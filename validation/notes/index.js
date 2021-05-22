const isEmpty = require("is-empty");

const { noteInput } = require("./noteValidationHelper/noteValidation");
const {
  backgroundInput
} = require("./noteValidationHelper/backgroundValidation");

// Create note validation
const validateCreateInput = (input) => {
  const { noteErrors } = noteInput(input.note);
  const { backgroundErrors } = backgroundInput(input.backgroundColor);

  const errors = [...noteErrors, ...backgroundErrors];

  return { errors, isValid: isEmpty(errors) };
};

// Update note validation
const validateUpdateInput = (input) => {
  const errors = [];

  if (input.note) {
    const { noteErrors } = noteInput(input.note);
    errors.concat(noteErrors);
  }
  if (input.backgroundColor) {
    const { backgroundErrors } = backgroundInput(input.backgroundColor);
    errors.concat(backgroundErrors);
  }

  return { errors, isValid: isEmpty(errors) };
};

module.exports = {
  validateCreateInput,
  validateUpdateInput
};
