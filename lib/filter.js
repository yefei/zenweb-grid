'use strict';

class Filter {
  constructor(grid, key) {
    this._grid = grid;
    this._key= key;
  }

  get exports() {
    const attrs = { key: this._key, widget: this._widget };
    if (this._label) attrs.label = this._label;
    return attrs;
  }

  label(label) {
    this._label = label;
    return this;
  }

  type(type) {
    this._type = type;
    return this;
  }

  validate(rule) {
    this._validate = rule;
    return this;
  }

  widget(widget) {
    this._widget = widget;
    return this;
  }

  whereBuilder(value) {
    return { [this._key]: value };
  }
}

class Choice extends Filter {
  get exports() {
    const attrs = {
      widget: 'choice',
      choices: this._items.map((i, index) => ({ label: i.label, value: i.value || index })),
    };
    return Object.assign(super.exports, attrs);
  }

  whereBuilder(value) {
    const item = this._items.find((i, index) => i.value == value || index == value);
    if (item) {
      if (item.where) return item.where;
      else if (item.value) return { [this._key]: item.value };
    }
    return {};
  }

  /**
   * 选择项
   * @param {{ label: string, value: string, where?: any }[]} items 
   */
   items(...items) {
    this._items = items;
    return this;
  }
}

module.exports = {
  Filter,
  Choice,
};
