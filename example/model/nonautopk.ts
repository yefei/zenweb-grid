import { model } from 'zenorm';
import { NonautopkTable } from './_tables.js';

@model({
  pk: 'id',
  table: 'nonautopk',
})
export default class Nonautopk extends NonautopkTable {
}
