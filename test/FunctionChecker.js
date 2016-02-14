/* eslint-env mocha */
/* eslint algolia/no-require: 0 */

import expect from 'expect';

import ExceptionThrower from '../src/ExceptionThrower.js';
import FunctionChecker from '../src/FunctionChecker.js';
import Structure from '../src/Structure.js';
import TypeCheckerStore from '../src/TypeCheckerStore.js';
import TypePrinterStore from '../src/TypePrinterStore.js';

describe('FunctionChecker', () => {
  let defaultStructure;
  let name;
  let shared;
  let thrower;
  let typeCheckers;
  let typePrinters;

  beforeEach(() => {
    name = 'customFunc';
    thrower = new ExceptionThrower('Function Checker');
    typeCheckers = new TypeCheckerStore();
    typePrinters = new TypePrinterStore();
    shared = {
      thrower,
      typeCheckers,
      typePrinters
    };
    ['boolean', 'number', 'string', 'Array', 'Object'].forEach((type) => {
      const typeObj = require(`../src/types/${type}.js`);
      typeCheckers.set(typeObj.name, typeObj.checker);
      typePrinters.set(typeObj.name, typeObj.printer);
    });
    defaultStructure = new Structure({type: 'string'}, shared, 'opt');
  });

  context('constructor', () => {
    it('should work', () => {
      expect(() => (
        new FunctionChecker(name, shared)
      )).toNotThrow();
    });
  });

  context('methods', () => {
    context('#arg', () => {
      it('should be able to chain arg calls', () => {
        expect(() => {
          new FunctionChecker(name, shared)
            .arg(defaultStructure)
            .arg(defaultStructure);
        }).toNotThrow();
      });
    });

    context('#values', () => {
      it('should use an empty array of value if not passed', () => {
        const value = new FunctionChecker(name, shared)
                .arg(new Structure({type: 'string', value: 'default value'}, shared, 'opt'))
                .values()[0];
        expect(value).toBe('default value');
      });
      it('should assign the default value if not present', () => {
        const value = new FunctionChecker(name, shared)
          .arg(new Structure({type: 'string', value: 'default value'}, shared, 'opt'))
          .values([undefined])[0];
        expect(value).toBe('default value');
      });
      it('should not assign the default value if present', () => {
        const [value] = new FunctionChecker(name, shared)
          .arg(new Structure({type: 'string', value: 'default value'}, shared))
          .values(['value']);
        expect(value).toBe('value');
      });

      context('error management', () => {
        it('throws with multiple errors', () => {
          const expectedError = `
Usage:
  customFunc(
 X  arg1<string> = "default value",
    arg2<Object>: {
*X    subArg1<string>,
      subArg2<number> = 42,
 X    subArg3<string>
    },
    <Array>[<Object>{
*X    elementArg1<string>,
      elementArg2<number> = 42,
 X    elementArg3<string>
    }],
 X  arg4<Array>: [<string>]
  )
----------------
Errors:
  - \`arg1\` should be <string>, received number
  - \`arg2.subArg1\` is required
  - \`arg2.subArg3\` should be <string>, received number
  - \`arguments[2][].elementArg1\` should be <string>, received number
  - \`arguments[2][].elementArg1\` is required
  - \`arguments[2][].elementArg3\` should be <string>, received number
  - \`arg4[1]\` should be <string>, received number
----------------
Legend:
  <...> Type
  *     Required
  X     Error`;
          let catchCalled = false;

          try {
            new FunctionChecker(name, shared)
            .arg('arg1', {type: 'string', value: 'default value'})
            .arg('arg2', {type: 'Object', children: {
              subArg1: {type: 'string', required: true},
              subArg2: {type: 'number', value: 42},
              subArg3: {type: 'string'}
            }})
            .arg({type: 'Array', element: {type: 'Object', children: {
              elementArg1: {type: 'string', required: true},
              elementArg2: {type: 'number', value: 42},
              elementArg3: {type: 'string'}
            }}})
            .arg('arg4', {type: 'Array', element: {
              type: 'string'
            }})
            .values([
              42,
              {subArg2: 0, subArg3: 42},
              [
                {elementArg1: 1, elementArg2: 30},
                {elementArg3: 42},
                {elementArg1: 'value'}
              ],
              ['value', 42, 'value']]);
          } catch (e) {
            expect(e.message).toEqual(expectedError);
            catchCalled = true;
          }
          expect(catchCalled).toBe(true);
        });
      });
    });

    context('#usage', () => {
      it('works', () => {
        const expected = `
Usage:
  customFunc(
    <string>,
    <string>
  )
----------------
Legend:
  <...> Type
  *     Required`;
        expect(new FunctionChecker(name, shared)
          .arg(defaultStructure)
          .arg(defaultStructure)
          .usage()
        ).toEqual(expected);
      });
    });
  });
});
