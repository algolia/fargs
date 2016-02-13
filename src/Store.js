import isFunction from 'lodash/isFunction';
import isNull from 'lodash/isNull';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

import ExceptionThrower from './ExceptionThrower.js';

export default class Store {
  constructor(thrower = null, name = 'Store') {
    this.thrower = isNull(thrower)
      ? new ExceptionThrower(name)
      : thrower.nest(name);
    this.store = {};
  }

  get(name) {
    const thrower = this.thrower.nest('.get');

    if (!isString(name)) {
      thrower.throw(`Name \`${name}\` should be a string`);
    }

    let res = this.store[name];

    if (isUndefined(res)) {
      thrower.throw(`Name \`${name}\` has no associated function`);
    }

    return res;
  }

  set(name, func, method = 'set') {
    const thrower = this.thrower.nest(`.${method}`);
    if (!isString(name)) {
      thrower.throw(`Name \`${name}\` should be a string`);
    }
    if (!isFunction(func)) {
      thrower.throw(`Function \`${func}\` should be a function`);
    }
    this.store[name] = func;
  }
  add(name, func) { this.set(name, func, 'add'); }
}
