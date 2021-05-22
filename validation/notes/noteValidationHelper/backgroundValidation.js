const Validator = require("validator");
const isEmpty = require("is-empty");

const backgroundRegex = /^('#FFFFFF' | '#FF00FF')$/;

const backgroundInput = (input) => {
  const errors = [];

  input = !isEmpty(input) ? input : "";

  if (Validator.isEmpty(input, { ignore_whitespace: true })) {
    errors.push({ msg: "Background color field is required" });
  } else if (!backgroundRegex.test(input)) {
    errors.push({ msg: "Invalid background color field" });
  }

  return { backgroundErrors: errors };
};

module.exports = { backgroundInput };
