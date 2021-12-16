import BaseContext from 'koa';
import { fields, Form } from '@zenweb/form';

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

declare class Column {
  constructor(grid: Grid, key: string);
  get exports(): { [key: string]: string };
  label(label: string): Column;
  sortable(order: boolean): Column;
}

class Filter {
  constructor(grid: Grid, key: string, field: fields.Input);
  where(func: (value: any) => object): Filter;
  whereBuilder(value: any): object;
}

export declare class Grid {
  /**
   * 添加表格列
   * @param key 字段key
   */
  column(key: string): Column;

  /**
   * 添加过滤器
   * @param key 
   * @param field 
   */
  filter(key: string, field: fields.Input): Filter;

  /**
   * 过滤表单
   * @param data 输入数据
   */
  filterForm(data?: { [key: string]: any }): Form;

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
