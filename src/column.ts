import { propertyAt } from 'property-at';
import { Element } from './element';
import { ColumnAlignType, ColumnHeadResult, ColumnSelect, DataCallback, DataRow, ElementResult, SortCallback } from './types';

export const KEY_SPLITER = '.';

export class Column<D extends DataRow> extends Element {
  _label?: string;
  _select?: ColumnSelect[] | false;
  _dataCallback?: DataCallback<D>;
  _dataCallbackElement?: DataCallback<D, Element | Element[]>;
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
   * @param callback 回调函数
   */
  data(callback: DataCallback<D>) {
    this._dataCallback = callback;
  }

  /**
   * 自定义数据结果元素
   * @param callback 回调函数
   *  - 如果回调返回 Element 则为 td 项
   *  - 如果回调返回 Element[] 则为 td 项的子元素
   */
  dataElement(callback: DataCallback<D, Element | Element[]>) {
    this._dataCallbackElement = callback;
  }

  /**
   * 表头输出
   */
  async headOutput() {
    const element = await this.output();
    const out: ColumnHeadResult = {
      key: this.key,
      label: this._label,
      sortable: this._sortCallback !== undefined,
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
      const _el = await this._dataCallbackElement(row);
      if (_el instanceof Element) {
        // 表格数据根元素只允许 td, th
        if (!['td', 'th'].includes(_el._type)) {
          _el.type('td');
        }
        return _el.output();
      }
      if (Array.isArray(_el)) {
        const child: ElementResult[] = [];
        for (const el of _el) {
          child.push(await el.output());
        }
        return child;
      }
      throw new Error(`dataElement callback result '${String(_el)}' is unknown`);
    }
    return propertyAt(row, this.key.split(KEY_SPLITER));
  }
}
