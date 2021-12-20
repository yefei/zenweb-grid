import { Fields, Layout } from "@zenweb/form";
export interface PageOptions {
    /** 分页条数 */
    limit: number;
    /** 分页位置 */
    offset?: number;
    /** 排序 */
    order?: string | string[];
}
export declare type ResultRow = {
    [key: string]: any;
};
export interface Finder {
    where(w: JsonWhere): Finder;
    order(...columns: string[]): Finder;
    page(page: PageOptions, ...columns: string[]): Promise<{
        total: number;
        list: ResultRow[];
    }>;
}
export declare type JsonWhere = {
    [key: string]: any | any[] | JsonWhere | JsonWhere[];
};
export declare type RenderFunc = (value: any, row: ResultRow, key: string) => any;
export interface ColumnExports {
    key: string;
    label?: string;
    sortable?: boolean;
}
export interface FetchResult {
    filter: {
        fields: Fields;
        layout: Layout[];
        errors: {
            [key: string]: string;
        };
    };
    columns: ColumnExports[];
    data: ResultRow[];
    total: number;
    limit: number;
    maxLimit: number;
    offset: number;
    order: string;
}
