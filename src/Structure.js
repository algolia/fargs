import clone from 'lodash/clone';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import isNull from 'lodash/isNull';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

export default class Structure {
  constructor(structure, shared, path, parentPath = null, isElement = false) {
    let {
      thrower,
      typeCheckers,
      typePrinters
    } = shared;

    this.path = path;
    this.fullPath = `${isNull(parentPath) ? '' : parentPath}${path}`;

    // Structure
    if (isUndefined(structure)) {
      thrower.throw(`\`${this.fullPath}\`'s \`structure\` must be defined`);
    }

    // Types
    if (!isString(structure.type)) {
      thrower.throw(`\`${this.fullPath}\` must have a \`type\``);
    }
    this.types = structure.type.split('|');
    this.typeCheck = typeCheckers.check.bind(typeCheckers, this.types);
    this.typesStr = this.types.join('|');

    // Required and default value
    this.required = structure.required === true;
    this.hasValue = structure.hasOwnProperty('value') || structure.hasOwnProperty('computeValue');
    this.value = (structure.computeValue || (() => structure.value))();
    this.computeValue = structure.computeValue;
    if (this.hasValue) {
      this.valueStr = typePrinters.get(this.types[0])(this.value);
    }
    if (this.hasValue && this.required) {
      thrower.throw(`\`${this.fullPath}\` can't be \`required\` and have a \`value\``);
    }

    // Validators
    this.validators = structure.validators || [];

    // Own element
    this.isElement = isElement;
    if (this.isElement) {
      if (this.hasValue) {
        thrower.throw(`\`${this.fullPath}\` is an \`element\`, it can't have a \`value\``);
      }
      if (this.required) {
        thrower.throw(`\`${this.fullPath}\` is an \`element\`, it can't be \`required\``);
      }
    }

    // Element and Children
    this.hasElement = !isUndefined(structure.element);
    this.hasChildren = !isUndefined(structure.children);
    if (this.hasElement && this.hasChildren) {
      thrower.throw(`\`${this.fullPath}\`'s structure can't have both \`element\` and \`children\``);
    }

    // Children
    this.children = null;
    if (this.hasChildren) {
      this.children = isArray(structure.children) ? [] : {};
      forEach(structure.children, (childStructure, childName) => {
        const childPath = isArray(structure.children) ? `[${childName}]` : `.${childName}`;
        this.children[childName] = new Structure(childStructure, shared, childPath, this.fullPath);
      });
    }

    // Element
    this.element = null;
    if (this.hasElement) {
      this.element = new Structure(structure.element, shared, '[]', this.fullPath, true);
    }
  }

  buildValue(value) {
    if (isUndefined(value) && this.hasValue) {
      if (isFunction(this.computeValue)) {
        value = this.computeValue();
      } else {
        const tmp = clone(this.value);
        if (isPlainObject(tmp) && !isPlainObject(this.value)) { // Not clonable
          value = this.value;
        } else {
          value = tmp;
        }
      }
    }
    if (!isNull(this.children)) {
      forEach(this.children, (childStructure, key) => {
        const res = childStructure.buildValue(value[key]);
        if (!isUndefined(res)) value[key] = res;
      });
    }
    if (!isNull(this.element)) {
      forEach(value, (childValue, index) => {
        value[index] = this.element.buildValue(childValue);
      });
    }
    return value;
  }

  _addError(errors, message, parentPath, index) {
    if (isNull(parentPath)) parentPath = '';
    errors.push({
      actualPath: `${parentPath}${this.isElement ? `[${index}]` : this.path}`,
      message,
      structurePath: this.isElement ? parentPath : this.fullPath
    });
  }

  check(value, errors, parentPath = null, index = null) {
    const type = typeof (value);

    // Element definition
    if (this.isElement) {
      const noUndefined = this.types.indexOf('undefined') === -1 && this.types.indexOf('any') === -1;
      if (isUndefined(value) && noUndefined) {
        this._addError(errors, 'should be defined', parentPath, index);
        return;
      }
    }

    // Required
    if (this.required && isUndefined(value)) {
      this._addError(errors, 'is required', parentPath, index);
      return;
    }

    // Skip if not required and absent
    if (isUndefined(value) && !this.isElement && !this.required) return;

    // Type error
    if (!this.typeCheck(value)) {
      const message = `should be <${this.typesStr}>, received ${type}`;
      this._addError(errors, message, parentPath, index);
      return;
    }

    // Validators
    for (let i = 0; i < this.validators.length; ++i) {
      const vRes = this.validators[i](value);
      if (vRes !== true) {
        this._addError(errors, vRes, parentPath, index);
        return;
      }
    }

    // Recursive calls
    if (this.hasChildren) {
      forEach(this.children, (childStructure, key) => {
        childStructure.check(value[key], errors, this.fullPath);
      });
    }

    if (this.hasElement) {
      forEach(value, (childValue, childIndex) => {
        this.element.check(childValue, errors, this.fullPath, childIndex);
      });
    }
  }

  usage(name = null, errors = [], indent = 4) {
    const indentation = new Array(indent + 1).join(' ');

    const requiredChar = this.required ? '*' : ' ';
    const errorChar = find(errors, {structurePath: this.fullPath}) ? 'X' : ' ';
    const prefix = requiredChar + errorChar + indentation.substring(0, indentation.length - 2);

    const hasName = !isUndefined(name) && !isNull(name) && !isNumber(name);
    if (!hasName) name = '';

    let res = `${prefix}${name}<${this.typesStr}>`;

    if ((!isNull(this.children) || !isNull(this.element)) && hasName) res += ': ';

    if (!isNull(this.children)) {
      const childrenArray = isArray(this.children);
      res += childrenArray ? '[' : '{';
      res += '\n';
      let childrenUsages = [];
      forEach(this.children, (childStructure, childName) => {
        childrenUsages.push(childStructure.usage(childName, errors, indent + 2));
      });
      res += childrenUsages.join(',\n');
      res += `\n${indentation}`;
      res += childrenArray ? ']' : '}';
    }

    if (!isNull(this.element)) {
      res += `[${this.element.usage(null, errors, indent).substr(indent)}]`;
    }

    if (this.hasValue) res += ` = ${this.valueStr}`;
    return res;
  }
}
