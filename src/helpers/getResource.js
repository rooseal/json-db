const readFile = require('./promised/readFile');

module.exports = async path => {
  try {
    const data = await readFile(path, 'UTF-8');

    return JSON.parse(data);
  } catch (err) {
    throw Error(err);
  }
};
