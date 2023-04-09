// zenorm 自动生成文件
// 请不要修改此文件，因为此文件在每次重新生成数据库结构时会被覆盖
// create at: 2023/4/8 19:14:07
// create by: YeFei@DESKTOP-B7B4E7I
// database: zenorm_test

export class MessageTable {
  static columns = ["id","user_id","content"];
  /**
   * type: int(11)
   * collation: null
   * null: NO
   * default: null
   * extra: auto_increment
   */
  id?: number;
  /**
   * type: int(11)
   * collation: null
   * null: NO
   * default: null
   */
  user_id!: number;
  /**
   * type: varchar(255)
   * collation: utf8_general_ci
   * null: YES
   * default: null
   */
  content?: string | null;
}

export class NonautopkTable {
  static columns = ["id","name"];
  /**
   * type: int(11)
   * collation: null
   * null: NO
   * default: null
   */
  id!: number;
  /**
   * type: varchar(255)
   * collation: utf8_general_ci
   * null: YES
   * default: null
   */
  name?: string | null;
}

export class ProfileTable {
  static columns = ["id","user_id","edu","work"];
  /**
   * type: int(11)
   * collation: null
   * null: NO
   * default: null
   * extra: auto_increment
   */
  id?: number;
  /**
   * type: int(11)
   * collation: null
   * null: NO
   * default: null
   */
  user_id!: number;
  /**
   * type: varchar(255)
   * collation: utf8_general_ci
   * null: YES
   * default: null
   */
  edu?: string | null;
  /**
   * type: varchar(255)
   * collation: utf8_general_ci
   * null: YES
   * default: null
   */
  work?: string | null;
}

export class UserTable {
  static columns = ["id","name","birthday","type"];
  /**
   * type: int(11)
   * collation: null
   * null: NO
   * default: null
   * extra: auto_increment
   */
  id?: number;
  /**
   * type: varchar(255)
   * collation: utf8_general_ci
   * null: NO
   * default: null
   */
  name!: string;
  /**
   * type: date
   * collation: null
   * null: YES
   * default: null
   */
  birthday?: Date | null;
  /**
   * type: enum('1','2','3')
   * collation: utf8_general_ci
   * null: YES
   * default: null
   */
  type?: '1' | '2' | '3' | null;
}
