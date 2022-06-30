/**
 * Created by yangyfe on 2017/2/24.
 * 带有数据的列表页面组件
 */
import React, {Component} from 'react';
import {Table, Row, Col, Icon, Button, Input, Switch, Modal, Radio, Tooltip, Spin} from 'antd';
import {connect} from 'react-redux';
import domUtil from '../../global/utils/domutil';
import {getCustomMembers, SaveEidtData} from '../../reducers/customFiles/customFilesReducer';
import * as types from '../../actions/actionTypes';

import Immutable from 'immutable';
import {Toast, NoInfo} from '../common';
import {bindActionCreators} from 'redux';
const RadioGroup = Radio.Group;
const Search = Input.Search;
class CustomFileInfo extends Component {
    constructor() {
        super();
        this.state = {
            tempId: 1,
            data: [],
            codeTempData: {},
            nameTempData: {},
            remarkTempData: {},
            statusTempData: {},
            needSave: false,
            selectedRowKeys: [],
            visible: false,
            newFlag: false,
            detailBodyItems: [],
            bodyDelArr: [],
            detailBodyItems: [],
            searchValue: ''
        };
        this.start = this.start.bind(this);
        this.testConfirm = this.testConfirm.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.downloadTemplate = this.downloadTemplate.bind(this);
        this.showCustomExpandList = this.showCustomExpandList.bind(this);
    }

    initState = () => {
        this.setState({
            tempId: 1,
            data: [],
            codeTempData: {},
            nameTempData: {},
            remarkTempData: {},
            statusTempData: {},
            needSave: false,
            selectedRowKeys: [],
            visible: false,
            newFlag: false,
            detailBodyItems: [],
            bodyDelArr: [],
            detailBodyItems: [],
            searchValue: ''
        })
    }

    componentWillMount() {
        // this.props.getCustomMembers();
        this.props.dispatch({
            type: types.CUSTOM_FUND_EDIT,
            payload: false
        });
        this.props.getCustomMembers();
    }

    //保存的成功与失败
    componentWillReceiveProps(newProps) {
        if (newProps['saveSuccess']) {
            try {
                window.loading.remove();
            } catch (e) {

            }
            Toast.success('数据保存成功');
            this.props.dispatch({
                type: types.CUSTOM_SAVE_SUCCESS,
                payload: false
            });
            this.props.dispatch({
                type: types.CUSTOM_FUND_EDIT,
                payload: false
            });
            this.props.dispatch({
                type: types.ADD_NEW_CUSTOM,
                payload: false
            })
            //初始化状态
            this.initState();
            //重新获取数据
            this.props.getCustomMembers();
        }
        if (newProps['saveFail']) {
            try {
                window.loading.remove();
            } catch (e) {

            }
            Toast.error(newProps['saveMessage']);
            this.props.dispatch({
                type: types.CUSTOM_SAVE_FAIL,
                payload: false,
                message: ''
            });
        }
        this.setState({
            data: newProps['CustomMembers']
        });
    }

