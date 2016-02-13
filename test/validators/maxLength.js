/* eslint-env mocha */

import expect from 'expect';
import vMaxLength from '../../src/validators/maxLength.js';

describe('maxLength', () => {
  context('.name', () => {
    it('is "maxLength"', () => {
      expect(vMaxLength.name).toEqual('maxLength');
    });
  });

  context('.validator', () => {
    it('validates a string shorter than the limit', () => {
      expect(vMaxLength.validator(3)('ab')).toBe(true);
    });
    it('validates a string as long as the limit', () => {
      expect(vMaxLength.validator(3)('abc')).toBe(true);
    });
    it('refuses a string longer than the limit', () => {
      expect(vMaxLength.validator(3)('abcd')).toBe('should be at most `3` characters long');
    });
  });
});
