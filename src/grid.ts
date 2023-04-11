import { PageLimitOption, PageOption, TypeCastHelper } from '@zenweb/helper';
import { FormFields, FormBase, FieldOption } from "@zenweb/form";
import { TypeKeys } from 'typecasts';
import { JsonWhere } from 'sql-easy-builder';
import { Column, COLUMN_FORMATTER_CALLBACK, COLUMN_HIDDEN, COLUMN_KEY, COLUMN_SORTABLE, COLUMN_SORT_CALLBACK, COLUMN_SELECT } from "./column";
import { Filter } from "./filter";
import { FetchResult, FilterForm, Finder } from "./types";
import { get as objGet, set as objSet } from 'lodash';
import { ColumnSelectList, PageResult } from './types';
import { Context } from "@zenweb/core";
import { inject, init } from "@zenweb/inject";

const FILTER_PREFIX: string = 'f_';

enum OutType {
  FILTER = 'filter',
  COLUMNS = 'columns',
  PAGE = 'page',
  DATA = 'data',
  QUERY = 'query',
};

const OutTypeValues = Object.values(OutType);

/**
 * 使用依赖注入取得类实例
 */
export class Grid {
  private _columns: { [key: string]: Column } = {};
  private _pageLimit: PageLimitOption = {};
  private _order?: string;
  private _filters: { [key: string]: Filter } = {};
  private _filterFields: FormFields = {};

  @inject protected ctx!: Context;
  @inject protected cast!: TypeCastHelper;

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

  filter(key: string, field: FieldOption | TypeKeys) {
    this._filters[key] = new Filter(key);
    this._filterFields[FILTER_PREFIX + key] = field;
    return this._filters[key];
  }

  /**
   * 设置分页选项
   * - 不设置默认使用 Helper.page 选项的默认值
   */
  setLimit(option: PageLimitOption) {
    Object.assign(this._pageLimit, option);
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
  private async _filterQuery(finder: Finder, query?: any) {
    if (!Object.keys(this._filterFields).length) {
      return;
    }

    class FilterForm extends FormBase(this._filterFields) {}
    const form = await this.ctx.injector.getInstance(FilterForm);
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
  private async _pageQuery(finder: Finder, query?: any) {
    const total = await finder.count();
    const page = this.cast.page(query, Object.assign({}, this._pageLimit, {
      total,
      maxOrder: 1,
      allowOrder: Object.keys(this._columns).filter(c => this._columns[c][COLUMN_SORTABLE]),
    } as PageOption));

    const order = page.order ? page.order[0] : this._order;

    // 排序
    if (total && order) {
      const orderDesc = order.startsWith('-');
      const orderKey = orderDesc ? order.slice(1) : order;
      const orderCall = this._columns[orderKey][COLUMN_SORT_CALLBACK];
      finder.order(...(orderCall ? orderCall(orderDesc) : [order]));
    }

    finder.limit(page.limit, page.offset);

    return {
      ...page,
      order,
    } as PageResult;
  }

  /**
   * 返回结果包含的项
   * 如果没有指定则返回全部项
   * includes=filter,columns,page,data
   */
  private _includeQuery(query?: any) {
    const { includes } = this.cast.pick(query, {
      includes: {
        type: 'trim1[]',
        validate: {
          in: OutTypeValues,
        }
      },
    });
    if (includes && includes.length > 0) {
      return includes as OutType[];
    }
    return OutTypeValues;
  }

  /**
   * 取得数据
   * @param finder 数据获取器
   * @param query 查询规则，如果不指定则默认使用 ctx.query
   * @returns 数据和表格设置项
   */
  async fetch(finder: Finder, query?: any) {
    if (query === undefined) {
      query = this.ctx.query;
    }
    const filter = await this._filterQuery(finder, query);
    const page = await this._pageQuery(finder, query);
    const includes = this._includeQuery(query);
    const columnList = Object.values(this._columns);
    const result: FetchResult = {};

    if (includes.includes(OutType.QUERY)) {
      result.query = query;
    }

    if (filter && includes.includes(OutType.FILTER)) {
      result.filterData = Object.values(filter.data).length ? filter.data : undefined;
      result.filterInput = {};
      for (const k of Object.keys(this._filterFields)) {
        result.filterInput[k] = query[k];
      }
      result.filterForm = <FilterForm> filter.result;
    }

    if (includes.includes(OutType.COLUMNS)) {
      result.columns = columnList.filter(i => !i[COLUMN_HIDDEN]).map(i => i.exports);
    }

    if (includes.includes(OutType.PAGE)) {
      result.page = page;
    }

    if (includes.includes(OutType.DATA)) {
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

export abstract class GridBase extends Grid {
  abstract setup(): void | Promise<void>;

  @init [Symbol()]() {
    return this.setup();
  }
}
