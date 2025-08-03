/**
 * Application-wide constants
 */

export const APP_CONSTANTS = {
  // API Configuration
  API: {
    DEFAULT_TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    POLLING_INTERVAL: 2000
  },

  // UI Configuration
  UI: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    DEBOUNCE_TIME: 300,
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 5000
  },

  // Form Validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_NAME_LENGTH: 50,
    MAX_COMMENT_LENGTH: 500,
    ZIP_CODE_PATTERN: /^\d{5}(-\d{4})?$/,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_PATTERN: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  },

  // Status Values
  STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    COMPLETED: 'completed',
    IN_PROGRESS: 'in_progress'
  },

  // Address Types
  ADDRESS_TYPES: {
    HOME: 'home',
    WORK: 'work',
    OTHER: 'other'
  },

  // Approval Roles
  APPROVAL_ROLES: {
    REVIEWER: 'Reviewer',
    MANAGER: 'Manager',
    SUPERVISOR: 'Supervisor',
    ADMIN: 'Admin'
  },

  // PD Types
  PD_TYPES: {
    CUSTOM: 'Custom PD',
    STANDARD: 'Standard PD',
    EXPERT_CONSULTANT: 'Expert and Consultant'
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    USER_PREFERENCES: 'userPreferences',
    AUTH_TOKEN: 'authToken',
    THEME: 'selectedTheme',
    LANGUAGE: 'selectedLanguage'
  },

  // Routes
  ROUTES: {
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    PROFILE: '/profile',
    ADDRESS: '/address',
    APPROVAL: '/approval'
  },

  // Error Messages
  ERROR_MESSAGES: {
    GENERIC: 'An unexpected error occurred. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    VALIDATION: 'Please correct the highlighted fields.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    TIMEOUT: 'Request timed out. Please try again.'
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    SAVE: 'Changes saved successfully.',
    DELETE: 'Item deleted successfully.',
    UPDATE: 'Item updated successfully.',
    CREATE: 'Item created successfully.',
    APPROVE: 'Approval submitted successfully.',
    REJECT: 'Rejection submitted successfully.'
  },

  // Date Formats
  DATE_FORMATS: {
    DISPLAY: 'MMM dd, yyyy',
    FULL: 'MMMM dd, yyyy HH:mm:ss',
    SHORT: 'MM/dd/yyyy',
    TIME: 'HH:mm:ss'
  },

  // File Upload
  FILE_UPLOAD: {
    MAX_SIZE_MB: 10,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf']
  }
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

/**
 * Application Events
 */
export const APP_EVENTS = {
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  ADDRESS_UPDATED: 'address:updated',
  APPROVAL_SUBMITTED: 'approval:submitted',
  THEME_CHANGED: 'theme:changed',
  LANGUAGE_CHANGED: 'language:changed'
} as const;