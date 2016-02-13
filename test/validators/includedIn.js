/* eslint-env mocha */

import expect from 'expect';
import vIncludedIn from '../../src/validators/includedIn.js';

describe('includedIn', () => {
  context('.name', () => {
    it('is "includedIn"', () => {
      expect(vIncludedIn.name).toEqual('includedIn');
    });
  });

  context('.validator', () => {
    it('validates a boolean contained in the array', () => {
      expect(vIncludedIn.validator([true, false])(false)).toBe(true);
    });
    it('validates a number contained in the array', () => {
      expect(vIncludedIn.validator([0, 42])(42)).toBe(true);
    });
    it('validates a string contained in the array', () => {
      expect(vIncludedIn.validator(['abc', 'def'])('def')).toBe(true);
    });
    it('refuses a boolean not contained in the array', () => {
      expect(vIncludedIn.validator([true, true])(false)).toBe('should be included in `[true,true]`');
    });
    it('refuses a number not contained in the array', () => {
      expect(vIncludedIn.validator([0, 1])(42)).toBe('should be included in `[0,1]`');
    });
    it('refuses a string not contained in the array', () => {
      expect(vIncludedIn.validator(['abc', 'def'])(42)).toBe('should be included in `["abc","def"]`');
    });
    it('prints an alias if passed', () => {
      expect(vIncludedIn.validator([true, true], 'CONSTANT')(false))
        .toBe('should be included in `CONSTANT`');
    });
  });
});
