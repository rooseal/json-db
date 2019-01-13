module.exports = modelName =>
  `${modelName[0].toLowerCase()}${modelName.slice(1)}s.json`;
