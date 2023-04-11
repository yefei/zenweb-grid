import { ElementAttrValue, ElementChildResult, ElementChildType, ElementResult } from './types';

export class Element<R = undefined> {
  _type = 'div';
  _attrs: Record<string, ElementAttrValue<R>> = {};
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
  attr(key: string, value: ElementAttrValue<R>) {
    this._attrs[key] = value;
    return this;
  }

  /**
   * 设置内容
   * - 会覆盖原有内容
   * @param child 内容
   * @returns 与 child 的不同，此方法返回的还是本身并不会返回子对象
   */
  content(child: ElementChildType | ElementChildType[]) {
    this._children = Array.isArray(child) ? child : [child];
    return this;
  }

  /**
   * 增加子项目
   * @param child 如果不指定将创建一个新 Element
   * @returns 返回 child
   */
  child<C extends ElementChildType = Element>(child?: C): C {
    if (typeof child === 'undefined') {
      child = <C> new Element();
    }
    this._children.push(child);
    return child;
  }

  /**
   * 结果输出
   */
  async output(row: R) {
    const attrs: Record<string, any> = {};
    for (const [ak, av] of Object.entries(this._attrs)) {
      attrs[ak] = typeof av === 'function' ? await av(row) : av;
    }

    let children: ElementChildResult[] | undefined;
    if (this._children.length > 0) {
      children = [];
      for (const child of this._children) {
        children.push(child instanceof Element ? await child.output(<any>row) : child);
      }
    }

    const out: ElementResult = {
      type: this._type,
      attrs,
      children,
    };
    return out;
  }
}
