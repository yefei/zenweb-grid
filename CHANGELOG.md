# Changelog

## [4.7.0] - 2023-5-18
- dataElement 改名 element
- . 分割列不进行拆分
- element 列只输出 element, 并且在 data 中追加 @el 用以区分是否为 element 类型

## [4.6.1] - 2023-5-18
- fix: console.log

## [4.6.0] - 2023-5-17
- 使用 Bootstrap 样式

## [4.5.0] - 2023-4-23
- 适配: @zenweb/form@5.2.2

## [4.4.0] - 2023-4-23
- 适配: @zenweb/form@5.1.0

## [4.3.0] - 2023-4-14
- 适配: @zenweb/form@4.5.0
- 修改: FetchType 区分 filter-form, filter-data, filter-input

## [4.2.0] - 2023-4-13
- 更新: 列元素自定义从 data 中分离为独立的 dataElement 列表，不影响原始数据输出
- 新增: 支持数据行元素自定义

## [4.1.0] - 2023-4-13
- 新增 element 元素支持，可以自定义列元素属性子元素
- Grid<D> 数据结构泛型支持
- Column.sortable 支持 false 参数关闭排序
- Column.select 支持 false 参数关闭 select
- Column.dataElement 方法支持设置数据 td 元素
- Grid.column 方法增加参数可以快捷关闭 select
- Element 增加 class, style 方法可以快捷设置样式表和样式
- 分离 Element 为独立项目 element-easy-builder

## 4.0.3
- html 渲染使用 page=页 分页

## 4.0.2
- setLimit 使用 PageLimitOption
- html 表格列 align

## 4.0.1
- pageLimit 参数默认不设置使用全局 page 参数

## 4.0.0
- 重构，内置服务端 html 渲染模板

## 3.1.2
- update: WhereFunc 允许返回 undefined

## 3.1.1
- fix: inject 作用域错误

## 3.1.0
- 更新兼容 zenweb@3.11.0
