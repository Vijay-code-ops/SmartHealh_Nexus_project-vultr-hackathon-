// Constants for storage keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'app_theme',
  PREFERENCES: 'user_preferences',
  REMEMBER_ME: 'remember_me',
  LAST_ACTIVE: 'last_active',
};

// Encryption key (you should move this to environment variables)
const ENCRYPTION_KEY = process.env.REACT_APP_STORAGE_KEY || 'your-secure-key-here';

/**
 * Simple encryption for sensitive data
 * Note: This is not military-grade encryption, but provides basic obfuscation
 * @param {string} text 
 * @returns {string}
 */
const encrypt = (text) => {
  try {
    if (!text) return null;
    const textToString = typeof text === 'string' ? text : JSON.stringify(text);
    return btoa(encodeURIComponent(textToString));
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

/**
 * Decrypt stored data
 * @param {string} encoded 
 * @returns {string}
 */
const decrypt = (encoded) => {
  try {
    if (!encoded) return null;
    return decodeURIComponent(atob(encoded));
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Set item in storage with optional encryption
 * @param {string} key 
 * @param {any} value 
 * @param {boolean} encrypt 
 * @param {boolean} useSession 
 */
const setStorageItem = (key, value, shouldEncrypt = false, useSession = false) => {
  try {
    const storage = useSession ? sessionStorage : localStorage;
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    const storageValue = shouldEncrypt ? encrypt(stringValue) : stringValue;
    storage.setItem(key, storageValue);
  } catch (error) {
    console.error('Error setting storage item:', error);
  }
};

/**
 * Get item from storage with optional decryption
 * @param {string} key 
 * @param {boolean} encrypted 
 * @param {boolean} useSession 
 * @returns {any}
 */
const getStorageItem = (key, encrypted = false, useSession = false) => {
  try {
    const storage = useSession ? sessionStorage : localStorage;
    const value = storage.getItem(key);
    
    if (!value) return null;
    
    const decryptedValue = encrypted ? decrypt(value) : value;
    
    try {
      return JSON.parse(decryptedValue);
    } catch {
      return decryptedValue;
    }
  } catch (error) {
    console.error('Error getting storage item:', error);
    return null;
  }
};

/**
 * Remove item from storage
 * @param {string} key 
 * @param {boolean} useSession 
 */
const removeStorageItem = (key, useSession = false) => {
  try {
    const storage = useSession ? sessionStorage : localStorage;
    storage.removeItem(key);
  } catch (error) {
    console.error('Error removing storage item:', error);
  }
};

/**
 * Clear all app-related items from storage
 * @param {boolean} useSession 
 */
const clearStorage = (useSession = false) => {
  try {
    const storage = useSession ? sessionStorage : localStorage;
    Object.values(STORAGE_KEYS).forEach(key => {
      storage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

// Token management
export const setToken = (token) => {
  setStorageItem(STORAGE_KEYS.TOKEN, token, true);
  updateLastActive();
};

export const getToken = () => {
  return getStorageItem(STORAGE_KEYS.TOKEN, true);
};

export const removeToken = () => {
  removeStorageItem(STORAGE_KEYS.TOKEN);
};

// User data management
export const setUser = (user) => {
  setStorageItem(STORAGE_KEYS.USER, user, true);
};

export const getUser = () => {
  return getStorageItem(STORAGE_KEYS.USER, true);
};

export const removeUser = () => {
  removeStorageItem(STORAGE_KEYS.USER);
};

// Theme management
export const setTheme = (theme) => {
  setStorageItem(STORAGE_KEYS.THEME, theme);
};

export const getTheme = () => {
  return getStorageItem(STORAGE_KEYS.THEME) || 'light';
};

// User preferences
export const setPreferences = (preferences) => {
  setStorageItem(STORAGE_KEYS.PREFERENCES, preferences);
};

export const getPreferences = () => {
  return getStorageItem(STORAGE_KEYS.PREFERENCES) || {};
};

export const updatePreferences = (updates) => {
  const current = getPreferences();
  setPreferences({ ...current, ...updates });
};

// Remember me functionality
export const setRememberMe = (credentials) => {
  setStorageItem(STORAGE_KEYS.REMEMBER_ME, credentials, true);
};

export const getRememberMe = () => {
  return getStorageItem(STORAGE_KEYS.REMEMBER_ME, true);
};

export const removeRememberMe = () => {
  removeStorageItem(STORAGE_KEYS.REMEMBER_ME);
};

// Session management
export const updateLastActive = () => {
  setStorageItem(STORAGE_KEYS.LAST_ACTIVE, Date.now());
};

export const getLastActive = () => {
  return getStorageItem(STORAGE_KEYS.LAST_ACTIVE);
};

/**
 * Check if session is expired
 * @param {number} maxAge Maximum session age in milliseconds
 * @returns {boolean}
 */
export const isSessionExpired = (maxAge = 3600000) => { // Default 1 hour
  const lastActive = getLastActive();
  if (!lastActive) return true;
  
  return Date.now() - lastActive > maxAge;
};

/**
 * Storage observer for reactive updates
 */
class StorageObserver {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  notify(key, value) {
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => callback(value));
    }
  }
}

export const storageObserver = new StorageObserver();

// React hook for storage values
export const useStorageValue = (key, initialValue = null) => {
  const [value, setValue] = React.useState(() => getStorageItem(key) || initialValue);

  React.useEffect(() => {
    const unsubscribe = storageObserver.subscribe(key, setValue);
    return unsubscribe;
  }, [key]);

  const updateValue = React.useCallback((newValue) => {
    setStorageItem(key, newValue);
    storageObserver.notify(key, newValue);
  }, [key]);

  return [value, updateValue];
};

export default {
  setItem: setStorageItem,
  getItem: getStorageItem,
  removeItem: removeStorageItem,
  clear: clearStorage,
  setToken,
  getToken,
  removeToken,
  setUser,
  getUser,
  removeUser,
  setTheme,
  getTheme,
  setPreferences,
  getPreferences,
  updatePreferences,
  setRememberMe,
  getRememberMe,
  removeRememberMe,
  updateLastActive,
  getLastActive,
  isSessionExpired,
  useStorageValue,
};