/**
 * Created by yangyfe on 2017/4/20.
 * 批量修改
 */

import React from 'react';
import {Form, Row, Col, Input, Button, Icon, Modal,Select} from 'antd';
import {CommonChoose, Confirm} from '../common/index';
import {connect} from 'react-redux';
const FormItem = Form.Item;
const Option = Select.Option;



class BatchEditDepartment extends React.Component {
    constructor() {
        super();
        this.state = {
            edittype:"parent",
            parent:null,
            reportAgent:null,
        }
    }
    handleOk = (e) => {
        e.preventDefault();
        const {edittype, parent, reportAgent} = this.state;
        const reqData = {
            edittype:  edittype,
            parent: parent && parent[0].id,
            reportAgent: reportAgent && reportAgent[0].id,
            staffids:this.props.$$departmentState.toJS().staffids
        };
            this.props.batchEditDepartment(reqData);
            this.props.changeBatchEditDepartmentFlag(false);
    };
    handleCancel = () => {
        this.props.changeBatchEditDepartmentFlag(false);
    };
    //选择部门的回调
    handleSelect = (code, value) => {
        this.setState({
            [code]: value
        })
    };
    //修改选择框
    handleChange = (edittype) => {
        this.setState({
            edittype:edittype
        });
    }
    render() {
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17},
        };
        const fields = [
            {code: 'parent', fileType: window.FILETYPE.staff, showGroup: false, isRadio: true},
            {code: 'reportAgent', fileType: window.FILETYPE.staff, showGroup: true, isRadio: true},
        ];

        const getFileds = (filed) => {
            const {code, labelName, fileType, showGroup, isRadio} = filed;
            return (
                <Col span={12} key={code}>
                    <FormItem {...formItemLayout} colon={false}>
                        <CommonChoose initialChoosed={this.state[code] || []}
                                      showGroup={showGroup}
                                      type={fileType}
                                      isRadio={isRadio}
                                      onSelect={(value) => {
                                          this.handleSelect(code, value);
                                      }}/>
                    </FormItem>
                </Col>
            )
        };
        const title = '批量编辑';
        return (
            <div>
                <Modal title={title}
                       visible={this.props.showBatchEditModal}
                       onOk={this.handleOk}
                       onCancel={this.handleCancel}
                       wrapClassName="batch-edit-department">
                    <Form
                        className="ant-advanced-search-form">
                        <Row gutter={40}>
                            <span>选择批量修改的栏目：</span>
                            <Select defaultValue={this.state.edittype === 'parent' ? '上级主管':'报销委托人'} dropdownMatchSelectWidth={false} dropdownStyle={{width:320,height:120}} style={{ width: 260 }} onChange={this.handleChange}>
                                <Option value="parent">上级主管</Option>
                                <Option value="reportAgent">报销委托人</Option>
                            </Select>
                        </Row>
                        <Row gutter={40}>
                            {
                                this.state.edittype === 'parent' ?
                                    getFileds(fields[0])
                                    :
                                    getFileds(fields[1])
                            }
                        
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}
function mapStateToProps(state) {
	return {
		$$departmentState: state.get('departmentState'),
	}
}
export default connect(mapStateToProps)(BatchEditDepartment);

