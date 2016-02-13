/* eslint-env mocha */

import expect from 'expect';
import vMatch from '../../src/validators/match.js';

describe('match', () => {
  context('.name', () => {
    it('is "match"', () => {
      expect(vMatch.name).toEqual('match');
    });
  });

  context('.validator', () => {
    it('validates a string matching the regex', () => {
      expect(vMatch.validator(/^a+b+$/)('aaaabb')).toBe(true);
    });
    it('refuses a string not matching the regex', () => {
      expect(vMatch.validator(/^a+b+$/)('aaaabcb')).toEqual('should match `/^a+b+$/`');
    });
  });
});
