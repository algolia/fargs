/* eslint-env mocha */

import expect from 'expect';
import fUndefined from '../../src/types/undefined.js';

describe('undefined', () => {
  context('.name', () => {
    it('is "undefined"', () => {
      expect(fUndefined.name).toEqual('undefined');
    });
  });

  context('.checker', () => {
    it('accepts undefined', () => {
      expect(fUndefined.checker(undefined)).toBe(true);
    });
    it('refuses a boolean', () => {
      expect(false).toBe(false);
    });
    it('refuses a string', () => {
      expect(fUndefined.checker('abc')).toBe(false);
    });
  });

  context('.printer', () => {
    it('prints correctly undefined', () => {
      expect(fUndefined.printer(undefined)).toBe('undefined');
    });
  });
});
