import { join, model } from 'zenorm';
import { UserTable } from './_tables';
import Profile from './profile';

@model({
  pk: 'id',
  table: 'user',
})
export default class User extends UserTable {
  @join(Profile, { type: 'OneToOne' })
  profile?: Profile;
}
