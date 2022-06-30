import React from 'react';
import {Form, Row, Col, Input, Modal, Select} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

class EditDisburseForm extends React.Component {
    constructor() {
        super();
    }

    handleOk = () => {
        this.props.form.validateFields((err, values) => {

            if (err == null) {
                this.props.updateCurrentDisburse(values);
            }
        });
    };
    handleCancel = () => {
        this.props.onEditOver();
    };


    render() {

        const {getFieldDecorator} = this.props.form;
        const editType = this.props.editType;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
        };
        const fields = editType == 'edit' ? this.props.editFields : this.props.editNoParentFields;

        const getFileds = (field, index) => {
            const {code, labelName, isRequire, choosing, disabled, inputType} = field;
            if (inputType === 'select') {
                return (
                    <Col span={12} key={`${code}`}>
                        <FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
                            {
                                getFieldDecorator(`${code}`, {
                                    rules: [
                                        {required: !!isRequire, message: `请输入${labelName}`},
                                    ],
                                    initialValue: '正常'
                                })(
                                    <Select >
                                        <Option value="正常">正常</Option>
                                        <Option value="停用">停用</Option>
                                    </Select>
                                )}
                        </FormItem>
                    </Col>
                )
            }
            else {
                return (
                    <Col span={12} key={`${code}`}>
                        <FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
                            {getFieldDecorator(`${code}`, {
                                rules: [
                                    {required: !!isRequire, message: `请输入${labelName}`},
                                ]
                            })(
                                <Input placeholder="" disabled={this.props.editType == 'edit'? disabled :false}/>
                            )}
                        </FormItem>
                    </Col>
                )
            }
        };


        const title = this.props.editType == 'edit' ? '编辑支出类型' : (this.props.editType == 'add' ? '新增支出类型' : '新增子类型');

        return (
            <div>
                <Modal title={title}
                       visible={this.props.showEditModal}
                       onOk={this.handleOk}
                       okText={'保存'}
                       onCancel={this.handleCancel}
                       wrapClassName="add-or-edit-project">
                    <Form
                        className="ant-advanced-search-form">
                        <Row gutter={40}>
                            {
                                fields.map(function (item, index) {
                                    return getFileds(item, index)
                                })

                            }
                        </Row>
                        <Row>

                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}


const editDisburseForm = Form.create({

    mapPropsToFields(props) {
        return {
            code: {
                value: props.editingDisburse.code
            },
            name: {
                value: props.editingDisburse.name
            },
            parent: {
                value: props.editingDisburse.parent
            },
            status: {
                value: props.editingDisburse.status
            }

        };
    },
    onValuesChange(props, values) {//改变的字段名和对应的值
        console.log(props, values);
    }
})(EditDisburseForm);
export default editDisburseForm;