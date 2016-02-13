/* eslint-env mocha */

import expect from 'expect';
import fAny from '../../src/types/any.js';

describe('Any', () => {
  context('.name', () => {
    it('is "Any"', () => {
      expect(fAny.name).toEqual('Any');
    });
  });

  context('.checker', () => {
    it('accepts undefined', () => {
      expect(fAny.checker(undefined)).toBe(true);
    });
    it('accepts null', () => {
      expect(fAny.checker(null)).toBe(true);
    });
    it('accepts a string', () => {
      expect(fAny.checker('abc')).toBe(true);
    });
    it('accepts a new instance of something', () => {
      expect(fAny.checker(new Date())).toBe(true);
    });
  });

  context('.printer', () => {
    it('prints correctly null', () => {
      expect(fAny.printer(null)).toBe('null');
    });
    it('prints correctly a string', () => {
      expect(fAny.printer('abc')).toBe('"abc"');
    });
    it('prints correctly an empty object', () => {
      expect(fAny.printer({})).toBe('{}');
    });
    it('prints correctly a filled object', () => {
      expect(fAny.printer({name: 'John', age: 20, permissions: ['a', 'b']}))
        .toBe('{"name":"John","age":20,"permissions":["a","b"]}');
    });
  });
});
