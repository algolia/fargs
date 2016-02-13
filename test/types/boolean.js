/* eslint-env mocha */
/* eslint no-new-wrappers: 0*/

import expect from 'expect';
import fBoolean from '../../src/types/boolean.js';

describe('boolean', () => {
  context('.name', () => {
    it('is "boolean"', () => {
      expect(fBoolean.name).toEqual('boolean');
    });
  });

  context('.checker', () => {
    it('accepts `new Boolean()`', () => {
      expect(fBoolean.checker(new Boolean())).toBe(true);
    });
    it('accepts false', () => {
      expect(fBoolean.checker(false)).toBe(true);
    });
    it('accepts true', () => {
      expect(fBoolean.checker(false)).toBe(true);
    });
    it('refuses null', () => {
      expect(fBoolean.checker(null)).toBe(false);
    });
    it('refuses a string', () => {
      expect(fBoolean.checker('abc')).toBe(false);
    });
  });

  context('.printer', () => {
    it('prints correctly a `new Boolean()`', () => {
      expect(fBoolean.printer(new Boolean())).toBe('false');
    });
    it('prints correctly false', () => {
      expect(fBoolean.printer(false)).toBe('false');
    });
    it('prints correctly an true', () => {
      expect(fBoolean.printer(true)).toBe('true');
    });
  });
});
