import { ColumnAlignType, ColumnExports, FormatterCallback, SortCallback } from './types';

export const COLUMN_KEY = Symbol('Column#key');
export const COLUMN_VIRTUAL = Symbol('Column#virtual');
export const COLUMN_FORMATTER_CALLBACK = Symbol('Column#formatter');
export const COLUMN_EXPORTS = Symbol('Column#exports');
export const COLUMN_HIDDEN = Symbol('Column#hidden');
export const COLUMN_SORTABLE = Symbol('Column#sortable');
export const COLUMN_SORT_CALLBACK = Symbol('Column#sortCallback');

export class Column {
  [COLUMN_KEY]: string;
  [COLUMN_VIRTUAL]: boolean = false;
  [COLUMN_FORMATTER_CALLBACK]: FormatterCallback = null;
  [COLUMN_EXPORTS]: ColumnExports;
  [COLUMN_HIDDEN]: boolean;
  [COLUMN_SORTABLE]: boolean;
  [COLUMN_SORT_CALLBACK]: SortCallback;

  constructor(key: string) {
    this[COLUMN_KEY] = key;
    this[COLUMN_EXPORTS] = { key };
  }

  get exports() {
    const attrs: ColumnExports = Object.assign({}, this[COLUMN_EXPORTS]);
    if (this[COLUMN_SORTABLE]) {
      attrs.sortable = true;
    }
    return attrs;
  }

  label(label: string) {
    this[COLUMN_EXPORTS].label = label;
    return this;
  }

  /**
   * 设置为可排序列
   * @param func 排序方法，如果指定则使用回调函数返回的排序规则，不指定则默认使用 key 排序
   */
  sortable(callback?: SortCallback) {
    this[COLUMN_SORTABLE] = true;
    this[COLUMN_SORT_CALLBACK] = callback;
    return this;
  }

  /**
   * 设置列宽度
   */
  width(width: string | number) {
    this[COLUMN_EXPORTS].width = width;
    return this;
  }

  /**
   * 对齐方式
   * @default 'left'
   */
  align(pos: ColumnAlignType) {
    this[COLUMN_EXPORTS].align = pos;
    return this;
  }

  /**
   * 是否为虚拟字段，不在数据库中字段
   */
  virtual() {
    this[COLUMN_VIRTUAL] = true;
    return this;
  }

  /**
   * 隐藏列显示
   */
  hidden() {
    this[COLUMN_HIDDEN] = true;
    return this;
  }

  /**
   * 自定义结果格式
   */
  formatter(callback: FormatterCallback) {
    this[COLUMN_FORMATTER_CALLBACK] = callback;
    return this;
  }
}
