/**
 * Created by yangyfe on 17/2/12.
 */
import * as types from '../../actions/actionTypes';
import Immutable from 'immutable';
import {constructTree, changeTreeNode} from '../../global/utils/tree';
import * as departmentConstants from '../../constants/department/department'

const $$initialState = Immutable.fromJS({
    departmentList: [],//停用的项目列表
    searchKeys: '',
    showingDisableLists: false,
    departments: [],
    currentDepartment: {},
    currentDepartmentMembers: {},
    visible: false,
    editType: '',//add edit
    editingDepartment: {
        "id": null,
        "code": "",
        "name": "",
        "manager": null,
        "finManager": null,
        "busiSeq": null,
        "status": "正常",
        "isFinal": false,
        "startDate": new Date(),
        "endDate": null,
        "parent": null,
    },//新增、编辑部门模板对象
    editFields: [
        {code: 'code', labelName: '部门编码', inputType: 'input', isRequire: true},
        {code: 'name', labelName: '部门名称', inputType: 'input', isRequire: true},
        {code: 'manager', labelName: '部门主管', inputType: 'staff', choosing: false},
        {code: 'finManager', labelName: '财务主管', inputType: 'staff', choosing: false},
        {code: 'busiSeqName', labelName: '业务序列', inputType: 'operation', choosing: false},
        {code: 'status', labelName: '部门状态', inputType: 'select'},
        {code: 'startDate', labelName: '开始时间', inputType: 'date', disabled: true},
        {code: 'endDate', labelName: '结束时间', inputType: 'date', disabled: true},
    ],
    editingDepartmentMembers: {
        "code": "",
        "mobile": "",
        "name": "",
        "email": "",
        "gender": "",
        "phone": null,
        "identification": null,
        "bankAccount": "",
        "department": {"id":'',"name":''},
        "startdate": new Date(),
        "enddate": null,
        "position": null,
        "personrank": null,
        "workPlace": null,
        "parent": null,
        "reportAgent": null,
        "status": "正常",
        "systemusedstatus": "正常",
        "missionneedapproval": true,
        "isCorpMobile": false,
        "needfillapplication": true,
        "id": "",
        "version": "2.0",
    },
    editMembersFields: [
        {code: 'code', labelName: '编码', inputType: 'input', isRequire: true},
        {code: 'name', labelName: '姓名', inputType: 'input', isRequire: true},
        {code: 'gender', labelName: '性别', inputType: 'danger', isRequire: true},
        {code: 'mobile', labelName: '手机号', inputType: 'input', isRequire: true},
        {code: 'department', labelName: '部门', inputType: 'department', isRequire: true},
        {code: 'parent', labelName: '上级主管', inputType: 'staff'},
        {code: 'position', labelName: '岗位', inputType: 'station'},
        {code: 'personrank', labelName: '人员级别', inputType: 'level',},
        {code: 'email', labelName: '邮箱', inputType: 'email'},
        {code: 'phone', labelName: '办公电话', inputType: 'input'},
        {code: 'identification', labelName: '身份证号码', inputType: 'input'},
        {code: 'bankAccount', labelName: '银行账号', inputType: 'input'},
        {code: 'reportAgent', labelName: '报销委托人', inputType: 'staff'},
        {code: 'workPlace', labelName: '工作地', inputType: 'city'},
        {code: 'startdate', labelName: '入职时间', inputType: 'date', disabled: true},
        {code: 'enddate', labelName: '离职时间', inputType: 'date', disabled: true},
        {code: 'status', labelName: '成员状态', inputType: 'select'},
        {code: 'line', labelName: '', inputType: 'line'},
        {code: 'missionneedapproval', labelName: '差旅申请单需审批', inputType: 'switch'},
        {code: 'needfillapplication', labelName: '差旅申请单需填写', inputType: 'switch'},
        {code: 'isCorpMobile', labelName: '手机号归企业所有', inputType: 'switch'},
        {code: 'systemusedstatus', labelName: '允许登录系统', inputType: 'switch1'},
    ],
    editMembersType: "",//addMembers  editMembers
    currentDepartmentMembers: {},//当前部门成员
    currentDepartmentMemberDetails: {
        "code": "",
        "name": "",
        "gender": "",
        "mobile": "",
        "department": "",
        "parent": "",
        "position": "",
        "personrank": "",
        "email": "",
        "phone": "",
        "identification": "",
        "bankAccount": "",
        "address": "",
        "inviteStatus": "",
        "startdate": "",
        "version": "2.0",
    },
    BatchAllDepartment: {
        "edittype": "",
        "parent": "",
        "reportAgent": "",
        "staffids": []
    },
    departmentMemberSearchType: departmentConstants.MEMBER_IN_DEPARTMENT,//成员搜索过滤条件
    showEditModal: false,
    showMembersEditModal: false,
    showBatchEditModal: false,
    isEditingMembers: false,//是否在编辑部门成员
    isAddingMembers: false,//是否在添加部门成员
    quitStaffs: {},//离职人员

    //tree
    departmentData: null,
    departmentPage: null,
    pagenum: '',
    version: '2.0',
    namelike: '',
    staffids: [],
    showDepartmentRightPage: false,
});

