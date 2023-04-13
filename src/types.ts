import { FormFields, FormLayout } from "@zenweb/form";
import { PageResultWithOption } from "@zenweb/helper";
import { JsonWhere } from 'sql-easy-builder';
import { ElementResult } from "element-easy-builder";

/**
 * 数据库列别名
 */
export type ColumnAs = { [key: string]: string };

/**
 * 需要从数据库中检出的列
 */
export type ColumnSelect = string | ColumnAs;

/**
 * 数据行
 */
export type DataRow = { [key: string]: any };

/**
 * 数据库查询器需实现的方法
 */
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

/**
 * 表头结果
 */
export interface ColumnHeadResult extends ElementResult {
  key: string;
  label?: string;
  sortable?: boolean;
  // dataType: 'data' | 'element';
  // hasData: boolean;
  // hasDataElement: boolean;
}

/**
 * 过滤表单结果
 */
export interface FilterForm {
  fields?: FormFields;
  layout?: FormLayout[];
  errors?: { [field: string]: string };
}

/**
 * 分页结果
 */
export interface PageResult extends Omit<PageResultWithOption, 'order'> {
  /**
   * 排序列名
   */
  order: string;
}

/**
 * 数据列元素
 */
export type DataElementRow = {
  // 所属键: 元素结果
  [key: string]: ElementResult;
};

/**
 * 取得结果
 */
export interface FetchResult {
  /**
   * 过滤表单
   */
  filterForm?: FilterForm;

  /**
   * 过滤表单输入数据结果
   */
  filterData?: any;

  /**
   * 过滤表单输入数据
   */
  filterInput?: any;

  /**
   * 表头信息
   */
  head?: ColumnHeadResult[];

  /**
   * 分页信息
   */
  page?: PageResult;

  /**
   * 数据结果
   */
  data?: DataRow[];

  /**
   * 数据元素
   * - 与 data 行对应
   */
  dataElement?: DataElementRow[];

  /**
   * 数据行元素 - tr
   */
  rowElement?: ElementResult[];

  /**
   * 所有请求参数
   */
  query?: any;
}
