/* eslint-env mocha */

import expect from 'expect';
import vLowerThan from '../../src/validators/lowerThan.js';

describe('lowerThan', () => {
  context('.name', () => {
    it('is "lowerThan"', () => {
      expect(vLowerThan.name).toEqual('lowerThan');
    });
  });

  context('.validator', () => {
    it('validates a number lower than the limit', () => {
      expect(vLowerThan.validator(42)(0)).toBe(true);
    });
    it('refuses a number equal the limit', () => {
      expect(vLowerThan.validator(42)(42)).toEqual('should be lower `<` than `42`');
    });
    it('refuses a number greater than the limit', () => {
      expect(vLowerThan.validator(42)(43)).toEqual('should be lower `<` than `42`');
    });
  });
});
