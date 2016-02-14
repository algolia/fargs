<a name="1.1.0"></a>
# [1.1.0](https://github.com/algolia/fargs/compare/bc918d1...v1.1.0) (2016-02-14)


### Bug Fixes

* **OptionsManager:** Accept unnamed structure ([bc918d1](https://github.com/algolia/fargs/commit/bc918d1))

### Features

* **FunctionChecker:** Change .arg API ([d417d2d](https://github.com/algolia/fargs/commit/d417d2d))


### BREAKING CHANGES

* FunctionChecker: S

Before: `.arg(structure, value, name)`
After:  `.arg(name, structure)` and `.arg(name)`

Before: `.values()`
After:  `.values(entries = [])`

Do not pass the value anymore in the `arg` method.
Now its way easier since you don't need to declare the function
arguments and can just call `.values(arguments)`.



