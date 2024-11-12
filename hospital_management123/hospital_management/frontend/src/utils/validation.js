import { VALIDATION_RULES } from './constants';

// Basic validation helpers
export const isRequired = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value.toString().trim() !== '';
};

export const minLength = (value, min) => {
  if (!value) return true; // Skip if empty (use with isRequired if needed)
  return value.length >= min;
};

export const maxLength = (value, max) => {
  if (!value) return true;
  return value.length <= max;
};

export const isEmail = (email) => {
  if (!email) return true;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

export const isPhone = (phone) => {
  if (!phone) return true;
  // Accepts formats: (123) 456-7890, 123-456-7890, 1234567890
  const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phoneRegex.test(phone);
};

// Date validation
export const isValidDate = (date) => {
  if (!date) return true;
  const timestamp = Date.parse(date);
  return !isNaN(timestamp);
};

export const isDateInFuture = (date) => {
  if (!date) return true;
  const inputDate = new Date(date);
  const today = new Date();
  return inputDate > today;
};

export const isDateInPast = (date) => {
  if (!date) return true;
  const inputDate = new Date(date);
  const today = new Date();
  return inputDate < today;
};

// Number validation
export const isNumber = (value) => {
  if (!value) return true;
  return !isNaN(Number(value));
};

export const isInteger = (value) => {
  if (!value) return true;
  return Number.isInteger(Number(value));
};

export const isInRange = (value, min, max) => {
  if (!value) return true;
  const num = Number(value);
  return num >= min && num <= max;
};

// Custom validators for hospital-specific data
export const isMedicalLicenseNumber = (license) => {
  if (!license) return true;
  // Example format: XX12345 (2 letters followed by 5 numbers)
  const licenseRegex = /^[A-Z]{2}\d{5}$/;
  return licenseRegex.test(license);
};

export const isInsuranceNumber = (insurance) => {
  if (!insurance) return true;
  // Example format: INS-1234567890
  const insuranceRegex = /^INS-\d{10}$/;
  return insuranceRegex.test(insurance);
};

// Form validation functions
export const validatePatientForm = (values) => {
  const errors = {};

  if (!isRequired(values.firstName)) {
    errors.firstName = VALIDATION_RULES.REQUIRED_MESSAGE;
  }

  if (!isRequired(values.lastName)) {
    errors.lastName = VALIDATION_RULES.REQUIRED_MESSAGE;
  }

  if (!isRequired(values.email)) {
    errors.email = VALIDATION_RULES.REQUIRED_MESSAGE;
  } else if (!isEmail(values.email)) {
    errors.email = VALIDATION_RULES.EMAIL_MESSAGE;
  }

  if (!isRequired(values.phone)) {
    errors.phone = VALIDATION_RULES.REQUIRED_MESSAGE;
  } else if (!isPhone(values.phone)) {
    errors.phone = VALIDATION_RULES.PHONE_MESSAGE;
  }

  if (values.insuranceNumber && !isInsuranceNumber(values.insuranceNumber)) {
    errors.insuranceNumber = 'Invalid insurance number format (INS-1234567890)';
  }

  return errors;
};

export const validateDoctorForm = (values) => {
  const errors = {};

  if (!isRequired(values.firstName)) {
    errors.firstName = VALIDATION_RULES.REQUIRED_MESSAGE;
  }

  if (!isRequired(values.lastName)) {
    errors.lastName = VALIDATION_RULES.REQUIRED_MESSAGE;
  }

  if (!isRequired(values.email)) {
    errors.email = VALIDATION_RULES.REQUIRED_MESSAGE;
  } else if (!isEmail(values.email)) {
    errors.email = VALIDATION_RULES.EMAIL_MESSAGE;
  }

  if (!isRequired(values.licenseNumber)) {
    errors.licenseNumber = VALIDATION_RULES.REQUIRED_MESSAGE;
  } else if (!isMedicalLicenseNumber(values.licenseNumber)) {
    errors.licenseNumber = 'Invalid license number format (XX12345)';
  }

  if (!isRequired(values.specialization)) {
    errors.specialization = VALIDATION_RULES.REQUIRED_MESSAGE;
  }

  return errors;
};

export const validateAppointmentForm = (values) => {
  const errors = {};

  if (!isRequired(values.patientId)) {
    errors.patientId = VALIDATION_RULES.REQUIRED_MESSAGE;
  }

  if (!isRequired(values.doctorId)) {
    errors.doctorId = VALIDATION_RULES.REQUIRED_MESSAGE;
  }

  if (!isRequired(values.date)) {
    errors.date = VALIDATION_RULES.REQUIRED_MESSAGE;
  } else if (!isValidDate(values.date)) {
    errors.date = 'Invalid date format';
  } else if (!isDateInFuture(values.date)) {
    errors.date = 'Appointment date must be in the future';
  }

  if (!isRequired(values.time)) {
    errors.time = VALIDATION_RULES.REQUIRED_MESSAGE;
  }

  if (values.notes && !maxLength(values.notes, 500)) {
    errors.notes = VALIDATION_RULES.MAX_LENGTH_MESSAGE(500);
  }

  return errors;
};

// Higher-order validation function
export const createValidator = (validations) => {
  return (value) => {
    for (const validation of validations) {
      const [validationFn, errorMessage, ...args] = validation;
      if (!validationFn(value, ...args)) {
        return errorMessage;
      }
    }
    return null;
  };
};

// Example usage of createValidator:
export const validatePassword = createValidator([
  [isRequired, 'Password is required'],
  [value => minLength(value, 8), 'Password must be at least 8 characters'],
  [
    value => /[A-Z]/.test(value),
    'Password must contain at least one uppercase letter'
  ],
  [
    value => /[a-z]/.test(value),
    'Password must contain at least one lowercase letter'
  ],
  [
    value => /[0-9]/.test(value),
    'Password must contain at least one number'
  ],
  [
    value => /[!@#$%^&*]/.test(value),
    'Password must contain at least one special character'
  ]
]);