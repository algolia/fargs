/* eslint-env mocha */

import expect from 'expect';
import fFunction from '../../src/types/function.js';

describe('function', () => {
  context('.name', () => {
    it('is "function"', () => {
      expect(fFunction.name).toEqual('function');
    });
  });

  context('.checker', () => {
    it('accepts a function', () => {
      expect(fFunction.checker(() => false)).toBe(true);
    });
    it('refuses null', () => {
      expect(fFunction.checker(null)).toBe(false);
    });
    it('refuses a string', () => {
      expect(fFunction.checker('abc')).toBe(false);
    });
  });

  context('.printer', () => {
    it('prints an anonymous function with no args correctly', () => {
      expect(fFunction.printer(() => '')).toBe('anonymous()');
    });
    it('prints an anonymous function with 1 arg correctly', () => {
      expect(fFunction.printer((_x) => '')).toBe('anonymous(1 argument)');
    });
    it('prints an anonymous function with multiple arg correctly', () => {
      expect(fFunction.printer((_x, _y, _z) => '')).toBe('anonymous(3 arguments)');
    });
    it('prints an named function with no args correctly', () => {
      function named() {}
      expect(fFunction.printer(named)).toBe('named()');
    });
    it('prints an named function with 1 arg correctly', () => {
      function named(_x) {}
      expect(fFunction.printer(named)).toBe('named(1 argument)');
    });
    it('prints an named function with multiple arg correctly', () => {
      function named(_x, _y, _z) {}
      expect(fFunction.printer(named)).toBe('named(3 arguments)');
    });
  });
});
