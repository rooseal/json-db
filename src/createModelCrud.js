const requiredParam = require('./utils/requiredParam');
const error = require('./utils/error');
const writeFile = require('./helpers/promised/writeFile');
const getResource = require('./helpers/getResource');
const validateModel = require('./validation/validateModel');

module.exports = ({
  resourcePath = requiredParam('createModelCRUD', 'resourcePath', true),
  fields = requiredParam('createModelCRUD', 'fields', true),
}) => ({
  async create(data) {
    // Validate the data
    const validationStatus = validateModel(data, fields);

    if (validationStatus.error) {
      return error(validationStatus.error, {});
    }

    // Get the collection from memory

    let collection;

    try {
      collection = await getResource(resourcePath);
    } catch (errMessage) {
      return error(errMessage, []);
    }

    // Save the new collection to memory
    collection.push(data);
    const { err } = await writeFile(resourcePath, collection);

    if (err) {
      return error(err, {});
    }

    return {
      error: false,
      data,
    };
  },

  async read(query = () => {}) {
    let collection;

    try {
      collection = await getResource(resourcePath);
    } catch (errMessage) {
      return error(errMessage, []);
    }

    const results = collection.filter(query);

    return {
      error: false,

      data: results,
    };
  },
});
