/* eslint algolia/no-module-exports: 0 */

import isFunction from 'lodash/isFunction';

module.exports = {
  name: 'function',
  checker: isFunction,
  printer: (f) => {
    const name = f.name || 'anonymous';
    let args = f.length ? `${f.length} argument${f.length > 1 ? 's' : ''}` : '';
    return `${name}(${args})`;
  }
};
