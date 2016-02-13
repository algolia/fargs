/* eslint algolia/no-module-exports: 0 */

module.exports = {
  name: 'includedIn',
  validator: (arr, alias) => {
    const refStr = alias ? alias : JSON.stringify(arr);
    const message = `should be included in \`${refStr}\``;
    return (elt) => arr.indexOf(elt) !== -1 || message;
  }
};
