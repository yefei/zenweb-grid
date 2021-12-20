import { BaseContext } from 'koa';
import { FieldType, Form, FormData } from "@zenweb/form";
import { Column } from "./column";
import { Filter } from "./filter";
import { FetchResult, Finder } from "./types";
export declare class Grid {
    private _ctx;
    private _columns;
    private _limit;
    private _maxLimit;
    private _order;
    private _filters;
    private _filterFields;
    private _filterWheres;
    private _filterForm;
    private _offset;
    constructor(ctx: BaseContext);
    /**
     * 定义列
     * @param key 字段key 唯一
     */
    column(key: string): Column;
    filter(key: string, field: FieldType): Filter;
    filterForm(data?: FormData): Form;
    /**
     * 默认条数限制
     * @param defaultLimit 默认条数
     * @param maxLimit 最大条数
     */
    setLimit(limit: number, maxLimit?: number): this;
    /**
     * 设置默认排序
     * @param column
     */
    setOrder(column: string): this;
    private _query;
    fetch(finder: Finder): Promise<FetchResult>;
}
