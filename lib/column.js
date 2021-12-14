'use strict';

class Column {
  /**
   * @param {Grid} grid
   * @param {string} key
   */
  constructor(grid, key) {
    this._grid = grid;
    this._key = key;
    this._label = undefined;
    this._sortable = false;
  }

  get exports() {
    const attrs = { key: this._key };
    if (this._label) attrs.label = this._label;
    if (this._sortable) attrs.sortable = this._sortable;
    return attrs;
  }

  label(label) {
    this._label = label;
    return this;
  }

  /**
   * 设置为可排序列
   * @param {boolean} [order]
   * @returns 
   */
  sortable(order = true) {
    this._sortable = order;
    return this;
  }
}

module.exports = Column;
