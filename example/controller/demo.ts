import { Context, mapping } from "zenweb";
import { fields } from '@zenweb/form';
import moment from 'moment';
import { GridBase } from "../../src/index.js";
import { User } from "../model/index.js";

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
    this.column("id").label("ID").sortable().width(80);

    this.column("name").label("姓名").width(100).element((row, td) => {
      td.style({ color: 'red' });
      return row.name;
    });

    // this.column("profile.edu").label("教育");

    this.column("birthday").label("生日").width(150).data(row =>
      row.birthday ? moment(row.birthday).format("YYYY-MM-DD") : "无"
    );

    this.column("created_at").label("注册日期").sortable().data(row => moment(row.created_at).format("YYYY/M/D H:mm"));

    // 自定义数据列元素
    this.column("auth").select(false).element((row, td) => {
      td.class('aaa', 'ccc', '', { bbb: true, ccc: false }).style({ backgroundColor: 'rgba(75,173,58,0.30)' });
      return [
        '自定义数据列元素',
        this.createElement('span').style({ fontWeight: 'bold' }).append('粗体'),
      ];
    });

    // 数据列子元素
    this.column("actions").select(false).element(row => [
      this.createElement('a').attr('href', `/edit/${row.id}`).append('编辑'),
    ]);

    // 数据过滤器定义
    this.filter("age", fields.select('int').label("年龄段").choices([
      { label: "毛蛋", value: 0 },
      { label: "少年", value: 1 },
      { label: "壮年", value: 2 },
      { label: "中年", value: 3 },
      { label: "老年", value: 4 },
    ]).default(1)).where(value => value ? [
      { birthday: ageRange(0, 18) },
      { birthday: ageRange(18, 40) },
      { birthday: ageRange(18, 40) },
      { birthday: ageRange(40, 55) },
      { birthday: ageRange(55, 100) },
    ][value] : undefined);

    this.filter("created_at", fields.dateRange('date[]').label("注册日期"))
    .where(value => ({ created_at: { $between: value } }));

    this.filter("bd", fields.date('date').label('生日'))
    .where(value => (value ? { birthday: value } : undefined));

    this.filter("search", fields.text('trim1').label("关键词搜索"))
    .where((value) => ({ name: { $like: `%${value}%` } }));

    this.filter("cas", fields.cascader('?int[]').label("级连选择").max(3).choices([
      { label: "第一层", value: 1 },
      { label: "第二层1", value: 2, parent: 1 },
      { label: "第二层2", value: 22, parent: 1 },
      { label: "第二层3", value: 23, parent: 1 },
      { label: "第二层4", value: 24, parent: 1 },
      { label: "第二层5", value: 25, parent: 1 },
    ])).where(() => {
      console.log('查询处理');
      return {};
    });

    this.filter("ms", fields.multiple('?int[]').label("多选").choices([
      { label: "aaa", value: 1 },
      { label: "bbb", value: 2 },
      { label: "ccc", value: 3 },
      { label: "ddd", value: 4 },
    ]).max(5)).where((v) => {
      console.log('多选结果:', v);
      return {};
    });

    // 设置默认排序
    this.setOrder("-id");

    // 自定义数据行元素
    this.rowElement((row, tr) => tr
      .style({ backgroundColor: (row.id || 0) % 4 ? undefined : 'rgba(100, 0, 0, 0.2)' })
      .class((row.id || 0) % 3 ? 'red' : false)
    );
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

  @mapping()
  test() {
    return User.find().limit(10).all();
  }
}
