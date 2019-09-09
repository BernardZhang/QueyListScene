import React from 'react';
import {Select} from 'antd';

const {Option} = Select;

export default props => {
    const {options, ...rest} = props;
    return (
        <Select allowClear {...rest}>
            {
        options.map(option => {
            if (option instanceof Object) {
                return (
                    <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                    );
            }

            return <Option key={option} value={option}>{option}</Option>;
        })
        }
        </Select>
        );
};
