/* eslint algolia/no-module-exports: 0 */

module.exports = {
  name: 'minLength',
  validator: (min) =>
    (str) => str.length >= min || `should be at least \`${min}\` characters long`
};
