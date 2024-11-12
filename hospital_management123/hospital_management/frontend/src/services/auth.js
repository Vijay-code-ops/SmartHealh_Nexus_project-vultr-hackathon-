import { authAPI } from './api';
import { setToken, getToken, removeToken, setUser, getUser, removeUser } from './storage';

class AuthService {
  // Initialize state
  constructor() {
    this._user = getUser();
    this._token = getToken();
    this._listeners = new Set();
  }

  // Get current authentication state
  get isAuthenticated() {
    return !!this._token;
  }

  // Get current user
  get currentUser() {
    return this._user;
  }

  // Add state change listener
  addListener(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  // Notify all listeners of state change
  _notifyListeners() {
    this._listeners.forEach(listener => listener({
      isAuthenticated: this.isAuthenticated,
      user: this._user
    }));
  }

  // Update internal state
  _updateState(user, token) {
    this._user = user;
    this._token = token;

    if (user && token) {
      setUser(user);
      setToken(token);
    } else {
      removeUser();
      removeToken();
    }

    this._notifyListeners();
  }

  /**
   * Login with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} User data
   */
  async login(email, password) {
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response;
      
      this._updateState(user, token);
      return user;
    } catch (error) {
      this._updateState(null, null);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user data
   */
  async register(userData) {
    const response = await authAPI.register(userData);
    const { user, token } = response;
    
    this._updateState(user, token);
    return user;
  }

  /**
   * Logout current user
   */
  async logout() {
    try {
      await authAPI.logout();
    } finally {
      this._updateState(null, null);
      window.location.href = '/login';
    }
  }

  /**
   * Check if current session is valid and refresh user data
   * @returns {Promise<boolean>} Session validity
   */
  async checkSession() {
    try {
      if (!this._token) {
        return false;
      }

      const user = await authAPI.getCurrentUser();
      this._updateState(user, this._token);
      return true;
    } catch (error) {
      this._updateState(null, null);
      return false;
    }
  }

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  async updateProfile(userData) {
    const updatedUser = await authAPI.updateProfile(userData);
    this._updateState(updatedUser, this._token);
    return updatedUser;
  }

  /**
   * Change user password
   * @param {string} currentPassword 
   * @param {string} newPassword 
   */
  async changePassword(currentPassword, newPassword) {
    await authAPI.changePassword({
      currentPassword,
      newPassword
    });
  }

  /**
   * Request password reset email
   * @param {string} email 
   */
  async forgotPassword(email) {
    await authAPI.forgotPassword({ email });
  }

  /**
   * Reset password with token
   * @param {string} token 
   * @param {string} newPassword 
   */
  async resetPassword(token, newPassword) {
    await authAPI.resetPassword({
      token,
      newPassword
    });
  }

  /**
   * Get user permissions
   * @returns {Array<string>} List of permissions
   */
  async getUserPermissions() {
    if (!this._user) {
      return [];
    }
    return this._user.permissions || [];
  }

  /**
   * Check if user has specific permission
   * @param {string} permission 
   * @returns {boolean}
   */
  async hasPermission(permission) {
    const permissions = await this.getUserPermissions();
    return permissions.includes(permission);
  }

  /**
   * Check if user has specific role
   * @param {string} role 
   * @returns {boolean}
   */
  hasRole(role) {
    if (!this._user || !this._user.roles) {
      return false;
    }
    return this._user.roles.includes(role);
  }
}

// Create singleton instance
const authService = new AuthService();

// Create React hook for auth state
export const useAuth = () => {
  const [authState, setAuthState] = React.useState({
    isAuthenticated: authService.isAuthenticated,
    user: authService.currentUser
  });

  React.useEffect(() => {
    // Subscribe to auth state changes
    return authService.addListener(setAuthState);
  }, []);

  return {
    ...authState,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    register: authService.register.bind(authService),
    updateProfile: authService.updateProfile.bind(authService),
    changePassword: authService.changePassword.bind(authService),
    forgotPassword: authService.forgotPassword.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
    hasPermission: authService.hasPermission.bind(authService),
    hasRole: authService.hasRole.bind(authService)
  };
};

// Create auth provider component
export const AuthProvider = ({ children }) => {
  React.useEffect(() => {
    // Check session validity on mount
    authService.checkSession();
  }, []);

  return children;
};

// Export service instance
export default authService;

// Export auth guard HOC
export const withAuth = (WrappedComponent, options = {}) => {
  return function AuthGuard(props) {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
      const checkAccess = async () => {
        // Check authentication
        if (!isAuthenticated) {
          navigate('/login');
          return;
        }

        // Check required permissions
        if (options.requiredPermissions) {
          const hasPermission = await Promise.all(
            options.requiredPermissions.map(permission =>
              authService.hasPermission(permission)
            )
          );

          if (hasPermission.some(result => !result)) {
            navigate('/unauthorized');
            return;
          }
        }

        // Check required roles
        if (options.requiredRoles) {
          const hasRole = options.requiredRoles.some(role =>
            authService.hasRole(role)
          );

          if (!hasRole) {
            navigate('/unauthorized');
            return;
          }
        }
      };

      checkAccess();
    }, [isAuthenticated, user, navigate]);

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};