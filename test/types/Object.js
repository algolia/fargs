/* eslint-env mocha */
/* eslint no-new-object: 0 */

import expect from 'expect';
import fObject from '../../src/types/Object.js';

describe('Object', () => {
  context('.name', () => {
    it('is "Object"', () => {
      expect(fObject.name).toEqual('Object');
    });
  });

  context('.checker', () => {
    it('accepts `new Object()`', () => {
      expect(fObject.checker(new Object())).toBe(true);
    });
    it('accepts empty object', () => {
      expect(fObject.checker({})).toBe(true);
    });
    it('accepts a filled object', () => {
      expect(fObject.checker({name: 'John', age: 20, permissions: ['a', 'b']})).toBe(true);
    });
    it('refuses null', () => {
      expect(fObject.checker(null)).toBe(false);
    });
    it('refuses a string', () => {
      expect(fObject.checker('abc')).toBe(false);
    });
    it('refuses a new instance of something', () => {
      expect(fObject.checker(new Date())).toBe(false);
    });
  });

  context('.printer', () => {
    it('prints correctly an empty object', () => {
      expect(fObject.printer({})).toBe('{}');
    });
    it('prints correctly a filled object', () => {
      expect(fObject.printer({name: 'John', age: 20, permissions: ['a', 'b']}))
        .toBe('{"name":"John","age":20,"permissions":["a","b"]}');
    });
  });
});
