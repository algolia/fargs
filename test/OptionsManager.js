/* eslint-env mocha */

import expect from 'expect';

import FunctionChecker from '../src/FunctionChecker.js';
import OptionsManager from '../src/OptionsManager.js';
import Structure from '../src/Structure.js';

describe('OptionsManager', () => {
  let manager;

  beforeEach(() => {
    manager = new OptionsManager();
  });

  context('constructor', () => {
    it('exposes .typeCheckers', () => {
      expect(manager.typeCheckers).toNotBe(undefined);
    });
    it('exposes .typePrinters', () => {
      expect(manager.typePrinters).toNotBe(undefined);
    });
    it('exposes .validators', () => {
      expect(manager.validators).toNotBe(undefined);
    });
  });

  context('methods', () => {
    context('#structure', () => {
      it('returns a Structure object', () => {
        expect(manager.structure('arg1', {type: 'string'})).toBeA(Structure);
      });
    });

    context('#registerType', () => {
      let name;
      let checker;
      let printer;

      beforeEach(() => {
        name = 'Object';
        checker = (obj) => typeof (obj) === 'object';
        printer = (obj) => obj.toString();
      });

      function register() {
        return manager.registerType({name, checker, printer});
      }

      it('returns the manager instance', () => {
        expect(register()).toBe(manager);
      });

      it('registers a type with a custom printer', () => {
        register();
        expect(manager.typeCheckers.get('Object')).toBe(checker);
        expect(manager.typePrinters.get('Object')).toBe(printer);
      });

      it('registers a type with the default printer', () => {
        let called = false;
        let obj = {toString: () => { called = true; }};
        printer = undefined;

        register();
        manager.typePrinters.get(name)(obj);

        expect(called).toBe(true);
      });
    });

    context('#registerTypes', () => {
      let types;

      beforeEach(() => {
        types = [{
          name: 'Object',
          checker: () => true,
          printer: () => true
        }, {
          name: 'Array',
          checker: () => true,
          printer: () => true
        }];
      });

      it('returns the manager instance', () => {
        expect(manager.registerTypes(types)).toBe(manager);
      });

      it('calls registerTypes as much as it has arguments', () => {
        manager.registerTypes(types);

        expect(manager.typeCheckers.get('Object')).toBe(types[0].checker);
        expect(manager.typePrinters.get('Object')).toBe(types[0].printer);
        expect(manager.typeCheckers.get('Array')).toBe(types[1].checker);
        expect(manager.typePrinters.get('Array')).toBe(types[1].printer);
      });
    });

    context('#registerValidator', () => {
      let name;
      let check;
      let validator;

      beforeEach(() => {
        name = 'Object';
        check = () => () => true;
        validator = {
          name: name,
          validator: check
        };
      });

      it('returns the manager instance', () => {
        expect(manager.registerValidator(validator)).toBe(manager);
      });

      it('registers a new validator', () => {
        manager.registerValidator(validator);

        expect(manager.validators.get(name)).toBe(check);
      });
    });

    context('#registerValidators', () => {
      let validators;

      beforeEach(() => {
        validators = [
          {name: 'custom validator 1', validator: () => () => true},
          {name: 'custom validator 2', validator: () => () => 'error'}
        ];
      });

      it('returns the manager instance', () => {
        expect(manager.registerValidators(validators)).toBe(manager);
      });

      it('registers multiple new validators', () => {
        manager.registerValidators(validators);

        expect(manager.validators.get('custom validator 1')).toBe(validators[0].validator);
        expect(manager.validators.get('custom validator 2')).toBe(validators[1].validator);
      });
    });

    context('#validator', () => {
      it('passes arguments', () => {
        let name = 'Object';
        let receivedArg1;
        let receivedArg2;

        function pass() { return true; }
        function validator(arg1, arg2) {
          receivedArg1 = arg1;
          receivedArg2 = arg2;
          return pass;
        }

        manager.registerValidator({name, validator});
        let received = manager.validator(name, 'custom arg 1', 'custom arg 2');

        expect(received).toBe(pass);
        expect(receivedArg1).toBe('custom arg 1');
        expect(receivedArg2).toBe('custom arg 2');
      });

      it('can access multiple validators', () => {
        function pass() { return true; }
        function fail() { return 'error'; }
        let validators = [
          {name: 'custom validator 1', validator: () => pass},
          {name: 'custom validator 2', validator: () => fail}
        ];

        manager.registerValidators(validators);

        expect(manager.validator('custom validator 1')).toBe(pass);
        expect(manager.validator('custom validator 2')).toBe(fail);
      });
    });

    context('#check', () => {
      it('returns a FunctionChecker object', () => {
        expect(manager.check('customFunc')).toBeA(FunctionChecker);
      });
    });
  });
});
