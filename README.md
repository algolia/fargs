# fargs

[![npm](https://img.shields.io/npm/v/fargs.svg)](https://www.npmjs.com/package/fargs)

[![Build Status](https://travis-ci.org/algolia/fargs.svg?branch=master)](https://travis-ci.org/algolia/fargs)
[![Coverage Status](https://coveralls.io/repos/github/algolia/fargs/badge.svg?branch=master)](https://coveralls.io/github/algolia/fargs?branch=master)

[![Dependency Status](https://david-dm.org/algolia/fargs.svg)](https://david-dm.org/algolia/fargs)
[![devDependency Status](https://david-dm.org/algolia/fargs/dev-status.svg)](https://david-dm.org/algolia/fargs#info=devDependencies)

[![GitHub license](https://img.shields.io/github/license/algolia/fargs.svg)](./LICENSE)

Simple options manager for JavaScript libraries.
It handles type checking, default values assignation and throws generated usage on errors.

## Problem

Sometimes, you want to do some basic type checking for a public interface in your library.
This always comes at a cost : incertainty or verbosity.

**Incertainety**

```js
function test(myVar) {
  myVar = myVar || 'default value';

  // What if `myVar` is falsy?
  // What if `myVar` isn't a string?
}
```

**Verbosity**

```js
function test(myVar) {
  if (typeof (myVar) === 'undefined') {
    myVar = 'default value';
  }
  if (!(typeof (myVar) === 'string' || myVar instanceof String))) {
    throw new Error('`myVar` should be a string');
  }
}

// 6 lines to do basic type checking and default assignment ?!
```

ES6 helps here:

```js
function test(myVar = 'default value') {
  if (!(typeof (myVar) === 'string' || myVar instanceof String))) {
    throw new Error('`myVar` should be a string');
  }
}
```

but we can still improve on that.

## Real-life example

Let's take a simple `register` function. It needs an `email`, an `age` and some extra fields.

With ES6, which gives us a cleaner parameters handling than ES5, here is how I would have written this function.

```js
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import isNull from 'lodash/isNull';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';

const AVAILABLE_PERMISSONS = ['read', 'write', 'update', 'delete'];
const USAGE = `
Usage:
  register(
*   email<string>,
*   age<number>,
    options: <Object>{
      name<string> = 'Default name',
      permissions<Array>: [<string>] = []
    } = {}
  )`;

function throwError(err) {
  throw new Error(`${USAGE}\n------\n${err}`)
}

function register(email, age, options = {}) {
  // Email should be present and match an email RegExp
  if (!isString(email) || !email.match(/^.*@.*\..*$/)) {
    throwError('`email` should be a string and match /^.*@.*\..*$/');
  }

  // Age is required and must be at least 13
  if (!isNumber(age)) {
    throwError('`age` should be a number');
  }
  if (age < 13) {
    throwError('`age` should be at least 13');
  }

  // Options should be a plain object
  if (!isPlainObject(options)) {
    throwError('`options` should be a plain object');
  }

  // Name and permissions get default values
  let {name = 'Default name', permissions = []} = options;

  // Name must be a string
  if (!isString(name)) {
    throwError('`options.name` should be a string');
  }

  // Permissions should be an array of strings which should
  // each be included in a constant permissions array
  if (!isArray(permissions) {
    throwError('`options.permissions` should be an Array');
  }
  permissions.forEach((permission, i) => {
    if (AVAILABLE_PERMISSIONS.indexOf(permission) === -1) {
      throwError(`\`options.permissions[${i}]\` should be part of AVAILABLE_PERMISSIONS`);
    }
  });
}
```

Notice that you'll lose the ability to use the nested default values in the
parameters if you want to type-check options.

With this module, here is how you'd do it:

```js
import fargs from 'fargs';

const AVAILABLE_PERMISSONS = ['read', 'write', 'update', 'delete'];

function register() {
  let [email, age, {name, permissions}] = fargs().check('register')
    .arg('email', {
      type: 'string',
      required: true,
      validators: [fargs.validators.email()]
    })
    .arg('age', {
      type: 'number',
      required: true,
      validators: [fargs.validators.greaterThan(12)]
    })
    .arg('options', {
      type: 'Object',
      value: {},
      children: {
        name: {type: 'string', value: 'default name'}
        permissions: {type: Array, element: {{
          type: 'string',
          validators: [fargs.validators.includedIn(AVAILABLE_PERMISSIONS)]
        }}}
      }
    })
    .values(arguments);
  // Here
  // - Generated usage was thrown if:
  //   - Any of the required fields was not provided
  //   - Any type mismatch
  //   - Any validator failure
  // - Else default values have been assigned in an nested way
}
```

Part of the logic can be precomputed.
If you expect these calls to be run often, an easy way to optimize it is to extract the structure building from the function call, by using the `.structure(name, object)` method.

## Structure

A structure can receive multiple parameters.
- `type`: Only required attribute.  
  String describing the type of the variable.  
  Accepts multiple types with this syntax: `number|string|Array`.  
  If you want to allow any type, just use the `any` type.
  If you want to pass a default value, in order to be able to print it correctly
  in the usage, use `valueType|any`, like `string|any`.
- `required`: Is this element `required`? Defaults to `false`. 
- `value`: Default value.  
  A clone of this is used to initialize the returned value if the value passed is `undefined.`
  Incompatible with `required`.
- `computeValue`: Accepts a function with no argument.  
  To use for the few cases where `_.clone` isn't what you want.  
  `lodash`'s `clone()` method doesn't work on `function`s, `DOMElement`s, `WeakMap`s for instance.
  Incompatible with `required`.
- `element`: Describe the structure each element of an array should have.  
  Do not use `required` here if you want to allow `undefined`. Explicitly use the `undefined` type instead.

    ```js 
    {type: 'Array', element: {
      {type: 'string|undefined'}
    }}
    // Accepts an Array which should contain only strings or undefined.
    ```

- `children`: Accepts the children structure.
  A structure with an `Array` type will expect children structures in an array:
  
    ```js
    {type: 'Array', required: true, children: [
      {type: 'number', required: true},
      {type: 'string'}
    ]}
    // Accepts an array where:
    // - the first child should be a number and is required
    // - the second child should be a string and is not required
    ```

## Types

This package comes with these built-in types:

- \*`undefined`: Only useful for `element`
- \*`null`
- \*`boolean`
- \*`number`
- \*`string`
- \*`function`
- \*`Array`
- \*`Object`
- `RegExp`

\* Embedded by default.

You can add non-default types by doing so:

```js
// fargs.js
import fargs from 'fargs';

export default fargs().registerTypes([
  // Use one of the provided ones
  require('fargs/types/RegExp'),
  // Or use your own
  {
    name: 'MyCustomType',
    checker: (elt) => elt instanceof MyCustomType,
    printer: (elt) => `<#MyCustomType ${elt.id}>`
  }
]);
```

## Validators

Embedded validators:

Validator                                     | Error
----------------------------------------------|--------------------------------------------------
`email`                                       | ... should be an email
`greaterThan(*n<number>)`                     | ... should be greater `>` than `n`
`includedIn(*arr<Array[any]>, alias<string>)` | ... should be included in `alias|arr`
`lowerThan(*n<number>)`                       | ... should be lower `<` than `n`
`match(*r<RegExp>)`                           | ... should match `r`
`maxLength(*n<number>)]`                      | ... should be at most `n` characters long
`minLength(*n<number>)`                       | ... should be at least `n` characters long
`strictlyEquals(*obj<any>, alias<string>)`    | ... should be strictly equal `===` to `alias|obj`

There are no validators enabled by default. You need to add them that way:

```js
// fargs.js
import fargs from 'fargs';

export default fargs().registerValidators([
  // Use one of the provided ones
  require('fargs/validators/strictlyEquals'),
  // Or use your own
  {
    name: 'inRange',
    validator: (min, max) =>
      (n) => (min <= n && n <= max) || `should be between \`${min}\` and \`${max}\``
  }
]);
```

## License

This library is packaged under the [MIT License](./LICENSE)
