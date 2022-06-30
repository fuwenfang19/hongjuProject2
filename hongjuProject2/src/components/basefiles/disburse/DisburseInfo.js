/**
 * Created by czl on 2017/2/28.
 */
import React from 'react';
import {Row, Button, Switch, Form, Col, Input, Modal, Select} from 'antd';
import _ from 'lodash';
const FormItem = Form.Item;
const Option = Select.Option;


import {Toast, renderLabelAndValues, Confirm} from '../../../components/common';


class DisburseInfo extends React.Component {

    constructor() {
        super();

        this.downloadTemplate = this.downloadTemplate.bind(this);
        this.importDatas = this.importDatas.bind(this);
        this.editDisburse = this.editDisburse.bind(this);
        this.editDisburseOther = this.editDisburseOther.bind(this);
        // this.canSave = this.canSave.bind(this);
        this.cancelEditDisburseOther = this.cancelEditDisburseOther.bind(this);
        this.cancelEditDisburseOtherForCancel = this.cancelEditDisburseOtherForCancel.bind(this);
        this.saveData = this.saveData.bind(this);
        this.change = this.change.bind(this);

    }

    // canSave = (Data)=>{
    //     this.props.canSave(Data);
    // }
    downloadTemplate() {
        this.props.downloadTemplate();
    }

    importDatas() {
        this.props.importDatas();
    }


    editDisburse() {
        if (this.props.currentDisburse.id) {
            this.props.onDisburseEditBegin('edit');
        } else {
            Toast.info('请先选择一个项目');
        }
    }

    editDisburseOther() {
        if (this.props.currentDisburse.id) {
            this.props.onDisburseEditBeginOther('edit', true);
        } else {
            Toast.info('请先选择一个项目');
        }
    }

    saveData() {
        this.props.form.validateFields((err, values) => {
            if (err == null) {
                this.props.updateCurrentDisburse(values);
                this.props.onDisburseEditBeginOther('edit', false);
            }
        });
    }

    cancelEditDisburseOtherForCancel() {
        this.props.onDisburseEditBeginOther('edit', false);
    }

    cancelEditDisburseOther() {
        if (!this.props.canSaveValue) {
            Confirm({
                title: '支出类型',
                content: {
                    message: '还有数据没有保存确定要离开吗?'
                },
                onOk: () => {
                    this.cancelEditDisburseOtherForCancel()
                },
                onCancel: () => {

                },
                okText: '确定',
                cancelText: '取消'
            })
        } else {
            this.cancelEditDisburseOtherForCancel()
        }

    }

    change = (checked)=> {
        this.props.changeDisburseStatus(checked)
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {currentDisburse, showEdit, canSaveValue,isDummy} = this.props;
        console.log(isDummy);
        const formLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };
        const switchflag = currentDisburse.status;
        const buttons = [
            {
                key: 'btn1',
                size: 'small',
                type: 'primary',
                text: '下载模板',
                onClick: this.downloadTemplate
            },
            {
                key: 'btn2',
                size: 'small',
                type: 'primary',
                text: '导入数据',
                onClick: this.importDatas
            },
            {
                key: 'btn3',
                size: 'small',
                type: 'primary',
                style: showEdit ? {backgroundColor: '#fff', border: '1px solid #449ff7', color: '#449ff7'} : {},
                text: showEdit ? '取消' : '编辑',
                disabled: currentDisburse.id == null,
                onClick: showEdit ? this.cancelEditDisburseOther : this.editDisburseOther,
            }
        ];
        showEdit ? buttons.push(
            {
                key: 'btn4',
                size: 'small',
                type: 'primary',
                text: '保存',
                disabled: canSaveValue,
                onClick: this.saveData
            }
        ) : buttons;
        return (
            <div className="content-right disburse-page">
                <div className="content-right-head">
                    <div
                        className="head-left">{currentDisburse.code ? '[' + currentDisburse.code + '] ' + currentDisburse.name : ''} </div>
                    <div className="head-right" style={{visibility : !isDummy?'hidden':'visible'}}>
                        启用<Switch checked={switchflag === '正常' ? true : false} onChange={this.change}
                    />
                        {renderToolButton(buttons)}
                    </div>
                </div>
                <div style={{margin:'27px 0 0 0'}}>
                    <Form>
                        <Row gutter={40}>
                            <Col span={12}>
                                <FormItem label="支出类型编码" required="required"  {...formLayout}>
                                    {showEdit ? getFieldDecorator('code', {
                                        rules: [{required: true, message: '支出类型编码不能为空!'}],
                                    })(<Input disabled={true} style={{height: 30 }}/>)
                                        :
                                        <span style={{fontSize: 14,margin:'0 0 0 8px'}}>{currentDisburse.code}</span>}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="支出类型名称" required="required" {...formLayout}>
                                    {showEdit ? getFieldDecorator('name', {
                                        rules: [{required: true, message: '支出类型名称不能为空!'}],
                                    })(<Input />)
                                        :
                                        <span style={{fontSize: 14,margin:'0 0 0 8px'}}>{currentDisburse.name}</span>
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="上级编码" {...formLayout}>
                                    {showEdit ? getFieldDecorator('parent', {
                                        rules: [{required: false}]
                                    })(<Input />) :
                                        <span style={{fontSize: 14,margin:'0 0 0 8px'}}>{currentDisburse.parent}</span>}
                                </FormItem>

                            </Col>
                            <Col span={12}>
                                <FormItem label="状态" {...formLayout}>
                                    {showEdit ?
                                        getFieldDecorator('status', {
                                            rules: [
                                                {required: false}
                                            ],
                                            initialValue: '正常'
                                        })(
                                            <Select >
                                                <Option value="正常">正常</Option>
                                                <Option value="停用">停用</Option>
                                            </Select>
                                        )
                                        :
                                        <span style={{fontSize: 14,margin:'0 0 0 8px'}}>{currentDisburse.status}</span>
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>

                </div>

            </div>
        )
    }
}

//右侧功能按钮
function renderToolButton(buttons) {
    return buttons.map((button) => {
        return (
            <Button key={button.key} size={button.size} style={button.style} type={button.type}
                    disabled={button.disabled}
                    onClick={button.onClick}>
                {button.text}
            </Button>
        )
    })
}
const disburseInfo = Form.create({
    onFieldsChange(props, changedFields) {//改变的字段对象
        const key = Object.keys(changedFields)[0];
        props.onFilesChange({...changedFields[key]});
    },
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
        const CurrentDisburse = _.cloneDeep(props.currentDisburse);
        const copyCurrentDisburse = _.cloneDeep(props.currentDisburse);
        for (var key in values) {
            if (copyCurrentDisburse[key] != values[key]) {
                if (key == 'parent' && values[key] == '') {
                    copyCurrentDisburse[key] = null;
                } else {
                    copyCurrentDisburse[key] = values[key];
                }

            }
        }
        if (JSON.stringify(CurrentDisburse) != JSON.stringify(copyCurrentDisburse)) {
            props.canSave(false);
        } else {
            props.canSave(true);
        }

    }
})(DisburseInfo);
export default disburseInfo;
