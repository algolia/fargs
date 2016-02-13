import forEach from 'lodash/forEach';
import isNull from 'lodash/isNull';

import Structure from './Structure.js';

export default class FunctionChecker {
  constructor(name, shared) {
    this.name = name;
    this.options = [];
    this.errors = [];
    this.shared = shared;
  }

  arg(structure, value, name = null) {
    if (!(structure instanceof Structure)) {
      const path = isNull(name) ? `arguments[${this.options.length}]` : name;
      structure = new Structure(structure, this.shared, path);
    }
    this.options.push({name, structure, value});
    return this;
  }

  _legend() {
    let res = ['<...> Type', '*     Required'];
    if (this.errors.length > 0) res.push('X     Error');
    return res;
  }

  usage() {
    let usages = [];
    forEach(this.options, ({structure, name}) => {
      usages.push(structure.usage(name, this.errors));
    });
    let res = [];
    res.push(`Usage:\n  ${this.name}(\n${usages.join(',\n')}\n  )`);
    if (this.errors.length > 0) {
      const errorsStr = this.errors
        .map(({actualPath, message}) => `  - \`${actualPath}\` ${message}`)
        .join('\n');
      res.push(`Errors:\n${errorsStr}`);
    }
    res.push(`Legend:\n  ${this._legend().join('\n  ')}`);
    return `\n${res.join('\n----------------\n')}`;
  }

  check() {
    this.errors = [];
    forEach(this.options, ({structure, value}) => {
      structure.check(value, this.errors);
    });
    if (this.errors.length > 0) throw new Error(this.usage());
  }

  values() {
    let res = [];
    forEach(this.options, (option) => {
      res.push(option.structure.buildValue(option.value));
    });
    this.check();
    return res;
  }
}
