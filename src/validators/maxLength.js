/* eslint algolia/no-module-exports: 0 */

module.exports = {
  name: 'maxLength',
  validator: (max) =>
    (str) => str.length <= max || `should be at most \`${max}\` characters long`
};
