/* eslint algolia/no-module-exports: 0 */

import isPlainObject from 'lodash/isPlainObject';

module.exports = {
  name: 'Object',
  checker: isPlainObject,
  printer: JSON.stringify
};
