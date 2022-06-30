/**
 * Created by yangyfe on 2017/2/22.
 * 部门成员
 * DepartmentFiles  无数据时的页面组件
 * DepartmentData 有数据时的页面组件
 * section  新增部门
 * subdivision 新增子部门
 */

import React, { Component } from 'react';
import { Icon, Button, Input, Checkbox, Spin } from 'antd';
import DepartmentFiles from './DepartmentFiles';
import DepartmentData from './DepartmentData';
import Searchbar from '../common/Searchbar';
import { connect } from 'react-redux';
import {
    getDepartmentById,
    getDepartmentMembersById,
    beginEditDepartment,
    endEditDepartment,
    beginBatchEditDepartment,
    endBatchEditDepartment,
    addDepartment,
    editDepartment,
    batchEditDepartment,
    batchSyncStoreDepartment,
    doBatchEditDepartment,
    updateAddingDepartment,
    beginEditDepartmentMembers,
    endEditDepartmentMembers,
    updateAddingDepartmentMembers,
    editDepartmentMembers,
    changeAddMembersFlagDepartment,
    updateEditingMembersDepartment,
    saveDepartmentMembers,
    addDepartmentMembers,
    changeFileChooseFlagDepartment,
    changeFileChooseFlagDepartmentMembers,
    changeEditMembersFlagDepartment,
    changeBatchEditDepartmentFlag,
    changeDepartmentStatus,
    getSearchDepartmentList,
    changeKeyValueOfDepartmentState,
    changeLeftMenuSelected,
} from '../../actions';
import { CommonTree, Confirm, Toast } from '../../components/common';
import * as actionTypes from '../../actions/actionTypes';
import * as types from '../../actions/actionTypes';
import { is } from 'immutable';
import NetWork from '../../global/utils/network';
import getQueryString from '../../global/utils/getQueryString';
import BatchEditDepartment from './BatchEditDepartment';
import EditDepartmentForm from './EditDepartmentForm';
import AddDepartmentMembers from './AddDepartmentMembers';
import { NewUserIntroduce } from '../common'


