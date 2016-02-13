/* eslint algolia/no-module-exports: 0 */

import isRegExp from 'lodash/isRegExp';

module.exports = {
  name: 'RegExp',
  checker: isRegExp,
  printer: (r) => r.toString()
};
