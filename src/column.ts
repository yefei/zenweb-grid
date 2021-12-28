import { Grid } from "./grid";
import { ColumnAlignType, ColumnExports, FormatterFunc } from "./types";

export class Column {
  private _grid: Grid;
  private _key: string;
  private _virtual: boolean = false;
  private _formatterFunc: FormatterFunc = null;
  private _attrs: ColumnExports;
  private _hidden: boolean;

  constructor(grid: Grid, key: string) {
    this._grid = grid;
    this._key = key;
    this._attrs = { key: this._key };
  }

  get exports() {
    return this._attrs;
  }

  get key() {
    return this._key;
  }

  label(label: string) {
    this._attrs.label = label;
    return this;
  }

  /**
   * 设置为可排序列
   */
  sortable(order = true) {
    this._attrs.sortable = order;
    return this;
  }

  get isSortable() {
    return this._attrs.sortable;
  }

  /**
   * 设置列宽度
   */
  width(width: string | number) {
    this._attrs.width = width;
    return this;
  }

  /**
   * 对齐方式
   * @default 'left'
   */
  align(pos: ColumnAlignType) {
    this._attrs.align = pos;
    return this;
  }

  /**
   * 是否为虚拟字段，不在数据库中字段
   */
  virtual(is = true) {
    this._virtual = is;
    return this;
  }

  get isVirtual() {
    return this._virtual;
  }

  /**
   * 隐藏列显示
   */
  hidden(is = true) {
    this._hidden = is;
    return this;
  }

  get isHidden() {
    return this._hidden;
  }

  /**
   * 自定义结果格式
   */
  formatter(func: FormatterFunc) {
    this._formatterFunc = func;
    return this;
  }

  get formatterFunc() {
    return this._formatterFunc;
  }
}
