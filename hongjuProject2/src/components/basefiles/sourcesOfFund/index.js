import React, { Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Button, Table, Input, Modal, Switch, Spin } from 'antd';
import { getSourceOfFundData, getSourceOfFundSaveData } from '../../../reducers/basefiles/sourcesOfFund/sourcesOfFundReducer';
import { bindActionCreators } from 'redux';
import * as types from '../../../actions/actionTypes';
import domUtil from '../../../global/utils/domutil';
import { Toast } from '../../common';

class sourcesOfFund extends Component {
    constructor() {
        super();
        this.state = {
            tempId: 1,
            data: [],
            codeTempData: {},
            nameTempData: {},
            statusTempData: {},
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
            codeTempData: {},
            nameTempData: {},
            statusTempData: {},
            needSave: false,
            visible: false,
            newFlag: false
        })
    }
    componentWillMount() {
        this.props.dispatch({
            type: types.SOURCE_OF_FUND_EDIT,
            payload: false
        });
        this.props.getSourceOfFundData();
    }
    componentWillReceiveProps(newProps) {
        if (newProps['saveSuccess']) {
            try {
                window.loading.remove();
            } catch (e) {

            }
            Toast.success('保存资金来源成功啦!');
            this.props.dispatch({
                type: types.SOURCE_OF_FUND_SAVE_SUCCESS,
                payload: false
            });
            this.props.dispatch({
                type: types.SOURCE_OF_FUND_EDIT,
                payload: false
            });
            //初始化状态
            this.initState();
            //重新获取数据
            this.props.getSourceOfFundData();
        }
        if (newProps['saveFail']) {
            try {
                window.loading.remove();
            } catch (e) {

            }
            Toast.error(newProps['saveMessage']);
            this.props.dispatch({
                type: types.SOURCE_OF_FUND_SAVE_FAIL,
                payload: false,
                message: ''
            });
        }
        this.setState({
            data: newProps['sourceOfFundData']
        });


    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.newFlag) {
            let len = this.state.data.length;
            let index = 1;
            for (let i = 0; i < len; i++) {
                if (this.state.data[i]['tempId']) {
                    index = len - i;
                    break;
                }
            }
            let ele = document.getElementById('input_temp' + (index));//input_temp_n
            let eleName = document.getElementById('input_temp_n' + (index));

            if (ele) {
                ele.addEventListener('keyup', (e) => {
                    let keyCode = e.keyCode;
                    if (this.props.editing && keyCode === 13) {
                        if (eleName) {
                            eleName.focus();
                        }
                    }
                })
                ele.focus();
                ele.scrollIntoView(true);
            }
            if (eleName) {
                eleName.addEventListener('keyup', (e) => {
                    let keyCode = e.keyCode;
                    if (this.props.editing && keyCode === 13) {
                        this.addEdit();
                    }
                })
            }
            this.setState({
                newFlag: false
            })
        }

    }

    //编辑
    activeEdit = () => {
        this.props.dispatch({
            type: types.SOURCE_OF_FUND_EDIT,
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
                type: types.SOURCE_OF_FUND_EDIT,
                payload: false
            });
        }
    }
    // 保存
    saveEdit = () => {

        if (!this.state.needSave) {
            return;
        }

        let data = this.handleMerge(this.state.data);
        let { codeArr, nameArr } = this.getRepeatCodeName(data);

        let len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i]['code'] === "") {
                Toast.warning('资金来源编码不能为空!');
                return;
            }
            if (data[i]['name'] === "") {
                Toast.warning('资金来源名称不能为空!');
                return;
            }
            if (data[i]['tempId']) {
                data[i] = {
                    code: data[i]['code'],
                    name: data[i]['name'],
                    status: data[i]['status']
                };
            }
        }

        if (codeArr.length > 0) {
            Toast.warning('资金来源编码不允许重复!');
            return;
        }
        if (nameArr.length > 0) {
            Toast.warning('资金来源名称不允许重复!');
            return;
        }
        window.loading.add();
        this.props.getSourceOfFundSaveData(data);

    }
    handleMerge = (stateData) => {

        // let stateData = this.state.data;
        let data = Immutable.fromJS(stateData).toJS();
        let len = data.length;

        let modifyData = {
            modifyCodes: this.state.codeTempData,
            modifyNames: this.state.nameTempData,
            modifyStatus: this.state.statusTempData
        };

        for (let key in modifyData['modifyCodes']) {
            data[key]['code'] = modifyData['modifyCodes'][key]['code'].trim();
        }
        for (let key in modifyData['modifyNames']) {
            data[key]['name'] = modifyData['modifyNames'][key]['name'].trim();
        }
        for (let key in modifyData['modifyStatus']) {
            data[key]['status'] = modifyData['modifyStatus'][key]['status'].trim();
        }
        return data;
    }
    //新增
    addEdit = () => {
        this.activeEdit();
        this.props.dispatch({
            type: types.SOURCE_OF_FUND_ADD,
            payload: {
                code: '',
                status: '正常',
                name: '',
                tempId: this.state.tempId
            }
        });
        this.setState({
            tempId: this.state.tempId + 1,
            needSave: true,
            newFlag: true
        });

    }
    // 编辑资金来源编码code
    handleCodeChange = (e, record, index) => {
        let codeTempData = this.state.codeTempData;
        codeTempData[index] = {};
        codeTempData[index]['code'] = e.target.value;
        this.setState({
            codeTempData,
            needSave: true
        });
    }
    // 编辑资金来源名称name
    handleNameChange = (e, record, index) => {
        let nameTempData = this.state.nameTempData;
        nameTempData[index] = {};
        nameTempData[index]['name'] = e.target.value;
        this.setState({
            nameTempData,
            needSave: true
        });
    }
    // 编辑启用状态status
    handleStatusChange = (checked, record, index) => {
        let statusTempData = this.state.statusTempData;
        statusTempData[index] = {};
        statusTempData[index]['status'] = checked ? '正常' : '停用';
        this.setState({
            statusTempData,
            needSave: true
        });
    }
    //模态对话框离开
    modalHandleOk = () => {

        this.props.dispatch({
            type: types.SOURCE_OF_FUND_EDIT,
            payload: false
        });
        //初始化
        this.initState();
        this.props.getSourceOfFundData();
    }
    //模态对话框保存
    modalHandleCancel = () => {
        // this.setState({
        //     visible: false,
        // });
        this.saveEdit();
    }
    getRepeatCodeName = (data) => {
        let codeArr = [];
        let nameArr = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = i + 1; j < data.length; j++) {
                if (data[i]['code'] === data[j]['code']) {
                    codeArr.push(i);
                    codeArr.push(j);
                }
                if (data[i]['name'] === data[j]['name']) {
                    nameArr.push(i);
                    nameArr.push(j);
                }
            }
        }
        codeArr = Immutable.Set(codeArr).toJS();
        nameArr = Immutable.Set(nameArr).toJS();

        return { codeArr, nameArr };

    }
    isValueInArr = (arr, index) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === index) {
                return true;
            }
        }
        return false;
    }

    render() {
        let isDummy = window.getUserInfo().isDummy;
        let offset = null;
        const tableHeaderHeight = 49;
        if (this.refs.membersTable) {
            offset = domUtil.getElementOffSet(this.refs.membersTable);
        }
        const tableConfig = {
            pagination: false,
            scroll: {
                x: false,
                y: this.props.clientHeight - (offset ? offset.top + tableHeaderHeight + 100 : 200)
            },
            expandedRowRender: false
        };

        // const data = this.state.data;
        const data = this.handleMerge(this.state.data);
        const { codeArr, nameArr } = this.getRepeatCodeName(data);

        const columns = [{
            title: <span className="found-table-box-header">资金来源编码</span>,
            dataIndex: 'code',
            width: 200,
            render: (val, record, index) => {

                return (
                    (() => {
                        if (!this.props.editing) {
                            return <div>{val}</div>
                        } else {
                            return (
                                <Input
                                    id={data[index]['id'] ? `input_a${data[index]['id']}` : `input_temp${data[index]['tempId']}`}
                                    value={this.state.codeTempData[index] ? this.state.codeTempData[index]['code'] : val}
                                    onChange={(e) => {
                                        this.handleCodeChange(e, record, index);
                                    }}
                                    className={(() => {
                                        if (this.isValueInArr(codeArr, index)) {
                                            return "found-table-row-input found-table-row-code-repeat";
                                        } else {
                                            return "found-table-row-input";
                                        }
                                    })()}
                                />
                            );
                        }
                    })()
                )
            }
        }, {
            title: <span className="found-table-box-header">资金来源名称</span>,
            dataIndex: 'name',
            width: 200,
            render: (val, record, index) => {

                return (
                    (() => {
                        if (!this.props.editing) {
                            return <div>{val}</div>
                        } else {
                            return (
                                <Input
                                    id={data[index]['id'] ? `input_b${data[index]['id']}` : `input_temp_n${data[index]['tempId']}`}
                                    value={this.state.nameTempData[index] ? this.state.nameTempData[index]['name'] : val}
                                    onChange={(e) => {
                                        this.handleNameChange(e, record, index);
                                    }}
                                    className={(() => {
                                        if (this.isValueInArr(nameArr, index)) {
                                            return "found-table-row-input found-table-row-name-repeat";
                                        } else {
                                            return "found-table-row-input";
                                        }
                                    })()} />
                            );
                        }
                    })()
                )
            }
        }, {
            title: '资金来源状态',
            dataIndex: 'status',
            width: 200,
            render: (val, record, index) => {

                return (
                    (() => {
                        if (!this.props.editing) {
                            return <div>{val === '正常' ? '启用' : '停用'}</div>
                        } else {
                            return (
                                <div>
                                    <span className="found-table-row-swich-title">{val === '正常' ? '启用' : '停用'}</span>
                                    <Switch
                                        onChange={(checked) => {
                                            this.handleStatusChange(checked, record, index)
                                        }}

                                        checked={this.state.statusTempData[index] ? (this.state.statusTempData[index]['status'] === '正常' ? true : false) : val === '正常' ? true : false} />
                                </div>
                            );
                        }
                    })()
                )
            }
        }];

        // rowSelection object indicates the need for row selection
        const rowSelection = {
        };
        if (this.props.getSourceOfFundDataSuccess) {
            return (
                <div className="found-box">
                    <div className="found-operator fn-clear">
                        <div className="found-operator-left">
                            <span>资金来源</span>
                            <i>{`${data.length}个`}</i>
                        </div>
                        {(() => {
                            //小微企业才显示编辑
                            if (!isDummy) {
                                return '';
                            }
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
                    <div className="found-table-box" ref="membersTable">
                        <Table
                            {...tableConfig}

                            columns={columns}
                            dataSource={data}
                            className="found-table"
                            rowClassName={(record) => {
                                if (this.props.editing) {
                                    return 'found-table-row found-table-row-editing';
                                } else {
                                    return 'found-table-row';
                                }

                            }}
                            rowKey={record => record['id'] ? record['id'] : 'temp' + record['tempId']}
                            pagination={false} />
                    </div>
                </div>
            );

        } else {
            return (
                <Spin tip="Loading...">
                </Spin>
            );
        }

    }
}

function mapStateToProps(state) {
    let sourcesOfFundState = state.get('sourcesOfFundState');
    let sourceOfFundData = sourcesOfFundState.get('sourceOfFundData').toJS();
    let editing = sourcesOfFundState.get('editing');
    let saveSuccess = sourcesOfFundState.get('saveSuccess');
    let saveFail = sourcesOfFundState.get('saveFail');
    let saveMessage = sourcesOfFundState.get('saveMessage');
    let getSourceOfFundDataSuccess = sourcesOfFundState.get('getSourceOfFundDataSuccess');
    return {
        sourceOfFundData,
        getSourceOfFundDataSuccess,
        editing,
        saveSuccess,
        saveFail,
        saveMessage,
        clientHeight: state.get('baseState').toJS().clientHeight
    };
}

function mapDispatchToProps(dispatch) {
    let method = {
        getSourceOfFundData,
        getSourceOfFundSaveData
    };
    let boundActionCreators = bindActionCreators(method, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(sourcesOfFund);