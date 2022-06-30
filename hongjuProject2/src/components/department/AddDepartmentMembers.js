import React from 'react';
import {Form, Row, Col, Input, DatePicker, Icon, Modal, Switch, Select} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
import {FileChooseBox, CommonChoose} from '../common';

class AddDepartmentMembers extends React.Component {
    constructor() {
        super();
    }

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (err == null) {
                this.props.updateCurrentDepartmentMembers(values);
            }
        });
    };
    handleCancel = () => {
        this.props.onEditOverMembers();
    };

    //选择部门的回调
    overChooseFiles = (fieldCode, fileValue, index) => {
        fileValue = fileValue[0] || null;
        this.props.onFilesChange({name: fieldCode, value: fileValue});
        this.overCancelChoose(index);
    };
    beginChooseFile = (index) => {
        this.props.changeFileChooseFlagDepartmentMembers(index, true);
    };
    overCancelChoose = (index) => {
        this.props.changeFileChooseFlagDepartmentMembers(index, false);
    };

    test = () => {
        let temp = document.getElementById("text1");
        //对电子邮件的验证
        let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!myreg.test(temp.value)) {
            alert('提示\n\n请输入有效的E_mail！');
            myreg.focus();
            return false;
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17},
        };
        const fields = this.props.editMembersFields;
        // const fields2 = this.props.editMembersFields2;
        const getFileds = (field, index) => {
            const {code, labelName, isRequire, showGroup, disabled, inputType} = field;
            if (['staff', 'department', 'operation', 'station', 'level', 'city'].indexOf(inputType) !== -1) {
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
                                        initialChoosed={ this.props.editingDepartmentMembers[code] ? [this.props.editingDepartmentMembers[code]] : []}
                                        showGroup={(inputType === 'staff') && !window.getUserInfo().isDummy && `${labelName}` == '上级主管'}
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
            } else if (inputType === 'switch') {
                return (
                    <Col span={40} key={`${code}`} style={{paddingLeft: '20px', paddingRight: '20px'}}>
                        <FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
                            {getFieldDecorator(`${code}`, {
                                valuePropName: 'checked',
                                rules: [
                                    {required: !!isRequire, message: `请输入${labelName}`},
                                ],
                            })(
                                <Switch/>
                            )}
                        </FormItem>
                    </Col>);
            } else if (inputType === 'switch1') {
                return (
                    <Col span={40} key={`${code}`} style={{paddingLeft: '20px', paddingRight: '20px'}}>
                        <FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
                            {getFieldDecorator(`${code}`, {
                                valuePropName: 'checked',
                                rules: [
                                    {required: !!isRequire, message: `请输入${labelName}`},
                                ],
                            })(
                                <Switch disabled={false}/>
                            )}
                        </FormItem>
                    </Col>);
            } else if (code === 'line') {
                return (
                    <Col span={24} key={`${code}`}>
                        <div className="single-line"></div>
                    </Col>
                )
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
                                    <Option value="离职">离职</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                )
            } else if (inputType === 'danger') {
                return (
                    <Col span={12} key={`${code}`}>
                        <FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
                            {getFieldDecorator(`${code}`, {
                                rules: [
                                    {required: !!isRequire, message: `请输入${labelName}`},
                                ],
                                initialValue: '男'
                            })(
                                <Select >
                                    <Option value="男">男</Option>
                                    <Option value="女">女</Option>
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
            } else if (inputType === 'email') {
                return (
                    <Col span={12} key={`${code}`}>
                        <FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
                            {getFieldDecorator(`${code}`, {
                                rules: [
                                    {type: 'email', message: '请输入正确的邮箱格式,必须加上@'},
                                    {required: !!isRequire, message: `请输入${labelName}`},
                                ],
                            })(
                                <Input/>
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
        const title = this.props.editMembersType == 'addMembers' ? '新增成员' : (this.props.editMembersType === 'editMembers' ? '编辑成员' : '');
        return (
            <div>
                <Modal title={title}
                       visible={this.props.showMembersEditModal}
                       onOk={this.handleOk}
                       onCancel={this.handleCancel}
                       style={{top: '0px'}}
                       wrapClassName="page add-or-edit-department">
                    {this.props.showMembersEditModal == true ?
                        <Form
                            className="ant-advanced-search-form">
                            <Row gutter={40} style={{marginLeft: "0", marginRight: "0", overflow: 'auto'}}>
                                {
                                    fields.map(function (item, index) {
                                        return getFileds(item, index)
                                    })
                                }
                            </Row>
                        </Form>
                        :
                        null
                    }

                </Modal>
            </div>
        );
    }
}


const addDepartmentMembers = Form.create({
    onFieldsChange(props, changedFields) {//改变的字段对象
        const key = Object.keys(changedFields)[0];
        props.onFilesChange({...changedFields[key]});
    },
    mapPropsToFields(props) {
        return {
            code: {
                value: props.editingDepartmentMembers.code,
            },
            name: {
                value: props.editingDepartmentMembers.name,
            },
            gender: {
                value: props.editingDepartmentMembers.gender,
            },
            mobile: {
                value: props.editingDepartmentMembers.mobile,
            },
            department: {
                obj: props.editingDepartmentMembers.department,
                value: props.editingDepartmentMembers.department && props.editingDepartmentMembers.department.name,
            },
            parent: {
                obj: props.editingDepartmentMembers.parent,
                value: props.editingDepartmentMembers.parent && props.editingDepartmentMembers.parent.name,
            },
            position: {
                obj: props.editingDepartmentMembers.position,
                value: props.editingDepartmentMembers.position && props.editingDepartmentMembers.position.name,
            },
            personrank: {
                obj: props.editingDepartmentMembers.personrank,
                value: props.editingDepartmentMembers.personrank && props.editingDepartmentMembers.personrank.name,
            },
            email: {
                value: props.editingDepartmentMembers.email,
            },
            phone: {
                value: props.editingDepartmentMembers.phone,
            },
            identification: {
                value: props.editingDepartmentMembers.identification,
            },
            bankAccount: {
                value: props.editingDepartmentMembers.bankAccount,
            },
            reportAgent: {
                obj: props.editingDepartmentMembers.reportAgent,
                value: props.editingDepartmentMembers.reportAgent && props.editingDepartmentMembers.reportAgent.name,
            },
            workPlace: {
                obj: props.editingDepartmentMembers.workPlace,
                value: props.editingDepartmentMembers.workPlace && props.editingDepartmentMembers.workPlace.name,
            },
            startdate: {
                value: moment(props.editingDepartmentMembers.startdate).format() === 'Invalid date' ? null : moment(props.editingDepartmentMembers.startdate),
            },
            status: {
                value: props.editingDepartmentMembers.status,
            },
            enddate: {
                value: moment(props.editingDepartmentMembers.enddate).format() === 'Invalid date' ? null : moment(props.editingDepartmentMembers.enddate),
            },
            missionneedapproval: {
                value: props.editingDepartmentMembers.missionneedapproval ? true : false,
            },
            needfillapplication: {
                value: props.editingDepartmentMembers.needfillapplication ? true : false,
            },
            isCorpMobile: {
                value: props.editingDepartmentMembers.isCorpMobile ? true : false,
            },
            systemusedstatus: {
                value: (props.editingDepartmentMembers.systemusedstatus == true || props.editingDepartmentMembers.systemusedstatus == '正常') ? true : ((props.editingDepartmentMembers.systemusedstatus == false ||props.editingDepartmentMembers.systemusedstatus == '禁止' )? false : true),
            },

        };
    },
    onValuesChange(props, values) {//改变的字段名和对应的值
        // console.log(props, values);
    },
})(AddDepartmentMembers);
export default addDepartmentMembers;
