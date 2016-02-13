/* eslint-env mocha */

import expect from 'expect';

import ExceptionThrower from '../src/ExceptionThrower.js';
import Store from '../src/Store.js';
import ValidatorStore from '../src/ValidatorStore.js';

describe('ValidatorStore', () => {
  context('constructor', () => {
    context('()', () => {
      it('extends Store', () => {
        expect(new ValidatorStore()).toBeA(Store);
      });

      it('throws errors with the ValidatorStore name', () => {
        expect(() => {
          new ValidatorStore().thrower.throw('Custom Error');
        }).toThrow(/^\[ValidatorStore\] Custom Error$/);
      });
    });

    context('(thrower)', () => {
      it('reuses thrower', () => {
        let thrower = new ExceptionThrower('CustomThrower');
        expect(() => {
          new ValidatorStore(thrower).thrower.throw('Custom Error');
        }).toThrow(/^\[CustomThrower\]\[ValidatorStore\] Custom Error$/);
      });
    });
  });
});
