/**
 * Created by yangyfe on 2017/3/3.
 * 编辑的表格
 */
import React from 'react';
import {Form, Row, Col, Input, DatePicker, Icon, Modal, Switch, Select} from 'antd';
import {FileChooseBox,CommonChoose} from '../common';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

class EditDepartmentForm extends React.Component {
    constructor() {
        super();
    }
    componentWillReceiveProps(nextState) {

    }

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (err == null) {
                this.props.updateCurrentDepartment(values);
            }
        });
    };
    handleCancel = () => {
        this.props.onEditOver();
    };
//选择部门的回调
    overChooseFiles = (fieldCode, fileValue, index) => {
        fileValue = fileValue[0] || null;
        this.props.onFilesChange({name: fieldCode, value: fileValue});
        // this.overCancelChoose(index);
    };

    beginChooseFile = (index) => {
        this.props.changeFileChooseFlagDepartment(index, true);
    };
    overCancelChoose = (index) => {
        this.props.changeFileChooseFlagDepartment(index, false);
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        // const currentDepartment = this.props;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17},
        };
        const fields = this.props.editFields;
        const getFileds = (field, index) => {
            let {code, labelName, isRequire, showGroup, disabled, inputType} = field;
            if(!window.getUserInfo().isDummy&&inputType === 'staff'){
                showGroup = true
            }
            if (['staff', 'operation'].indexOf(inputType) !== -1) {
                return (
                    <div key={`${code + 1}`} style={{paddingLeft: '0', paddingRight: '0'}}>
                        <Col span={12} style={{paddingLeft: '20px', paddingRight: '20px'}} key={`${code}`}>
                            <FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
                                {getFieldDecorator(`${code}`, {
                                    rules: [
                                        {required: !!isRequire, message: `请输入${labelName}`},
                                    ],
                                })(
                                    <CommonChoose
                                        initialChoosed={ this.props.editingDepartment[code] ? [this.props.editingDepartment[code]] : []}
                                        showGroup={showGroup}
                                        type={inputType}
                                        isRadio={true}
                                        onSelect={(value) => {
                                            this.overChooseFiles(code, value, index);
                                        }}/>
                                )}
                            </FormItem>
                        </Col>
                    </div>
                );
            } else if (inputType === 'select') {
                return (
                    <Col span={12} key={`${code}`}>
                        <FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
                            {getFieldDecorator(`${code}`, {
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
            } else if (inputType === 'date') {
                return (
                    <Col span={12} key={`${code}`}>
                        <FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
                            {getFieldDecorator(`${code}`, {
                                rules: [
                                    {required: !!isRequire, message: `请输入${labelName}`},
                                ],
                            })(
                                <DatePicker placeholder="" style={{width: '100%'}}/>
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
                                ],
                            })(
                                <Input placeholder="" disabled={disabled}/>
                            )}
                        </FormItem>
                    </Col>
                )
            }
        };
        const title = this.props.editType === 'edit' ? '编辑部门' : (this.props.editType === 'add' ? '新增部门' : <span>新增 <span style={{color:'#449ff7'}}>{this.props.currentDepartment.name}</span> 子部门</span>);
        return (
            <div>
                <Modal title={title}
                       visible={this.props.showEditModal}
                       onOk={this.handleOk}
                       okText={'保存'}
                       onCancel={this.handleCancel}
                       wrapClassName="add-or-edit-department">
                    <Form
                        className="ant-advanced-search-form">
                        {this.props.showEditModal ?
                            <Row gutter={40}>
                                {
                                    fields.map(function (item, index) {
                                        return getFileds(item, index)
                                    })
                                }
                            </Row> : null}
                    </Form>
                    {
                        this.props.editType === 'addChild' ?
                            <div style={{
                                marginLeft: '30px',
                                marginTop: '40px',
                                fontSize: '12px',
                                color: '#666',
                                fontWeight: '300',

                            }}>隶属于: &nbsp;{this.props.currentDepartment.name}</div>
                            :
                            ''
                    }
                </Modal>
            </div>
        );
    }
}
const editDepartmentForm = Form.create({
    onFieldsChange(props, changedFields) {//改变的字段对象
        const key = Object.keys(changedFields)[0];
        props.onFilesChange({...changedFields[key]});
    },
    mapPropsToFields(props) {
        return {
            code: {
                value: props.editingDepartment.code,
            },
            name: {
                value: props.editingDepartment.name,
            },
            manager: {
                obj: props.editingDepartment.manager,
                value: props.editingDepartment.manager && props.editingDepartment.manager.name,
            },
            finManager: {
                obj: props.editingDepartment.finManager,
                value: props.editingDepartment.finManager && props.editingDepartment.finManager.name,
            },
            busiSeqName: {
                obj: props.editingDepartment.busiSeqName,
                value: props.editingDepartment.busiSeqName && props.editingDepartment.busiSeqName.name,
            },
            startDate: {
                value: moment(props.editingDepartment.startDate).format() === 'Invalid date' ? null : moment(props.editingDepartment.startDate),
            },
            status: {
                value: props.editingDepartment.status,
            },
            endDate: {
                value: moment(props.editingDepartment.endDate).format() === 'Invalid date' ? null : moment(props.editingDepartment.endDate),
            },
        };
    },

    onValuesChange(props, values) {//改变的字段名和对应的值
        // console.log(props, values);
    },
})(EditDepartmentForm);
export default editDepartmentForm;
