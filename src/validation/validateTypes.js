const constants = require('../constants');
const isString = require('../utils/type-checks/isString');
const isNumber = require('../utils/type-checks/isNumber');
const isBoolean = require('../utils/type-checks/isBoolean');
const isArray = require('../utils/type-checks/isArray');
const isObject = require('../utils/type-checks/isObject');
const isFunction = require('../utils/type-checks/isFunction');

module.exports = {
  [constants.TYPE_STRING]: isString,
  [constants.TYPE_NUMBER]: isNumber,
  [constants.TYPE_BOOLEAN]: isBoolean,
  [constants.TYPE_ARRAY]: isArray,
  [constants.TYPE_OBJECT]: isObject,
  [constants.TYPE_FUNCTION]: isFunction,
};
