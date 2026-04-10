import { Model } from 'zenorm';
import { NonautopkTable } from './_tables.js';

@Model({
  pk: 'id',
  table: 'nonautopk',
})
export default class Nonautopk extends NonautopkTable {
}
