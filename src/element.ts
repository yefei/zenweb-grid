import { ElementAttrValue, ElementChildResult, ElementChildType, ElementResult } from './types';

export class Element {
  _type = 'div';
  _attrs: Record<string, ElementAttrValue> = {};
  _class?: Set<string>;
  _style?: Map<string, string>;
  _children: ElementChildType[] = [];

  /**
   * 设置类型
   * @param type 例如 a, div, img
   */
  type(type: string) {
    this._type = type;
    return this;
  }

  /**
   * 设置属性
   * @param key 属性名
   * @param value 属性值
   */
  attr(key: string, value: ElementAttrValue) {
    this._attrs[key] = value;
    return this;
  }

  /**
   * 设置 class 值
   * - `string` 类型直接追加到已有值中, 空字符串忽略
   * - `object` 如果对象值为 `true` 追加入值, `false` 则从中删除
   * @param values 属性值
   */
  class(...values: (string | { [name: string]: boolean })[]) {
    if (values.length === 0) {
      return this;
    }
    if (!this._class) {
      this._class = new Set();
    }
    for (const value of values) {
      if (!value) {
        continue;
      }
      if (typeof value === 'string') {
        this._class.add(value);
      } else {
        for (const [k, is] of Object.entries(value)) {
          if (!is) {
            this._class.delete(k);
          } else {
            this._class.add(k);
          }
        }
      }
    }
    return this;
  }

  /**
   * 设置样式值
   * @param values 
   */
  style(...values: { [key: string]: string }[]) {

  }

  /**
   * 追加子元素
   */
  append(child: ElementChildType | ElementChildType[]) {
    this._children.push(...Array.isArray(child) ? child : [child]);
    return this;
  }

  /**
   * 结果输出
   */
  async output() {
    let children: ElementChildResult[] | undefined;
    if (this._children.length > 0) {
      children = [];
      for (const child of this._children) {
        children.push(child instanceof Element ? await child.output() : child);
      }
    }

    const out: ElementResult = {
      type: this._type,
      attrs: Object.assign(
        {},
        this._attrs,
        this._class ? {
          class: Array.from(this._class).filter(v => v != '').join(' ')
        } : undefined,
      ),
      children,
    };
    return out;
  }
}
