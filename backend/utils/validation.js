const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createValidationErrors() {
  return {};
}

function addValidationError(errors, field, message) {
  if (errors[field] == null) {
    errors[field] = message;
  }
}

function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}

function validateRequiredString(errors, field, value, message) {
  if (value === "") {
    addValidationError(errors, field, message);
  }
}

function validateMaxLength(errors, field, value, maxLength, message) {
  if (value !== "" && value.length > maxLength) {
    addValidationError(errors, field, message);
  }
}

function validateEmail(errors, field, value, requiredMessage, invalidMessage) {
  validateRequiredString(errors, field, value, requiredMessage);

  if (value !== "" && EMAIL_REGEX.test(value) === false) {
    addValidationError(errors, field, invalidMessage);
  }
}

function validatePasswordLength(errors, field, value, minLength, maxLength) {
  if (value === "") {
    return;
  }

  if (value.length < minLength) {
    addValidationError(errors, field, `Password must be at least ${minLength} characters`);
  } else if (value.length > maxLength) {
    addValidationError(errors, field, `Password must be ${maxLength} characters or fewer`);
  }
}

module.exports = {
  addValidationError,
  createValidationErrors,
  hasValidationErrors,
  validateEmail,
  validateMaxLength,
  validatePasswordLength,
  validateRequiredString
};
