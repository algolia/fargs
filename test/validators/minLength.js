/* eslint-env mocha */

import expect from 'expect';
import vMinLength from '../../src/validators/minLength.js';

describe('minLength', () => {
  context('.name', () => {
    it('is "minLength"', () => {
      expect(vMinLength.name).toEqual('minLength');
    });
  });

  context('.validator', () => {
    it('validates a string longer than the limit', () => {
      expect(vMinLength.validator(3)('abcd')).toBe(true);
    });
    it('validates a string as long as the limit', () => {
      expect(vMinLength.validator(3)('abc')).toBe(true);
    });
    it('refuses a string shorter than the limit', () => {
      expect(vMinLength.validator(3)('ab')).toBe('should be at least `3` characters long');
    });
  });
});
