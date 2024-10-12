// zenorm 自动生成文件
// 请不要修改此文件，因为此文件在每次重新生成数据库结构时会被覆盖
// create at: 2024/10/12 09:46:26
// create by: yefei@-
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

  constructor(data?: object) {
    data && Object.assign(this, data);
  }
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

  constructor(data?: object) {
    data && Object.assign(this, data);
  }
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

  constructor(data?: object) {
    data && Object.assign(this, data);
  }
}

export class UserTable {
  static columns = ["id","name","birthday","type","isbool","point","created_at","updated_at"];
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
  /**
   * type: tinyint(1)
   * collation: null
   * null: YES
   * default: null
   */
  isbool?: boolean | null;
  /**
   * type: point
   * collation: null
   * null: YES
   * default: null
   */
  point?: { x: number, y: number } | null;
  /**
   * type: datetime
   * collation: null
   * null: NO
   * default: CURRENT_TIMESTAMP
   */
  created_at?: Date;
  /**
   * type: datetime
   * collation: null
   * null: NO
   * default: CURRENT_TIMESTAMP
   * extra: on update CURRENT_TIMESTAMP
   */
  updated_at?: Date;

  constructor(data?: object) {
    data && Object.assign(this, data);
  }
}
