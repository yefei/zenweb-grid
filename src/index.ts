import path from 'node:path';
import { SetupFunction } from '@zenweb/core';
import { fileURLToPath } from 'node:url';

export { Grid, GridBase } from './grid.js';
export * from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
