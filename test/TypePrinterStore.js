/* eslint-env mocha */

import expect from 'expect';

import ExceptionThrower from '../src/ExceptionThrower.js';
import Store from '../src/Store.js';
import TypePrinterStore from '../src/TypePrinterStore.js';

describe('TypePrinterStore', () => {
  context('constructor', () => {
    context('()', () => {
      it('extends Store', () => {
        expect(new TypePrinterStore()).toBeA(Store);
      });

      it('throws errors with the TypePrinterStore name', () => {
        expect(() => {
          new TypePrinterStore().thrower.throw('Custom Error');
        }).toThrow(/^\[TypePrinterStore\] Custom Error$/);
      });
    });

    context('(thrower)', () => {
      it('reuses thrower', () => {
        let thrower = new ExceptionThrower('CustomThrower');
        expect(() => {
          new TypePrinterStore(thrower).thrower.throw('Custom Error');
        }).toThrow(/^\[CustomThrower\]\[TypePrinterStore\] Custom Error$/);
      });
    });
  });
});
