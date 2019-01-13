const fs = require('fs');

const requiredParam = require('./utils/requiredParam');
const constants = require('./constants');
const getResourceName = require('./helpers/getResourceName');
const createResource = require('./helpers/createResource');
const createModelCRUD = require('./createModelCrud');

let Models;

module.exports = {
  types: {
    string: constants.TYPE_STRING,
    number: constants.TYPE_NUMBER,
    array: constants.TYPE_ARRAY,
    object: constants.TYPE_OBJECT,
    bool: constants.TYPE_BOOLEAN,
    function: constants.TYPE_FUNCTION,
  },
  constraints: {
    required: (name, value) => ({
      execute: () => value === undefined,
      message: `${name} is a required field`,
    }),
  },
  create: async ({
    dbName = requiredParam('db', 'dbName', true),
    dbPath = constants.DB_PATH,
    models = {},
  }) => {
    const collectionPath = `${dbPath}${
      dbPath.slice(-1) === '/' ? '' : '/'
    }${dbName}/`;

    // Create the db folder if it doesn't exists
    if (!fs.existsSync(collectionPath)) {
      fs.mkdirSync(collectionPath);
    }

    // Create the Models if they don't exist
    if (Models === undefined) {
      Models = await Object.entries(models).reduce(
        async (gather, [modelName, model]) => {
          // Create the resource if it does not exist

          const resourcePath = `${collectionPath}${getResourceName(modelName)}`;
          await createResource(resourcePath);

          // Create the CRUD for the model
          const modelCRUD = createModelCRUD({
            resourcePath,
            fields: model.fields,
          });

          // Put the modelCrud on the Models
          gather[modelName] = modelCRUD;

          return gather;
        },

        {},
      );
    }

    return Models;
  },
};