    start() {
        this.setState({loading: false});
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 100);
    }

    //判断搜索框的显示与隐藏
    handdlechange(e) {
        this.refs.departmentSearch1.className = "DepartmentData-page-head2-marg1 DepartmentData-page-head2-marg-show";
        this.refs.departmentSearch2.className = "DepartmentData-page-head2-marg-hide";
        this.handleClick();
    }

    //关闭搜索框
    closeSearch = () => {
        this.refs.departmentSearch1.className = "DepartmentData-page-head2-marg-hide";
        this.refs.departmentSearch2.className = "DepartmentData-page-head2-marg1 DepartmentData-page-head2-marg-show";
    }

    //选择记录
    onSelectChange(selectedRowKeys) {
        this.setState({selectedRowKeys});
    }

    //下载模板
    downloadTemplate() {
        this.props.downloadTemplate();
    }
    showCustomExpandList(){
        this.props.showCustomExpandList(true);
    }
    //导入数据
    testConfirm() {
        this.props.testConfirm();
    }

    //回车键切换光标
    componentDidUpdate(prevProps, prevState) {
        if (this.state.newFlag) {
            let len = this.state.data[this.props.currentIndex].childs.length;
            let index = 1;
            for (let i = 0; i < len; i++) {
                if (this.state.data[this.props.currentIndex].childs[i]['tempId']) {
                    index = len - i;
                    break;
                }
            }
            let ele = document.getElementById('input_temp' + (index));

            if (ele) {
                ele.focus();
                ele.scrollIntoView(true);
            }
            this.setState({
                newFlag: false
            })
        }
    }

    //编辑
    activeEdit = () => {
        this.props.dispatch({
            type: types.CUSTOM_FUND_EDIT,
            payload: true
        });
    }
    //取消
    cancelEdit = () => {
        if (this.state.needSave) {
            this.setState({
                visible: true,
            });
            this.props.dispatch({
                type: types.ADD_NEW_CUSTOM,
                payload: false
            })
        } else {
            this.props.dispatch({
                type: types.CUSTOM_FUND_EDIT,
                payload: false
            });
            this.props.dispatch({
                type: types.ADD_NEW_CUSTOM,
                payload: false
            })
        }
    }
    // 保存
    saveEdit = () => {
        // alert("点击保存");
        if (!this.state.needSave) {
            return;
        }

        let data = this.handleMerge(this.state.data);
        let len = data[this.props.currentIndex].childs.length;
        for (let i = 0; i < len; i++) {
            if (data[this.props.currentIndex]['childs'][i]['code'] === "") {
                Toast.warning('自定义档案编码不能为空!');
                return;
            }
            if (data[this.props.currentIndex]['childs'][i]['name'] === "") {
                Toast.warning('自定义档案名称不能为空!');
                return;
            }
        }
        window.loading.add();
        this.props.SaveEidtData(data);
    }
    handleMerge = (stateData) => {
        let data = Immutable.fromJS(stateData).toJS();
        let {codeTempData, nameTempData, remarkTempData, statusTempData} = this.state;
        for (let i in codeTempData) {
            data[this.props.currentIndex]['childs'][i]['code'] = codeTempData[i]['code'].trim();
        }
        for (let i in nameTempData) {
            data[this.props.currentIndex]['childs'][i]['name'] = nameTempData[i]['name'].trim();
        }
        for (let i in remarkTempData) {
            data[this.props.currentIndex]['childs'][i]['remark'] = remarkTempData[i]['remark'].trim();
        }
        for (let i in statusTempData) {
            data[this.props.currentIndex]['childs'][i]['enable'] = statusTempData[i]['enable'];
        }
        return data;
    }
    //新增
    addEdit = () => {
        this.activeEdit();
        this.props.dispatch({
            type: types.CUSTOM_FUND_ADD,
            payload: {
                code: '',
                enable: true,
                remark: '',
                name: '',
                id: null,
                tempId: this.state.tempId
            }
        });
        this.setState({
            tempId: this.state.tempId + 1,
            needSave: true,
            newFlag: true
        });
    }
    // 编辑自定义档案编码code
    handleCodeChange = (e, record, index) => {
        let codeTempData = this.state.codeTempData;
        codeTempData[index] = {};
        codeTempData[index]['code'] = e.target.value;
        this.setState({
            codeTempData,
            needSave: true
        });
    }
    // 编辑自定义档案名称name
    handleNameChange = (e, record, index) => {
        let nameTempData = this.state.nameTempData;
        nameTempData[index] = {};
        nameTempData[index]['name'] = e.target.value;
        this.setState({
            nameTempData,
            needSave: true
        });
    }
    //编辑自定义档案描述
    handleRemarkChange = (e, record, index) => {
        let remarkTempData = this.state.remarkTempData;
        remarkTempData[index] = {};
        remarkTempData[index]['remark'] = e.target.value;
        this.setState({
            remarkTempData,
            needSave: true
        });
    }
    // 编辑启用状态status
    handleStatusChange = (checked, record, index) => {
        let statusTempData = this.state.statusTempData;
        statusTempData[index] = {};
        statusTempData[index]['enable'] = checked ? true : false;
        this.setState({
            statusTempData,
            needSave: true,
        });
    }
    //取消按钮---模态对话框离开
    modalHandleOk = () => {
        this.props.dispatch({
            type: types.CUSTOM_FUND_EDIT,
            payload: false
        });
        this.initState();
        this.props.getCustomMembers();
    }
    //取消按钮---模态对话框保存
    modalHandleCancel = () => {
        this.saveEdit();
    }
    isValueInArr = (arr, index) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === index) {
                return true;
            }
        }
        return false;
    }
    // 修改remark值
    changeCustomRemark(e) {
        this.props.dispatch({
            type: types.CHANGE_REMARK,
            payload: e.target.value
        })
        this.setState({
            needSave: true
        });
    }

    // 修改name值
    changeCustomName(e) {
        this.props.dispatch({
            type: types.CHANGE_NAME,
            payload: e.target.value
        })
        this.setState({
            needSave: true
        });
    }

    // 单选框的选择
    changeRadio = (e) => {
        this.props.dispatch({
            type: types.CHANGE_ISPUBLIC,
            payload: e.target.value
        });
        this.setState({
            needSave: true
        });
    }
    //选择框选择列表
    handleSearch = (e) => {
        this.setState({
            searchValue: e.target.value
        }, function () {
            let arr = [];
            let searchValue = this.state.searchValue.trim();
            arr = this.props.CustomMembers[this.props.currentIndex].childs;
            let filterArr = []
            if (searchValue === '') {
                return arr
            } else {

                arr.map((item, i) => {
                    if (item['name'].toString().trim().indexOf(searchValue) > -1 || item['code'].toString().trim().indexOf(searchValue) > -1) {
                        filterArr.push(item);
                    }

                });
            }
            this.props.dispatch({
                type: types.SEARCH_TABLE_DATA,
                payload: filterArr
            })
        });


    }
