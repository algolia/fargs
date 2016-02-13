/* eslint-env mocha */

import expect from 'expect';
import fRegExp from '../../src/types/RegExp.js';

describe('RegExp', () => {
  context('.name', () => {
    it('is "RegExp"', () => {
      expect(fRegExp.name).toEqual('RegExp');
    });
  });

  context('.checker', () => {
    it('accepts `new RegExp()`', () => {
      expect(fRegExp.checker(new RegExp())).toBe(true);
    });
    it('accepts empty regex', () => {
      expect(fRegExp.checker(/(?:)/)).toBe(true);
    });
    it('accepts a filled regex', () => {
      expect(fRegExp.checker(/a+/)).toBe(true);
    });
    it('refuses null', () => {
      expect(fRegExp.checker(null)).toBe(false);
    });
    it('refuses a string', () => {
      expect(fRegExp.checker('abc')).toBe(false);
    });
  });

  context('.printer', () => {
    it('prints correctly an empty regex', () => {
      expect(fRegExp.printer(new RegExp())).toBe('/(?:)/');
    });
    it('prints correctly a filled regex', () => {
      expect(fRegExp.printer(/a+/)).toBe('/a+/');
    });
  });
});
