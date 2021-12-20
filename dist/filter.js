"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filter = void 0;
class Filter {
    constructor(grid, key, field) {
        this._grid = grid;
        this._key = key;
        this._field = field;
        this._whereFunc = null;
    }
    where(func) {
        this._whereFunc = func;
        return this;
    }
    whereBuilder(value) {
        if (this._whereFunc) {
            return this._whereFunc.call(this, value);
        }
        return { [this._key]: value };
    }
}
exports.Filter = Filter;
//# sourceMappingURL=filter.js.map