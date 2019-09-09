import React from "react";
import { Form } from "antd";
import fieldsMap from "./fieldsMap";

const FormItem = Form.Item;

export default props => {
    const {
        type = "string",
        title,
        name,
        initialValue,
        form,
        props: fieldProps
    } = props;
    const { getFieldDecorator } = form;
    const Field = fieldsMap[type];

    return (
        <FormItem label={title}>
            {
                getFieldDecorator(name, {
                    initialValue
                })(
                    <Field {...fieldProps} />
                )
            }
        </FormItem>
    );
};
