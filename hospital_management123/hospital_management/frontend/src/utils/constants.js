// Authentication
export const AUTH_TOKEN_KEY = 'hospitalAuthToken';
export const REFRESH_TOKEN_KEY = 'hospitalRefreshToken';
export const TOKEN_EXPIRY_DAYS = 7;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  PATIENTS: {
    LIST: '/patients',
    DETAILS: '/patients/:id',
    CREATE: '/patients',
    UPDATE: '/patients/:id',
    DELETE: '/patients/:id',
  },
  APPOINTMENTS: {
    LIST: '/appointments',
    DETAILS: '/appointments/:id',
    CREATE: '/appointments',
    UPDATE: '/appointments/:id',
    CANCEL: '/appointments/:id/cancel',
  },
  DOCTORS: {
    LIST: '/doctors',
    DETAILS: '/doctors/:id',
    SCHEDULE: '/doctors/:id/schedule',
  },
  BEDS: {
    LIST: '/beds',
    STATUS: '/beds/:id/status',
    ASSIGN: '/beds/:id/assign',
    RELEASE: '/beds/:id/release',
  },
};

// Pagination
export const ITEMS_PER_PAGE = 10;
export const DEFAULT_PAGE = 1;

// Patient Status
export const PATIENT_STATUS = {
  ACTIVE: 'active',
  DISCHARGED: 'discharged',
  CRITICAL: 'critical',
  STABLE: 'stable',
  EMERGENCY: 'emergency',
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  IN_PROGRESS: 'in_progress',
};

// Bed Status
export const BED_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  RESERVED: 'reserved',
};

// Department Types
export const DEPARTMENTS = {
  EMERGENCY: 'emergency',
  ICU: 'icu',
  PEDIATRICS: 'pediatrics',
  CARDIOLOGY: 'cardiology',
  NEUROLOGY: 'neurology',
  ORTHOPEDICS: 'orthopedics',
  GENERAL_MEDICINE: 'general_medicine',
};

// Doctor Specializations (matching departments)
export const SPECIALIZATIONS = {
  EMERGENCY_MEDICINE: 'emergency_medicine',
  INTENSIVE_CARE: 'intensive_care',
  PEDIATRICS: 'pediatrics',
  CARDIOLOGY: 'cardiology',
  NEUROLOGY: 'neurology',
  ORTHOPEDICS: 'orthopedics',
  GENERAL_MEDICINE: 'general_medicine',
};

// Time Slots for Appointments (24-hour format)
export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
];

// Form Validation Rules
export const VALIDATION_RULES = {
  REQUIRED_MESSAGE: 'This field is required',
  EMAIL_MESSAGE: 'Please enter a valid email address',
  PHONE_MESSAGE: 'Please enter a valid phone number',
  MIN_LENGTH_MESSAGE: (length) => `Must be at least ${length} characters`,
  MAX_LENGTH_MESSAGE: (length) => `Must not exceed ${length} characters`,
};

// UI Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#2196f3',
};

// Status Colors (for visual representation)
export const STATUS_COLORS = {
  [PATIENT_STATUS.ACTIVE]: THEME_COLORS.SUCCESS,
  [PATIENT_STATUS.DISCHARGED]: THEME_COLORS.INFO,
  [PATIENT_STATUS.CRITICAL]: THEME_COLORS.ERROR,
  [PATIENT_STATUS.STABLE]: THEME_COLORS.PRIMARY,
  [PATIENT_STATUS.EMERGENCY]: THEME_COLORS.WARNING,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'userPreferences',
  THEME_SETTINGS: 'themeSettings',
  LANGUAGE: 'language',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MM/DD/YYYY',
  API: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
};