/* eslint algolia/no-module-exports: 0 */

module.exports = {
  name: 'match',
  validator: (format) =>
    (str) => str.match(format) !== null || `should match \`${format}\``
};
