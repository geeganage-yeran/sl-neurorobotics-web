// FAQValidation.js
export const sanitizeFAQQuestion = (question) => {
  if (typeof question !== 'string') return '';
  return question
    .trim()
    .replace(/[<>"/\\]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\?+$/, '?');
};

export const sanitizeFAQAnswer = (answer) => {
  if (typeof answer !== 'string') return '';
  return answer
    .trim()
    .replace(/[<>"/\\]/g, '')
    .replace(/\s+/g, ' ');
};

export const validateFAQQuestion = (question) => {
  const sanitized = sanitizeFAQQuestion(question);
  
  if (!sanitized) {
    return 'Question is required';
  }
  
  if (sanitized.length < 10) {
    return 'Question must be at least 10 characters long';
  }
  
  if (sanitized.length > 200) {
    return 'Question must be less than 200 characters';
  }
  
  const wordCount = sanitized.split(/\s+/).length;
  if (wordCount < 3) {
    return 'Question should contain at least 3 words';
  }
  
  return '';
};

export const validateFAQAnswer = (answer) => {
  const sanitized = sanitizeFAQAnswer(answer);
  
  if (!sanitized) {
    return 'Answer is required';
  }
  
  if (sanitized.length < 20) {
    return 'Answer must be at least 20 characters long';
  }
  
  if (sanitized.length > 1000) {
    return 'Answer must be less than 1000 characters';
  }
  
  const wordCount = sanitized.split(/\s+/).length;
  if (wordCount < 5) {
    return 'Answer should contain at least 5 words';
  }
  
  return '';
};

export const validateFAQForm = (formData) => {
  const errors = {};
  errors.question = validateFAQQuestion(formData.question);
  errors.answer = validateFAQAnswer(formData.answer);
  return errors;
};

export const hasFAQErrors = (errors) => {
  return Object.values(errors).some(error => error !== '');
};

export const sanitizeFAQFormData = (formData) => {
  return {
    question: sanitizeFAQQuestion(formData.question || ''),
    answer: sanitizeFAQAnswer(formData.answer || '')
  };
};

export const validateFAQDuplication = (newQuestion, existingFAQs, currentFAQId = null) => {
  const sanitizedNewQuestion = sanitizeFAQQuestion(newQuestion).toLowerCase();
  
  const duplicate = existingFAQs.find(faq =>
    faq.id !== currentFAQId &&
    sanitizeFAQQuestion(faq.question).toLowerCase() === sanitizedNewQuestion
  );
  
  if (duplicate) {
    return 'A FAQ with this question already exists';
  }
  
  return '';
};

export const hasFieldError = (errors, fieldName) => {
  return errors[fieldName] && errors[fieldName] !== '';
};
