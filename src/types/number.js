/* eslint algolia/no-module-exports: 0 */

import isNumber from 'lodash/isNumber';

module.exports = {
  name: 'number',
  checker: isNumber,
  printer: JSON.stringify
};
