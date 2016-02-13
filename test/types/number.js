/* eslint-env mocha */
/* eslint no-new-wrappers: 0 */

import expect from 'expect';
import fNumber from '../../src/types/number.js';

describe('number', () => {
  context('.name', () => {
    it('is "number"', () => {
      expect(fNumber.name).toEqual('number');
    });
  });

  context('.checker', () => {
    it('accepts `new Number()`', () => {
      expect(fNumber.checker(new Number())).toBe(true);
    });
    it('accepts a number', () => {
      expect(fNumber.checker(42)).toBe(true);
    });
    it('refuses null', () => {
      expect(fNumber.checker(null)).toBe(false);
    });
    it('refuses a string', () => {
      expect(fNumber.checker('abc')).toBe(false);
    });
  });

  context('.printer', () => {
    it('prints correctly an `new Number()`', () => {
      expect(fNumber.printer(new Number())).toBe('0');
    });
    it('prints correctly a number', () => {
      expect(fNumber.printer(42)).toBe('42');
    });
  });
});
