const isType = require('./validateTypes');
const error = require('../utils/error');

module.exports = (update, schema) => {
  // String to save the potential error message
  let errorMessage = '';

  // Loop over schema and check each field.
  const containsInvalid = Object.entries(update).some(([name, value]) => {
    // Get schema for teh field
    const fieldSchema = schema[name];

    // Check if the field is the correct type
    if (value !== undefined && !isType[fieldSchema.type](value)) {
      errorMessage = `${name} is not the correct data type`;

      return true;
    }

    // Check the constraints for the field
    if (fieldSchema.constraints !== undefined) {
      const containsInvalidConstraints = fieldSchema.constraints.some(
        getConstraint => {
          const constraint = getConstraint(name, value);

          if (!constraint.execute()) {
            errorMessage = constraint.message;

            return true;
          }

          return false;
        },
      );

      if (containsInvalidConstraints) {
        return true;
      }
    }

    return false;
  });

  if (containsInvalid) {
    // return error(errorMessage);
    throw Error(`Schema validation for update failed. ${errorMessage}`);
  }

  // No errors were found with the data so we return a status with error false
  // return {
  //   error: false,
  // };
};
