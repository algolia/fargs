/* eslint-env mocha */

import expect from 'expect';
import fArray from '../../src/types/Array.js';

describe('Array', () => {
  context('.name', () => {
    it('is "Array"', () => {
      expect(fArray.name).toEqual('Array');
    });
  });

  context('.checker', () => {
    it('accepts `new Array()`', () => {
      expect(fArray.checker(new Array())).toBe(true);
    });
    it('accepts empty array', () => {
      expect(fArray.checker([])).toBe(true);
    });
    it('accepts a filled array', () => {
      expect(fArray.checker([1, 2, '3'])).toBe(true);
    });
    it('refuses null', () => {
      expect(fArray.checker(null)).toBe(false);
    });
    it('refuses a string', () => {
      expect(fArray.checker('abc')).toBe(false);
    });
  });

  context('.printer', () => {
    it('prints correctly an empty array', () => {
      expect(fArray.printer([])).toBe('[]');
    });
    it('prints correctly a filled array', () => {
      expect(fArray.printer([1, 2, '3'])).toBe('[1,2,"3"]');
    });
  });
});
