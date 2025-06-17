//sanitizations

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>"/\\&]/g, '')
    .replace(/\s+/g, ' ');
};


export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  
  return email
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9@._-]/g, ''); 
};


export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return '';
  
  return phone
    .trim()
    .replace(/[^0-9+\-\s()]/g, '');
};


export const validateFirstName = (firstName) => {
  const sanitized = sanitizeInput(firstName);
  
  if (!sanitized) {
    return 'First name is required';
  }
  
  if (sanitized.length < 2) {
    return 'First name must be at least 2 characters long';
  }
  
  if (sanitized.length > 50) {
    return 'First name must be less than 50 characters';
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(sanitized)) {
    return 'First name can only contain letters, spaces, hyphens, and apostrophes';
  }
  
  return '';
};

//validations

export const validateLastName = (lastName) => {
  const sanitized = sanitizeInput(lastName);
  
  if (!sanitized) {
    return 'Last name is required';
  }
  
  if (sanitized.length < 2) {
    return 'Last name must be at least 2 characters long';
  }
  
  if (sanitized.length > 50) {
    return 'Last name must be less than 50 characters';
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(sanitized)) {
    return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
  }
  
  return '';
};


export const validateEmail = (email) => {
  const sanitized = sanitizeEmail(email);
  
  if (!sanitized) {
    return 'Email address is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return 'Please enter a valid email address';
  }
  
  if (sanitized.length > 254) {
    return 'Email address is too long';
  }
  
  return '';
};


export const validateContact = (contact) => {
  const sanitized = sanitizePhone(contact);
  
  if (!sanitized) {
    return 'Phone number is required';
  }
  
  // Remove all non-digit characters for length validation
  const digitsOnly = sanitized.replace(/\D/g, '');
  
  if (digitsOnly.length <= 7) {
    return 'Phone number must be at least 7 digits';
  }
  
  if (digitsOnly.length >= 15) {
    return 'Phone number must be less than 15 digits';
  }
  
  // Basic phone format validation
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
  if (!phoneRegex.test(sanitized)) {
    return 'Please enter a valid phone number';
  }
  
  return '';
};

/**
 * Validate country selection
 * @param {string} country - The country code to validate
 * @returns {string} - Error message or empty string if valid
 */
export const validateCountry = (country) => {
  if (!country || country.trim() === '') {
    return 'Please select a country';
  }
  
  // List of valid country codes (should match your dropdown options)
  const validCountries = [
    'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'IN', 'BR', 'MX', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK', 'FI', 'CH', 'AT', 'BE', 'LK', 'SG', 'MY', 'TH', 'PH', 'ID', 'VN', 'KR', 'CN', 'HK', 'TW', 'NZ', 'ZA', 'NG', 'EG', 'MA', 'KE', 'GH', 'AE', 'SA', 'IL', 'TR', 'RU', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'PY', 'BO', 'EC', 'GT', 'HN', 'SV', 'NI', 'CR', 'PA', 'DO', 'CU', 'JM', 'TT', 'BB', 'BS', 'BZ', 'GY', 'SR', 'UZ', 'KZ', 'KG', 'TJ', 'TM', 'AF', 'PK', 'BD', 'NP', 'BT', 'MV', 'MM', 'LA', 'KH', 'BN', 'TL', 'PG', 'FJ', 'VU', 'SB', 'NC', 'PF', 'WS', 'TO', 'KI', 'TV', 'NR', 'PW', 'FM', 'MH'
  ];
  
  if (!validCountries.includes(country)) {
    return 'Please select a valid country';
  }
  
  return '';
};

/**
 * Validate password
 * @param {string} password - The password to validate
 * @returns {string} - Error message or empty string if valid
 */
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  if (password.length > 128) {
    return 'Password must be less than 128 characters';
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return 'Password must contain at least one special character (@$!%*?&)';
  }
  
  return '';
};

/**
 * Validate password confirmation
 * @param {string} password - The original password
 * @param {string} confirmPassword - The confirmation password
 * @returns {string} - Error message or empty string if valid
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return '';
};

/**
 * Validate entire form
 * @param {Object} formData - The form data object
 * @returns {Object} - Object containing validation errors for each field
 */
export const validateForm = (formData) => {
  const errors = {};
  
  errors.firstName = validateFirstName(formData.firstName);
  errors.lastName = validateLastName(formData.lastName);
  errors.email = validateEmail(formData.email);
  errors.contact = validateContact(formData.contact);
  errors.country = validateCountry(formData.country);
  errors.password = validatePassword(formData.password);
  errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
  
  return errors;
};

/**
 * Check if form has any validation errors
 * @param {Object} errors - The errors object from validateForm
 * @returns {boolean} - True if there are errors, false otherwise
 */
export const hasErrors = (errors) => {
  return Object.values(errors).some(error => error !== '');
};

/**
 * Sanitize entire form data
 * @param {Object} formData - The form data to sanitize
 * @returns {Object} - Sanitized form data
 */
export const sanitizeFormData = (formData) => {
  return {
    firstName: sanitizeInput(formData.firstName),
    lastName: sanitizeInput(formData.lastName),
    email: sanitizeEmail(formData.email),
    contact: sanitizePhone(formData.contact),
    country: formData.country,
    password: formData.password,
    confirmPassword: formData.confirmPassword
  };
};