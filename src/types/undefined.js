/* eslint algolia/no-module-exports: 0 */

import isUndefined from 'lodash/isUndefined';

module.exports = {
  name: 'undefined',
  checker: isUndefined,
  printer: () => 'undefined'
};
