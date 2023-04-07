import { JsonWhere } from 'sql-easy-builder';

type WhereFunc = (value: any) => JsonWhere | undefined;

export class Filter {
  private _whereFunc?: WhereFunc;

  constructor(private _key: string) {
  }

  where(func: WhereFunc) {
    this._whereFunc = func;
    return this;
  }

  whereBuilder(value: any): JsonWhere | undefined {
    if (this._whereFunc) {
      return this._whereFunc.call(this, value);
    }
    return { [this._key]: value };
  }
}
