/**
 * Created by chezhanluo on 2017/5/22.
 */
import React from 'react';
import {Modal, Table, Checkbox, Input, Select, Popconfirm} from 'antd';
import {connect} from 'react-redux';
const Option = Select.Option;
class CustomFileExpand extends React.Component {
    constructor() {
        super();

    }

    handleOk = () => {
        console.log(this.props.editExpand.toJS());
        // this.props.form.validateFields((err, values) => {

    };
    changeValue = (e, text, index)=> {
        if (e.target) {
            if (e.target.type == 'text') {
                this.props.changeCustomExpandList(e.target.value, text, index);
            }
            else if (e.target.type == 'checkbox') {
                if (`${e.target.checked}` == 'true') {
                    this.props.changeCustomExpandList(true, text, index);
                } else {
                    this.props.changeCustomExpandList(false, text, index);
                }
            }
        }
        else {
            this.props.changeCustomExpandList(e, text, index);
        }

    };
    handleCancel = () => {
        this.props.showCustomExpandList(false);
    };
    edit = (index, key, value) => {
        this.props.changeCustomExpandList(value, key, index);
    };


    render() {
        const tableConfig = {
            pagination: true,
            scroll: {
                x: false,
                y: this.props.clientHeight - this.props.clientHeight / 2
            }
        };
        const {editExpand} = this.props;
        const columns = [{
            key: 'status',
            title: '启用',
            dataIndex: 'status',
            width: '10%',
            render: (val, record, index) => {
                const editable = this.props.editExpand.toJS()[index].canEdit;
                return (
                    (() => {
                        if (editable) {
                            return (
                                <Checkbox style={{marginLeft:'7px'}} onChange={(checked) => {
                                        this.changeValue(checked,'status',index);
                                    }} checked={val}> </Checkbox>
                            )
                        } else {
                            return (
                                <Checkbox disabled={true} style={{marginLeft:'7px'}} onChange={(checked) => {
                                        this.changeValue(checked,'status',index);
                                    }} checked={val}> </Checkbox>
                            )
                        }

                    })()
                )
            }
        }, {
            key: 'name',
            title: '扩展栏目',
            dataIndex: 'name',
            width: '18%'
        }, {
            key: 'showName',
            title: '显示名称',
            dataIndex: 'showName',
            width:  '40%',
            render: (val, record, index) => {
                const editable = this.props.editExpand.toJS()[index].canEdit;
                return (
                    (() => {
                        if (editable) {
                            return (
                                <Input
                                    value={val}
                                    onChange={(e) => {
                                        this.changeValue(e,'showName',index);
                                    }}
                                    className="found-table-row-input"
                                />

                            );
                        } else {
                            return (
                                <div className="editable-row-showName">
                                    {val.toString() || ' '}
                                </div>

                            );
                        }

                    })()
                )
            }
        }, {
            key: 'dataType',
            title: '数据类型',
            dataIndex: 'dataType',
            width:  '20%',
            render: (val, record, index) => {
                const editable = this.props.editExpand.toJS()[index].canEdit;
                return (
                    (() => {
                        if (editable) {
                            return (
                                <Select defaultValue={val} style={{ width: 120 }} onChange={(e) => {
                                        this.changeValue(e,'dataType',index);
                                    }}>
                                    <Option value="日期">日期</Option>
                                    <Option value="数值">数值</Option>
                                    <Option value="整数">整数</Option>
                                    <Option value="文本">文本</Option>
                                </Select>
                            );
                        } else {
                            return (
                                <div className="editable-row-dataType">
                                    {val.toString() || ' '}
                                </div>
                            )
                        }

                    })()
                )
            }
        }, {
            key: 'canEdit',
            title: '操作',
            dataIndex: 'canEdit',
            width: '12%',
            render: (val, record, index) => {
                const editable = this.props.editExpand.toJS()[index].canEdit;
                return (
                    (()=> {
                        if (val) {
                            return (
                                <span>
                                    <a onClick={() => this.handleOk(index, 'save')}>保存&nbsp;&nbsp;</a>
                                        <Popconfirm title="确定取消?" onConfirm={() => this.edit(index,'canEdit',false)}>
                                    <a>取消</a>
                                         </Popconfirm>
                                </span>
                            )
                        } else {
                            return (
                                <span>
                                      <a onClick={() => this.edit(index,'canEdit',true)}>编辑</a>
                                 </span>
                            )
                        }
                    })()
                );
            }
        }];
        return (
                <div class="customExpand-page">
                    <Modal title={'扩展栏目'}
                           visible={this.props.showCustomExpand}
                           onOk={this.handleOk}
                           okText={'保存'}
                           onCancel={this.handleCancel}
                           wrapClassName="edit-customExpand">
                        <Table
                            {...tableConfig}
                            columns={columns}
                            dataSource={editExpand.toJS()}
                            className="found-table"
                            owKey={(record, index) => {  return index; }}
                            pagination={false}
                        >

                        </Table>


                    </Modal>
                </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        clientHeight: state.get('baseState').toJS().clientHeight
    };
}
export default connect(mapStateToProps)(CustomFileExpand);