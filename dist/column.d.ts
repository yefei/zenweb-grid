import { Grid } from "./grid";
import { ColumnExports, RenderFunc } from "./types";
export declare class Column {
    private _grid;
    private _key;
    private _label;
    private _sortable;
    private _virtual;
    private _renderFunc;
    constructor(grid: Grid, key: string);
    get exports(): ColumnExports;
    get key(): string;
    label(label: string): this;
    /**
     * 设置为可排序列
     */
    sortable(order?: boolean): this;
    get isSortable(): boolean;
    /**
     * 是否为虚拟字段，不在数据库中字段
     */
    virtual(is?: boolean): this;
    get isVirtual(): boolean;
    /**
     * 自定义结果渲染
     */
    render(func: RenderFunc): this;
    get renderFunc(): RenderFunc;
}
