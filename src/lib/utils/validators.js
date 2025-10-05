// @ts-nocheck

/**
 * Form Validation Utilities
 */

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return re.test(phone);
}

export function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateRequired(value) {
  return value !== null && value !== undefined && value.toString().trim() !== '';
}

export function validateMinLength(value, min) {
  return value && value.toString().length >= min;
}

export function validateMaxLength(value, max) {
  return value && value.toString().length <= max;
}

export function validatePattern(value, pattern) {
  const re = new RegExp(pattern);
  return re.test(value);
}

/**
 * Comprehensive form validator
 * Usage: const errors = validateForm(formData, rules);
 */
export function validateForm(data, rules) {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = fieldRules.messages?.required || 'This field is required';
      return;
    }
    
    if (fieldRules.email && !validateEmail(value)) {
      errors[field] = fieldRules.messages?.email || 'Invalid email address';
      return;
    }
    
    if (fieldRules.phone && !validatePhone(value)) {
      errors[field] = fieldRules.messages?.phone || 'Invalid phone number';
      return;
    }
    
    if (fieldRules.minLength && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = fieldRules.messages?.minLength || `Minimum ${fieldRules.minLength} characters`;
      return;
    }
    
    if (fieldRules.maxLength && !validateMaxLength(value, fieldRules.maxLength)) {
      errors[field] = fieldRules.messages?.maxLength || `Maximum ${fieldRules.maxLength} characters`;
      return;
    }
    
    if (fieldRules.pattern && !validatePattern(value, fieldRules.pattern)) {
      errors[field] = fieldRules.messages?.pattern || 'Invalid format';
      return;
    }
  });
  
  return errors;
}
