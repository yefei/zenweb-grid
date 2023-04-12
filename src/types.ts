import { FormFields, FormLayout } from "@zenweb/form";
import { PageResultWithOption } from "@zenweb/helper";
import { JsonWhere } from 'sql-easy-builder';
import { Element } from "./element";

export type ColumnAs = { [key: string]: string };
export type ColumnSelect = string | ColumnAs;
export type DataRow = { [key: string]: any };

export interface Finder {
  whereAnd(w: JsonWhere): Finder;
  limit(limit: number, offset: number): Finder;
  order(...columns: string[]): Finder;
  count(): Promise<number>;
  all(...columns: ColumnSelect[]): Promise<DataRow[]>;
}

/**
 * 自定义结果回调
 * @param row 行结果
 */
export type DataCallback<T, R = any> = (row: T) => R | Promise<R>;

/**
 * 排序方法回调函数
 * @param desc 是否为倒序，否则就是顺序
 */
export type SortCallback = (desc: boolean) => string[];

export type ColumnAlignType = 'left' | 'center' | 'right';

/**
 * 表头结果
 */
export interface ColumnHeadResult extends ElementResult {
  key: string;
  label?: string;
  sortable?: boolean;
  dataType: 'data' | 'element';
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
  head?: ColumnHeadResult[];
  page?: PageResult;
  data?: DataRow[];
  query?: any;
}

export type ElementAttrValue = string | number;
export type ElementChildType = string | number | Element;
export type ElementChildResult = string | number | ElementResult;

/**
 * 元素结果
 */
export interface ElementResult {
  /**
   * 元素类型
   * @default 'div'
   */
  type: string;

  /**
   * 元素属性
   */
  attrs: Record<string, ElementAttrValue>;

  /**
   * 子元素
   */
  children?: ElementChildResult[];
}
