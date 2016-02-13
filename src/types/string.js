/* eslint algolia/no-module-exports: 0 */

import isString from 'lodash/isString';

module.exports = {
  name: 'string',
  checker: isString,
  printer: JSON.stringify
};
