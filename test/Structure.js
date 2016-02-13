/* eslint-env mocha */
/* eslint algolia/no-require: 0 */

import expect from 'expect';

import ExceptionThrower from '../src/ExceptionThrower.js';
import Structure from '../src/Structure.js';
import TypeCheckerStore from '../src/TypeCheckerStore.js';
import TypePrinterStore from '../src/TypePrinterStore.js';

describe('Structure', () => {
  let errors;
  let expected;
  let isElement;
  let parentPath;
  let path;
  let shared;
  let structure;
  let thrower;
  let typeCheckers;
  let typePrinters;

  beforeEach(() => {
    errors = [];
    isElement = false;
    parentPath = null;
    path = 'opt';
    structure = {type: 'string', value: 'default value'};

    thrower = new ExceptionThrower('StructureChecker');
    typeCheckers = new TypeCheckerStore(thrower);
    typePrinters = new TypePrinterStore(thrower);
    shared = {
      thrower,
      typeCheckers,
      typePrinters
    };

    ['any', 'undefined', 'boolean', 'string', 'number', 'Array', 'Object'].forEach((type) => {
      const {checker, printer} = require(`../src/types/${type}`);
      typeCheckers.add(type, checker);
      typePrinters.add(type, printer);
    });
  });

  function instance() {
    return new Structure(structure, shared, path, parentPath, isElement);
  }

  context('constructor', () => {
    beforeEach(() => {
      expected = {
        children: null,
        element: null,
        hasChildren: false,
        hasElement: false,
        hasValue: true,
        isElement: false,
        path: 'opt',
        required: false,
        fullPath: 'opt',
        types: ['string'],
        typesStr: 'string',
        validators: [],
        value: 'default value',
        valueStr: '"default value"'
      };
    });

    function object() {
      return JSON.parse(JSON.stringify(instance()));
    }

    function check() {
      expect(object()).toEqual(expected);
    }

    context('path', () => {
      it('uses it', () => {
        path = 'customOpt';
        expected.path = 'customOpt';
        expected.fullPath = 'customOpt';
        check();
      });
    });

    context('parentPath', () => {
      it('uses it', () => {
        parentPath = 'parentOpt';
        path = '.customOpt';
        expected.path = '.customOpt';
        expected.fullPath = 'parentOpt.customOpt';
        check();
      });
    });

    context('isElement', () => {
      it('sets it to false if undefined', () => {
        isElement = undefined;

        expected.isElement = false;

        check();
      });

      it('uses it if set to true', () => {
        isElement = true;
        delete structure.value;

        expected.hasValue = false;
        expected.isElement = true;
        delete expected.value;
        delete expected.valueStr;

        check();
      });
    });

    context('structure', () => {
      it('throws if undefined', () => {
        structure = undefined;
        expect(object).toThrow('[StructureChecker] `opt`\'s `structure` must be defined');
      });

      context('.type', () => {
        it('throws if type is undefined', () => {
          delete structure.type;
          expect(object).toThrow('[StructureChecker] `opt` must have a `type`');
        });

        it('works with only one type', () => {
          structure.type = 'boolean';

          expected.types = ['boolean'];
          expected.typesStr = 'boolean';

          check();
        });
        it('works with multiple types', () => {
          structure.type = 'boolean|string';

          expected.types = ['boolean', 'string'];
          expected.typesStr = 'boolean|string';

          check();
        });
      });

      context('.required', () => {
        it('uses it', () => {
          delete structure.value;
          structure.required = true;

          delete expected.value;
          delete expected.valueStr;
          expected.required = true;
          expected.hasValue = false;

          check();
        });
      });

      context('.value', () => {
        it('handles undefined correctly', () => {
          structure.value = undefined;

          expected.hasValue = true;
          delete expected.value;
          delete expected.valueStr;

          check();
        });

        it('handles not defined correctly', () => {
          delete structure.value;

          expected.hasValue = false;
          delete expected.value;
          delete expected.valueStr;

          check();
        });

        it('throws if .value and .required are defined', () => {
          structure.value = undefined;
          structure.required = true;

          expect(check).toThrow('[StructureChecker] `opt` can\'t be `required` and have a `value`');
        });

        it('creates valueStr', () => {
          structure.value = 'default value';

          expected.hasValue = true;
          expected.value = 'default value';
          expected.valueStr = '"default value"';

          check();
        });
      });

      context('.validators', () => {
        it('generates an empty array if not passed', () => {
          structure.validators = undefined;
          delete structure.validators;

          expect(instance().validators).toEqual([]);
        });

        it('takes it if defined', () => {
          structure.validators = [];

          expect(instance().validators).toEqual(structure.validators);
        });
      });

      context('.element', () => {
        beforeEach(() => {
          structure = {type: 'Array', element: {
            type: 'string'
          }};
          expected = {
            children: null,
            element: {
              children: null,
              element: null,
              fullPath: 'opt[]',
              hasChildren: false,
              hasElement: false,
              hasValue: false,
              isElement: true,
              path: '[]',
              required: false,
              types: ['string'],
              typesStr: 'string',
              validators: []
            },
            fullPath: 'opt',
            hasChildren: false,
            hasElement: true,
            hasValue: false,
            isElement: false,
            path: 'opt',
            required: false,
            types: ['Array'],
            typesStr: 'Array',
            validators: []
          };
        });

        it('works', () => {
          check();
        });
        it('throws if element has a default value', () => {
          structure.element.value = undefined;
          expect(object).toThrow('[StructureChecker] `opt[]` is an `element`, it can\'t have a `value`');
        });
        it('throws if element is required', () => {
          structure.element.required = true;
          expect(object).toThrow('[StructureChecker] `opt[]` is an `element`, it can\'t be `required`');
        });
      });

      context('children', () => {
        context('array', () => {
          beforeEach(() => {
            structure = {type: 'Array', children: [
              {type: 'string', value: 'default value for child 0'},
              {type: 'string', value: 'default value for child 1'}
            ]};
            expected = {
              children: [{
                children: null,
                element: null,
                fullPath: 'opt[0]',
                hasChildren: false,
                hasElement: false,
                hasValue: true,
                isElement: false,
                path: '[0]',
                required: false,
                types: ['string'],
                typesStr: 'string',
                value: 'default value for child 0',
                valueStr: '"default value for child 0"',
                validators: []
              }, {
                children: null,
                element: null,
                fullPath: 'opt[1]',
                hasChildren: false,
                hasElement: false,
                hasValue: true,
                isElement: false,
                path: '[1]',
                required: false,
                types: ['string'],
                typesStr: 'string',
                value: 'default value for child 1',
                valueStr: '"default value for child 1"',
                validators: []
              }],
              element: null,
              fullPath: 'opt',
              hasChildren: true,
              hasElement: false,
              hasValue: false,
              isElement: false,
              path: 'opt',
              required: false,
              types: ['Array'],
              typesStr: 'Array',
              validators: []
            };
          });

          it('works', () => {
            check();
          });
        });

        context('object', () => {
          beforeEach(() => {
            structure = {type: 'Object', children: {
              subOpt1: {type: 'string', value: 'default value for subOpt1'},
              subOpt2: {type: 'string', value: 'default value for subOpt2'}
            }};
            expected = {
              children: {
                subOpt1: {
                  children: null,
                  element: null,
                  fullPath: 'opt.subOpt1',
                  hasChildren: false,
                  hasElement: false,
                  hasValue: true,
                  isElement: false,
                  path: '.subOpt1',
                  required: false,
                  types: ['string'],
                  typesStr: 'string',
                  value: 'default value for subOpt1',
                  valueStr: '"default value for subOpt1"',
                  validators: []
                },
                subOpt2: {
                  children: null,
                  element: null,
                  fullPath: 'opt.subOpt2',
                  hasChildren: false,
                  hasElement: false,
                  hasValue: true,
                  isElement: false,
                  path: '.subOpt2',
                  required: false,
                  types: ['string'],
                  typesStr: 'string',
                  value: 'default value for subOpt2',
                  valueStr: '"default value for subOpt2"',
                  validators: []
                }
              },
              element: null,
              fullPath: 'opt',
              hasChildren: true,
              hasElement: false,
              hasValue: false,
              isElement: false,
              path: 'opt',
              required: false,
              types: ['Object'],
              typesStr: 'Object',
              validators: []
            };
          });

          it('works', () => {
            check();
          });
        });
      });


      context('element and children', () => {
        beforeEach(() => {
          structure = {type: 'Array', element: {
            type: 'string', value: 'default value for subElement'
          }};
        });

        it('throws if children is an array', () => {
          structure.children = [];
          const error = '`opt`\'s structure can\'t have both `element` and `children`';
          expect(object).toThrow(`[StructureChecker] ${error}`);
        });
        it('throws if children is an object', () => {
          structure.children = [];
          const error = '`opt`\'s structure can\'t have both `element` and `children`';
          expect(object).toThrow(`[StructureChecker] ${error}`);
        });
      });

      context('required and value', () => {
        beforeEach(() => {
          structure.required = true;
          structure.value = 'xxx';
        });

        it('throws', () => {
          expect(object).toThrow('[StructureChecker] `opt` can\'t be `required` and have a `value`');
        });
      });
    });
  });

  context('methods', () => {
    context('#buildValue', () => {
      let value;

      context('()', () => {
        it('returns a clone of the default value', () => {
          let defaultValue = {};
          structure = {type: 'Object', value: {}};
          expect(instance().buildValue()).toEqual(defaultValue);
          expect(instance().buildValue()).toNotBe(defaultValue);
        });
      });


      context('(value)', () => {
        it('returns the passed value', () => {
          structure = {type: 'Object'};
          value = {};
          expect(instance().buildValue(value)).toBe(value);
        });
        it('returns a clone of the value in the general case', () => {
          let defaultValue = {key: 'value'};
          structure = {type: 'Object', value: defaultValue};
          value = undefined;
          expect(instance().buildValue(value)).toEqual(defaultValue);
          expect(instance().buildValue(value)).toNotBe(defaultValue);
        });
        it('returns the default value if it\'s a function', () => {
          function defaultValue() { return true; }
          structure = {type: 'Object', value: defaultValue};
          value = undefined;
          expect(instance().buildValue(value)).toBe(defaultValue);
        });
        it('returns the computed default value', () => {
          structure = {type: 'boolean', computeValue: () => true};
          value = undefined;
          expect(instance().buildValue(value)).toBe(true);
        });
        it('returns the value if it\'s an error', () => {
          let defaultValue = new Error('Custom Error');
          structure = {type: 'Object', value: defaultValue};
          value = undefined;
          expect(instance().buildValue(value)).toBe(defaultValue);
        });
        it('initialized defaults on element with children', () => {
          structure = {type: 'Array', element: {
            type: 'Object', children: {
              subOpt1: {type: 'string', value: 'default value for subOpt1'},
              subOpt2: {type: 'number', value: 42},
              subOpt3: {type: 'string'}
            }
          }};
          value = [{
            subOpt2: 2
          }, {
            subOpt3: 'custom value'
          }];
          expect(instance().buildValue(value)[0].subOpt1).toEqual('default value for subOpt1');
          expect(instance().buildValue(value)[0].subOpt2).toEqual(2);
          expect(instance().buildValue(value)[0].subOpt3).toEqual(undefined);
          expect(instance().buildValue(value)[1].subOpt1).toEqual('default value for subOpt1');
          expect(instance().buildValue(value)[1].subOpt2).toEqual(42);
          expect(instance().buildValue(value)[1].subOpt3).toEqual('custom value');
        });
      });
    });

    context('#check', () => {
      let value;

      beforeEach(() => {
        errors = [];
      });

      it('adds and error if required and not passed', () => {
        value = undefined;
        structure = {type: 'string', required: true};

        instance().check(value, errors, parentPath);

        expect(errors).toEqual([{
          actualPath: 'opt',
          message: 'is required',
          structurePath: 'opt'
        }]);
      });

      it('doesn\'t add an error if a validator passes', () => {
        value = 'test';
        structure = {type: 'string', validators: [() => true]};

        instance().check(value, errors, parentPath);

        expect(errors).toEqual([]);
      });

      it('adds an error if a validator fails', () => {
        value = 'test';
        structure = {type: 'string', validators: [() => 'should never work']};

        instance().check(value, errors, parentPath);

        expect(errors).toEqual([{
          actualPath: 'opt',
          message: 'should never work',
          structurePath: 'opt'
        }]);
      });

      it('only adds one validator error', () => {
        value = 'test';
        structure = {type: 'string', validators: [
          () => 'should never work',
          () => 'should never work2'
        ]};

        instance().check(value, errors, parentPath);

        expect(errors).toEqual([{
          actualPath: 'opt',
          message: 'should never work',
          structurePath: 'opt'
        }]);
      });

      it('fails if an element is undefined', () => {
        value = ['test', undefined, 'test2', undefined];
        structure = {type: 'Array', element: {
          type: 'string'
        }};

        instance().check(value, errors, parentPath);

        expect(errors).toEqual([{
          actualPath: 'opt[1]',
          message: 'should be defined',
          structurePath: 'opt'
        }, {
          actualPath: 'opt[3]',
          message: 'should be defined',
          structurePath: 'opt'
        }]);
      });

      it('doesn\'t fail if an element is undefined and undefined is in type', () => {
        value = ['test', undefined, 'test2', undefined];
        structure = {type: 'Array', element: {
          type: 'string|undefined'
        }};

        instance().check(value, errors, parentPath);

        expect(errors).toEqual([]);
      });

      it('doesn\'t fail if an element is undefined and any is in type', () => {
        value = ['test', undefined, 'test2', undefined];
        structure = {type: 'Array', element: {
          type: 'string|any'
        }};

        instance().check(value, errors, parentPath);

        expect(errors).toEqual([]);
      });
    });

    context('#usage', () => {
      function check() {
        expect(instance().usage(path)).toEqual(expected);
      }

      it('puts no name by default', () => {
        path = undefined;
        expected = '    <string> = "default value"';
        check();
      });

      it('uses name', () => {
        expected = '    optName<string> = "default value"';
        expect(instance().usage('optName')).toEqual(expected);
      });
      it('respects indentation', () => {
        expected = '      optName<string> = "default value"';
        expect(instance().usage('optName', [], 6)).toEqual(expected);
      });
      it('displays required', () => {
        structure = {type: 'string', required: true};
        expected = '*   opt<string>';
        check();
      });
      it('displays an error', () => {
        let s = instance();
        errors = [{structurePath: 'opt'}];
        expected = ' X  opt<string> = "default value"';
        expect(s.usage(path, errors)).toEqual(expected);
      });
      it('handles multiple types', () => {
        structure.type = 'string|number';
        expected = '    opt<string|number> = "default value"';
        check();
      });
      it('handles a string element', () => {
        structure = {type: 'Array', value: [], element: {type: 'string'}};
        expected = '    opt<Array>: [<string>] = []';
        check();
      });
      it('handles an object element', () => {
        structure = {type: 'Array', required: true, element: {type: 'Object', children: {
          elementOpt1: {type: 'string', required: true},
          elementOpt2: {type: 'number', value: 42},
          elementOpt3: {type: 'string', value: 'default value'}
        }}};
        expected = '' +
          '*   opt<Array>: [<Object>{\n' +
          '*     elementOpt1<string>,\n' +
          '      elementOpt2<number> = 42,\n' +
          '      elementOpt3<string> = "default value"\n' +
          '    }]';
        check();
      });
      it('handles children object', () => {
        structure = {type: 'Object', value: {}, children: {
          subOpt1: {type: 'string', required: true},
          subOpt2: {type: 'number', value: 42},
          subOpt3: {type: 'string', value: 'default value'}
        }};
        expected = '' +
          '    opt<Object>: {\n' +
          '*     subOpt1<string>,\n' +
          '      subOpt2<number> = 42,\n' +
          '      subOpt3<string> = "default value"\n' +
          '    } = {}';
        check();
      });
      it('handles children array', () => {
        structure = {type: 'Array', value: [], children: [
          {type: 'string', required: true},
          {type: 'number', value: 42},
          {type: 'string', value: 'default value'}
        ]};
        expected = '' +
          '    opt<Array>: [\n' +
          '*     <string>,\n' +
          '      <number> = 42,\n' +
          '      <string> = "default value"\n' +
          '    ] = []';
        check();
      });
    });
  });
});