export default function DepartmentPageReducer($$state = $$initialState, action = {}) {
    switch (action.type) {
        case types.FETCH_ALL_DEPTS:
            return $$state.set('currentDepartment', action.payload.returnData);
        case types.FETCH_ALL_DEPTS_COMPANY:
            return $$state.set('currentDepartment', action.payload);
        case types.DEPARTMENT_MEMBERS:
            return $$state.merge({
                currentDepartmentMembers: action.payload.returnData,
                departmentMemberSearchType: action.payload.status,
                status: action.payload.status

            });
        case types.DEPARTMENT_MEMBERS_DETAILS:
            return $$state.merge({
                currentDepartmentMemberDetails: action.payload.returnData,
                visible: action.payload.visible,
                pagenum: action.payload.pagenum
            });
        case types.DEPARTMENT_BEGIN_EDIT:
            return $$state.merge({
                'showEditModal': action.payload.editModalVisible,
                'editType': action.payload.editType,
                'editingDepartment': action.payload.editType === 'edit' ? $$state.get('currentDepartment') : $$initialState.get('editingDepartment')
            });
        case types.DEPARTMENT_END_EDIT:
            return $$state.set('showEditModal', action.payload);
        case types.DEPARTMENT_UPDATE_ADDING:
            return $$state.updateIn(['editingDepartment', action.payload.name], (value) => {
                return action.payload.value;
            });
        case types.DEPARTMENT_BATCH_SYNC:
            return $$state.updateIn(['batchEditData', action.payload.name], (value) => {
                return action.payload.value;
            });
        // case types.DEPARTMENT_BATCH_UPDATE:
        // 	return $$state.merge({'showBatchEditModal': action.payload});
        case types.DEPARTMENT_CHANGE_BATCH_EDIT_DEPARTMENT_FLAG:
            return $$state.merge({'showBatchEditModal': action.payload});
        case types.DEPARTMENT_CHANGE_ADD_MEMBERS_FLAG:
            return $$state.merge({'isAddingMembers': action.payload});
        case types.DEPARTMENT_CHANGE_EDIT_MEMBERS_FLAG:
            return $$state.merge({
                'isEditingMembers': action.payload,
                'editingDepartmentMembers': $$state.get('editingDepartmentMembers')
            });
        case types.DEPARTMENT_UPDATE_EDITING_MEMBERS:
            return $$state.updateIn(['editingDepartmentMembers', action.payload.index, 'status'], () => {
                return action.payload.member.status;
            });
        case types.DEPARTMENT_CHANGE_FILE_CHOOSE_FLAG:
            return $$state.updateIn(['editFields', action.payload.index, 'choosing'], () => {
                return action.payload.flag;
            });
        case types.DEPARTMENT_CHANGE_FILE_CHOOSE_FLAG_MEMBERS:
            return $$state.updateIn(['editMembersFields', action.payload.index, 'choosing'], () => {
                return action.payload.flag;
            });
        case types.DEPARTMENT_SAVE_MEMBERS:
            return $$state.merge({currentDepartmentMemberDetails: $$state.get('editingDepartmentMembers')});
        case types.DEPARTMENT_RELOAD_TREE://重新加载树
            return $$state
        //新增部门 新增子部门
        case types.DEPARTMENT_ADD_DEPARTMENT:
            //如果是新加子部门 需要查找parent追加子节点
            let treeData1 = $$state.get('departmentData');
            const payload = {
                data: [
                    {
                        isLeaf: true,
                        ...action.payload,
                        parentId: action.payload.parent,
                    },
                ]
            };
            return constructTree(treeData1, payload, $$state, 'departmentData');

        //编辑部门
        case types.TREE_UPDATE_DEPARTMENT:
            return $$state.merge({currentDepartment: action.payload, editingDepartment: action.payload});
        case types.DEPARTMENT_UPDATE:
            let node = action.payload;
            node.parentId = node.parent;
            let treeData2 = $$state.get('departmentData');
            return changeTreeNode($$state, 'departmentData', treeData2, node);


        case types.DEPARTMENT_QUIT_STAFFS:
            return $$state.set('quitStaffs', action.payload);
        case types.DEPARTMENT_INVITE_STAFFS:
            return $$state.set('staffInvite', action.payload);

        //tree
        case types.DEPARTMENT_TREE_SET_DEPARTMENT_DATA:
            let treeData = $$state.get(action['whichData']);
            let appendData = action.payload;
            const showDepartmentRightPage = $$state.get('showDepartmentRightPage');
            if (showDepartmentRightPage) {

            } else {
                $$state = $$state.set('showDepartmentRightPage', true);
            }
            return constructTree(treeData, appendData, $$state, action['whichData']);
        case types.DEPARTMENT_TREE_SET_PAGE:
            return $$state.set(action['whichPage'], action.payload);
        case types.DEPARTMENT_TREE_ClEAR:
            //清空数据
            $$state = $$state.set(action['whichData'], null);
            return $$state.set(action['whichPage'], null);
        case types.DEPARTMENT_SEARCH_STAFFS:
            return $$state.merge({
                staffSearch: action.payload.returnData,
                keyword: action.payload.keyword,
                status: action.payload.status
            });
        case types.DEPARTMENT_SEARCH_ENDS:
            return $$state.set('currentDepartmentMembers', $$state.get('currentDepartmentMembers').set('rows', action.payload));


        //新增、编辑部门成员
        case types.DEPARTMENT_BEGIN_EDIT_MEMBERS:
            let newMember = {};


            //转换成和新增时一样的数据结构

            let currentDepartment = $$state.toJS().currentDepartment;
            let editingDepartmentMembers = $$state.toJS().editingDepartmentMembers;
            editingDepartmentMembers.department.id = currentDepartment.id;
            editingDepartmentMembers.department.name = currentDepartment.name;
            console.log(editingDepartmentMembers.department.id)
            return $$state.merge({
                'showMembersEditModal': action.payload.editModalVisible,
                'editMembersType': action.payload.editMembersType,
                'editingDepartmentMembers': action.payload.editMembersType === 'editMembers' ? $$state.get('currentDepartmentMemberDetails') : editingDepartmentMembers
            });
        case types.DEPARTMENT_END_EDIT_MEMBERS:
            return $$state.set('showMembersEditModal', action.payload);
        //新增部门成员
        case types.DEPARTMENT_ADD_DEPARTMENT_MEMBERS:
            const state = $$state.toJS();
            if (action.payload.department.id === state.currentDepartment.id) {//判断当前增加的人员是否属于当前部门
                let newRows = state.currentDepartmentMembers.rows.slice();
                newRows.push(action.payload);
                newRows = newRows.slice();
                return $$state.updateIn('currentDepartmentMembers', 'rows', () => {
                    return newRows;
                });
            } else {
                return $$state;
            }
        case types.DEPARTMENT_UPDATE_MEMBERS:
            return $$state.merge({currentDepartmentMembers: $$state.get('editingDepartmentMembers')});
        case types.DEPARTMENT_UPDATE_ADDING_MEMBERS:
            return $$state.updateIn(['editingDepartmentMembers', action.payload.name], (value) => {
                return action.payload.value;
            });
        //停用部门、搜索部门
        case types.DEPARTMENT_GET_LIST:
            return $$state.merge({departmentList: action.payload});
        case types.DEPARTMENT_CHANGE_KEY_VALUE:
            return $$state.merge({[action.payload.key]: action.payload.value});
        case types.DEPARTMENT_RESET_PASSWORD:
            return $$state.merge({});
        //详情的上一个下一个
        case types.NEXT_DEPARTMENT_MEMBERS_DETAIL:
            return $$state.merge({
                pagenum: action.payload.pagenum
            });
        case types.PREV_DEPARTMENT_MEMBERS_DETAIL:
            return $$state.merge({
                pagenum: action.payload.pagenum
            });
        case types.CHANGE_STAFFID:
            return $$state.merge({
                staffids: action.payload
            });
        default:
            return $$state;
    }
}
