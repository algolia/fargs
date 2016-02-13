/* eslint algolia/no-module-exports: 0 */

import isArray from 'lodash/isArray';

module.exports = {
  name: 'Array',
  checker: isArray,
  printer: JSON.stringify
};
