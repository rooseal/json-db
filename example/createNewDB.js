const path = require('path');
const jsonDB = require('../src');

jsonDB
  .create({
    dbPath: path.resolve(__dirname, './data/'),
    dbName: 'dashboard',
    models: {
      User: {
        fields: {
          firstname: {
            type: jsonDB.types.string,
          },

          lastName: {
            type: jsonDB.types.string,
          },
        },
      },
    },
  })
  .then(Models => {
    Models.User.read().then(({ error, data: users }) => {
      if (!error) {
        console.log({ users });
      }
    });
  });
