/* eslint algolia/no-module-exports: 0 */

module.exports = {
  name: 'greaterThan',
  validator: (n) =>
    (elt) => elt > n || `should be greater \`>\` than \`${n}\``
};
