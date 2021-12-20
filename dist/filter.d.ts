import { Grid } from "./grid";
import { JsonWhere } from "./types";
import { FieldType } from "@zenweb/form";
declare type WhereFunc = (value: any) => JsonWhere;
export declare class Filter {
    private _grid;
    private _key;
    private _field;
    private _whereFunc;
    constructor(grid: Grid, key: string, field: FieldType);
    where(func: WhereFunc): this;
    whereBuilder(value: any): JsonWhere;
}
export {};
