# zenweb-grid
 
服务端控制前端表格渲染

配套前端渲染项目: [@zenweb/grid-vue-element](https://www.npmjs.com/package/@zenweb/grid-vue-element)

## 安装

```bash
$ npm i @zenweb/grid
```

## 数据格式说明

### 请求格式

```js
{
  includes: 'filter,columns,page,data', // 返回时需要饱含的数据项, 如果无则返回所有项
  limit: 100, // 返回条数限制
  offset: 0, // 数据起始位置
  order: '-id', // 排序规则， 字段名称, 负号开头则代表倒序，无开头正序
  f_aaa: '123', // 表单过滤
}
```

### 返回格式

```js
{
  // 过滤表单
  filterForm: {
    // 表单字段
    fields: {
      // 字段项
      // 名称: 字段选项
      f_aaa: {
        name: 'Input', // 控件名称，用于前端渲染，目前支持名称见下表
        label?: '字段显示名称',
        help?: '帮助信息',
        choices?: [ // 选择项, 在控件是 Select Multiple Cascader 时出现
          {
            label: '显示名称',
            value: 1, // 选项值
            unselectable?: false, // 不可选择项, Cascader 专有
            parent?: 2, // 父项, Cascader 专有
          }
        ],
        format?: 'YYYY-MM-DD', // 日期格式, DateRange, Date 专有
        start?: '2020-1-1', // 开始日期 DateRange 专有
        end?: '2020-2-2', // 结束日期 DateRange 专有
        action?: 'https://a.com', // 上传地址, upload 控件
        limit?: 1, // 上传数量限制, upload 控件
      }
    },
    // 表单字段顺序
    layout: [
      'f_aaa', 'f_bbb'
    ]
  },
  // 当过滤表单验证出错时
  filterErrors?: {
    // 字段名: 错误信息
    f_aaa: '错误信息',
  },
  // 列信息
  columns: [
    key: 'id', // 键名
    label?: '显示名',
    sortable?: true, // 是否可排序
    width?: 120, // 宽度
    align?: 'left' | 'center' | 'right', // 对齐方式
  ],
  // 数据结果
  data: [
    { id: 1, name: 'test' }, // 数据库返回结果行
  ],
  // 分页信息
  page: {
    total: 100, // 总条数
    limit: 10, // 本次返回限制条数
    maxLimit: 20, // 最大返回限制条数
    offset: 0, // 数据起始位置
    order: '-id', // 本次排序规则
  }
}
```

### 前端渲染包
#### @zenweb/grid-vue-element

##### 可用控件
| 名称 | 说明 |
| ---- | ---- |
| Input | 文本输入框,服务端返回无法匹配时默认的控件 |
| Text | 文本输入框+搜索按钮 |
| Select | 单选 |
| Multiple | 多选 |
| DateRange | 日期范围选择器 ｜
| Date ｜ 日期选择器 |
| Cascader | 级连选择器 |
