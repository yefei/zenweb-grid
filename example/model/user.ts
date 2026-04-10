import { Join, Model } from 'zenorm';
import { UserTable } from './_tables.js';
import Profile from './profile.js';

@Model({
  pk: 'id',
  table: 'user',
})
export default class User extends UserTable {
  @Join(Profile, { type: 'OneToOne' })
  profile?: Profile;
}
