const isType = require('./validateTypes');
const error = require('../utils/error');

module.exports = (newModel, schema) => {
  // Copy newModel, we don't want to mutate the original data
  const remainingFields = { ...newModel };

  // String to save the potential error message
  let errorMessage = '';

  // Loop over schema and check each field.
  const containsInvalid = Object.entries(schema).some(
    ([fieldName, fieldSchema]) => {
      const value = remainingFields[fieldName];

      // Check if the field is the correct type
      if (value !== undefined && !isType[fieldSchema.type](value)) {
        errorMessage = `${fieldName} is not the correct data type`;

        return true;
      }

      // Check the constraints for the field
      if (fieldSchema.constraints !== undefined) {
        const containsInvalidConstraints = fieldSchema.constraints.some(
          getConstraint => {
            const constraint = getConstraint(fieldName, value);

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

      // Data field is correct, remove it from the remaining fields

      delete remainingFields[fieldName];

      return false;
    },
  );

  if (containsInvalid) {
    // return error(errorMessage);
    throw Error(`Validation for Model failed. ${errorMessage}`);
  }

  // Check if there is data which is not in the schema
  if (Object.keys(remainingFields).length > 0) {
    throw Error(
      `Validation for Model failed. Data contains the following fields which are not defined in the schema: ${Object.keys(
        remainingFields,
      )}`,
    );
  }

  // No errors were found with the data so we return a status with error false
  // return {
  //   error: false,
  // };
};
