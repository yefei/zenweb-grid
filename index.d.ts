import BaseContext from 'koa';

interface PageOptions {
  /** 分页条数 */
  limit: number;

  /** 分页位置 */
  offset?: number;

  /** 排序 */
  order?: string | string[];
}

interface Finder<T> {
  order(...columns: string[]): Finder<T>;
  page(page: PageOptions, ...columns: string[]): Promise<{ total: number, list: T[] }>;
}

export declare class Grid {
  /**
   * 添加表格列
   * @param key 字段key
   */
  column(key: string): Grid;

  /**
   * 默认条数限制
   * @param defaultLimit 默认条数
   * @param maxLimit 最大条数
   */
  setLimit(limit: number, maxLimit?: number): Grid;

   /**
   * 设置默认排序
   * @param column 
   */
  setOrder(column: string): Grid;

  /**
   * 查询过滤并排序
   * @param ctx
   */
  query(ctx: BaseContext): Grid;

  /**
   * 取得结果
   * @param finder
   */
  fetch(finder: Finder<T>): Promise<T>;
}