const Search = Input.Search;
class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal1Visible: false,
            modal2Visible: false,
            value: '',
            showTree: true
        }
        this.getDepartmentById = this.getDepartmentById.bind(this);
        this.onEditBegin = this.onEditBegin.bind(this);
        this.onEditOver = this.onEditOver.bind(this);
        this.onEditBeginMembers = this.onEditBeginMembers.bind(this);
        this.onEditOverMembers = this.onEditOverMembers.bind(this);
        this.changeEditMembersFlagDepartment = this.changeEditMembersFlagDepartment.bind(this);
        this.updateCurrentDepartment = this.updateCurrentDepartment.bind(this);
        this.onAddingDepartmentChange = this.onAddingDepartmentChange.bind(this);
        this.onAddingDepartmentChangeMembers = this.onAddingDepartmentChangeMembers.bind(this);
        this.switchItemStaffsShow = this.switchItemStaffsShow.bind(this);
        this.updateEditingMembersDepartment = this.updateEditingMembersDepartment.bind(this);
    }
    componentDidMount() {
        // var objsearch = document.getElementById('searchbar');
        // objsearch.className+=' searchbar1';
        // console.log(objsearch)
        const departmentState = this.props.$$departmentState.toJS();
        if (departmentState.departmentData != null && departmentState.departmentData.length === 0) {
            //TODO 先检查全局状态中无数据的情况下  是否已经进行过引导
            setTimeout(() => {
                //this.handleIsUserIntroduced(0)
                this.noDataUserIntroduce()
            }, 1000)
        } else {
            //TODO 先检查全局状态中有数据的情况下  是否已经进行过引导
            setTimeout(() => {
                this.handleIsUserIntroduced(1)
                //this.userIntroduce()
            }, 500)
        }
        const maxTimes = 20;
        let times = 1;
        const s = setInterval(() => {
            if (times >= maxTimes) {
                clearInterval(s);
            } else {
                if (document.querySelector('.lazy-tree-node:first-child span')) {
                    document.querySelector('.lazy-tree-node:first-child span').click();
                    clearInterval(s);
                } else {
                    times++;
                }
            }
        }, 1000)
    }
    handleIsUserIntroduced = (isEmpty) => {
        let uid = window.getUserInfo().uid
        let url = '/organization/getguidemessage/' + uid + '/'
        NetWork.get(url,
            (returnData) => {
                //记录在window.userIntroduceData全局里
                window.instroduceData = returnData
                if (isEmpty) {
                    const departmentData = returnData.department ? returnData.department.dataInstroduce : 0
                    if (!departmentData) {
                        //alert('没有引导过')
                        this.userIntroduce()
                    }
                } else {
                    const departmentData = returnData.department ? returnData.department.nodataInstroduce : 0
                    if (!departmentData) {
                        //alert('没有引导过')
                        this.noDataUserIntroduce()
                    }
                }
            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
    noDataUserIntroduce = () => {
        const target1 = document.getElementsByClassName('btn-container')[0].getElementsByClassName('ant-btn')[0]
        const target2 = document.getElementsByClassName('btn-container')[0].getElementsByClassName('ant-btn')[1]
        const target3 = document.getElementsByClassName('project-left-btns')[0]
        const userIntro = [{
            element: target1,
            info: { titlePic: '_downLoad_data', remark: '点击下载模板，将部门成员Excel文档整理到下载的模板中！' }, picUrl: '', arrow: 8
        },
        {
            element: target2,
            info: { titlePic: '_import_data', remark: '点击导入数据，将整理好的Excel文档导入到系统中！' }, picUrl: '', arrow: 2
        },
        {
            element: target3,
            info: { titlePic: '_add_department', remark: '点击新增部门，直接增加一个部门！ 选择一个部门点击新增子部门！' }, picUrl: '', arrow: 3
        }]
        setTimeout(() => {
            NewUserIntroduce.userIntroduce(this.noDataUserIntroduceOver, userIntro)
        }, 1000)
    }
    userIntroduce = () => {
        const target1 = document.getElementsByClassName('content-right')[0]
        const target2 = document.getElementsByClassName('content-right')[0]
        const target3 = document.getElementsByClassName('content-right')[0]
        const userIntro = [{
            element: target1,
            info: { titlePic: '', remark: '' }, picUrl: 'department_invite', arrow: 0
        },
        {
            element: target2,
            info: { titlePic: '', remark: '' }, picUrl: 'department_addPeople', arrow: 0
        },
        {
            element: target3,
            info: { titlePic: '', remark: '' }, picUrl: 'department_leavePeople', arrow: 0
        }]
        setTimeout(() => {
            NewUserIntroduce.userIntroduce(this.userIntroduceOver, userIntro)
        }, 1000)
    }
    userIntroduceOver = () => {
        //请求接口  写入已引导结束的标志
        let instroduceData = window.instroduceData
        const nodataInstroduce = instroduceData.department ? instroduceData.department.nodataInstroduce : 0
        instroduceData.department = { 'nodataInstroduce': nodataInstroduce, 'dataInstroduce': 1 }
        let uid = window.getUserInfo().uid
        NetWork.put('/organization/addguidemessage/' + uid + '/', instroduceData,
            (returnData) => {

            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
    noDataUserIntroduceOver = () => {
        //请求接口  写入已引导结束的标志
        let instroduceData = window.instroduceData
        const dataInstroduce = instroduceData.department ? instroduceData.department.dataInstroduce : 0

        instroduceData.department = { 'nodataInstroduce': 1, 'dataInstroduce': dataInstroduce }
        let uid = window.getUserInfo().uid
        NetWork.put('/organization/addguidemessage/' + uid + '/', instroduceData,
            (returnData) => {

            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(changeKeyValueOfDepartmentState('showDepartmentRightPage', false));
    };
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) || !(this.state === nextState || is(this.state, nextState));
    }

    //获取部门成员
    getDepartmentById(departmentId, status) {
        let root = document.querySelector('.company-root');
        let comDom = root.querySelector('.company-name');
        if(comDom){
            comDom.className = 'company-name company-name-active company-name-bg';
        }
        let chidlDom = root.querySelector('.tree-selected-bg');
        if (chidlDom) {
            let cn = chidlDom.className;
            chidlDom.className = cn.replace('tree-selected-bg', '');
        }



        window.loading.add();
        const { dispatch } = this.props;
        dispatch(getDepartmentById(departmentId, status.status))
    }

    // 新增编辑部门、子部门
    onEditBegin(editType) {
        this.props.dispatch(beginEditDepartment(editType));
    }

    onEditOver() {
        this.props.dispatch(endEditDepartment());
    }

    // 新增成员、编辑成员
    onEditBeginMembers(editMembersType) {
        this.props.dispatch(beginEditDepartmentMembers(editMembersType));
    }

    onEditOverMembers() {
        this.props.dispatch(endEditDepartmentMembers());
    }

    //保存正在编辑或者保存的部门成员
    updateCurrentDepartmentMembers = (departmentData) => {
        this.props.dispatch(addDepartmentMembers(departmentData));
    }
    changeEditMembersFlagDepartment(flag) {
        this.props.dispatch(changeEditMembersFlagDepartment(flag));
    }

    changeBatchEditDepartmentFlag = (flag) => {
        this.props.dispatch(changeBatchEditDepartmentFlag(flag));
    };

    changeAddMembersFlagDepartment = (flag) => {
        this.props.dispatch(changeAddMembersFlagDepartment(flag));
    };
    // 增部门档案选择是否显示
    changeFileChooseFlagDepartment = (index, flag) => {
        this.props.dispatch(changeFileChooseFlagDepartment(index, flag));
    };
    // 增成员档案选择是否显示
    changeFileChooseFlagDepartmentMembers = (index, flag) => {
        this.props.dispatch(changeFileChooseFlagDepartmentMembers(index, flag));
    };

    //保存部门成员修改
    saveMembersChange = () => {
        this.props.dispatch(saveDepartmentMembers());
    };

    addDepartmentMembers = (memberIds) => {
        this.props.dispatch(addDepartmentMembers(memberIds));
    };

    //更新正在编辑的member
    updateEditingMembersDepartment(index, member) {
        this.props.dispatch(updateEditingMembersDepartment(index, member))
    }

    onBatchDataChange = (filedData) => {
        this.props.dispatch(batchSyncStoreDepartment(filedData))
    };

    doBatchEditDepartment = () => {
        this.props.dispatch(doBatchEditDepartment());
    };
    //保存正在编辑或者保存的部门
    updateCurrentDepartment(departmentData) {
        this.props.dispatch(addDepartment(departmentData));
    }

    // 部门修改更新
    onAddingDepartmentChange(fieldData) {
        this.props.dispatch(updateAddingDepartment(fieldData));
    }

    // 修改部门成员更新
    onAddingDepartmentChangeMembers(fieldData) {
        this.props.dispatch(updateAddingDepartmentMembers(fieldData));
    }

    //切换离职在职时获取当前的id值
    switchItemStaffsShow(status) {
        this.props.dispatch(getDepartmentMembersById(this.props.$$departmentState.get('currentDepartment')['id'], status))
    }
    reloadTree = () => {
        this.setState({
            showTree: false,
        }, () => {
            setTimeout(() => {
                this.setState({
                    showTree: true
                })
            }, 100)
        });
    };
    //导入部门成员数据
    testConfirm = () => {
        const that = this
        const departmentState = that.props.$$departmentState.toJS();
        Confirm({
            title: '导入部门成员数据',
            isUpload: true,
            fileDataFormName: 'fileToUpload',
            uploadConfig: {
                url: NetWork.getUrl('/organization/importfromexcel/'),//上传的url
                data: { importcontent: 'department,staffitem' }
            },
            onFileUploadSuccess: (returnData) => {
                //返回的是上传结束后的response
                if (returnData.staffInfo.isOk) {
                    Toast.success('部门成员导入成功。');
                    this.reloadTree();
                } else {
                    Toast.error('部门成员导入失败，原因：' + returnData.staffInfo.error.join());
                }
                if (returnData.departInfo.isOk) {
                    Toast.success('部门导入成功。');
                    this.reloadTree();
                } else {
                    Toast.error('部门导入失败，原因：' + returnData.departInfo.error.join());
                }

            },
            onOk: () => {

            },
            onCancel: () => {
            }
        });
    }

    //下载模板
    downloadTemplate() {
        NetWork.download('/static/exceltemplate/department_template.xlsx');
    }
    //搜索部门，停用部门
    getDepartmentData = () => {
        const { dispatch } = this.props;
        dispatch(getSearchDepartmentList());
    };
    changeKeyValueOfDepartmentState = (key, value) => {
        const { dispatch } = this.props;
        dispatch(changeKeyValueOfDepartmentState(key, value));
        this.getDepartmentData();
    };
    //停用部门的点击
    onSelect = (departmentId, status) => {
        this.props.dispatch(getDepartmentById(departmentId, '停用'));
    }
    //是否启用部门
    changeDepartmentStatus = (value) => {
        this.props.dispatch(changeDepartmentStatus(value));
    }
    //返回首页
    goBackHomepage = () => {
        try {
            window.location.hash = '#/homePage?guide=true'
            this.props.dispatch(changeLeftMenuSelected('homePage'))

        } catch (e) {

        }
    }
    //批量编辑
    batchEditDepartment = (reqData) => {
        this.props.dispatch(batchEditDepartment(reqData));
    };
    companyCallback = () => {
        window.loading.add();
        let a = {
            id: null,
            lastupdate: "",
            code: "",
            name: "",
            startDate: "",
            endDate: null,
            status: "正常",
            managername: null,
            isFinal: true,
            finManagername: null,
            busiSeq: null,
            parent: null,
            busiSeqName: null,
            isEnd: false,
        }
        let root = document.querySelector('.company-root');
        let comDom = root.querySelector('.company-name');
        comDom.className = 'company-name company-name-active';
        if(comDom){
            let chidlDom = root.querySelector('.tree-selected');
            if(chidlDom){
                chidlDom.className = 'tree-title tree-selected tree-selected-bg';
            }
        }



        this.props.dispatch({
            type: types.FETCH_ALL_DEPTS_COMPANY,
            payload: a
        })
        this.props.dispatch(getDepartmentMembersById(null, '正常'))
    }
    render() {
        const { showTree } = this.state;
        const departmentState = this.props.$$departmentState.toJS();
        const { currentDepartment, editingDepartment, currentDepartmentMembers, editingDepartmentMembers, showingDisableLists, searchKeys, departmentList, status } = departmentState;
        const isFromHomepage = getQueryString('isFromHomepage');
        return (
            <div className="page department-page">
                {/*左侧的新增搜索项*/}
                {
                    currentDepartment == null ? null : <div className="gutter-box content-left">
                        <Searchbar
                            placeholder="搜索部门"
                            size={'large'}
                            style={{ width: '100%', marginTop: '6px', color: '#999' }}
                            onChange={e => this.changeKeyValueOfDepartmentState('searchKeys', e.target.value)}
                            onSearch={value => this.getDepartmentData()}
                        />
                        <div className="project-left-btns">

                            <Button className="add-btn" style={{ width: '46%' }} size={'default'} onClick={this.onEditBegin.bind(this, 'add')}>
                                <Icon type="plus-circle" />
                                新增部门
                            </Button>
                            <Button className="add-btn" style={{ width: '46%' }} size={'default'}
                                disabled={currentDepartment.id == null || currentDepartment.id === undefined}
                                onClick={this.onEditBegin.bind(this, 'addChild')}>
                                <Icon type="plus-circle" />
                                新增子部门
                            </Button>
                        </div>
                        <div style={{ margin: '10px 0 0 2%' }}>
                            <Checkbox checked={showingDisableLists}
                                onChange={(e) => {
                                    this.changeKeyValueOfDepartmentState('showingDisableLists', e.target.checked);
                                }}>停用的部门</Checkbox>
                        </div>
                        <br />
                        {/*<Button className={'add-btn'} onClick={this.getDepartmentById.bind(this, 224, "启用")}>伪树</Button>*/}
                        <div className="tree-container"
                            style={{ overflow: 'auto', height: this.props.baseState.clientHeight - 240 }}>
                            {showingDisableLists || searchKeys !== '' ?
                                (<ul className="department-wraper">
                                    {departmentList.length > 0 ?
                                        '' : <span style={{ marginLeft: '13px', color: '#999' }}>没有数据</span>}
                                    {departmentList.length != 'null' ?
                                        departmentList.map(function (item, key) {
                                            return (
                                                <li
                                                    className={item.id === currentDepartment.id ? 'department-item currentDepartment' : 'department-item'}
                                                    key={key}
                                                    onClick={() => this.onSelect(item.id)}>
                                                    <Icon type="file" />
                                                    <span style={{ marginLeft: '5px' }}>[{item.code}]</span>
                                                    <span style={{ marginLeft: '5px' }}>{item.name}</span>
                                                </li>
                                            )
                                        }, this) : <span style={{ marginLeft: '13px', color: '#999' }}>加载数据</span>
                                    }
                                </ul>)
                                :
                                <div>
                                    {
                                        showTree ?
                                            <CommonTree
                                                ref="tree"
                                                clearActionType={actionTypes.DEPARTMENT_TREE_ClEAR}
                                                treeDataActionType={actionTypes.DEPARTMENT_TREE_SET_DEPARTMENT_DATA}
                                                treePageActionType={actionTypes.DEPARTMENT_TREE_SET_PAGE}
                                                countperpage={10000}
                                                type='department'
                                                reducerState="departmentState"
                                                handleSelect={this.getDepartmentById}
                                                baseState={this.props.baseState}
                                                treeState={departmentState}
                                                dispatch={this.props.dispatch}
                                                companyCallback={this.companyCallback}
                                            />
                                            :
                                            null
                                    }
                                </div>
                            }
                        </div>
                    </div>
                }
                {/*右侧的表格数据*/}
                {
                    departmentState.showDepartmentRightPage && (departmentState.departmentData == null || departmentState.departmentData.length === 0) ?
                        <DepartmentFiles
                            testConfirm={this.testConfirm}
                            downloadTemplate={this.downloadTemplate}
                        ></DepartmentFiles> :
                        <div className="gutter-box content-right">
                            <DepartmentData ref="DepartmentData"
                                editType={departmentState.editType}
                                status={status}
                                editMembersType={departmentState.editMembersType}
                                editingDepartment={editingDepartment}
                                clientHeight={this.props.clientHeight}
                                onEditBegin={this.onEditBegin}
                                onEditOver={this.onEditOver}
                                onEditBeginMembers={this.onEditBeginMembers}
                                onEditOverMembers={this.onEditOverMembers}
                                updateCurrentDepartment={this.updateCurrentDepartment}
                                onFilesChange={this.onAddingDepartmentChange}
                                showEditModal={departmentState.showEditModal}
                                showMembersEditModal={departmentState.showMembersEditModal}
                                showBatchEditModal={departmentState.showBatchEditModal}
                                switchItemStaffsShow={this.switchItemStaffsShow}
                                testConfirm={this.testConfirm}
                                downloadTemplate={this.downloadTemplate}
                                currentDepartment={currentDepartment}
                                currentDepartmentMembers={currentDepartmentMembers}
                                changeAddMembersFlagDepartment={this.changeAddMembersFlagDepartment}
                                changeDepartmentStatus={this.changeDepartmentStatus}
                                changeBatchEditDepartmentFlag={this.changeBatchEditDepartmentFlag}
                            />
                        </div>
                }
                <EditDepartmentForm
                    currentDepartment={currentDepartment}
                    editingDepartment={editingDepartment}
                    editType={departmentState.editType}
                    editFields={departmentState.editFields}
                    showEditModal={departmentState.showEditModal}
                    onEditOver={this.onEditOver}
                    updateCurrentDepartment={this.updateCurrentDepartment}
                    changeFileChooseFlagDepartment={this.changeFileChooseFlagDepartment}
                    onFilesChange={this.onAddingDepartmentChange}
                >
                </EditDepartmentForm>

                <BatchEditDepartment
                    showBatchEditModal={departmentState.showBatchEditModal}
                    changeBatchEditDepartmentFlag={this.changeBatchEditDepartmentFlag}
                    batchEditDepartment={this.batchEditDepartment}>
                </BatchEditDepartment>

                <AddDepartmentMembers
                    currentDepartmentMembers={currentDepartmentMembers}
                    editingDepartmentMembers={editingDepartmentMembers}
                    editMembersType={departmentState.editMembersType}
                    editMembersFields={departmentState.editMembersFields}
                    showMembersEditModal={departmentState.showMembersEditModal}
                    onEditOverMembers={this.onEditOverMembers}
                    updateCurrentDepartmentMembers={this.updateCurrentDepartmentMembers}
                    changeFileChooseFlagDepartmentMembers={this.changeFileChooseFlagDepartmentMembers}
                    onFilesChange={this.onAddingDepartmentChangeMembers}
                >

                </AddDepartmentMembers>
                {
                    isFromHomepage ? (
                        <div className='backToHomepage' onClick={this.goBackHomepage}>返回新手引导</div>
                    ) : null
                }
            </div>
        )
    }
}
//将dispatch传递进来
function mapStateToProps(state) {
    return {
        $$departmentState: state.get('departmentState'),
        clientHeight: state.get('baseState').toJS().clientHeight,
        baseState: state.get('baseState').toJS()
    }
}
export default connect(mapStateToProps)(Department);
