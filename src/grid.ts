import { FieldOption, fields, Fields, FieldType, Form, FormData } from "@zenweb/form";
import { JsonWhere } from 'sql-easy-builder';
import { Column, COLUMN_FORMATTER_CALLBACK, COLUMN_HIDDEN, COLUMN_KEY, COLUMN_SORTABLE, COLUMN_SORT_CALLBACK, COLUMN_SELECT } from "./column";
import { Filter } from "./filter";
import { FetchResult, Finder } from "./types";
import { get as objGet, set as objSet } from 'lodash';
import { ColumnSelectList, PageResult } from './types';
import { Context } from "@zenweb/core";
import { inject } from "@zenweb/inject";

const FILTER_PREFIX: string = 'f.';

/**
 * 使用依赖注入取得类实例
 */
export class Grid {
  private _columns: { [key: string]: Column } = {};
  private _limit: number = 10;
  private _maxLimit: number = 100;
  private _order?: string;
  private _filters: { [key: string]: Filter } = {};
  private _filterFields: Fields = {};
  private _offset: number = 0;

  @inject private _ctx!: Context;

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

  /**
   * 查询过滤
   * @throws {FilterError}
   */
  private async _filterQuery(finder: Finder, query?: FormData): Promise<Form | undefined> {
    if (!Object.keys(this._filterFields).length) {
      return;
    }

    const self = this;
    class FilterForm extends Form {
      defaultOption: FieldOption = { type: 'any', required: false };
      fields() {
        return self._filterFields
      }
    }

    const form = await this._ctx.injector.getInstance(FilterForm);
    query && await form.validate(query);

    const filterWheres: JsonWhere = {};
    for (const [key, value] of Object.entries(form.data)) {
      Object.assign(filterWheres, this._filters[key.slice(FILTER_PREFIX.length)].whereBuilder(value));
    }

    // 过滤
    if (Object.keys(filterWheres).length) {
      finder.whereAnd(filterWheres);
    }

    return form;
  }

  /**
   * 分页和排序
   */
  private async _pageQuery(finder: Finder, query?: FormData): Promise<PageResult> {
    const self = this;
    class PageForm extends Form {
      defaultOption: FieldOption = { type: 'any', required: false };
      fields() {
        return {
          limit: fields.int('条数').validate({ gte: 1, lte: self._maxLimit }),
          offset: fields.int('行位置').validate({ gte: 0, lte: Number.MAX_VALUE }),
          order: fields.trim('排序'),
        }
      }
    }

    const form = await this._ctx.injector.getInstance(PageForm);
    query && await form.validate(query);

    const params = form.data;
    const limit = params.limit || this._limit;
    const offset = params.offset || this._offset;
    let order = this._order;
    if (typeof params.order === 'string') {
      const orderKey = params.order.startsWith('-') ? params.order.slice(1) : params.order;
      if (orderKey in this._columns && this._columns[orderKey][COLUMN_SORTABLE]) {
        order = params.order;
      }
    }

    const total = await finder.count();

    finder.limit(limit, offset);

    // 排序
    if (total && order) {
      const orderDesc = order.startsWith('-');
      const orderKey = orderDesc ? order.slice(1) : order;
      const orderCall = this._columns[orderKey][COLUMN_SORT_CALLBACK];
      finder.order(...(orderCall ? orderCall(orderDesc) : [order]));
    }
    
    return {
      total,
      limit,
      maxLimit: this._maxLimit,
      offset,
      order,
    }
  }

  /**
   * 返回结果包含的项
   * 如果没有指定则返回全部项
   * includes=filter,columns,page,data
   */
  private async _includeQuery(query?: FormData): Promise<string[]> {
    const all = ['filter', 'columns' , 'page', 'data'];
    class IncludeForm extends Form {
      defaultOption: FieldOption = { type: 'any', required: false };
      fields() {
        return {
          includes: fields.multiple('includes').choices(all),
        }
      }
    }
    const form = await this._ctx.injector.getInstance(IncludeForm);
    query && await form.validate(query);
    if (form.data.includes && form.data.includes.length > 0) {
      return form.data.includes;
    }
    return all;
  }

  /**
   * 取得数据
   * @param finder 数据获取器
   * @param query 查询规则，如果不指定则默认使用 ctx.query
   * @returns 数据和表格设置项
   */
  async fetch(finder: Finder, query?: FormData): Promise<FetchResult> {
    if (query === undefined && this._ctx?.query) {
      query = this._ctx.query;
    }
    const filter = await this._filterQuery(finder, query);
    const page = await this._pageQuery(finder, query);
    const includes = await this._includeQuery(query);
    const columnList = Object.values(this._columns);
    const result: FetchResult = {};

    if (filter) {
      result.filterData = filter.data;
      if (includes.includes('filter')) {
        result.filterForm = filter.result;
      }
      if (filter.hasErrors) {
        result.filterErrors = filter.errorMessages;
      }
    }

    if (includes.includes('columns')) {
      result.columns = columnList.filter(i => !i[COLUMN_HIDDEN]).map(i => i.exports);
    }

    if (includes.includes('page')) {
      result.page = page;
    }

    if (includes.includes('data')) {
      const dbColumns: ColumnSelectList = [];
      for (const i of columnList) {
        if (i[COLUMN_SELECT]) {
          if (i[COLUMN_SELECT][0] === null) {
            continue;
          }
          dbColumns.push(...i[COLUMN_SELECT]);
        } else {
          dbColumns.push(i[COLUMN_KEY]);
        }
      }
      const data = page.total ? await finder.all(...dbColumns) : [];
      // 处理结果行
      result.data = [];
      for (const row of data) {
        const d = {};
        for (const col of columnList) {
          let value;
          const formatterCall = col[COLUMN_FORMATTER_CALLBACK];
          if (formatterCall) {
            value = await formatterCall(row, col[COLUMN_KEY]);
          } else {
            value = objGet(row, col[COLUMN_KEY]);
          }
          if (typeof value !== 'undefined') {
            objSet(d, col[COLUMN_KEY], value);
          }
        }
        result.data.push(d);
      }
    }
  
    return result;
  }
}
