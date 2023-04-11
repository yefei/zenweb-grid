import { FormFields, FormLayout } from "@zenweb/form";
import { PageResultWithOption } from "@zenweb/helper";
import { JsonWhere } from 'sql-easy-builder';
import { Element } from "./element";

export type ColumnAs = { [key: string]: string };
export type ColumnSelectList = (string | ColumnAs)[];
export type ResultRow = { [key: string]: any };

export interface Finder {
  whereAnd(w: JsonWhere): Finder;
  limit(limit: number, offset: number): Finder;
  order(...columns: string[]): Finder;
  count(): Promise<number>;
  all(...columns: ColumnSelectList): Promise<ResultRow[]>;
}

/**
 * 自定义结果回调
 * @param row 行结果
 * @param key 列名
 */
export type ResultCallback = (row: ResultRow, key: string) => any | Promise<any>;

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

export interface FilterForm {
  fields?: FormFields;
  layout?: FormLayout[];
  errors?: { [field: string]: string };
}

export interface PageResult extends Omit<PageResultWithOption, 'order'> {
  /**
   * 排序列名
   */
  order: string;
}

export interface FetchResult {
  filterForm?: FilterForm;
  filterData?: any;
  filterInput?: any;
  columns?: ColumnExports[];
  page?: PageResult;
  data?: ResultRow[];
  query?: any;
}


export type ElementAttrValue = string | number | ResultCallback;
export type ElementChildType = string | number | Element;
export type ElementChildResult = string | number | ElementResult;

export interface ElementResult {
  type: string;
  attrs: Record<string, string>;
  children?: ElementChildResult[];
}