//自动获取焦点
    handleClick = () => {
        const input = this.refs.myInput.refs.input;
        input.focus();
        input.setSelectionRange(0, input.value.length);
    };

    //修改switch
    change = (checked) => {
        this.props.dispatch({
            type: types.CHANGE_ISUSED_CUSTOMTILES,
            payload: checked
        })
    }
    //删除档案列表
    deleteTable = () => {
        this.props.dispatch({
            type: types.DELETE_TABLE_DATA,
            payload: null
        })
    }
    //人员列表的选择
    onSelectChange = (selectedRowKeys) => {
        this.props.dispatch({
            type: types.CHANGE_CUSTOM_STAFFID,
            payload: selectedRowKeys
        })
        this.setState({selectedRowKeys});
    }

    render() {
        const {CustomMembers, currentIndex} = this.props;
        const {dataSource} = this.state;
        const buttons = [
            // {
            //     key: 'btn1',
            //     size: 'small',
            //     type: 'primary',
            //     text: '下载模板',
            //     onClick: this.downloadTemplate,
            // },
            // {
            //     key: 'btn2',
            //     size: 'small',
            //     type: 'primary',
            //     text: '导入档案',
            //     onClick: this.testConfirm,
            //     disabled:CustomMembers[this.props.currentIndex].childs.length>1?false:true
            // },
            {
                key: 'btn4',
                size: 'small',
                type: 'primary',
                text: '编辑',
                onClick: this.activeEdit
            }
        ];
        //让table自适应高度
        let offset = null;
        const tableHeaderHeight = 49;
        if (this.refs.membersTable) {
            offset = domUtil.getElementOffSet(this.refs.membersTable);
        }
        const tableConfig = {
            pagination: false,
            scroll: {
                x: false,
                y: this.props.clientHeight - 310
            },
            expandedRowRender: false
        };
        const {loading, selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const data = this.state.data;
        const columns = [{
            title: '记录编码',
            dataIndex: 'code',
            width: 200,
            render: (val, record, index) => {
                return (
                    (() => {
                        if (!this.props.editing) {
                            return <Tooltip placement="topLeft" title={val}>
                                <div className="table-content" style={{
                                    overflow: 'hidden',
                                    maxWidth: '260px',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{val}</div>
                            </Tooltip>
                        } else {
                            return (
                                <Input
                                    id={data[this.props.currentIndex]['childs'][index]['id'] ? `input_a${data[this.props.currentIndex]['childs'][index]['id']}` : `input_temp${data[this.props.currentIndex]['childs'][index]['tempId']}`}
                                    value={this.state.codeTempData[index] ? this.state.codeTempData[index]['code'] : val}
                                    onChange={(e) => {
                                        this.handleCodeChange(e, record, index);
                                    }}
                                    className="found-table-row-input"
                                />
                            );
                        }
                    })()
                )
            }
        }, {
            title: '名称',
            dataIndex: 'name',
            width: 200,
            render: (val, record, index) => {
                return (
                    (() => {
                        if (!this.props.editing) {
                            return <Tooltip placement="topLeft" title={val}>
                                <div className="table-content" style={{
                                    overflow: 'hidden',
                                    maxWidth: '260px',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{val}</div>
                            </Tooltip>
                        } else {
                            return (
                                <Input
                                    value={this.state.nameTempData[index] ? this.state.nameTempData[index]['name'] : val}
                                    onChange={(e) => {
                                        this.handleNameChange(e, record, index);
                                    }}
                                    className="found-table-row-input"/>
                            );
                        }
                    })()
                )
            }
        }, {
            title: '描述',
            dataIndex: 'remark',
            width: 400,
            render: (val, record, index) => {
                return (
                    (() => {
                        if (!this.props.editing) {
                            return <Tooltip placement="topLeft" title={val}>
                                <div className="table-content" style={{
                                    overflow: 'hidden',
                                    maxWidth: '260px',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{val}</div>
                            </Tooltip>

                        } else {
                            return (
                                <Input
                                    value={this.state.remarkTempData[index] ? this.state.remarkTempData[index]['remark'] : val}
                                    onChange={(e) => {
                                        this.handleRemarkChange(e, record, index);
                                    }}
                                    className="found-table-row-input"
                                />

                            );
                        }
                    })()
                )
            }
        }, {
            title: '账号状态',
            dataIndex: 'enable',
            width: 200,
            render: (val, record, index) => {
                return (
                    (() => {
                        if (!this.props.editing) {
                            return <div className="table-content">{val === true ? '启用' : '停用'}</div>
                        } else {
                            return (
                                <div>
                                    {/*<span className="found-table-row-swich-title">{val === true? '启用' : '停用'}</span>*/}
                                    <Switch onChange={(checked) => {
                                        this.handleStatusChange(checked, record, index)
                                    }}
                                            checked={this.state.statusTempData[index] ? (this.state.statusTempData[index]['enable'] === true ? true : false) : (val === true ? true : false)}/>
                                </div>
                            );
                        }
                    })()
                )
            }
        }];
        return (
            <div>
                {
                    this.state.data.length >= 0 ? <div className="customFile-page">
                        <div className="gutter-box customFile-right">
                            {(() => {
                                if (!this.props.editing) {
                                    return (
                                        <div>
                                            <div className="content-right-head">
                                                <div className="head-left">
                                                    <Tooltip placement="topLeft"
                                                             title={CustomMembers[this.props.currentIndex].name}>
                                                        <span>{CustomMembers[this.props.currentIndex].name}</span>
                                                    </Tooltip>
                                                </div>
                                                <span className="head-right">
                                                    {/*{CustomMembers[this.props.currentIndex].isUsed == true?'启用':'停用'}<Switch*/}
                                                    {/*checked={CustomMembers[this.props.currentIndex].isUsed == true ? true : false}*/}
                                                    {/*onChange={this.change} className="switch"/>*/}
                                                    { /*<Button onClick={this.showCustomExpandList}
                                                             type="primary">扩展栏目</Button>*/}
                                                    {<Button onClick={this.downloadTemplate}
                                                             type="primary">下载模板</Button>}
                                                    {
                                                        this.props.CustomMembers.length > 1 ?
                                                            <Button onClick={this.testConfirm}
                                                                    type="primary">导入数据</Button>
                                                            :
                                                            <Button onClick={this.testConfirm} type="primary"
                                                                    disabled="CustomMembers[currentIndex].id == null">导入数据</Button>
                                                    }
                                                    {renderToolButton(buttons)}
                                                </span>
                                            </div>
                                            <div className="single-line"></div>
                                            <div>
                                                <Row>
                                                    {renderDeptInfoItem('使用范围', CustomMembers[this.props.currentIndex].isPublic == true ? "集团共享" : "公司私有", true)}
                                                    <Tooltip placement="topLeft"
                                                             title={CustomMembers[this.props.currentIndex].remark}>
                                                        {renderDeptInfoItem('档案描述', CustomMembers[this.props.currentIndex].remark, false)}
                                                    </Tooltip>

                                                </Row>
                                                <div className="single-line"></div>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    if (selectedRowKeys.length > 0) {
                                        return (
                                            <div>
                                                <div className="DepartmentData-page-head-hide"
                                                     style={{height: "56px", lineHeight: "56px"}}>
                                                    <div className="DepartmentData-page-head-hide1">
                                                        <Button type="primary" disabled={!selectedRowKeys.length}
                                                                onClick={this.start}>取消选择</Button>
                                                        <span
                                                            style={{marginLeft: 8}}>{selectedRowKeys.length ? `选择 ${selectedRowKeys.length} 档案记录` : ''}</span>
                                                    </div>
                                                    <div className="DepartmentData-page-head-hide2">
                                                        <span className="DepartmentData-page-head2-marg"
                                                              onClick={() => {
                                                                  this.deleteTable();
                                                              }}>
                                                            <Icon type="close"/>
                                                            <span>删除</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="single-line"></div>
                                                <div>
                                                    <Row>
                                                        {renderDeptInfoItem('使用范围', CustomMembers[this.props.currentIndex].isPublic == true ? "集团共享" : "公司私有", true)}
                                                        {renderDeptInfoItem('档案描述', CustomMembers[this.props.currentIndex].remark, false)}
                                                    </Row>
                                                    <div className="single-line"></div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div>
                                                <div className="content-right-head">
                                                    <Input type="text" className="content-right-head-input"
                                                           maxLength={100}
                                                           value={CustomMembers[this.props.currentIndex].name}
                                                           onChange={this.changeCustomName.bind(this)}/>

                                                    <span className="not-saved">{CustomMembers[this.props.currentIndex].id ? '':'[该自定义档案未保存]'}</span>

                                                    <span className="head-right">
                                                        {
                                                            this.props.addNewCustom == true && this.state.needSave == false?
                                                                null
                                                                :
                                                                <Button onClick={this.cancelEdit} type="primary">取消
                                                                    <Modal
                                                                        className="found-operator-right-modal"
                                                                        okText="离开" cancelText="保存"
                                                                        visible={this.state.visible}
                                                                        onOk={this.modalHandleOk}
                                                                        onCancel={this.modalHandleCancel}
                                                                        maskClosable={false}
                                                                        closable={false}
                                                                    >
                                                                        <div className="found-operator-right-modal-div">
                                                                            还有数据没有保存确定要离开吗?
                                                                        </div>
                                                                    </Modal>
                                                                </Button>
                                                        }
                                                        {
                                                            this.state.needSave ?
                                                                <Button onClick={this.saveEdit}
                                                                        type="primary">保存</Button>
                                                                :
                                                                <Button onClick={this.saveEdit} type="primary"
                                                                        disabled="CustomMembers[currentIndex].id == null">保存</Button>
                                                        }
                                                    </span>
                                                </div>
                                                <div className="single-line"></div>
                                                <div>
                                                    <Row>
                                                        <div className="custom-remark">使用范围:&nbsp;
                                                            <RadioGroup className="custom-isUsed"
                                                                        onChange={this.changeRadio}
                                                                        value={this.props.CustomMembers[this.props.currentIndex].isPublic}>
                                                                <Radio value={true}>集团共享</Radio>
                                                                <Radio value={false}>公司私有</Radio>
                                                            </RadioGroup>
                                                        </div>
                                                        <div className="custom-remark">档案描述:&nbsp;
                                                            <input type="text"
                                                                   value={this.props.CustomMembers[this.props.currentIndex].remark}
                                                                   onChange={this.changeCustomRemark.bind(this)}
                                                                   className="content-right-head-input"/>
                                                        </div>
                                                    </Row>
                                                    <div className="single-line"></div>
                                                </div>
                                            </div>
                                        );
                                    }
                                }
                            })()}
                            <div className="DepartmentData-page-head" ref={"DepartmentData-page-head"}>
                                <div className="DepartmentData-page-head1">
                                    档案记录
                                </div>
                                <div className="DepartmentData-page-head-center" onClick={this.closeSearch}></div>
                                <div className="DepartmentData-page-head2">
                                    <div className="DepartmentData-page-head2-marg" onClick={this.addEdit}>
                                        <Icon type="plus-circle"></Icon>
                                        新增列表
                                    </div>
                                    <div className="DepartmentData-page-head2-marg" ref={"departmentSearch2"}
                                         onClick={this.handdlechange.bind(this)}
                                         style={{marginRight: '8px'}}>
                                        <Icon type="search"></Icon>
                                        搜索
                                    </div>
                                    <div className="DepartmentData-page-head2-marg1" ref={"departmentSearch1"}>
                                        <Input
                                            size={'large'}
                                            style={{marginTop: '5px'}}
                                            prefix={<Icon type="search" style={{marginLeft: '-8px'}}/>}
                                            value={this.state.searchValue}
                                            onChange={this.handleSearch}
                                            className="DepartmentData-page-head2-search DepartmentData-page-head2-marg"
                                            onFocus={this.inputOnFocus }
                                            ref="myInput"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div ref="membersTable">
                                <Table
                                    {...tableConfig}
                                    rowSelection={this.props.editing ? rowSelection : null}
                                    columns={columns}
                                    dataSource={this.state.searchValue == '' ? CustomMembers[this.props.currentIndex].childs : this.props.searchValues}
                                    className="found-table"
                                    rowKey={(record, index) => {
                                        return index;
                                    }}
                                    pagination={false}/>
                            </div>
                        </div>
                    </div> : null
                }
            </div>
        );
    }


}
//右侧功能按钮
function renderToolButton(buttons) {
    return buttons.map((button) => {
        return (
            <Button key={button.key} size={button.size} type={button.type} onClick={button.onClick}>
                {button.text}
            </Button>
        )
    })
}
//部门信息项
function renderDeptInfoItem(labelName, value, isRequire) {
    return (
        <Col className="gutter-row" span={6}>
            <div className="gutter-box">
                <span className="info-label">{labelName}{isRequire ?
                    <span className="require-star">*</span> : ''}:</span>
                <span className="info-value" style={{maxWidth: '160px', overflow: 'hidden'}}>{value}</span>
            </div>
        </Col>
    )
}
function mapStateToProps(state) {
    let customFilesState = state.get('customFilesState');
    let CustomMembers = customFilesState.get('CustomMembers').toJS();
    let editing = customFilesState.get('editing');
    let saveSuccess = customFilesState.get('saveSuccess');
    let saveFail = customFilesState.get('saveFail');
    let saveMessage = customFilesState.get('saveMessage');
    let staffPagenum = customFilesState.get('staffPagenum');
    let addNewCustom = customFilesState.get('addNewCustom');
    let searchValues = customFilesState.get('searchValues').toJS();
    return {
        CustomMembers,
        editing,
        saveSuccess,
        saveFail,
        saveMessage,
        staffPagenum,
        searchValues,
        addNewCustom,
        clientHeight: state.get('baseState').toJS().clientHeight
    };
}
function mapDispatchToProps(dispatch) {
    let method = {
        getCustomMembers,
        SaveEidtData
    };
    let boundActionCreators = bindActionCreators(method, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomFileInfo);



