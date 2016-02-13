import isArray from 'lodash/isArray';

import Store from './Store.js';

class TypeCheckerStore extends Store {
  constructor(thrower) {
    super(thrower, 'TypeCheckerStore');
  }

  check(types, value) {
    const thrower = this.thrower.nest('.check');
    if (!isArray(types)) {
      thrower.throw(`Types \`${types}\` should be an array`);
    }
    if (types.length === 0) {
      thrower.throw('Types `[]` must have at least one element');
    }
    let res = false;
    // Let the loop run until the end, we want it to break
    // if it fails for any type
    types.forEach((type) => {
      if (this.get(type)(value)) res = true;
    });
    return res;
  }
}
export default TypeCheckerStore;
