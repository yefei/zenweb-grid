import { propertyAt } from 'property-at';
import { Element } from './element';
import { ColumnAlignType, ColumnHeadResult, ColumnSelectList, DataCallback, DataRow, ElementResult, SortCallback } from './types';

export const KEY_SPLITER = '.';

export class Column<D extends DataRow> extends Element {
  _label?: string;
  _select?: ColumnSelectList;
  _dataCallback?: DataCallback<D>;
  _dataCallbackElement?: DataCallback<D, Element<D>[]>;
  _hidden?: boolean;
  _sortCallback?: SortCallback;

  constructor(public key: string) {
    super();
    this.type('th');
  }

  /**
   * 表格头显示名
   * @param label 显示名
   */
  label(label: string) {
    this._label = label;
    return this;
  }

  /**
   * 设置为可排序列
   * @param callback 排序方法，如果指定则使用回调函数返回的排序规则，不指定则默认使用 key 作为排序字段
   *  如果指定值为 string 类型，则使用 string 作为排序字段
   */
  sortable(callback?: SortCallback | string) {
    this._sortCallback = typeof callback === 'string' ? (desc => [`${desc ? '-' : ''}${callback}`]) : callback;
    return this;
  }

  /**
   * 设置列宽度
   */
  width(width: string | number) {
    this.attr('width', width);
    return this;
  }

  /**
   * 对齐方式
   * @default 'left'
   */
  align(pos: ColumnAlignType) {
    this.attr('align', pos);
    return this;
  }

  /**
   * 设置需要检出的数据库字段名
   * @param columns 如果不指定则默认使用 key 值，如果指定 null 则不检出
   */
  select(...columns: ColumnSelectList) {
    this._select = columns;
    return this;
  }

  /**
   * 隐藏列显示
   */
  hidden() {
    this._hidden = true;
    return this;
  }

  /**
   * 自定义数据结果
   * @param callback 回调函数
   */
  data(callback: DataCallback<D>) {
    this._dataCallback = callback;
  }

  /**
   * 自定义数据结果元素
   * @param callback 回调函数
   */
  dataElement(callback: DataCallback<D, Element<D>[]>) {
    this._dataCallbackElement = callback;
  }

  /**
   * 表头输出
   */
  async headOutput() {
    const element = await this.output(undefined);
    const out: ColumnHeadResult = {
      key: this.key,
      label: this._label,
      sortable: !!this._sortCallback,
      dataType: this._dataCallbackElement ? 'element' : 'data',
      ...element,
    };
    return out;
  }

  /**
   * 表数据输出
   */
  async dataOutput(row: D) {
    if (this._dataCallback) {
      return await this._dataCallback(row);
    }
    if (this._dataCallbackElement) {
      const out: ElementResult[] = [];
      for (const el of await this._dataCallbackElement(row)) {
        out.push(await el.output(row));
      }
      return out;
    }
    return propertyAt(row, this.key.split(KEY_SPLITER));
  }
}
