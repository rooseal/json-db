const path = require('path');
const fs = require('fs');

function createPath(pathString) {
  // Create the db folder if it doesn't exists
  if (!fs.existsSync(pathString)) {
    createPath(
      pathString
        .split(path.sep)
        .slice(0, -1)
        .join(path.sep),
    );

    fs.mkdirSync(pathString);
  }
}

module.exports = createPath;
