/* eslint-env mocha */

import expect from 'expect';
import vGreaterThan from '../../src/validators/greaterThan.js';

describe('greaterThan', () => {
  context('.name', () => {
    it('is "greaterThan"', () => {
      expect(vGreaterThan.name).toEqual('greaterThan');
    });
  });

  context('.validator', () => {
    it('validates a number greater than the limit', () => {
      expect(vGreaterThan.validator(42)(43)).toBe(true);
    });
    it('refuses a number equal the limit', () => {
      expect(vGreaterThan.validator(42)(42)).toEqual('should be greater `>` than `42`');
    });
    it('refuses a number lower than the limit', () => {
      expect(vGreaterThan.validator(42)(0)).toEqual('should be greater `>` than `42`');
    });
  });
});
