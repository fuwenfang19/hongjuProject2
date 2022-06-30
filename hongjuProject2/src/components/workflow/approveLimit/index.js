import React, { Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Button, Table, Input, Modal, Icon } from 'antd';
import { getApprovelLimitData, approvelLimitSaveData } from '../../../reducers/workflow/approveLimit/approveLimitReducer';
import { bindActionCreators } from 'redux';
import * as types from '../../../actions/actionTypes';
import domUtil from '../../../global/utils/domutil';
import { Toast } from '../../common';
import { BillTypeChoose, FileChooseBox } from '../../common';
import PositionChoose from './PositionChoose';
import format from '../../../global/utils/format';
import PopoverX from './PopoverX';
class ApproveLimit extends Component {
    constructor() {
        super();
        this.state = {
            tempId: 1,
            data: [],
            billTypeTempData: {},
            departmentTempData: {},
            positionTempData: {},
            limitToTempData: {},
            needSave: false,
            visible: false,
            newFlag: false
        }
    }
    static defaultProps = {

    }
    initState = () => {
        this.setState({
            tempId: 1,
            data: [],
            billTypeTempData: {},
            departmentTempData: {},
            positionTempData: {},
            limitToTempData: {},
            needSave: false,
            visible: false,
            newFlag: false
        });
    }
    componentWillMount() {

        this.props.dispatch({
            type: types.APPROVE_LIMIT_EDIT,
            payload: false
        });
        this.props.getApprovelLimitData();
    }
    componentWillReceiveProps(newProps) {
        if (newProps['saveSuccess']) {
            try {
                window.loading.remove();
            } catch (e) {

            }
            Toast.success('数据保存成功');
            this.props.dispatch({
                type: types.APPROVE_LIMIT_SAVE_SUCCESS,
                payload: false
            });
            this.props.dispatch({
                type: types.APPROVE_LIMIT_EDIT,
                payload: false
            });
            //初始化状态
            this.initState();
            //重新获取数据
            this.props.getApprovelLimitData();
        }
        if (newProps['saveFail']) {
            try {
                window.loading.remove();
            } catch (e) {

            }
            Toast.error(newProps['saveMessage']);
            this.props.dispatch({
                type: types.APPROVE_LIMIT_SAVE_FAIL,
                payload: false,
                message: ''
            });
        }
        this.setState({
            data: newProps['approvelLimitData']
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.newFlag) {
            let len = this.state.data.length;

            let ele = document.getElementById('input_temp' + (this.state.data[len - 1]['tempId']));//input_temp
            if (ele) {

                ele.click();
                ele.scrollIntoView(true);
            }
            this.setState({
                newFlag: false
            });
        }
    }

    //编辑
    activeEdit = () => {
        this.props.dispatch({
            type: types.APPROVE_LIMIT_EDIT,
            payload: true
        });
    }
    //取消
    cancelEdit = () => {
        if (this.state.needSave) {
            this.setState({
                visible: true,
            });
        } else {
            this.props.dispatch({
                type: types.APPROVE_LIMIT_EDIT,
                payload: false
            });
            this.initState();
        }
    }
    // 保存
    saveEdit = () => {
        if (!this.state.needSave) {
            return;
        }

        let data = this.handleMerge(this.state.data);
        let len = data.length;
        for (let i = 0; i < len; i++) {
            if (!data[i]['position']['id']) {
                Toast.warning('岗位不能为空!');
                return;
            }
            if (data[i]['tempId']) {
                if (data[i]['position']['id'] === undefined) {
                    Toast.warning('岗位不能为空!');
                    return;
                }
                data[i] = {
                    department: data[i]['department'],
                    objectclass: data[i]['objectclass'],
                    position: data[i]['position'],
                    limitTo: data[i]['limitTo']
                }
            }
        }
        for (let i = 0; i < len; i++) {
            if (data[i]['department']['id'] === undefined) {
                data[i]['department'] = null;
            }
            if (data[i]['objectclass']['id'] === undefined) {
                data[i]['objectclass'] = null;
            }
        }

        window.loading.add();
        this.props.approvelLimitSaveData(data);

    }
    handleMerge = (stateData) => {
        let { billTypeTempData, departmentTempData, positionTempData, limitToTempData } = this.state;
        // let stateData = this.state.data;
        let data = Immutable.fromJS(stateData).toJS();
        for (let i = 0; i < data.length; i++) {

            if (data[i]['id'] || data[i]['id'] === 0) {
                for (let k in billTypeTempData) {
                    if (k === data[i]['id'].toString()) {
                        data[i]['objectclass'] = billTypeTempData[k]['objectclass_name'];
                        break;
                    }
                }

                for (let k in departmentTempData) {
                    if (k === data[i]['id'].toString()) {
                        data[i]['department'] = departmentTempData[k]['department_name'];
                        break;
                    }
                }

                for (let k in positionTempData) {
                    if (k === data[i]['id'].toString()) {
                        data[i]['position'] = positionTempData[k]['position_name'];
                        break;
                    }
                }

                for (let k in limitToTempData) {
                    if (k === data[i]['id'].toString()) {
                        data[i]['limitTo'] = parseFloat(limitToTempData[k]['limitTo']);
                        break;
                    }
                }
            } else {
                //k === data[i]['tempId']
                for (let k in billTypeTempData) {
                    if (k === data[i]['tempId']) {
                        data[i]['objectclass'] = billTypeTempData[k]['objectclass_name'];
                        break;
                    }
                }

                for (let k in departmentTempData) {
                    if (k === data[i]['tempId']) {
                        data[i]['department'] = departmentTempData[k]['department_name'];
                        break;
                    }
                }

                for (let k in positionTempData) {
                    if (k === data[i]['tempId']) {
                        data[i]['position'] = positionTempData[k]['position_name'];
                        break;
                    }
                }

                for (let k in limitToTempData) {
                    if (k === data[i]['tempId']) {
                        data[i]['limitTo'] = parseFloat(limitToTempData[k]['limitTo']);
                        break;
                    }
                }
            }
        }

        return data;
    }
    //新增
    addEdit = () => {
        this.activeEdit();
        this.props.dispatch({
            type: types.APPROVE_LIMIT_ADD,
            payload: {
                objectclass: {},
                department: {},
                position: {},
                limitTo: 0,
                tempId: "temp" + this.state.tempId
            }
        });
        this.setState({
            tempId: this.state.tempId + 1,
            needSave: true,
            newFlag: true
        });

    }
    // 编辑-

    // 编辑-

    // 编辑-

    //模态对话框离开
    modalHandleOk = () => {

        this.props.dispatch({
            type: types.APPROVE_LIMIT_EDIT,
            payload: false
        });
        //初始化
        this.initState();
        this.props.getApprovelLimitData();
    }
    //模态对话框保存
    modalHandleCancel = () => {
        // this.setState({
        //     visible: false,
        // });
        this.saveEdit();
    }

    transformDataForTable = (data) => {
        let arr = []
        for (let i = 0; i < data.length; i++) {
            arr[i] = {
                objectclass_name: data[i]['objectclass']['name'],
                department_name: data[i]['department']['name'],
                position_name: data[i]['position']['name'],
                limitTo_name: data[i]['limitTo'],
                id: data[i]['id'],
                tempId: data[i]['tempId']
            }
        }
        return arr;
    }
    //3个字段选择改变的函数都用它
    handleBillTypeChange = (e, record, index) => {
        //必须的
        //不用做处理
    }
    handleLimitToChange = (e, record, index) => {
        let limitToTempData = this.state.limitToTempData;
        let val = e.target.value;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(val) && reg.test(val)) || val === '' || val === '-') {

        } else {
            Toast.info('请输入数字');
            return;
        }

