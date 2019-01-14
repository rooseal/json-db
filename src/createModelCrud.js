const requiredParam = require('./utils/requiredParam');
const error = require('./utils/error');
const writeFile = require('./helpers/promised/writeFile');
const getResource = require('./helpers/getResource');
const validateModel = require('./validation/validateModel');
const validateUpdate = require('./validation/validateUpdate');

module.exports = ({
  modelName = requiredParam('createModelCRUD', 'modelName', true),
  resourcePath = requiredParam('createModelCRUD', 'resourcePath', true),
  fields = requiredParam('createModelCRUD', 'fields', true),
}) => ({
  async create(data) {
    // Validate the data
    try {
      validateModel(data, fields);
    } catch (err) {
      throw Error(`[${modelName}] Error while creating new resource. ${err}`);
    }

    // if (validationStatus.error) {
    //   return error(validationStatus.error, {});
    // }

    // Get the collection from memory
    let collection;

    try {
      collection = await getResource(resourcePath);
    } catch (errMessage) {
      throw Error(
        `[${modelName}] Error while creating new resource. ${errMessage}`,
      );
    }

    // Save the new collection to memory
    collection.push(data);

    try {
      await writeFile(resourcePath, JSON.stringify(collection, null, 2));
    } catch (err) {
      throw Error(`[${modelName}] Error while creating new resource. ${err}`);
    }

    return data;
  },

  async read(query = () => true) {
    let collection;

    try {
      collection = await getResource(resourcePath);
    } catch (errMessage) {
      throw Error(
        `[${modelName}] Error while reading from resource. Couldn't load collection from database. ${errMessage}`,
      );
    }

    const results = collection.filter(query);

    return results;
  },

  async update(changes, query = () => false, overwrite = false) {
    // Validate the data
    try {
      validateUpdate(changes, fields);
    } catch (err) {
      throw Error(`[${modelName}] Error while updating resource ${err}`);
    }

    // if (validationStatus.error) {
    //   return error(validationStatus.error, {});
    // }

    // Get the collection from memory
    let collection;

    try {
      collection = await getResource(resourcePath);
    } catch (errMessage) {
      throw Error(`[${modelName}] Error while updating resource ${errMessage}`);
    }

    const updatedCollection = collection.map(currentItem =>
      query(currentItem)
        ? overwrite
          ? changes
          : { ...currentItem, ...changes }
        : currentItem,
    );

    try {
      await writeFile(resourcePath, JSON.stringify(updatedCollection, null, 2));
    } catch (err) {
      throw Error(`[${modelName}] Error while updating resource ${err}`);
    }

    return updatedCollection;
  },
});
