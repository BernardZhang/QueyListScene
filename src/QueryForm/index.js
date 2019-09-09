import React from 'react';
import {Form, Button} from 'antd';
import {get} from 'lodash';
import './index.less';

@Form.create()
export default class QueryForm extends React.Component {
    constructor(props) {
        super(props);
        props.actions.on('setFormData', this.setFormData);
    }

    render() {
        const {
            title,
            children,
            className = '',
            form
        } = this.props;

        return (
            <div className={`query-list-scene-queryform ${className}`}>
				{
            title && (
            <span className='title'>{title}</span>
            )
            }
				<Form layout='inline'>
					{React.Children.map(
                children,
                child => child &&
                    get(child, 'props.align') !== 'right' &&
                    React.cloneElement(child, {
                        form
                    })
            )}
					<Button type='primary' onClick={this.onSubmit}>
						查询
					</Button>
					<Button onClick={this.onReset}>重置</Button>
					{React.Children.map(
                children,
                child => child &&
                    get(child, 'props.align') === 'right' &&
                    React.cloneElement(child, {
                        form
                    })
            )}
				</Form>
			</div>
            );
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

    setFormData = data => {
        const {form} = this.props;
        form.setFieldsValue(data);
        this.onSubmit();
    }
}
