import { SetupFunction } from '@zenweb/core';
export { Grid } from './grid';
export * from './types';

export interface GridOption {
  /**
   * 过滤表单错误代码
   * @default 400
   */
  filterErrorCode: number;
}

const defaultOption: GridOption = {
  filterErrorCode: 400,
}

/**
 * 安装
 */
export default function setup(option?: GridOption): SetupFunction {
  option = Object.assign({}, defaultOption, option);
  return function grid(setup) {
    setup.checkContextProperty('fail', 'need to setup @zenweb/api');
    setup.checkCoreProperty('messageCodeResolver', 'need to setup @zenweb/messagecode');
    setup.defineCoreProperty('gridOption', { value: option });
  }
}

declare module '@zenweb/core' {
  interface Core {
    gridOption: GridOption;
  }
}
