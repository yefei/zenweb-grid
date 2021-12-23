import { SetupFunction } from '@zenweb/core';
export { Grid } from './grid';
export * from './types';

/**
 * 安装
 */
export default function setup(): SetupFunction {
  return function grid(setup) {
    setup.checkCoreProperty('messageCodeResolver', 'need to setup @zenweb/messagecode');
  }
}
