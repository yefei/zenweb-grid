'use strict';

class Filter {
  /**
   * @param {import('./grid')} grid 
   * @param {string} key 
   * @param {import('@zenweb/form').FormField} field 
   */
  constructor(grid, key, field) {
    this._grid = grid;
    this._key= key;
    this._field = field;
    this._whereFunc = null;
  }

  where(func) {
    this._whereFunc = func;
    return this;
  }

  whereBuilder(value) {
    if (this._whereFunc) {
      return this._whereFunc.call(this, value);
    }
    return { [this._key]: value };
  }
}

module.exports = Filter;
