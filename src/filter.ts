import { Grid } from "./grid";
import { JsonWhere } from "./types";
import { FieldType } from "@zenweb/form";

type WhereFunc = (value: any) => JsonWhere;

export class Filter {
  private _grid: Grid;
  private _key: string;
  private _field: FieldType;
  private _whereFunc: WhereFunc;

  constructor(grid: Grid, key: string, field: FieldType) {
    this._grid = grid;
    this._key = key;
    this._field = field;
    this._whereFunc = null;
  }

  where(func: WhereFunc) {
    this._whereFunc = func;
    return this;
  }

  whereBuilder(value: any): JsonWhere {
    if (this._whereFunc) {
      return this._whereFunc.call(this, value);
    }
    return { [this._key]: value };
  }
}
