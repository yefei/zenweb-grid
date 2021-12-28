import { Grid } from "./grid";
import { ColumnExports, RenderFunc } from "./types";

export class Column {
  private _grid: Grid;
  private _key: string;
  private _label: any;
  private _sortable: boolean = false;
  private _virtual: boolean = false;
  private _renderFunc: RenderFunc = null;
  private _width: string | number;

  constructor(grid: Grid, key: string) {
    this._grid = grid;
    this._key = key;
  }

  get exports() {
    const attrs: ColumnExports = { key: this._key };
    if (this._label) attrs.label = this._label;
    if (this._sortable) attrs.sortable = this._sortable;
    if (this._width) attrs.width = this._width;
    return attrs;
  }

  get key() {
    return this._key;
  }

  label(label: string) {
    this._label = label;
    return this;
  }

  /**
   * 设置为可排序列
   */
  sortable(order = true) {
    this._sortable = order;
    return this;
  }

  get isSortable() {
    return this._sortable;
  }

  /**
   * 设置列宽度
   */
  width(width: string | number) {
    this._width = width;
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
   * 自定义结果渲染
   */
  render(func: RenderFunc) {
    this._renderFunc = func;
    return this;
  }

  get renderFunc() {
    return this._renderFunc;
  }
}
