/* eslint-env mocha */

import expect from 'expect';

import ExceptionThrower from '../src/ExceptionThrower.js';
import Store from '../src/Store.js';
import TypeCheckerStore from '../src/TypeCheckerStore.js';

describe('TypeCheckerStore', () => {
  context('constructor', () => {
    context('()', () => {
      it('extends Store', () => {
        expect(new TypeCheckerStore()).toBeA(Store);
      });

      it('throws errors with the TypeCheckerStore name', () => {
        expect(() => {
          new TypeCheckerStore().thrower.throw('Custom Error');
        }).toThrow(/^\[TypeCheckerStore\] Custom Error$/);
      });
    });

    context('(thrower)', () => {
      it('reuses thrower', () => {
        let thrower = new ExceptionThrower('CustomThrower');
        expect(() => {
          new TypeCheckerStore(thrower).thrower.throw('Custom Error');
        }).toThrow(/^\[CustomThrower\]\[TypeCheckerStore\] Custom Error$/);
      });
    });
  });

  context('methods', () => {
    context('#check', () => {
      let store;

      beforeEach(() => {
        store = new TypeCheckerStore();
      });

      context('()', () => {
        it('throws', () => {
          expect(() => {
            store.check();
          }).toThrow('[.check] Types `undefined` should be an array');
        });
      });

      context('(types, value)', () => {
        it('throws if types is an empty array', () => {
          expect(() => {
            store.check([], 'str');
          }).toThrow('[.check] Types `[]` must have at least one element');
        });
        it('throws if first type is not set', () => {
          store.set('number', () => false);
          expect(() => {
            store.check(['boolean', 'number'], 'str');
          }).toThrow();
        });
        it('throws if last type is not set', () => {
          store.set('number', () => false);
          expect(() => {
            store.check(['number', 'boolean'], 'str');
          }).toThrow();
        });
        it('returns false if corresponding type is not in array', () => {
          store.set('number', () => false);
          store.set('boolean', () => false);
          expect(store.check(['number', 'boolean'], 'str')).toBe(false);
        });
        it('returns true if corresponding type is in types', () => {
          store.set('number', () => false);
          store.set('string', () => true);
          expect(store.check(['number', 'string'], 'str')).toBe(true);
        });
      });
    });
  });
});
