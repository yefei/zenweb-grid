# zenweb-grid
 
服务端控制前端表格渲染

功能特色:
- 服务器端控制
- 数据过滤
- 数据排序
- 分页处理
- 前后分离设计
- 多种前端渲染支持
- 快速构建产品

## 安装

```bash
$ npm i @zenweb/grid @zenweb/form
```

## 数据格式说明

### 请求格式

```ts
{
  includes?: 'filter,head,page,data,query', // 返回时需要饱含的数据项, 如果无则返回所有项
  limit?: 100, // 返回条数限制
  offset?: 0, // 数据起始位置或使用 page 参数
  page?: 1, // 第几页或使用 offset 参数
  order?: '-id', // 排序规则， 字段名称, 负号开头则代表倒序，无开头正序
  f_aaa?: '123', // 表单过滤字段
}
```

## 服务端 html 渲染

### 安装

```bash
yarn add @zenweb/template @zenweb/template-nunjucks
```

### 配置

`src/index.ts`

```ts
import { create } from 'zenweb';
import modForm, { formTemplate } from '@zenweb/form';
import modGrid, { gridTemplate } from '@zenweb/grid';
import modTemplate from '@zenweb/template';
import nunjucks from '@zenweb/template-nunjucks';

create()
.setup(modForm())
.setup(modGrid())
.setup(modTemplate({
  engine: nunjucks({
    path: [
      './template', // 项目模板文件夹
      formTemplate, // 过滤表单需要使用
      gridTemplate, // 数据表格渲染模板
    ],
  }),
}))
.start();
```

### 使用

`src/controller/demo.ts`

```ts
import { Context, mapping } from "zenweb";
import { widgets } from '@zenweb/form';
import * as moment from 'moment';
import { GridBase } from "@zenweb/grid";
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

    this.column("name").label("姓名").width(100);

    // this.column("profile.edu").label("教育");

    this.column("birthday").label("生日").width(100).data(row =>
      row.birthday ? moment(row.birthday).format("YYYY-MM-DD") : "无"
    );

    this.column("created_at").label("注册日期").sortable().data(row => moment(row.created_at).format("YYYY/M/D H:mm"));

    // 自定义数据列元素
    this.column("auth", false).dataElement(row => this.createElement()
    .class('aaa', 'ccc', '', { bbb: true, ccc: false })
    .style({ backgroundColor: 'rgba(75,173,58,0.30)' }).append('数据列元素属性演示'));

    // 数据列子元素
    this.column("actions", false).dataElement(row => [
      this.createElement('a').attr('href', `/edit/${row.id}`).append('编辑'),
    ]);

    // 数据过滤器定义
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

    // 设置默认排序
    this.setOrder("-id");
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
```

`template/grid.html.njk`

```nunjucks
{% from "zenweb/form/macro.html.njk" import formStyle, formScript -%}
{% from "zenweb/grid/macro.html.njk" import gridRender, gridStyle, gridScript -%}

<html>
  <head>
    <title>zenweb grid demo</title>
    {{formStyle()}}
    {{gridStyle()}}
  </head>
  <body>
    {{gridRender(grid)}}

    {{formScript()}}
    {{gridScript()}}
  </body>
</html>
```

## 前后分离渲染

[@zenweb/grid-vue-element](https://www.npmjs.com/package/@zenweb/grid-vue-element)
