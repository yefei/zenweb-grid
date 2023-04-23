import { Field } from '@zenweb/form';
import { JsonWhere } from 'sql-easy-builder';
import { CastAndListKeys } from 'typecasts';

type WhereFunc = (value: any) => JsonWhere | undefined;

export class Filter<T extends CastAndListKeys> extends Field<T> {
  private _whereFunc?: WhereFunc;

  constructor(private _key: string, valueType: T) {
    super(valueType);
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
