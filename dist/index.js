"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.Grid = void 0;
var grid_1 = require("./grid");
Object.defineProperty(exports, "Grid", { enumerable: true, get: function () { return grid_1.Grid; } });
__exportStar(require("./types"), exports);
/**
 * 安装
 */
function setup(core) {
}
exports.setup = setup;
//# sourceMappingURL=index.js.map