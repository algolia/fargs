/* eslint-env mocha */
/* eslint no-new-wrappers: 0 */

import expect from 'expect';
import fString from '../../src/types/string.js';

describe('string', () => {
  context('.name', () => {
    it('is "string"', () => {
      expect(fString.name).toEqual('string');
    });
  });

  context('.checker', () => {
    it('accepts `new String()`', () => {
      expect(fString.checker(new String())).toBe(true);
    });
    it('accepts empty string', () => {
      expect(fString.checker('')).toBe(true);
    });
    it('accepts a filled string', () => {
      expect(fString.checker('abc')).toBe(true);
    });
    it('refuses null', () => {
      expect(fString.checker(null)).toBe(false);
    });
  });

  context('.printer', () => {
    it('prints correctly an empty string', () => {
      expect(fString.printer('')).toBe('""');
    });
    it('prints correctly a filled string', () => {
      expect(fString.printer('abc')).toBe('"abc"');
    });
  });
});
