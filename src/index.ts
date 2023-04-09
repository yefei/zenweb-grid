import * as path from 'path';
import { SetupFunction } from '@zenweb/core';
export { Grid, GridBase } from './grid';
export * from './types';

/**
 * grid html template library
 */
export const gridTemplate = path.join(__dirname, '..', 'template');

/**
 * 安装
 */
export default function setup(): SetupFunction {
  return function grid(setup) {
    setup.assertModuleExists('form', 'need to setup @zenweb/form');
  }
}
