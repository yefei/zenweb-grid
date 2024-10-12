import { join, model } from 'zenorm';
import { UserTable } from './_tables.js';
import Profile from './profile.js';

@model({
  pk: 'id',
  table: 'user',
})
export default class User extends UserTable {
  @join(Profile, { type: 'OneToOne' })
  profile?: Profile;
}
