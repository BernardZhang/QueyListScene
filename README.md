### 查询列表组件
主要用于查询列表页面场景，主要包括三部分: 表单查询、操作工具栏、表格数据展示。组件特点：
- 标签结构化、语义化，提高代码可读性
- 样式统一，方便统一维护升级
- 数据状态管理 + 通用逻辑涵盖(如Loading、分页、切换页码、查询、重置、自动轮询等)

### 代码演示

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Popconfirm, Divider} from 'antd';
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
        dataIndex: 'name'
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


ReactDOM.render(
    <QueryListScene query={query} actions={actions} interval={3000}>
        <QueryForm title="项目管理">
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
        </QueryForm>
        <Toolbar>
            <Button type="primary">新增</Button>
            <Button type="warning">删除</Button>
        </Toolbar>
        <QueryList
            bordered={false}
            columns={columns}
            top={480}
            scroll={{ y: window.innerHeight - 480 }}
        />
    </QueryListScene>,
    document.getElementById('root')
)
```


### API
#### QueryListScene
|属性名称|属性说明|类型|默认值|是否必须|
|--|--|--|--|--|
|query|查询数据方法,调用时会把queryform数据作为参数|Promise|无|是|
|actions|组件上聚合的方法，需由createActions方法创建出来|Object|无|否|
|interval|轮训时间间隔单位ms，设置该值后列表可自动轮询|number|无|否|
|className|css类|string|无|否|

#### QueryForm
|属性名称|属性说明|类型|默认值|是否必须|
|--|--|--|--|
|title|标题|string|无|否|否|

#### Field
|属性名称|属性说明|类型|默认值|是否必须|
|--|--|--|--|
|name|表单项名，保证唯一|string|无|是|
|title|表单label|string|无|否|
|type|表单类型string、number、select、date|无|否|
|props|表单元素属性，参照antd, Input, InputNumber, Select, DatePicker|Object|无|否|

#### Toolbar
无

#### QueryList
同antd Table

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
    search: (params?: Object, showLoading?: boolean = true)
}
```




