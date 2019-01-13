const isNull = require('./isNull');
const isArray = require('./isArray');

module.exports = x => typeof x === 'object' && !isNull(x) && !isArray(x);
