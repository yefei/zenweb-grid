import { Context, mapping } from "zenweb";
import { widgets } from '@zenweb/form';
import * as moment from 'moment';
import { GridBase } from "../../src";
import { User } from "../model";

function ageRange(min: number, max: number) {
  return {
    $between: [
      moment().subtract(max, "y").format("YYYY-MM-DD"),
      moment().subtract(min, "y").format("YYYY-MM-DD"),
    ],
  };
}

class UserGrid extends GridBase<User> {
  setup() {
    this.column("id").label("ID").sortable().width(50).align('right');
    this.column("name").label("姓名").width(100);
    // this.column("profile.edu").label("教育");
    this.column("birthday").label("生日").width(100).data(row =>
      row.birthday ? moment(row.birthday).format("YYYY-MM-DD") : "无"
    );
    this.column("created_at").label("注册日期").sortable().data(row => moment(row.created_at).format("YYYY/M/D H:mm"));

    // 操作项
    this.column("actions").select().dataElement(row => [
      this.createElement('a').attr('href', row => `/edit/${row.id}`).content('编辑'),
    ]);

    // filters
    this.filter("age", {
      type: 'int',
      widget: widgets.select("年龄段").choices([
        { label: "毛蛋", value: 0 },
        { label: "少年", value: 1 },
        { label: "壮年", value: 2 },
        { label: "中年", value: 3 },
        { label: "老年", value: 4 },
      ]),
    }).where(value => [
      { birthday: ageRange(0, 18) },
      { birthday: ageRange(18, 40) },
      { birthday: ageRange(18, 40) },
      { birthday: ageRange(40, 55) },
      { birthday: ageRange(55, 100) },
    ][value]);
    this.filter("created_at", {
      type: 'string',
      widget: widgets.dateRange("注册日期").end(new Date().toDateString())
    }).where(value => ({ created_at: { $between: value } }));
    this.filter("search", {
      type: 'trim1',
      widget: widgets.text("关键词搜索")
    }).where((value) => ({ name: { $like: `%${value}%` } }));
    this.filter("cas", {
      type: 'int',
      widget: widgets.cascader("级连选择").choices([
        { label: "第一层", value: 1 },
        { label: "第二层", value: 2, parent: 1 },
      ])
    }).where(() => {
      console.log('查询处理');
      return {};
    });
    this.setOrder("-id");
  }
}

export class DemoController {
  @mapping()
  async index(ctx: Context, grid: UserGrid) {
    ctx.template('grid.html.njk');
    return {
      grid: await grid.fetch(User.find()),
    };
  }

  @mapping()
  async grid(grid: UserGrid) {
    return await grid.fetch(User.find());
  }
}
