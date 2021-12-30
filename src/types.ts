import { Fields, Layout } from "@zenweb/form";

export type ColumnAs = { [key: string]: string };
export type ColumnSelectList = (string | ColumnAs)[];

export interface PageOptions {
  /** 分页条数 */
  limit: number;

  /** 分页位置 */
  offset?: number;

  /** 排序 */
  order?: string | string[];
}

export type ResultRow = { [key: string]: any };

export interface Finder {
  whereAnd(w: JsonWhere): Finder;
  limit(limit: number, offset: number): Finder;
  order(...columns: string[]): Finder;
  count(): Promise<number>;
  all(...columns: ColumnSelectList): Promise<ResultRow[]>;
}

export type JsonWhere = { [key: string]: any | any[] | JsonWhere | JsonWhere[] };

/**
 * 结果格式化回调
 * @param row 行结果
 * @param key 列名
 */
export type FormatterCallback = (row: ResultRow, key: string) => any | Promise<any>;

/**
 * 排序方法回调函数
 * @param desc 是否为倒序，否则就是顺序
 */
export type SortCallback = (desc: boolean) => string[];

export type ColumnAlignType = 'left' | 'center' | 'right';

export interface ColumnExports {
  key: string;
  label?: string;
  sortable?: boolean;
  width?: string | number;
  align?: ColumnAlignType;
}

export interface FilterResult {
  fields: Fields;
  layout: Layout[];
  errors: { [key: string]: string };
}

export interface PageResult {
  total: number;
  limit: number;
  maxLimit: number;
  offset: number;
  order: string;
}

export interface FetchResult {
  filter?: FilterResult;
  columns?: ColumnExports[];
  page?: PageResult;
  data?: ResultRow[];
}