        limitToTempData[record['id'] || record['tempId']] = {};
        limitToTempData[record['id'] || record['tempId']]['limitTo'] = val;
        this.setState({
            limitToTempData,
            needSave: true
        });
    }


    render() {
        // let isDummy = window.getUserInfo().isDummy;

        let offset = null;
        const tableHeaderHeight = 49;
        if (this.refs.membersTable) {
            offset = domUtil.getElementOffSet(this.refs.membersTable);
        }
        const tableConfig = {
            pagination: false,
            scroll: {
                x: false,
                y: this.props.clientHeight - (offset ? offset.top + tableHeaderHeight + 100 : 216)
            },
            expandedRowRender: false
        };


        let data = this.transformDataForTable(this.state.data);
        let len = data.length;

        const columns = [{
            title: '单据类型',
            dataIndex: 'objectclass_name',
            width: 200,
            render: (val, record, index) => {

                return (
                    (() => {
                        if (!this.props.editing) {
                            return <div>{val}</div>
                        } else {
                            let cont = (
                                <BillTypeChoose
                                    okClick={(arr) => {
                                        if (!arr[0]) {

                                            return;
                                        }

                                        let billTypeTempData = this.state.billTypeTempData;
                                        billTypeTempData[record['id'] || record['tempId']] = {};
                                        billTypeTempData[record['id'] || record['tempId']]['objectclass_name'] = arr[0];

                                        this.setState({
                                            billTypeTempData,
                                            needSave: true
                                        });

                                    }}
                                    cancelClick={() => {

                                    }}
                                    isRadio={true}
                                    type={['2', '3', '15']}
                                    initialChoosed={[]} />
                            );
                            let inp = (
                                <Input
                                    id={data[index]['id'] ? `input_a${data[index]['id']}` : `input_temp${data[index]['tempId']}`}
                                    value={this.state.billTypeTempData[record['id'] || record['tempId']] ? this.state.billTypeTempData[record['id'] || record['tempId']]['objectclass_name']['name'] : val}
                                    onChange={this.handleBillTypeChange}
                                    className={(() => {
                                        return "found-table-row-input found-table-row-input-select";
                                    })()}

                                />
                            );

                            return (
                                <div className="approve-limit-choose-bill-type input-clear-item" >
                                    <div className="approve-limit-choose-bill-type-val">
                                        <PopoverX cont={cont} inp={inp} />
                                    </div>
                                    <Icon type="close-circle" className="close-icon" onClick={() => {
                                        let billTypeTempData = this.state.billTypeTempData;
                                        billTypeTempData[record['id'] || record['tempId']] = {};
                                        billTypeTempData[record['id'] || record['tempId']]['objectclass_name'] = {};

                                        this.setState({
                                            billTypeTempData,
                                            needSave: true
                                        });
                                    }} />
                                </div>
                            );
                        }
                    })()
                );
            }
        }, {
            title: '部门',
            dataIndex: 'department_name',
            width: 200,
            render: (val, record, index) => {//input_temp_n
                return (
                    (() => {
                        if (!this.props.editing) {
                            return <div>{val}</div>
                        } else {
                            let cont = (
                                <FileChooseBox
                                    type="department"
                                    isRadio={true}
                                    okClick={(arr) => {
                                        if (!arr[0]) {

                                            return;
                                        }

                                        let departmentTempData = this.state.departmentTempData;
                                        departmentTempData[record['id'] || record['tempId']] = {};
                                        departmentTempData[record['id'] || record['tempId']]['department_name'] = arr[0];
                                        this.setState({
                                            departmentTempData,
                                            needSave: true
                                        })
                                    }}
                                    cancelClick={() => {

                                    }}

                                    initialChoosed={[]} />
                            );
                            let inp = (
                                <Input
                                    value={this.state.departmentTempData[record['id'] || record['tempId']] ? this.state.departmentTempData[record['id'] || record['tempId']]['department_name']['name'] : val}
                                    onChange={this.handleBillTypeChange}
                                    className={(() => {
                                        return "found-table-row-input found-table-row-input-select";
                                    })()}

                                />
                            );
                            return (
                                <div className="approve-limit-choose-bill-type input-clear-item" >
                                    <div className="approve-limit-choose-bill-type-val">
                                        <PopoverX cont={cont} inp={inp} />
                                    </div>

                                    <Icon type="close-circle" className="close-icon" onClick={() => {
                                        let departmentTempData = this.state.departmentTempData;
                                        departmentTempData[record['id'] || record['tempId']] = {};
                                        departmentTempData[record['id'] || record['tempId']]['department_name'] = {};
                                        this.setState({
                                            departmentTempData,
                                            needSave: true
                                        })
                                    }} />

                                </div>
                            );
                        }
                    })()
                );
            }
        }, {
            title: <span className="found-table-box-header">岗位</span>,
            dataIndex: 'position_name',
            width: 200,
            render: (val, record, index) => {
                return (
                    (() => {
                        if (!this.props.editing) {
                            return <div>{val}</div>
                        } else {
                            let cont = (
                                <PositionChoose
                                    okClick={(arr) => {
                                        if (!arr[0]) {

                                            return;
                                        }

                                        let positionTempData = this.state.positionTempData;
                                        positionTempData[record['id'] || record['tempId']] = {};
                                        let obj = {};
                                        obj = {
                                            companyid: arr[0]['companyid'],
                                            id: arr[0]['id'],
                                            isNotNeedTicketApprove: arr[0]['isNotNeedTicketApprove'],
                                            level: arr[0]['level'],
                                            positioncode: arr[0]['positioncode'],
                                            name: arr[0]['positionname']
                                        };
                                        positionTempData[record['id'] || record['tempId']]['position_name'] = obj;

                                        this.setState({
                                            positionTempData,

                                            needSave: true
                                        })
                                    }} cancelClick={() => {

                                    }} />
                            );
                            let inp = (
                                <Input

                                    value={this.state.positionTempData[record['id'] || record['tempId']] ? this.state.positionTempData[record['id'] || record['tempId']]['position_name']['name'] : val}
                                    onChange={this.handleBillTypeChange}
                                    className={(() => {
                                        return "found-table-row-input found-table-row-input-select";
                                    })()}

                                />
                            );
                            return (
                                <div className="approve-limit-choose-bill-type input-clear-item" >
                                    <div className="approve-limit-choose-bill-type-val">
                                        <PopoverX cont={cont} inp={inp} />
                                    </div>

                                    <Icon type="close-circle" className="close-icon" onClick={() => {
                                        let positionTempData = this.state.positionTempData;
                                        positionTempData[record['id'] || record['tempId']] = {};
                                        let obj = {};
                                        obj = {
                                            companyid: undefined,
                                            id: undefined,
                                            isNotNeedTicketApprove: undefined,
                                            level: undefined,
                                            positioncode: undefined,
                                            name: undefined
                                        };
                                        positionTempData[record['id'] || record['tempId']]['position_name'] = obj;

                                        this.setState({
                                            positionTempData,

                                            needSave: true
                                        })
                                    }} />
                                </div>
                            );
                        }
                    })()
                );
            }
        }, {
            title: "审批额度",
            dataIndex: 'limitTo_name',
            width: 200,
            render: (val, record, index) => {
                return (
                    (() => {
                        if (!this.props.editing) {
                            return <div>{`¥ ${format.currency(val || 0)}`}</div>
                        } else {
                            return (
                                <Input
                                    value={this.state.limitToTempData[record['id'] || record['tempId']] ? this.state.limitToTempData[record['id'] || record['tempId']]['limitTo'] : val}
                                    onChange={(e) => {
                                        this.handleLimitToChange(e, record, index)
                                    }}
                                    className={(() => {
                                        return "found-table-row-input";
                                    })()} />
                            );
                        }
                    })()
                );
            }
        }
        ];

        // rowSelection object indicates the need for row selection
        const rowSelection = {
        };

        return (
            <div className="found-box" onClick={(e) => {

            }}>
                <div className="found-operator fn-clear">
                    <div className="found-operator-left">
                        <span>审批额度</span>
                    </div>
                    {(() => {

                        if (!this.props.editing) {
                            return (
                                <div className="found-operator-right">
                                    <Button type="primary" onClick={this.activeEdit} className="found-operator-right-normal">编辑</Button>
                                    <Button type="primary" onClick={this.addEdit} className="found-operator-right-normal">新增</Button>
                                </div>
                            );
                        } else {
                            return (
                                <div className="found-operator-right fn-clear">

                                    <Button onClick={this.cancelEdit} type="primary" className="found-operator-right-cancel">取消
                                         <Modal
                                            className="found-operator-right-modal"
                                            okText="离开" cancelText="保存"
                                            visible={this.state.visible}
                                            onOk={this.modalHandleOk}
                                            onCancel={this.modalHandleCancel}
                                            maskClosable={false}
                                            closable={false}>
                                            <div className="found-operator-right-modal-div">还有数据没有保存确定要离开吗?</div>
                                        </Modal>
                                    </Button>
                                    <Button onClick={this.saveEdit} type="primary" className={this.state.needSave ? "found-operator-right-normal" : "found-operator-right-negative"}>保存</Button>
                                    <Button onClick={this.addEdit} type="primary" className="found-operator-right-normal">新增</Button>
                                </div>
                            );
                        }
                    })()}
                </div>
                <div className="found-table-box" ref="membersTable" >
                    <Table
                        {...tableConfig}

                        columns={columns}
                        dataSource={data}
                        className={len > 10 ? "found-table" : "found-table found-table-padding"}
                        rowClassName={(record) => {
                            if (this.props.editing) {
                                return 'found-table-row found-table-row-editing';
                            } else {
                                return 'found-table-row';
                            }
                        }}
                        rowKey={record => {
                            return record['id'] ? record['id'] : 'temp' + record['tempId']
                        }}
                        pagination={false} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    let approvelLimitState = state.get('approvelLimitState');
    let approvelLimitData = approvelLimitState.get('approvelLimitData').toJS();
    let editing = approvelLimitState.get('editing');
    let saveSuccess = approvelLimitState.get('saveSuccess');
    let saveFail = approvelLimitState.get('saveFail');
    let saveMessage = approvelLimitState.get('saveMessage');

    return {
        approvelLimitData,
        editing,
        saveSuccess,
        saveFail,
        saveMessage,
        clientHeight: state.get('baseState').toJS().clientHeight
    };
}

function mapDispatchToProps(dispatch) {
    let method = {
        getApprovelLimitData,
        approvelLimitSaveData
    };
    let boundActionCreators = bindActionCreators(method, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApproveLimit);