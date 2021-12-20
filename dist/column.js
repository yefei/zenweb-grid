"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
class Column {
    constructor(grid, key) {
        this._sortable = false;
        this._virtual = false;
        this._renderFunc = null;
        this._grid = grid;
        this._key = key;
    }
    get exports() {
        const attrs = { key: this._key };
        if (this._label)
            attrs.label = this._label;
        if (this._sortable)
            attrs.sortable = this._sortable;
        return attrs;
    }
    get key() {
        return this._key;
    }
    label(label) {
        this._label = label;
        return this;
    }
    /**
     * 设置为可排序列
     */
    sortable(order = true) {
        this._sortable = order;
        return this;
    }
    get isSortable() {
        return this._sortable;
    }
    /**
     * 是否为虚拟字段，不在数据库中字段
     */
    virtual(is = true) {
        this._virtual = is;
        return this;
    }
    get isVirtual() {
        return this._virtual;
    }
    /**
     * 自定义结果渲染
     */
    render(func) {
        this._renderFunc = func;
        return this;
    }
    get renderFunc() {
        return this._renderFunc;
    }
}
exports.Column = Column;
//# sourceMappingURL=column.js.map