import { Context } from 'koa';
import { fields, Fields, FieldType, Form, FormData } from "@zenweb/form";
import { Column, COLUMN_FORMATTER_CALLBACK, COLUMN_HIDDEN, COLUMN_KEY, COLUMN_SORTABLE, COLUMN_SORT_CALLBACK, COLUMN_VIRTUAL } from "./column";
import { Filter } from "./filter";
import { FetchResult, Finder, JsonWhere } from "./types";
import { cloneDeep, get as objGet, set as objSet } from 'lodash';

const FILTER_PREFIX: string = 'filter_';

export class Grid {
  private _ctx: Context;
  private _columns: { [key: string]: Column } = {};
  private _limit: number = 10;
  private _maxLimit: number = 100;
  private _order: string;
  private _filters: { [key: string]: Filter } = {};
  private _filterFields: Fields = {};
  private _filterWheres: JsonWhere;
  private _filterForm: Form;
  private _offset: number;

  constructor(ctx: Context) {
    this._ctx = ctx;
    this._filterWheres = {};
  }

  /**
   * 定义列
   * @param key 字段key 唯一
   */
  column(key: string) {
    if (!this._columns[key]) {
      this._columns[key] = new Column(key);
    }
    return this._columns[key];
  }

  filter(key: string, field: FieldType) {
    this._filters[key] = new Filter(this, key, field);
    this._filterFields[FILTER_PREFIX + key] = field;
    return this._filters[key];
  }

  filterForm(data?: FormData) {
    if (!this._filterForm) {
      this._filterForm = new Form({ required: false });
      this._filterForm.init({
        fields: this._filterFields,
      }, data);
    }
    return this._filterForm;
  }

  /**
   * 默认条数限制
   * @param defaultLimit 默认条数
   * @param maxLimit 最大条数
   */
  setLimit(limit: number, maxLimit?: number) {
    this._limit = limit;
    this._maxLimit = maxLimit || 100;
    return this;
  }

  /**
   * 设置默认排序
   * @param column 
   */
  setOrder(column: string) {
    this._order = column;
    return this;
  }

  private _query() {
    const pageForm = new Form({ required: false });
    pageForm.init({
      fields: {
        limit: fields.int('条数').validate({ gte: 1, lte: this._maxLimit }),
        offset: fields.int('行位置').validate({ gte: 0, lte: Number.MAX_VALUE }),
        order: fields.trim('排序'),
      }
    }, this._ctx.query);
    // 查询数据
    const params = pageForm.data;
    if (params.limit) this._limit = params.limit;
    if (params.offset) this._offset = params.offset;
    if (typeof params.order === 'string') {
      const orderKey = params.order.startsWith('-') ? params.order.slice(1) : params.order;
      if (orderKey in this._columns && this._columns[orderKey][COLUMN_SORTABLE]) {
        this._order = params.order;
      }
    }
    // 过滤查询
    const filterData = this.filterForm(this._ctx.query).data;
    for (const [key, value] of Object.entries(filterData)) {
      Object.assign(this._filterWheres, this._filters[key.slice(FILTER_PREFIX.length)].whereBuilder(value));
    }
    return this;
  }
 
  async fetch(finder: Finder): Promise<FetchResult> {
    this._query();
    // 排序
    if (this._order) {
      const orderDesc = this._order.startsWith('-');
      const orderKey = orderDesc ? this._order.slice(1) : this._order;
      const orderCall = this._columns[orderKey][COLUMN_SORT_CALLBACK];
      finder.order(...(orderCall ? orderCall(orderDesc) : [this._order]));
    }
    // 过滤
    if (Object.keys(this._filterWheres).length) {
      finder.whereAnd(this._filterWheres);
    }
    // 分页并取得指定列
    const columnList = Object.values(this._columns);
    const dbColumns = columnList.filter(i => !i[COLUMN_VIRTUAL]).map(i => i[COLUMN_KEY]);
    const limit = this._limit;
    const offset = this._offset || 0;
    const result = await finder.page({
      limit,
      offset,
    }, ...dbColumns);

    const filterForm = this.filterForm();

    // 处理结果行
    let data = [];
    const formatterList = columnList.filter(i => i[COLUMN_FORMATTER_CALLBACK]);
    if (formatterList.length) {
      for (const row of result.list) {
        const d = cloneDeep(row);
        for (const col of formatterList) {
          const formatterCall = col[COLUMN_FORMATTER_CALLBACK];
          objSet(d, col[COLUMN_KEY], formatterCall(objGet(row, col[COLUMN_KEY]), row, col[COLUMN_KEY]));
        }
        data.push(d);
      }
    } else {
      data = result.list;
    }

    return {
      filter: {
        fields: filterForm.fields,
        layout: filterForm.layout,
        errors: filterForm.errorMessages(this._ctx.messageCodeResolver),
      },
      columns: columnList.filter(i => !i[COLUMN_HIDDEN]).map(i => i.exports),
      data,
      total: result.total,
      limit,
      maxLimit: this._maxLimit,
      offset,
      order: this._order,
    };
  }
}
