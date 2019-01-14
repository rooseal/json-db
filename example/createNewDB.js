const path = require('path');
const jsonDB = require('../src');

async function makeDBOperations(Models) {
  try {
    const usersBeforeWrite = await Models.User.read();
    console.log({ usersBeforeWrite });
  } catch (err) {
    console.log(err);
  }

  try {
    await Models.User.create({
      firstname: 'Alyssa',
    });
  } catch (err) {
    console.log(err);
  }
  // console.log({ writeResult });

  try {
    const usersAfterWrite = await Models.User.read();
    console.log({ usersAfterWrite });
  } catch (err) {
    console.log(err);
  }
}

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

          lastname: {
            type: jsonDB.types.string,
            constraints: [jsonDB.constraints.required],
          },
        },
      },
    },
  })
  .then(Models => {
    try {
      makeDBOperations(Models);
    } catch (err) {
      console.log(err);
    }
  });
