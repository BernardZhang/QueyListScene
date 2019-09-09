import React from "react";
import { Select } from "antd";

const { Option } = Select;

export default props => {
    const { options, ...rest } = props;
    return (
        <Select allowClear {...rest}>
            {
                options.map(({ label, value }) => (
                    <Option key={value} value={value}>
                        {label}
                    </Option>
                ))
            }
        </Select>
    );
};
