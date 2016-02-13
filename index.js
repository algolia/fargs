/* eslint algolia/no-module-exports: 0 */

import fUndefined from './src/types/undefined.js';
import fNull from './src/types/null.js';
import fBoolean from './src/types/boolean.js';
import fNumber from './src/types/number.js';
import fString from './src/types/string.js';
import fFunction from './src/types/function.js';
import fArray from './src/types/Array.js';
import fObject from './src/types/Object.js';

import OptionsManager from './src/OptionsManager.js';
module.exports = () => new OptionsManager().registerTypes([
  fUndefined,
  fNull,
  fBoolean,
  fNumber,
  fString,
  fFunction,
  fArray,
  fObject
]);
