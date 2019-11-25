import React, { createRef } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Form, Button } from 'antd';
import { get } from 'lodash';

const QueryFormWraper = styled.div`
    display: flex;

    .ant-form {
        display: inline-block;
        margin-bottom: 12px;
        display: flex;

        flex: 1;

        & > div:nth-child(1) {
            height: 32px;
            overflow: hidden;
        }

        &.expanded {
            & > div:nth-child(1) {
                height: auto;
            }
        }

        &.showMore {
            & > div:nth-child(1) {
                .ant-form-item {
                    margin-bottom: 12px;
                }
            }
        }

        & > div:nth-child(2) {
            display: flex;
        }

        & > * {
            &:not(:last-child) {
                margin-right: 10px;
            }
        }

        .ant-form-item-control {
            min-width: 170px;
            line-height: 32px;
        }
    }
`;

const Title = styled.span`
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    line-height: 32px;
`;

const ExtralActions = styled.div`
    line-height: 32px;
    & > * {
        margin-left: 8px;
    }
`;

@Form.create()
export default class QueryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMore: false,
            expanded: false
        };
        this.fieldsRef = createRef();
        props.actions.on('setFormData', this.setFormData);
    }

    render() {
        const {
            title,
            children,
            className = '',
            form,
            extralActions
        } = this.props;
        const { expanded, showMore } = this.state;

        return (
            <QueryFormWraper className={className}>
				{
                    title && <Title>{title}</Title>
                }
				<Form layout="inline" className={classnames({expanded: !showMore || expanded, showMore })}>
                    <div ref={this.fieldsRef}>
                        {
                            React.Children.map(
                                children,
                                child => (
                                    child && get(child, 'props.align') !== 'right' && React.cloneElement(child, {
                                        form
                                    })
                                )
                            )
                        }
                    </div>
                    <div>
                        {
                            showMore && (
                                <Button type="link" onClick={this.onToggleExpand}>
                                    {expanded ? '收起' : '展开'}
                                </Button>
                            )
                        }
                        <Button type="primary" onClick={this.onSubmit}>
                            查询
                        </Button>
                        <Button type="link" onClick={this.onReset}>重置</Button>
                        {
                            React.Children.map(
                                children,
                                child => (
                                    child && get(child, 'props.align') === 'right' && React.cloneElement(child, {
                                        form
                                    })
                                )
                            )
                        }
                    </div>
				</Form>
                {
                    extralActions && (
                        <ExtralActions>
                            {extralActions}
                        </ExtralActions>
                    )
                }
			</QueryFormWraper>
        );
    }

    componentDidMount() {
        const { current } = this.fieldsRef;

        if (current && current.clientHeight > 45) {
            this.setState({
                showMore: true
            });
        }
    }

    onSubmit = () => {
        const {
            form,
            onSubmit,
            actions
        } = this.props;
        const values = form.getFieldsValue();
        const parmas = {...values, current: 1};
        actions.setData('formData', values);
        onSubmit && onSubmit(parmas);
        actions.emit('search', parmas);
    };

    onReset = () => {
        const {form, onReset} = this.props;

        form.resetFields();
        const values = form.getFieldsValue();
        onReset && onReset(values);
        this.onSubmit();
    };

    onToggleExpand = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    setFormData = data => {
        const {form} = this.props;
        form.setFieldsValue(data);
        this.onSubmit();
    }

    componentWillUnmount() {
        this.props.actions.removeListener('setFormData', this.setFormData);
    }
};
