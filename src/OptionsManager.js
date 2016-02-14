import isUndefined from 'lodash/isUndefined';

import ExceptionThrower from './ExceptionThrower.js';
import FunctionChecker from './FunctionChecker.js';
import Structure from './Structure.js';
import TypeCheckerStore from './TypeCheckerStore.js';
import TypePrinterStore from './TypePrinterStore.js';
import ValidatorStore from './ValidatorStore.js';

function defaultPrint(elt) {
  return elt.toString();
}

export default class OptionsManager {
  constructor() {
    this.thrower = new ExceptionThrower('OptionsManager');
    this.typeCheckers = new TypeCheckerStore(this.thrower);
    this.typePrinters = new TypePrinterStore(this.thrower);
    this.validators = new ValidatorStore(this.thrower);
    this._shared = {
      thrower: this.thrower,
      typeCheckers: this.typeCheckers,
      typePrinters: this.typePrinters
    };
  }

  registerType({name, checker, printer = defaultPrint}) {
    this.typeCheckers.add(name, checker);
    this.typePrinters.add(name, printer);
    return this;
  }
  registerTypes(types) {
    types.forEach(this.registerType, this);
    return this;
  }

  registerValidator({name, validator}) {
    this.validators.add(name, validator);
    return this;
  }
  registerValidators(validators) {
    validators.forEach(this.registerValidator, this);
    return this;
  }

  validator(name, ...args) {
    return this.validators.get(name)(...args);
  }

  // Accepts (name, obj) or just (obj)
  structure(name, obj) {
    if (isUndefined(obj)) {
      obj = name;
      name = '';
    }
    return new Structure(obj, this._shared, name);
  }

  check(name) {
    const shared = {
      ...this._shared,
      thrower: this.thrower.nest('.check')
    };
    return new FunctionChecker(name, shared);
  }
}
