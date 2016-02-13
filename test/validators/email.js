/* eslint-env mocha */

import expect from 'expect';
import vEmail from '../../src/validators/email.js';

describe('email', () => {
  context('.name', () => {
    it('is "email"', () => {
      expect(vEmail.name).toEqual('email');
    });
  });

  context('.validator', () => {
    it('accepts a valid email', () => {
      expect(vEmail.validator()('test@email.com')).toBe(true);
    });

    it('refuses a wrong email', () => {
      expect(vEmail.validator()('xxxx')).toBe('should be an email');
    });
  });
});
