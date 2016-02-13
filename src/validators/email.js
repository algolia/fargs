/* eslint algolia/no-module-exports: 0 */

const emailRegExp = /.*@.*\..*/;

module.exports = {
  name: 'email',
  validator: () =>
    (str) => str.match(emailRegExp) !== null || `should be an email`
};
