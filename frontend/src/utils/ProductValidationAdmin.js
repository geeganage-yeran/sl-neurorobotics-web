export const validationRules = {
  name: {
    required: true,
    minLength: 5,
    maxLength: 100,
    sanitize: true,
  },
  summary: {
    required: true,
    minLength: 10,
    maxLength: 800,
    sanitize: true,
  },
  description: {
    required: true,
    minLength: 20,
    maxLength: 2000,
    sanitize: true,
  },
  overview: {
    required: true,
    minLength: 20,
    maxLength: 1000,
    sanitize: true,
  },
  price: {
    required: true,
    min: 0,
    type: 'number',
  },
  tutorialLink: {
    required: false,
    pattern: /^https?:\/\/.+\..+/,
    maxLength: 2048,
    sanitize: true,
  },
  specifications: {
    maxItems: 20,
    itemValidation: {
      name: { 
        required: true, 
        minLength: 2, 
        maxLength: 100,
        sanitize: true 
      },
      description: { 
        required: true, 
        minLength: 5, 
        maxLength: 500,
        sanitize: true 
      },
    },
  },
  images: {
    maxSize: 8 * 1024 * 1024,
    maxFiles: 10, 
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  },
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .substring(0, 5000)
};

export const sanitizeUrl = (url) => {
  if (typeof url !== 'string') return url;
  
  const trimmed = url.trim();
  
  if (!trimmed.match(/^https?:\/\//i)) {
    return '';
  }

  return trimmed
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .substring(0, 2048);
};

export const errorMessages = {
  required: (field) => `${field} is required`,
  minLength: (field, min) => `${field} must be at least ${min} characters long`,
  maxLength: (field, max) => `${field} must not exceed ${max} characters`,
  min: (field, min) => `${field} must be at least ${min}`,
  max: (field, max) => `${field} must not exceed ${max}`,
  pattern: (field) => `${field} must be a valid URL (starting with http:// or https://)`,
  invalidEmail: (field) => `${field} must be a valid email address`,
  invalidNumber: (field) => `${field} must be a valid number`,
  fileSize: (field, max) => `${field} file size must not exceed ${max}MB`,
  fileType: (field, types) => `${field} must be one of: ${types.join(', ')}`,
  maxItems: (field, max) => `${field} cannot exceed ${max} items`,
  maxFiles: (field, max) => `Cannot upload more than ${max} files`,
  invalidInput: (field) => `${field} contains invalid characters`,
};

export const validateField = (fieldName, value, rules = validationRules[fieldName]) => {
  const errors = [];
  const fieldLabel = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');

  if (!rules) return { errors, sanitizedValue: value };

  let sanitizedValue = value;

  if (rules.sanitize && typeof value === 'string') {
    if (fieldName === 'tutorialLink') {
      sanitizedValue = sanitizeUrl(value);
    } else {
      sanitizedValue = sanitizeInput(value);
    }
  }

  if (rules.required && (!sanitizedValue || (typeof sanitizedValue === 'string' && !sanitizedValue.trim()))) {
    errors.push(errorMessages.required(fieldLabel));
    return { errors, sanitizedValue };
  }

  if (!sanitizedValue || (typeof sanitizedValue === 'string' && !sanitizedValue.trim())) {
    return { errors, sanitizedValue };
  }

  if (typeof sanitizedValue === 'string') {
    const trimmedValue = sanitizedValue.trim();
    
    if (rules.minLength && trimmedValue.length < rules.minLength) {
      errors.push(errorMessages.minLength(fieldLabel, rules.minLength));
    }

    if (rules.maxLength && trimmedValue.length > rules.maxLength) {
      errors.push(errorMessages.maxLength(fieldLabel, rules.maxLength));
    }

    if (rules.pattern && !rules.pattern.test(trimmedValue)) {
      errors.push(errorMessages.pattern(fieldLabel));
    }
  }

  if (rules.type === 'number' || (typeof sanitizedValue === 'number' || (typeof sanitizedValue === 'string' && !isNaN(parseFloat(sanitizedValue))))) {
    const numValue = typeof sanitizedValue === 'number' ? sanitizedValue : parseFloat(sanitizedValue);
    
    if (isNaN(numValue)) {
      errors.push(errorMessages.invalidNumber(fieldLabel));
    } else {
      if (rules.min !== undefined && numValue < rules.min) {
        errors.push(errorMessages.min(fieldLabel, rules.min));
      }
      
      if (rules.max !== undefined && numValue > rules.max) {
        errors.push(errorMessages.max(fieldLabel, rules.max));
      }
    }
  }

  return { errors, sanitizedValue };
};

export const validateSpecification = (spec) => {
  const errors = {};
  const sanitized = {};
  const rules = validationRules.specifications.itemValidation;

  const nameValidation = validateField('name', spec.name, rules.name);
  if (nameValidation.errors.length > 0) {
    errors.name = nameValidation.errors[0];
  }
  sanitized.name = nameValidation.sanitizedValue;

  const descValidation = validateField('description', spec.description, rules.description);
  if (descValidation.errors.length > 0) {
    errors.description = descValidation.errors[0];
  }
  sanitized.description = descValidation.sanitizedValue;

  return { errors, sanitized };
};

export const validateImageFile = (file) => {
  const errors = [];
  const rules = validationRules.images;

  if (file.size > rules.maxSize) {
    errors.push(errorMessages.fileSize('Image', Math.round(rules.maxSize / (1024 * 1024))));
  }

  if (!rules.allowedTypes.includes(file.type)) {
    errors.push(errorMessages.fileType('Image', rules.allowedTypes));
  }

  if (file.name) {
    const suspiciousExtensions = /\.(exe|bat|cmd|scr|pif|com|js|jar|php|asp|jsp)$/i;
    if (suspiciousExtensions.test(file.name)) {
      errors.push('File type not allowed for security reasons');
    }
  }

  return errors;
};

export const validateForm = (formData, specifications = [], images = []) => {
  const errors = {};
  const sanitizedData = {};

  Object.keys(validationRules).forEach(fieldName => {
    if (fieldName === 'specifications' || fieldName === 'images') return;
    
    const validation = validateField(fieldName, formData[fieldName]);
    if (validation.errors.length > 0) {
      errors[fieldName] = validation.errors;
    }
    sanitizedData[fieldName] = validation.sanitizedValue;
  });

  const specRules = validationRules.specifications;
  if (specifications.length > specRules.maxItems) {
    errors.specifications = [errorMessages.maxItems('Specifications', specRules.maxItems)];
  } else {
    const specErrors = [];
    const sanitizedSpecs = [];
    
    specifications.forEach((spec, index) => {
      const specValidation = validateSpecification(spec);
      if (Object.keys(specValidation.errors).length > 0) {
        specErrors[index] = specValidation.errors;
      }
      sanitizedSpecs[index] = specValidation.sanitized;
    });
    
    if (specErrors.length > 0) {
      errors.specifications = specErrors;
    }
    sanitizedData.specifications = sanitizedSpecs;
  }

  const imageRules = validationRules.images;
  if (images.length > imageRules.maxFiles) {
    errors.images = [errorMessages.maxFiles('Images', imageRules.maxFiles)];
  } else {
    const imageErrors = [];
    images.forEach((image, index) => {
      if (image.file) {
        const imageValidationErrors = validateImageFile(image.file);
        if (imageValidationErrors.length > 0) {
          imageErrors[index] = imageValidationErrors;
        }
      }
    });

    if (imageErrors.length > 0) {
      errors.images = imageErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
};

export const createRateLimiter = (maxAttempts = 5, windowMs = 60000) => {
  const attempts = new Map();
  
  return (identifier = 'default') => {
    const now = Date.now();
    const userAttempts = attempts.get(identifier) || [];
    
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    attempts.set(identifier, recentAttempts);
    return true; // Allowed
  };
};

export const getFieldError = (errors, fieldName) => {
  if (!errors || !errors[fieldName]) return null;
  return Array.isArray(errors[fieldName]) ? errors[fieldName][0] : errors[fieldName];
};

export const hasFieldError = (errors, fieldName) => {
  return errors && errors[fieldName] && 
    (Array.isArray(errors[fieldName]) ? errors[fieldName].length > 0 : true);
};

export const formatValidationErrors = (errors) => {
  const formatted = [];
  
  Object.keys(errors).forEach(fieldName => {
    const fieldErrors = errors[fieldName];
    if (Array.isArray(fieldErrors)) {
      fieldErrors.forEach(error => formatted.push(error));
    } else if (typeof fieldErrors === 'object') {
      Object.keys(fieldErrors).forEach(nestedKey => {
        const nestedErrors = fieldErrors[nestedKey];
        if (Array.isArray(nestedErrors)) {
          nestedErrors.forEach(error => formatted.push(error));
        } else if (typeof nestedErrors === 'object') {
          Object.values(nestedErrors).forEach(error => formatted.push(error));
        }
      });
    }
  });
  
  return formatted;
};