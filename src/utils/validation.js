// Input validation utilities for AI-Fit Architect

// Email validation
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  // RFC 5322 compliant email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, value: trimmedEmail };
};

// Password validation
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecialChar = false,
  } = options;

  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters` };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (requireNumber && !/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }

  return { isValid: true };
};

// Numeric input validation
export const validateNumber = (value, options = {}) => {
  const {
    min,
    max,
    allowDecimal = true,
    required = true,
    fieldName = 'Value',
  } = options;

  if (value === null || value === undefined || value === '') {
    if (required) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true, value: null };
  }

  const numValue = allowDecimal ? parseFloat(value) : parseInt(value, 10);

  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (min !== undefined && numValue < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }

  if (max !== undefined && numValue > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` };
  }

  return { isValid: true, value: numValue };
};

// Weight validation (kg)
export const validateWeight = (weight) => {
  return validateNumber(weight, {
    min: 20,
    max: 500,
    allowDecimal: true,
    fieldName: 'Weight',
  });
};

// Height validation (cm)
export const validateHeight = (height) => {
  return validateNumber(height, {
    min: 50,
    max: 300,
    allowDecimal: true,
    fieldName: 'Height',
  });
};

// Age validation
export const validateAge = (age) => {
  return validateNumber(age, {
    min: 13,
    max: 120,
    allowDecimal: false,
    fieldName: 'Age',
  });
};

// Body fat percentage validation
export const validateBodyFat = (bodyFat) => {
  return validateNumber(bodyFat, {
    min: 2,
    max: 60,
    allowDecimal: true,
    required: false,
    fieldName: 'Body fat percentage',
  });
};

// Reps validation
export const validateReps = (reps) => {
  return validateNumber(reps, {
    min: 1,
    max: 100,
    allowDecimal: false,
    fieldName: 'Reps',
  });
};

// Sets validation
export const validateSets = (sets) => {
  return validateNumber(sets, {
    min: 1,
    max: 20,
    allowDecimal: false,
    fieldName: 'Sets',
  });
};

// Workout weight validation (kg)
export const validateWorkoutWeight = (weight) => {
  return validateNumber(weight, {
    min: 0,
    max: 1000,
    allowDecimal: true,
    fieldName: 'Weight',
  });
};

// Duration validation (minutes)
export const validateDuration = (duration) => {
  return validateNumber(duration, {
    min: 1,
    max: 300,
    allowDecimal: false,
    fieldName: 'Duration',
  });
};

// Calories validation
export const validateCalories = (calories) => {
  return validateNumber(calories, {
    min: 0,
    max: 10000,
    allowDecimal: false,
    fieldName: 'Calories',
  });
};

// Macros validation (grams)
export const validateMacro = (value, fieldName = 'Macro') => {
  return validateNumber(value, {
    min: 0,
    max: 1000,
    allowDecimal: true,
    fieldName,
  });
};

// Name validation
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return { isValid: false, error: 'Name is required' };
  }

  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Name is too long' };
  }

  // Check for potentially malicious characters
  if (/[<>{}[\]\\]/g.test(trimmedName)) {
    return { isValid: false, error: 'Name contains invalid characters' };
  }

  return { isValid: true, value: trimmedName };
};

// Sanitize text input (remove potentially dangerous characters)
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};

// Validate and sanitize form data
export const validateFormData = (data, schema) => {
  const errors = {};
  const sanitizedData = {};

  Object.keys(schema).forEach((field) => {
    const validator = schema[field];
    const value = data[field];
    const result = validator(value);

    if (!result.isValid) {
      errors[field] = result.error;
    } else {
      sanitizedData[field] = result.value !== undefined ? result.value : value;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: sanitizedData,
  };
};

export default {
  validateEmail,
  validatePassword,
  validateNumber,
  validateWeight,
  validateHeight,
  validateAge,
  validateBodyFat,
  validateReps,
  validateSets,
  validateWorkoutWeight,
  validateDuration,
  validateCalories,
  validateMacro,
  validateName,
  sanitizeInput,
  validateFormData,
};
