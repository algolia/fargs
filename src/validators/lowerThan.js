/* eslint algolia/no-module-exports: 0 */

module.exports = {
  name: 'lowerThan',
  validator: (n) =>
    (elt) => elt < n || `should be lower \`<\` than \`${n}\``
};
