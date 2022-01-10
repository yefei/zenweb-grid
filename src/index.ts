import { SetupFunction } from '@zenweb/core';
export { Grid } from './grid';
export * from './types';

export interface GridOption {
}

const defaultOption: GridOption = {
}

/**
 * 安装
 */
export default function setup(option?: GridOption): SetupFunction {
  option = Object.assign({}, defaultOption, option);
  return function grid(setup) {
    setup.checkCoreProperty('messageCodeResolver', 'need to setup @zenweb/messagecode');
    setup.defineCoreProperty('gridOption', { value: option });
  }
}

declare module '@zenweb/core' {
  interface Core {
    gridOption: GridOption;
  }
}
