'use strict';

const Column = require('./column');
const { Filter, Choice } = require('./filter');

class Grid {
  constructor() {
    /** @type { {[key: string]: Column} } */
    this._columns = {};
    /** @type { string[] } */
    this._columnKeys = [];
    this._limit = 10;
    this._maxLimit = 100;
    this._order = null;
    /** @type { {[key: string]: Filter} } */
    this._filters = {};
    /** @type { string[] } */
    this._filterKeys = [];
    this._filterWhere = {};
  }

  column(key) {
    if (!this._columns[key]) {
      this._columns[key] = new Column(this, key);
      this._columnKeys.push(key);
    }
    return this._columns[key];
  }

  filter(key, clazz = Filter) {
    if (!this._filters[key]) {
      this._filters[key] = new clazz(this, key);
      this._filterKeys.push(key);
    }
    return this._filters[key];
  }

  choice(key) {
    return this.filter(key, Choice);
  }

  /**
   * 默认条数限制
   * @param {number} defaultLimit 默认条数
   * @param {number} [maxLimit] 最大条数
   */
  setLimit(limit, maxLimit) {
    this._limit = limit;
    this._maxLimit = maxLimit;
    return this;
  }

  /**
   * 设置默认排序
   * @param {string} column 
   */
  setOrder(column) {
    this._order = column;
    return this;
  }

  /**
   * @param {import('koa').BaseContext} ctx
   */
  query(ctx) {
    const queryFields = {
      limit: {
        type: 'int',
        validate: {
          gte: 1,
          lte: this._maxLimit,
        }
      },
      offset: {
        type: 'int',
        validate: {
          gte: 0,
          lte: Number.MAX_VALUE,
        }
      },
      order: 'trim',
    };
    // 过滤字段
    const filters = Object.values(this._filters);
    for (const i of filters) {
      queryFields['filter_' + i._key] = {
        type: i._type || 'trim',
        validate: i._validate,
      };
    }
    // 查询数据
    const params = ctx.helper.query(queryFields);
    if (params.limit) this._limit = params.limit;
    if (params.offset) this._offset = params.offset;
    if (params.order) {
      const allowOrders = Object.values(this._columns).filter(i => i._sortable).map(i => i._key);
      if (allowOrders.includes(params.order.startsWith('-') ? params.order.slice(1) : params.order)) {
        this._order = params.order;
      }
    }
    // 过滤查询
    for (const i of filters) {
      const value = params['filter_' + i._key];
      if (value !== undefined) {
        Object.assign(this._filterWhere, i.whereBuilder(value));
      }
    }
    return this;
  }

  /**
   * @param {import('zenorm').Finder} finder
   */
  async fetch(finder) {
    // 排序
    if (this._order) {
      finder.order(this._order);
    }
    // 过滤
    if (Object.keys(this._filterWhere).length) {
      finder.where(this._filterWhere);
    }
    // 分页并取得指定列
    const limit = this._limit;
    const offset = this._offset || 0;
    const result = await finder.page({
      limit,
      offset,
    }, ...this._columnKeys);
    return {
      filters: this._filterKeys.map(i => this._filters[i].exports),
      columns: this._columnKeys.map(i => this._columns[i].exports),
      data: result.list,
      total: result.total,
      limit,
      maxLimit: this._maxLimit,
      offset,
      order: this._order,
    };
  }
}

module.exports = Grid;
