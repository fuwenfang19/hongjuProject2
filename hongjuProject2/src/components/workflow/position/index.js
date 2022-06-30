import React, { Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Button, Table, Input, Modal, Switch } from 'antd';
import { getPositionData, positionSaveData } from '../../../reducers/workflow/position/positionReducer';
import { bindActionCreators } from 'redux';
import * as types from '../../../actions/actionTypes';
import domUtil from '../../../global/utils/domutil';
import { Toast } from '../../common';

class Position extends Component {
    constructor() {
        super();
        this.state = {
            tempId: 1,
            data: [],
            codeTempData: {},
            nameTempData: {},
            levelTempData: {},
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
            levelTempData: {},
            needSave: false,
            visible: false,
            newFlag: false
        })
    }
    componentWillMount() {
        this.props.dispatch({
            type: types.POSITION_EDIT,
            payload: false
        });
        this.props.getPositionData();
    }
    componentWillReceiveProps(newProps) {
        if (newProps['saveSuccess']) {
            try {
                window.loading.remove();
            } catch (e) {

            }
            Toast.success('数据保存成功');
            this.props.dispatch({
                type: types.POSITION_SAVE_SUCCESS,
                payload: false
            });
            this.props.dispatch({
                type: types.POSITION_EDIT,
                payload: false
            });
            //初始化状态
            this.initState();
            //重新获取数据
            this.props.getPositionData();
        }
        if (newProps['saveFail']) {
            try {
                window.loading.remove();
            } catch (e) {

            }
            Toast.error(newProps['saveMessage']);
            this.props.dispatch({
                type: types.POSITION_SAVE_FAIL,
                payload: false,
                message: ''
            });
        }
        this.setState({
            data: newProps['positionData']
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
            let ele = document.getElementById('input_temp' + (index));//input_temp
            let eleName = document.getElementById('input_temp_n' + (index));//input_temp_n
            let eleLevel = document.getElementById('input_temp_n_n' + (index));//input_temp_n_n

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
                        if (eleLevel) {
                            eleLevel.focus();
                        }
                    }
                })
            }
            if (eleLevel) {
                eleLevel.addEventListener('keyup', (e) => {
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
            type: types.POSITION_EDIT,
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
                type: types.POSITION_EDIT,
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

            if (data[i]['positionname'] === "") {
                Toast.warning('岗位名称不能为空!');
                return;
            }
            if (data[i]['positioncode'] === "") {
                Toast.warning('岗位编码不能为空!');
                return;
            }

            if (data[i]['tempId']) {
                data[i] = {
                    positioncode: data[i]['positioncode'],
                    positionname: data[i]['positionname'],
                    level: data[i]['level']
                };
            }
        }

        if (codeArr.length > 0) {
            Toast.warning('岗位编码不允许重复!');
            return;
        }
        if (nameArr.length > 0) {
            Toast.warning('岗位名称不允许重复!');
            return;
        }

        window.loading.add();
        this.props.positionSaveData(data);

    }
    handleMerge = (stateData) => {

        // let stateData = this.state.data;
        let data = Immutable.fromJS(stateData).toJS();
        let len = data.length;

        let modifyData = {
            modifyCodes: this.state.codeTempData,
            modifyNames: this.state.nameTempData,
            modifyLevel: this.state.levelTempData
        };

        for (let key in modifyData['modifyCodes']) {
            data[key]['positioncode'] = modifyData['modifyCodes'][key]['positioncode'].trim();
        }
        for (let key in modifyData['modifyNames']) {
            data[key]['positionname'] = modifyData['modifyNames'][key]['positionname'].trim();
        }
        for (let key in modifyData['modifyLevel']) {
            data[key]['level'] = modifyData['modifyLevel'][key]['level'].trim();
        }
        return data;
    }
    //新增
    addEdit = () => {
        this.activeEdit();
        this.props.dispatch({
            type: types.POSITION_ADD,
            payload: {
                positioncode: '',
                level: '',
                positionname: '',
                tempId: this.state.tempId
            }
        });
        this.setState({
            tempId: this.state.tempId + 1,
            needSave: true,
            newFlag: true
        });

    }
    // 编辑-资金来源编码code
    handleCodeChange = (e, record, index) => {
        let codeTempData = this.state.codeTempData;
        codeTempData[index] = {};
        ///^[A-Za-z0-9_-]*$/g
        let val = e.target.value;
        let reg = /^[A-Za-z0-9_-]*$/g;
        if (!reg.test(val)) {
            Toast.warning('岗位编码只能为数字字母下划线!');
            return;
        }
        codeTempData[index]['positioncode'] = val;
        this.setState({
            codeTempData,
            needSave: true
        });
    }
    // 编辑-资金来源名称name
    handleNameChange = (e, record, index) => {
        let nameTempData = this.state.nameTempData;
        nameTempData[index] = {};
        nameTempData[index]['positionname'] = e.target.value;
        this.setState({
            nameTempData,
            needSave: true
        });
    }
    // 编辑-启用状态level
    handleLevelChange = (e, record, index) => {
        let levelTempData = this.state.levelTempData;
        let val = e.target.value;
        const reg = /^(0|[1-9][0-9]*)$/;
        if ((!isNaN(val) && reg.test(val)) || val === '' || val === '-') {

        } else {
            Toast.info('岗位级别只允许输入整数!');
            return;
        }
        levelTempData[index] = {};
        levelTempData[index]['level'] = val;
        this.setState({
            levelTempData,
            needSave: true
        });
    }
    //模态对话框离开
    modalHandleOk = () => {

        this.props.dispatch({
            type: types.POSITION_EDIT,
            payload: false
        });
        //初始化
        this.initState();
        this.props.getPositionData();
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
                if (data[i]['positioncode'] === data[j]['positioncode']) {
                    codeArr.push(i);
                    codeArr.push(j);
                }
                if (data[i]['positionname'] === data[j]['positionname']) {
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
            title: <span className="found-table-box-header">岗位编码</span>,
            dataIndex: 'positioncode',
            width: 200,
            render: (val, record, index) => {

                return (
                    (() => {
                        if (!this.props.editing) {
                            return <div>{val}</div>
                        } else {
                            return (
                                <Input
                                    disabled={!!data[index]['id']}
                                    id={data[index]['id'] ? `input_a${data[index]['id']}` : `input_temp${data[index]['tempId']}`}
                                    value={this.state.codeTempData[index] ? this.state.codeTempData[index]['positioncode'] : val}
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
            title: <span className="found-table-box-header">岗位名称</span>,
            dataIndex: 'positionname',
            width: 200,
            render: (val, record, index) => {//input_temp_n

                return (
                    (() => {
                        if (!this.props.editing) {
                            return <div>{val}</div>
                        } else {
                            return (
                                <Input
                                    id={data[index]['id'] ? `input_b${data[index]['id']}` : `input_temp_n${data[index]['tempId']}`}
                                    value={this.state.nameTempData[index] ? this.state.nameTempData[index]['positionname'] : val}
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
            title: '岗位级别',
            dataIndex: 'level',
            width: 200,
            render: (val, record, index) => {

                return (
                    (() => {
                        if (!this.props.editing) {
                            return <div>{val}</div>
                        } else {
                            return (
                                <Input
                                    id={data[index]['id'] ? `input_c${data[index]['id']}` : `input_temp_n_n${data[index]['tempId']}`}
                                    value={this.state.levelTempData[index] ? this.state.levelTempData[index]['level'] : val}
                                    onChange={(e) => {
                                        this.handleLevelChange(e, record, index)
                                    }}
                                    className={(() => {
                                        return "found-table-row-input";
                                    })()} />
                            );
                        }
                    })()
                )
            }
        }];

        // rowSelection object indicates the need for row selection
        const rowSelection = {
        };

        return (
            <div className="found-box">
                <div className="found-operator fn-clear">
                    <div className="found-operator-left">
                        <span>岗位</span>
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
        )
    }
}

function mapStateToProps(state) {
    let positionState = state.get('positionState');
    let positionData = positionState.get('positionData').toJS();
    let editing = positionState.get('editing');
    let saveSuccess = positionState.get('saveSuccess');
    let saveFail = positionState.get('saveFail');
    let saveMessage = positionState.get('saveMessage');

    return {
        positionData,
        editing,
        saveSuccess,
        saveFail,
        saveMessage,
        clientHeight: state.get('baseState').toJS().clientHeight
    };
}

function mapDispatchToProps(dispatch) {
    let method = {
        getPositionData,
        positionSaveData
    };
    let boundActionCreators = bindActionCreators(method, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Position);