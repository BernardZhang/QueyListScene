### 查询列表组件
主要用于查询列表页面场景，主要包括三部分: 表单查询、操作工具栏、表格数据展示。组件特点：
- 标签结构化、语义化，提高代码可读性
- 样式统一，方便统一维护升级
- 数据状态管理 + 通用逻辑涵盖(如Loading、分页、切换页码、查询、重置、自动轮询等)

### 安装
```
npm install querylistscnene --save
```

### 运行demo
```
git clone https://github.com/BernardZhang/QueyListScene.git
npm install
npm run start
```

### 代码演示

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Popconfirm, Divider, Icon, ButtonGroup} from 'antd';
import QueryListScene from './src';
import 'antd/dist/antd.css';

const { QueryForm, Field, Toolbar, QueryList, createActions } = QueryListScene;
const actions = createActions();

const ColumnActions = ({ record }) => {
    const onDelete = () => {
        new Promise(resolve => {
            resolve(true);
        }).then(() => {
            actions.search();
        });
    };

    return (
        <span>
            <a>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
                title="删除确认"
                onConfirm={onDelete}
                okText="确认"
                cancelText="取消"
            >
                <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a
                download
                target="__blank"
                href={`/download?id=${record.id}`}
            >
                下载
            </a>
        </span>
    );
};

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 60
    },
    {
        title: '项目名称',
        dataIndex: 'name',
        sorter: (a, b) => a.name > b.name
    },
    {
        title: '管理员',
        dataIndex: 'owner',
        width: 100
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 200
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: 100
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: 150,
        render: (val, record) => <ColumnActions record={record} />
    }
];
const query = ({ current = 1, pageSize, ...rest }) => {
    console.log('query', { current, pageSize, rest });
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                current,
                pageSize,
                total: 100,
                data: new Array(100).fill(1).map(
                    (item, index) => ({
                        id: index + 1,
                        name: `项目${index + 1}`,
                        owner: `张三${index + 1}`,
                        createTime: '2019-09-10 16:30:34',
                        status: ['初始化', '运行中', '成功', '失败'][index % 4]
                    })
                ).slice((current - 1) * pageSize, current * pageSize)
            });
        }, 500);
    });
};

const ExtralActions = (
    <Button.Group>
      <Button size="small" icon="import" />
      <Button size="small" icon="export" />
      <Button size="small" icon="setting" />
    </Button.Group>
);
// scroll={{ y: window.innerHeight - 480 }}

ReactDOM.render(
    <QueryListScene
        title="项目管理"
        query={query}
        actions={actions}
        interval={300000}
    >
        <QueryForm extralActions={ExtralActions}>
            <Field type="string" name="name" props={{ placeholder: "名称" }} />
            <Field type="date" name="date" />
            <Field
                type="select"
                name="select"
                props={{
                    placeholder: '状态',
                    options: ['初始化', '运行中', '成功', '失败']
                }}
            />
            <Field type="string" name="name1" props={{ placeholder: "名称" }} />
            <Field type="date" name="date1" />
            <Field
                type="select"
                name="select1"
                props={{
                    placeholder: '状态',
                    options: ['初始化', '运行中', '成功', '失败']
                }}
            />
            <Field type="string" name="name2" props={{ placeholder: "名称" }} />
            <Field type="date" name="date2" />
            <Field
                type="select"
                name="select2"
                props={{
                    placeholder: '状态',
                    options: ['初始化', '运行中', '成功', '失败']
                }}
            />
        </QueryForm>
        <Toolbar>
            <Button type="primary">新增</Button>
            <Button type="warning">删除</Button>
        </Toolbar>
        <QueryList
            bordered={false}
            columns={columns}
            top={480}
            // pagination={false}
            // localPagination={true}
        />
    </QueryListScene>,
    document.getElementById('root')
)
```


### API
#### QueryListScene

|属性名称|属性说明|类型|默认值|是否必须|
|:--|:--|:--|:--|:--|
|query|查询数据方法,调用时会把queryform数据作为参数|Promise|无|是|
|title|标题|string|无|否|
|actions|组件上聚合的方法，需由createActions方法创建出来|Object|无|否|
|interval|轮训时间间隔单位ms，设置该值后列表可自动轮询|number|无|否|
|className|css类|string|无|否|

#### QueryForm
|属性名称|属性说明|类型|默认值|是否必须|
|:--|:--|:--|:--|:--|
|title|标题|string|无|否|
|extralActions|额外操作|ReactNode|无|否|

#### Field
|属性名称|属性说明|类型|默认值|是否必须|
|:--|:--|:--|:--|:--|
|name|表单项名，保证唯一|string|无|是|
|title|表单label|string|无|否|
|type|表单类型string、number、select、date|无|否|
|props|表单元素属性，参照antd, Input, InputNumber, Select, DatePicker|Object|无|否|

#### Toolbar
无

#### QueryList
同antd Table
|属性名称|属性说明|类型|默认值|是否必须|
|:--|:--|:--|:--|:--|
|localPagination|前端分页，数据一次性从接口获取，前端分页时使用|boolean|false|否|


#### createActions
```
const { createActions } = QueryListScene;
const actions = createActions();

actions对象接口如下：
{
    // 设置查询表单数据（自动查询）
    setFormData: (data: Object),
    // 设置表格数据
    setTableDataSource: (dataSource: Array),
    // 设置分页数据
    setPagination: (
        pagination: Object = {
            current,
            pageSize,
            total
        }
    ),
    // 查询列表, params 为查询参数，会扩展到formData上, showLoading：是否显示loading
    search: (params?: Object, showLoading?: boolean = true),

    // 获取表单数据，name不传则是整个表单数据对象，传了name则获取单个表单值
    getFormData: (name?: string),
    // 获取列表数据
    getTableDataSource: (),
    // 获取分页数据
    getPagination: ()
}
```