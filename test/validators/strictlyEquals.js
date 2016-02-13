/* eslint-env mocha */

import expect from 'expect';
import vStrictlyEquals from '../../src/validators/strictlyEquals.js';

describe('strictlyEquals', () => {
  context('.name', () => {
    it('is "strictlyEquals"', () => {
      expect(vStrictlyEquals.name).toEqual('strictlyEquals');
    });
  });

  context('.validator', () => {
    it('validates a number equal the passed one', () => {
      expect(vStrictlyEquals.validator(42)(42)).toBe(true);
    });
    it('refuses a number greater than the passed one', () => {
      expect(vStrictlyEquals.validator(42)(43)).toEqual('should be strictly equal `===` to `42`');
    });
    it('refuses a number lower than the passed one', () => {
      expect(vStrictlyEquals.validator(42)(0)).toEqual('should be strictly equal `===` to `42`');
    });
    it('validates two equal strings', () => {
      expect(vStrictlyEquals.validator('abc')('abc')).toBe(true);
    });
    it('refuses two different strings', () => {
      expect(vStrictlyEquals.validator('abc')('def'))
        .toEqual('should be strictly equal `===` to `"abc"`');
    });
    it('prints an alias if passed', () => {
      expect(vStrictlyEquals.validator('abc', 'CONSTANT')('def'))
        .toEqual('should be strictly equal `===` to `CONSTANT`');
    });
  });
});
