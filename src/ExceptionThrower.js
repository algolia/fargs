export default class ExceptionThrower {
  constructor(path, parent = '') {
    this.path = `${parent}[${path}]`;
  }

  nest(name) {
    return new ExceptionThrower(name, this.path);
  }


  throw(message) {
    throw new Error(`${this.path} ${message}`);
  }
}
