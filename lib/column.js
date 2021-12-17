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
    this._virtual = false;
    this._renderFunc = null;
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

  /**
   * 是否为虚拟字段，不在数据库中字段
   * @param {boolean} is 
   * @returns 
   */
  virtual(is = true) {
    this._virtual = is;
    return this;
  }

  /**
   * 自定义结果渲染
   * @param {(row) => any} func
   * @returns 
   */
  render(func) {
    this._renderFunc = func;
    return this;
  }
}

module.exports = Column;
