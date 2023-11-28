import { propertyAt } from 'property-at';
import { Element, ElementAttrValue } from 'element-easy-builder';
import { ColumnHeadResult, ColumnSelect, DataCallback, DataRow, ColumnElementCallback, SortCallback } from './types';

export const KEY_SPLITER = '.';

export class Column<D extends DataRow> extends Element {
  _label?: string;
  _select?: ColumnSelect[] | false;
  _dataCallback?: DataCallback<D>;
  _columnElementCallback?: ColumnElementCallback<D>;
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
  sortable(callback: SortCallback | string | boolean = true) {
    if (callback === true) {
      callback = this.key;
    }
    if (typeof callback === 'string') {
      this._sortCallback = (desc => [`${desc ? '-' : ''}${callback}`]);
    }
    else if (typeof callback === 'function') {
      this._sortCallback = callback;
    }
    else {
      delete this._sortCallback;
    }
    return this;
  }

  /**
   * 设置列宽度
   */
  width(width: ElementAttrValue) {
    this.attr('width', width);
    return this;
  }

  /**
   * 设置需要检出的数据库字段名
   * @param columns 如果不指定则默认使用 key 值，如果指定 false 则不检出
   */
  select(...columns: ColumnSelect[] | false[]) {
    this._select = columns[0] === false ? false : <ColumnSelect[]> columns;
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
   * @param callback 行回调
   */
  data(callback: DataCallback<D>) {
    this._dataCallback = callback;
    return this;
  }

  /**
   * 自定义数据结果元素
   * @param callback 行回调
   */
  element(callback: ColumnElementCallback<D>) {
    this._columnElementCallback = callback;
    return this;
  }

  /**
   * 表头输出
   */
  async _headOutput() {
    const element = this.output();
    const out: ColumnHeadResult = {
      key: this.key,
      label: this._label,
      sortable: this._sortCallback !== undefined,
      ...element,
    };
    return out;
  }

  /**
   * 表数据输出
   */
  async _dataOutput(row: D) {
    if (this._dataCallback) {
      return await this._dataCallback(row);
    }
    if (this._select === false) {
      return;
    }
    return propertyAt(row, this.key.split(KEY_SPLITER));
  }

  /**
   * 表数据元素输出
   */
  async _elementOutput(row: D) {
    if (this._columnElementCallback) {
      const _td = new Element().type('td');
      const _res = await this._columnElementCallback(row, _td);
      if (_res) {
        _td.append(_res);
      }
      return _td.output();
    }
  }
}
