import { Field } from '@zenweb/form';
import { JsonWhere } from 'sql-easy-builder';
import { TypeKeys, TypeMap } from 'typecasts';

export class Filter<T extends TypeKeys, R = TypeMap[T]> {
  private _whereFunc?: (value: R) => JsonWhere | undefined;

  constructor(
    private _key: string,
    private _field: Field<T, R>,
  ) {}

  where(func: (value: R) => JsonWhere | undefined) {
    this._whereFunc = func;
    return this;
  }

  private _whereBuilder(value: any): JsonWhere | undefined {
    if (this._whereFunc) {
      return this._whereFunc.call(this, value);
    }
    return { [this._key]: value };
  }

  /**
   * 查询构建 - Grid 内部使用
   */
  static whereBuilder(filter: Filter<any>, value: any) {
    return filter._whereBuilder(value)
  }

  /**
   * 查询构建 - Grid 内部使用
   */
  static getField(filter: Filter<any>) {
    return filter._field;
  }
}
