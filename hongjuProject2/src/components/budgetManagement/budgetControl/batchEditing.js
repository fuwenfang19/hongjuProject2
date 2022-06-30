/**
 * Created by fuwf on 2017/5/26.
 * 批量修改
 */

import React from 'react';
import {Form, Row, Col, Input, Button, Icon, Modal,Select,InputNumber} from 'antd';
import {CommonChoose, Confirm,CustomRangeType} from '../../common/index';
import {connect} from 'react-redux';
const FormItem = Form.Item;
const Option = Select.Option;

class BatchEditing extends React.Component {
    constructor() {
        super();
        this.state = {
            edittype:"controlLevel",
            value:'1',
        }
    }
    
    handleCancel = () => {
        this.setState({
          edittype:"controlLevel",
          value:'1'
        })
        this.props.closeBatchEditingModal();
    };
    //修改选择类型
    handleChangeEditType = (value)=>{
      const defaultValue = value==='controlLevel'?'1':value==='overageKind'?'3':value==='warnLimit'||value==='controlLimit'?'100':value==='controlKind'?0:null
      this.setState({
        edittype:value,
        value:defaultValue
      })
    }
    //改变修改值
    changeControlLevel = (value)=>{
      const selectedType = this.state.edittype
      this.setState({
        edittype :selectedType,
        value:value
      })
    }
    //点击ok
    clickOkBtn = ()=>{
      const selectedType = this.state.edittype
      const selectedValue = this.state.value
      this.props.changeControlLevel(selectedValue,selectedType)
      this.handleCancel()
    }
    render() {
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17},
        };
        const {isBatchEdit} = this.props
        const value = this.state.value
        const edittype = this.state.edittype
        const title = '批量编辑';
        return (
            <div>
                <Modal title={title}
                       visible={isBatchEdit}
                       onOk={this.clickOkBtn}
                       onCancel={this.handleCancel}
                       wrapClassName="batch-edit-budgetControl">
                    <Form
                        className="ant-advanced-search-form">
                        <Row gutter={40}>
                            <span>选择批量修改的栏目：</span>
                            <Select value={edittype}
                            style={{ width: 260 }} onChange={this.handleChangeEditType}>
                                <Option value="controlLevel">控制方式</Option>
                                <Option value="controlKind">控制期间类型</Option>
                                <Option value="overageKind">预算累计周期</Option>
                                <Option value="warnLimit">预警百分比</Option>
                                <Option value="controlLimit">控制百分比</Option>
                            </Select>
                        </Row>
                        <Row gutter={40}>
                            <span style={{display:'inline-block',width:180}}>修改为：</span>
                            {
                              this.state.edittype === 'controlLevel' ?
                                  <Select value={value} style={{ width: 260 }} 
                                  onChange={(value)=>{this.changeControlLevel(value)}}>
                                        <Option value='0'>记录</Option>
                                        <Option value='1'>提醒</Option>
                                        <Option value='2'>弹性</Option>
                                        <Option value='3'>刚性</Option>
                                    </Select>
                                  :
                                  this.state.edittype === 'controlKind' ?
                                  <CustomRangeType
                                    value={value}
                                    onSelect={(value) => {
                                      this.changeControlLevel(value);
                                    }}
                                  />
                                    :
                                  this.state.edittype === 'overageKind' ?
                                  <Select value={value} style={{ width: 260 }} 
                                  onChange={(value)=>{this.changeControlLevel(value)}}>
                                        <Option value='0'>按月初累计</Option>
                                        <Option value='1'>按季初累计</Option>
                                        <Option value='2'>按半年初累计</Option>
                                        <Option value='3'>按年初累计</Option>
                                        <Option value='4'>按整个自定义期间初累计</Option>
                                        <Option value='5'>按单个自定义期间初</Option>
                                    </Select>
                                    :
                                    this.state.edittype === 'warnLimit' ||this.state.edittype === 'controlLimit'?
                                    <InputNumber style={{width: 220}} value={value}
                                      min={1}
                                      max={100}
                                      formatter={value => `${value}%`}
                                      parser={value => value.replace('%', '')} 
                                      step={1}
                                      onChange={(value) => {
                                        this.changeControlLevel(value);
                                      }}
                                      />
                                      :null
                            }
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default BatchEditing;
