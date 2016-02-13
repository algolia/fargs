/* eslint-env mocha */

import expect from 'expect';
import fNull from '../../src/types/null.js';

describe('null', () => {
  context('.name', () => {
    it('is "null"', () => {
      expect(fNull.name).toEqual('null');
    });
  });

  context('.checker', () => {
    it('accepts null', () => {
      expect(fNull.checker(null)).toBe(true);
    });
    it('refuses a boolean', () => {
      expect(false).toBe(false);
    });
    it('refuses a string', () => {
      expect(fNull.checker('abc')).toBe(false);
    });
  });

  context('.printer', () => {
    it('prints correctly null', () => {
      expect(fNull.printer(null)).toBe('null');
    });
  });
});
