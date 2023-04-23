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
    this.column("id").label("ID").sortable().width(50);

    this.column("name").label("姓名").width(100).dataElement(row => this.createElement().style({ color: 'red' }));

    // this.column("profile.edu").label("教育");

    this.column("birthday").label("生日").width(100).data(row =>
      row.birthday ? moment(row.birthday).format("YYYY-MM-DD") : "无"
    );

    this.column("created_at").label("注册日期").sortable().data(row => moment(row.created_at).format("YYYY/M/D H:mm"));

    // 自定义数据列元素
    this.column("auth", false).dataElement(row => this.createElement()
    .class('aaa', 'ccc', '', { bbb: true, ccc: false })
    .style({ backgroundColor: 'rgba(75,173,58,0.30)' }).append('自定义数据列元素'));

    // 数据列子元素
    this.column("actions", false).dataElement(row => [
      this.createElement('a').attr('href', `/edit/${row.id}`).append('编辑'),
    ]);

    // 数据过滤器定义
    this.filter("age", 'int').where(value => [
      { birthday: ageRange(0, 18) },
      { birthday: ageRange(18, 40) },
      { birthday: ageRange(18, 40) },
      { birthday: ageRange(40, 55) },
      { birthday: ageRange(55, 100) },
    ][value]).widget(widgets.select("年龄段").choices([
      { label: "毛蛋", value: 0 },
      { label: "少年", value: 1 },
      { label: "壮年", value: 2 },
      { label: "中年", value: 3 },
      { label: "老年", value: 4 },
    ]));

    this.filter("created_at", 'trim1[]')
    .where(value => ({ created_at: { $between: value } }))
    .widget(widgets.dateRange("注册日期").end(new Date().toDateString()));

    this.filter("search", 'trim1')
    .where((value) => ({ name: { $like: `%${value}%` } }))
    .widget(widgets.text("关键词搜索"));

    this.filter("cas", 'int').where(() => {
      console.log('查询处理');
      return {};
    }).widget(widgets.cascader("级连选择").choices([
      { label: "第一层", value: 1 },
      { label: "第二层", value: 2, parent: 1 },
    ]));

    // 设置默认排序
    this.setOrder("-id");

    // 自定义数据行元素
    this.setDataRowElement(row => this.createElement()
    .style({ backgroundColor: (row.id || 0) % 4 ? undefined : 'rgba(100, 0, 0, 0.2)' }));
  }
}

export class DemoController {
  /**
   * 服务器端 html 渲染
   */
  @mapping()
  async index(ctx: Context, grid: UserGrid) {
    ctx.template('grid.html.njk');
    return {
      grid: await grid.fetch(User.find()),
    };
  }

  /**
   * 前后分离接口输出
   */
  @mapping()
  async grid(grid: UserGrid) {
    return await grid.fetch(User.find());
  }
}
