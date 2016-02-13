/* eslint algolia/no-module-exports: 0 */

import isBoolean from 'lodash/isBoolean';

module.exports = {
  name: 'boolean',
  checker: isBoolean,
  printer: JSON.stringify
};
