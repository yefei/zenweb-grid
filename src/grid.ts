import { PageLimitOption, PageOption, TypeCastHelper } from '@zenweb/helper';
import { FormBase } from "@zenweb/form";
import { CastAndListKeys } from 'typecasts';
import { JsonWhere } from 'sql-easy-builder';
import { Column, KEY_SPLITER } from "./column";
import { Filter } from "./filter";
import { FetchResult, Finder, DataRow, DataElementRow, DataCallback } from "./types";
import { propertyAt } from 'property-at';
import { ColumnSelect, PageResult } from './types';
import { Context } from "@zenweb/core";
import { inject, init } from "@zenweb/inject";
import { Element } from 'element-easy-builder';

const FILTER_PREFIX: string = 'f_';

enum FetchType {
  FILTER_FORM = 'filter-form',
  FILTER_DATA = 'filter-data',
  FILTER_INPUT = 'filter-input',
  HEAD = 'head',
  PAGE = 'page',
  DATA = 'data',
  DATA_ELEMENT = 'data-element',
  ROW_ELEMENT = 'row-element',
  QUERY = 'query',
};

const FetchTypeValues = Object.values(FetchType);

/**
 * 使用依赖注入取得类实例
 */
export class Grid<D extends DataRow = DataRow> {
  private _columns: { [key: string]: Column<D> } = {};
  private _pageLimit: PageLimitOption = {};
  private _order?: string;
  private _filters: { [key: string]: Filter<any> } = {};
  private _dataRowElementCallback?: DataCallback<D, Element>;

  @inject protected ctx!: Context;
  @inject protected cast!: TypeCastHelper;

  /**
   * 定义数据列
   * @param key 字段key 唯一
   * @param select 检索字段
   *  - 默认: 使用 key 检索
   *  - false: 不检索
   *  - ColumnSelect[]: 指定检索
   */
  column(key: string, select?: false | ColumnSelect[]) {
    const col = this._columns[key] = new Column(key);
    if (select === false || select) {
      col.select(false);
    }
    return col;
  }

  /**
   * 创建一个 Element
   */
  createElement(type?: string) {
    const el = new Element();
    if (type) {
      el.type(type);
    }
    return el;
  }

  /**
   * 定义过滤器
   * @param key 过滤器字段名
   * @param valueType 值类型
   */
  filter<T extends CastAndListKeys>(key: string, valueType: T) {
    const f = this._filters[FILTER_PREFIX + key] = new Filter<T>(key, valueType);
    f.optional();
    return f;
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
   * 设置数据行元素处理 - tr
   */
  setDataRowElement(callback: DataCallback<D, Element>) {
    this._dataRowElementCallback = callback;
    return this;
  }

  /**
   * 查询过滤
   */
  private async _filterQuery(finder: Finder, query?: any) {
    if (!Object.keys(this._filters).length) {
      return;
    }

    const gird = this;
    class FilterForm extends FormBase {
      setup() {
        return gird._filters;
      }
    }
    const form = await this.ctx.injector.getInstance(FilterForm);
    query && await form.validate(query);

    const filterWheres: JsonWhere = {};
    if (form.data) {
      for (const [key, value] of Object.entries(form.data)) {
        Object.assign(filterWheres, this._filters[key].whereBuilder(value));
      }
      console.log(filterWheres)
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
      allowOrder: Object.keys(this._columns).filter(c => !!this._columns[c]._sortCallback),
    } as PageOption));

    const order = page.order ? page.order[0] : this._order;

    // 排序
    if (total && order) {
      const orderDesc = order.startsWith('-');
      const orderKey = orderDesc ? order.slice(1) : order;
      const orderCall = this._columns[orderKey]._sortCallback;
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
   * fetch=filter,columns,page,data
   */
  private _fetchQuery(query?: any) {
    const { fetch } = this.cast.pick(query, {
      fetch: {
        type: 'trim1[]',
        validate: {
          in: FetchTypeValues,
        }
      },
    });
    if (fetch && fetch.length > 0) {
      return fetch as FetchType[];
    }
    return FetchTypeValues;
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
    const fetchs = this._fetchQuery(query);
    const columnList = Object.values(this._columns);
    const result: FetchResult = {};

    if (fetchs.includes(FetchType.QUERY)) {
      result.query = query;
    }

    if (filter) {
      if (fetchs.includes(FetchType.FILTER_FORM)) {
        result.filterForm = filter.toJSON();
      }
      if (fetchs.includes(FetchType.FILTER_DATA)) {
        result.filterData = filter.data;
      }
      if (fetchs.includes(FetchType.FILTER_INPUT)) {
        result.filterInput = {};
        for (const k of Object.keys(this._filters)) {
          result.filterInput[k] = query[k];
        }
      }
      if (filter.hasErrors) {
        result.filterErrors = filter.errorMessages;
      }
    }

    if (fetchs.includes(FetchType.HEAD)) {
      result.head = [];
      for (const col of columnList.filter(i => !i._hidden)) {
        result.head.push(await col.headOutput());
      }
    }

    if (fetchs.includes(FetchType.PAGE)) {
      result.page = page;
    }

    const hasData = fetchs.includes(FetchType.DATA);
    const hasDataElement = fetchs.includes(FetchType.DATA_ELEMENT);
    const hasRowElement = fetchs.includes(FetchType.ROW_ELEMENT);
    if (hasData || hasDataElement || hasRowElement) {
      // 检出数据
      const dbColumns: ColumnSelect[] = [];
      for (const i of columnList) {
        if (i._select === false) {
          continue;
        }
        if (i._select) {
          dbColumns.push(...i._select);
        } else {
          dbColumns.push(i.key);
        }
      }
      const results = page.total ? <D[]> await finder.all(...dbColumns) : [];

      // 数据行元素
      if (hasRowElement && this._dataRowElementCallback) {
        result.rowElement = [];
        for (const row of results) {
          const value = await this._dataRowElementCallback(row);
          value.type('tr');
          result.rowElement.push(value.output());
        }
      }

      // 数据结果
      if (hasData) {
        // 处理结果行
        result.data = [];
        for (const row of results) {
          const data: DataRow = {};
          for (const col of columnList) {
            const value = await col.dataOutput(row);
            if (typeof value !== 'undefined') {
              propertyAt(data, col.key.split(KEY_SPLITER), value);
            }
          }
          result.data.push(data);
        }
      }

      // 数据元素结果
      if (hasDataElement) {
        result.dataElement = [];
        for (const row of results) {
          const data: DataElementRow = {};
          for (const col of columnList) {
            const value = await col.dataElementOutput(row);
            if (typeof value !== 'undefined') {
              propertyAt(data, col.key.split(KEY_SPLITER), value);
            }
          }
          result.dataElement.push(data);
        }
      }
    }

    return result;
  }
}

export abstract class GridBase<D extends DataRow = DataRow> extends Grid<D> {
  abstract setup(): void | Promise<void>;

  @init [Symbol()]() {
    return this.setup();
  }
}
