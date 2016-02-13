/* eslint algolia/no-module-exports: 0 */

module.exports = {
  name: 'strictlyEquals',
  validator: (ref, alias) => {
    const refStr = alias ? alias : JSON.stringify(ref);
    const message = `should be strictly equal \`===\` to \`${refStr}\``;
    return (elt) => elt === ref || message;
  }
};
