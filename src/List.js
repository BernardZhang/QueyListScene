/**
 * @file QueryList
 * @author you.zhang
 */
import React from 'react';
import { Table, Spin } from 'antd';
import { get } from 'lodash';
import styled from 'styled-components';

export default styled(class QueryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dataSource: [],
            pagination: {
                pageSize: 20,
                current: 1,
                total: 0
            },
            scroll: props.scroll
        };

        const {actions} = props;
        actions.on('search', this.onSearch);
        actions.on('setTableDataSource', this.updateDataSource);
        actions.on('setPagination', this.updatePagination);
    }

    render() {
        const {
            columns,
            children,
            pagination,
            localPagination = false,
            className = '',
            ...rest
        } = this.props;
        const {
            dataSource,
            loading,
            expandedRowKeys = [],
            scroll
        } = this.state;
        const hasPagination = typeof pagination !== 'undefined' ? pagination : true;
        const paginaionInfo = {
            ...this.state.pagination,
            showSizeChanger: true,
            showTotal: total => `总共 ${total} 条`,
            // onChange: this.onPageChange,
            // onShowSizeChange: this.onPageSizeChange

        };
        const expandProps = {
            ...(rest.defaultExpandAllRows ? {
                expandedRowKeys,
                onExpandedRowsChange: this.onExpandedRowsChange
            } : {})
        };

        return (
            <div className={`query-list-scene-list ${className}`}>
                <Spin spinning={loading}>
                    <Table
                        size='middle'
                        {...expandProps}
                        {...rest}
                        {...(columns ? {
                            columns
                        } : {})}
                        scroll={scroll}
                        dataSource={dataSource}
                        pagination={hasPagination ? paginaionInfo : localPagination}
                        onChange={this.onTableChange}
                    >
                        {!columns && children}
                    </Table>
                </Spin>
            </div>
            );
    }

    onWindowResize = () => {
        const {scroll} = this.state;

        this.setState({
            scroll: {
                ...scroll,
                y: window.innerHeight - (this.props.top || 200)
            }
        });
    }

    componentDidMount() {
        const {qlsProps, actions} = this.props;

        this.fetchData(actions.getFormData()).finally(() => {
            // 轮询
            if (qlsProps.interval) {
                const doIntervalQuery = ms => {
                    this.timmer = setTimeout(() => {
                        // 如果有查询请求还未结束，则该次轮询不执行，重新设置下次轮询
                        if (!this.isFetching) {
                            this.fetchData(actions.getFormData(), {
                                isInterval: true,
                                showLoading: false
                            }).then(() => {
                                doIntervalQuery(ms);
                            });
                        }
                        else {
                            doIntervalQuery(ms);
                        }
                    }, ms);
                };
                doIntervalQuery(qlsProps.interval);
            }

        });

        if (this.state.scroll) {
            window.addEventListener('resize', this.onWindowResize);
        }
    }

    componentWillUnmount() {
        const { actions } = this.props;

        actions.removeListener('search', this.onSearch);
        actions.removeListener('setTableDataSource', this.updateDataSource);
        actions.removeListener('setPagination', this.updatePagination);
        window.removeEventListener('resize', this.onWindowResize);
        this.timmer && clearTimeout(this.timmer);
    }

    fetchData = (params = {}, {
            callback,
            showLoading = true,
            isInterval
        } = {}) => {
        const {
            qlsProps: {query},
            defaultExpandAllRows,
            rowKey,
            actions
        } = this.props;
        const {pagination} = this.state;
        const hasPagination = this.props.pagination !== false;

        if (hasPagination) {
            params = {
                pageSize: pagination.pageSize,
                current: pagination.current,
                ...params
            };
        }

        showLoading && this.setState({
            loading: true
        });

        // 当用户操作查询还未得到服务端响应前,不要执行轮询请求时序问题导致覆盖
        if (!isInterval) {
            this.isFetching = true;
        }

        return query(params)
            .then(result => {
                const dataSource = hasPagination ? result.data || [] : result;

                this.setState(
                    {
                        loading: false,
                        dataSource,
                        pagination: hasPagination ? {
                            pageSize: result.pageSize || pagination.pageSize || 10,
                            current: result.current || params.current || pagination.current || 1,
                            total: result.total || 0
                        } : null,
                        ...(defaultExpandAllRows ? {
                            expandedRowKeys: dataSource.map(row => row[rowKey])
                        } : {})
                    },
                    () => {
                        actions.setData('pagination', this.state.pagination);
                        actions.setData('dataSource', this.state.dataSource);
                    }
                );
            })
            .finally(() => {
                this.isFetching = false;
                showLoading && this.setState({
                    loading: false
                });
                callback && callback();
            });
    };

    updateDataSource = dataSource => {
        this.setState({
            dataSource
        });
    };

    updatePagination = pagination => {
        this.setState({
            pagination
        });
    }

    onSearch = (values, {callback, showLoading = true} = {}) => {
        this.formData = {
            ...this.formData,
            ...values
        };
        this.props.actions.setData('formData', this.formData);
        return this.fetchData(this.formData, {callback, showLoading});
    };

    // onPageChange = (current, pageSize) => {
    //     this.fetchData({
    //         ...this.formData,
    //         pageSize,
    //         current
    //     });
    // }

    // onPageSizeChange = (current, pageSize) => {
    //     this.fetchData({
    //         ...this.formData,
    //         pageSize,
    //         current
    //     });
    // }

    onTableChange = (pagination, filters, sorter) => {
        const { actions, localPagination } = this.props;

        // 排序变化暂时不处理，因为有时可能是前端sorter不需要走请求
        // 所以暂时排序有使用者自己处理
        if (!sorter.columnKey && !localPagination) {
            this.fetchData({
                ...this.formData,
                pageSize: pagination.pageSize,
                current: pagination.current,
                ...filters,
                ...sorter
            });
        }

        const { dataSource, pagination: paginaionInfo } = this.state;

        // 前端本地分页
        if (localPagination) {
            this.setState(
                {
                    dataSource,
                    pagination: {
                        ...paginaionInfo,
                        ...pagination
                    }
                },
                () => {
                    actions.setData('pagination', this.state.pagination);
                    // actions.setData('dataSource', this.state.dataSource);
                }
            );
        }
    };
})`
    background: #fff;

    .ant-table-pagination.ant-pagination {
        width: 100%;
        text-align: right;
        margin-bottom: 0;
        padding: 15px 0;
        background: #fff;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        bottom: 0;
        margin-top: 0;
        z-index: 1;
    }
`;

