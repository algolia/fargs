/* eslint-env mocha */

import expect from 'expect';

import ExceptionThrower from '../src/ExceptionThrower.js';

describe('ExceptionThrower', () => {
  it('should accept just a path', () => {
    expect(() => {
      new ExceptionThrower('CustomThrower').throw('Custom Error');
    }).toThrow('[CustomThrower] Custom Error');
  });
  it('should accept a parent', () => {
    expect(() => {
      new ExceptionThrower('NestedThrower', '[CustomThrower]').throw('Custom Error');
    }).toThrow('[CustomThrower][NestedThrower] Custom Error');
  });
  it('should be able to nest', () => {
    expect(() => {
      new ExceptionThrower('CustomThrower').nest('NestedThrower').throw('Custom Error');
    }).toThrow('[CustomThrower][NestedThrower] Custom Error');
  });
});
