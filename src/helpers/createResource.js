const stat = require('./promised/stat');
const writeFile = require('./promised/writeFile');

module.exports = async path => {
  try {
    await stat(path);
  } catch (err) {
    if (err.code === 'ENOENT') {
      const emptyCollection = [];

      try {
        await writeFile(path, JSON.stringify(emptyCollection, 0, 2));
      } catch (writeError) {
        console.log(writeError);
      }
    }
  }
};
