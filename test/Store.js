/* eslint-env mocha */

import expect from 'expect';

import ExceptionThrower from '../src/ExceptionThrower.js';
import Store from '../src/Store.js';

describe('Store', () => {
  context('constructor', () => {
    context('()', () => {
      it('creates a thrower', () => {
        let store = new Store();
        expect(() => {
          store.thrower.throw('Custom Error');
        }).toThrow(/^\[Store\] Custom Error$/);
      });
    });

    context('(thrower)', () => {
      it('reuses a thrower', () => {
        let thrower = new ExceptionThrower('Custom Thrower');
        let store = new Store(thrower);
        expect(() => {
          store.thrower.throw('Custom Error');
        }).toThrow(/^\[Custom Thrower\]\[Store\] Custom Error/);
      });
    });

    context('(thrower, name)', () => {
      it('creates a thrower', () => {
        let store = new Store(null, 'CustomStore');
        expect(() => {
          store.thrower.throw('Custom Error');
        }).toThrow(/^\[CustomStore\] Custom Error$/);
      });
      it('reuses a thrower', () => {
        let thrower = new ExceptionThrower('Custom Thrower');
        let store = new Store(thrower, 'CustomStore');
        expect(() => {
          store.thrower.throw('Custom Error');
        }).toThrow(/^\[Custom Thrower\]\[CustomStore\] Custom Error/);
      });
    });
  });

  context('methods', () => {
    let store;

    beforeEach(() => {
      store = new Store();
    });

    context('#get', () => {
      context('()', () => {
        it('throws', () => {
          const expected = '[.get] Name `undefined` should be a string';
          expect(() => store.get()).toThrow(expected);
        });
      });

      context('(name)', () => {
        it('throws if name isn\'t a string', () => {
          const expected = '[.get] Name `null` should be a string';
          expect(() => { store.get(null); }).toThrow(expected);
        });
        it('throws if name doesn\'t exist', () => {
          const expected = '[.get] Name `ACustomElement` has no associated function';
          expect(() => { store.get('ACustomElement'); }).toThrow(expected);
        });
      });
    });

    function setContext(method) {
      return () => {
        let name;
        let func;

        beforeEach(() => {
          name = 'ACustomElement';
          func = () => false;
        });

        context('()', () => {
          it('throws', () => {
            const expected = `[.${method}] Name \`undefined\` should be a string`;
            expect(() => { store[method](); }).toThrow(expected);
          });
        });

        context('(name)', () => {
          it('throws', () => {
            const expected = `[.${method}] Function \`undefined\` should be a function`;
            expect(() => { store[method](name); }).toThrow(expected);
          });
        });

        context('(name, func)', () => {
          it('throws if name is undefined', () => {
            const expected = `[.${method}] Name \`undefined\` should be a string`;
            name = undefined;
            expect(() => { store[method](name, func); }).toThrow(expected);
          });
          it('throws if name isn\'t a string', () => {
            const expected = `[.${method}] Name \`null\` should be a string`;
            name = null;
            expect(() => { store[method](name, func); }).toThrow(expected);
          });
          it('throws if func is undefined', () => {
            const expected = `[.${method}] Function \`undefined\` should be a function`;
            func = undefined;
            expect(() => { store[method](name, func); }).toThrow(expected);
          });
          it('throws if func isn\'t a function', () => {
            const expected = `[.${method}] Function \`null\` should be a function`;
            func = null;
            expect(() => { store[method](name, func); }).toThrow(expected);
          });
          it('adds a new one', () => {
            name = 'CustomElement';
            func = () => true;

            store[method](name, func);

            expect(store.get(name)).toBe(func);
          });
          it('overwrites an existing one', () => {
            name = 'CustomElement';

            function oldFunc() { return false; }
            store[method](name, oldFunc);

            function newFunc() { return true; }
            store[method](name, newFunc);

            expect(store.get(name)).toNotBe(oldFunc);
            expect(store.get(name)).toBe(newFunc);
          });
        });
      };
    }

    context('#set', setContext('set'));
    context('#add', setContext('add'));
  });
});
