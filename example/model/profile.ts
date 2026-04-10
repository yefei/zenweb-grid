import { Model } from 'zenorm';
import { ProfileTable } from './_tables.js';

@Model({
  pk: 'id',
  table: 'profile',
})
export default class Profile extends ProfileTable {
}
