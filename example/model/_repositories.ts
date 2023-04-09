// zenorm 自动生成文件
// 请不要修改此文件，因为此文件在每次重新生成数据库结构时会被覆盖
// create at: 2023/4/8 19:14:07
// create by: YeFei@DESKTOP-B7B4E7I
// database: zenorm_test
import { QueryParam, createRepositoryQuery } from 'zenorm';
import * as _tables from './_tables';
import _Message from './message';
import _Nonautopk from './nonautopk';
import _Profile from './profile';
import _User from './user';

let _bindQuery: QueryParam;
function _query() { return typeof _bindQuery === 'function' ? _bindQuery() : _bindQuery }
/** 绑定模型 Query 源 */
export function bindQuery(query: QueryParam) { _bindQuery = query; }

export class Message extends _Message {
  /** 使用指定 Query 对象查询 MessageRepository */
  static query = createRepositoryQuery<Message, _tables.MessageTable, number>(Message);
  /** Query 绑定的 MessageRepository */
  static repository = Message.query(_query);
  static of: typeof Message.repository.of = Message.repository.of.bind(Message.repository);
  static find: typeof Message.repository.find = Message.repository.find.bind(Message.repository);
  static findByPk: typeof Message.repository.findByPk = Message.repository.findByPk.bind(Message.repository);
  static getByPk: typeof Message.repository.getByPk = Message.repository.getByPk.bind(Message.repository);
  static count: typeof Message.repository.count = Message.repository.count.bind(Message.repository);
  static exists: typeof Message.repository.exists = Message.repository.exists.bind(Message.repository);
  static create: typeof Message.repository.create = Message.repository.create.bind(Message.repository);
  static createAndGet: typeof Message.repository.createAndGet = Message.repository.createAndGet.bind(Message.repository);
  static save: typeof Message.repository.save = Message.repository.save.bind(Message.repository);
  static update: typeof Message.repository.update = Message.repository.update.bind(Message.repository);
  static delete: typeof Message.repository.delete = Message.repository.delete.bind(Message.repository);
  /** 保存当前实例数据 */
  save() { return Message.repository.save(this); }
  /** 更新当前实例数据 */
  update(data: Partial<Message>) { return Message.repository.update(this, data); }
  /** 删除当前实例数据 */
  delete() { return Message.repository.delete(this); }
}

export class Nonautopk extends _Nonautopk {
  /** 使用指定 Query 对象查询 NonautopkRepository */
  static query = createRepositoryQuery<Nonautopk, _tables.NonautopkTable, number>(Nonautopk);
  /** Query 绑定的 NonautopkRepository */
  static repository = Nonautopk.query(_query);
  static of: typeof Nonautopk.repository.of = Nonautopk.repository.of.bind(Nonautopk.repository);
  static find: typeof Nonautopk.repository.find = Nonautopk.repository.find.bind(Nonautopk.repository);
  static findByPk: typeof Nonautopk.repository.findByPk = Nonautopk.repository.findByPk.bind(Nonautopk.repository);
  static getByPk: typeof Nonautopk.repository.getByPk = Nonautopk.repository.getByPk.bind(Nonautopk.repository);
  static count: typeof Nonautopk.repository.count = Nonautopk.repository.count.bind(Nonautopk.repository);
  static exists: typeof Nonautopk.repository.exists = Nonautopk.repository.exists.bind(Nonautopk.repository);
  static create: typeof Nonautopk.repository.create = Nonautopk.repository.create.bind(Nonautopk.repository);
  static createAndGet: typeof Nonautopk.repository.createAndGet = Nonautopk.repository.createAndGet.bind(Nonautopk.repository);
  static save: typeof Nonautopk.repository.save = Nonautopk.repository.save.bind(Nonautopk.repository);
  static update: typeof Nonautopk.repository.update = Nonautopk.repository.update.bind(Nonautopk.repository);
  static delete: typeof Nonautopk.repository.delete = Nonautopk.repository.delete.bind(Nonautopk.repository);
  /** 保存当前实例数据 */
  save() { return Nonautopk.repository.save(this); }
  /** 更新当前实例数据 */
  update(data: Partial<Nonautopk>) { return Nonautopk.repository.update(this, data); }
  /** 删除当前实例数据 */
  delete() { return Nonautopk.repository.delete(this); }
}

export class Profile extends _Profile {
  /** 使用指定 Query 对象查询 ProfileRepository */
  static query = createRepositoryQuery<Profile, _tables.ProfileTable, number>(Profile);
  /** Query 绑定的 ProfileRepository */
  static repository = Profile.query(_query);
  static of: typeof Profile.repository.of = Profile.repository.of.bind(Profile.repository);
  static find: typeof Profile.repository.find = Profile.repository.find.bind(Profile.repository);
  static findByPk: typeof Profile.repository.findByPk = Profile.repository.findByPk.bind(Profile.repository);
  static getByPk: typeof Profile.repository.getByPk = Profile.repository.getByPk.bind(Profile.repository);
  static count: typeof Profile.repository.count = Profile.repository.count.bind(Profile.repository);
  static exists: typeof Profile.repository.exists = Profile.repository.exists.bind(Profile.repository);
  static create: typeof Profile.repository.create = Profile.repository.create.bind(Profile.repository);
  static createAndGet: typeof Profile.repository.createAndGet = Profile.repository.createAndGet.bind(Profile.repository);
  static save: typeof Profile.repository.save = Profile.repository.save.bind(Profile.repository);
  static update: typeof Profile.repository.update = Profile.repository.update.bind(Profile.repository);
  static delete: typeof Profile.repository.delete = Profile.repository.delete.bind(Profile.repository);
  /** 保存当前实例数据 */
  save() { return Profile.repository.save(this); }
  /** 更新当前实例数据 */
  update(data: Partial<Profile>) { return Profile.repository.update(this, data); }
  /** 删除当前实例数据 */
  delete() { return Profile.repository.delete(this); }
}

export class User extends _User {
  /** 使用指定 Query 对象查询 UserRepository */
  static query = createRepositoryQuery<User, _tables.UserTable, number>(User);
  /** Query 绑定的 UserRepository */
  static repository = User.query(_query);
  static of: typeof User.repository.of = User.repository.of.bind(User.repository);
  static find: typeof User.repository.find = User.repository.find.bind(User.repository);
  static findByPk: typeof User.repository.findByPk = User.repository.findByPk.bind(User.repository);
  static getByPk: typeof User.repository.getByPk = User.repository.getByPk.bind(User.repository);
  static count: typeof User.repository.count = User.repository.count.bind(User.repository);
  static exists: typeof User.repository.exists = User.repository.exists.bind(User.repository);
  static create: typeof User.repository.create = User.repository.create.bind(User.repository);
  static createAndGet: typeof User.repository.createAndGet = User.repository.createAndGet.bind(User.repository);
  static save: typeof User.repository.save = User.repository.save.bind(User.repository);
  static update: typeof User.repository.update = User.repository.update.bind(User.repository);
  static delete: typeof User.repository.delete = User.repository.delete.bind(User.repository);
  /** 保存当前实例数据 */
  save() { return User.repository.save(this); }
  /** 更新当前实例数据 */
  update(data: Partial<User>) { return User.repository.update(this, data); }
  /** 删除当前实例数据 */
  delete() { return User.repository.delete(this); }
}