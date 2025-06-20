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

//validations

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

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  return '';
};

//validate full form

export const validateForm=(formData)=>{
    const errors={};

    errors.email=validateEmail(formData.email);
    errors.password=validatePassword(formData.password);

    return errors;
}

export const hasErrors = (errors) => {
  return Object.values(errors).some(error => error !== '');
};

export const sanitizeFormData=(formData)=>{
    return{
        email: sanitizeInput(formData.email),
        password: formData.password
    };
}