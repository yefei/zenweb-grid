import { ElementAttrValue, ElementChildResult, ElementChildType, ElementResult } from './types';

export class Element {
  _type = 'div';
  _attrs: Record<string, ElementAttrValue> = {};
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
      attrs: this._attrs,
      children,
    };
    return out;
  }
}