// hooks
// import React, { useState, useEffect } from "react";
// import { Table } from "antd";

// export default props => {
//     const { columns, children, eventEmitter, qlsProps: { query } } = props;
//     const [dataSource, setDataSource] = useState([]);
//     const [pagination, setPagination] = useState({
//         pageSize: 10,
//         current: 1,
//         total: 0
//     });
//     let formData = {};
//     const fetchData = params => {
//         query({
//             pageSize: pagination.pageSize,
//             current: pagination.current,
//             ...params
//         }).then(result => {
//             setDataSource(result.data || []);
//             setPagination({
//                 pageSize: result.pageSize || 10,
//                 current: result.current || 1,
//                 total: result.total || 0
//             })
//         });
//     };
//     const onSearch = values => {
//         formData = values;
//         fetchData(formData);
//     };
//     const onTableChange = (pagination, filters, sorter) => {
//         console.log("onTableChange", pagination, filters, sorter);
//         // fetchData({

//         // });
//     };

//     useEffect(() => {
//         console.log("useEffect...");
//         // fetchData(formData);
//         eventEmitter.on("search", onSearch);
//     });

//     return (
//         <div className="query-list-scene-list page-global-body">
//             <div className="page-global-body-main">
//                 <Table
//                     {...(columns ? { columns } : {})}
//                     dataSource={dataSource}
//                     pagination={pagination}
//                     onTableChange={onTableChange}
//                 >
//                     {!columns && children}
//                 </Table>
//             </div>
//         </div>
//     );
// };
