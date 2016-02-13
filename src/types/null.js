/* eslint algolia/no-module-exports: 0 */

import isNull from 'lodash/isNull';

module.exports = {
  name: 'null',
  checker: isNull,
  printer: () => 'null'
};
