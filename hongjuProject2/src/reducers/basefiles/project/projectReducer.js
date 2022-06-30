/**
 * Created by uncle on 17/2/12.
 */
import * as types from '../../../actions/actionTypes';
import * as projectConstants from '../../../constants/basefiles/project'
import Immutable from 'immutable';
import {constructTree, changeTreeNode} from '../../../global/utils/tree';
import moment from 'moment';

const $$initialState = Immutable.fromJS({
	projectList: [],//停用的项目列表
	showRightPage: false,
	searchKey: '',
	showingDisableList: false,
	currentProject: {},//当前选中的项目
	editingProject: {
		"id": null,
		"parent": "",
		"code": "",
		"name": "",
		"isCommon": true,
		"searchName": "",
		"target": "",
		"department": null,
		"manager": null,
		"director_id": null,
		"finManager": null,
		"status": "正常",
		"startDate": new Date(),
		"endDate": null
	},//当前编辑的项目/新增项目模板对象
	editFields: [
		{code: 'code', labelName: '项目编码', inputType: 'input', isRequire: true},
		{code: 'name', labelName: '项目名称', inputType: 'input', isRequire: true},
		{code: 'searchName', labelName: '项目别名', inputType: 'input'},
		{code: 'department', labelName: '所属部门', inputType: 'department', choosing: false},
		{code: 'director', labelName: '项目总监', inputType: 'staff', choosing: false},
		{code: 'manager', labelName: '项目经理', inputType: 'staff', choosing: false},
		{code: 'finManager', labelName: '财务主管', inputType: 'staff', choosing: false},
		{code: 'startDate', labelName: '开始时间', inputType: 'date', disabled: true},
		{code: 'status', labelName: '项目状态', inputType: 'select'},
		{code: 'endDate', labelName: '结束时间', inputType: 'date', disabled: true},
		{code: 'isCommon', labelName: '公共项目', inputType: 'switch'},
	],
	editType: '',//add addChild edit batchEdit

	currentProjectMembers: [],//当前项目成员
	editingProjectMembers: [],//正在编辑的项目成员
	projectMemberSearchType: projectConstants.MEMBER_IN_PROJECT,//成员搜索过滤条件

	showEditModal: false,//是否在编辑
	showBatchEditModal: false,//是否在批量编辑
	isEditingMembers: false,//是否在编辑项目成员
	isAddingMembers: false,//是否在添加项目成员


	//tree
	projectData: null,
	projectPage: null
});

export default function ProjectPageReducer($$state = $$initialState, action = {}) {
	switch (action.type) {
		case types.PROJECT_FETCH_PROJECT:
			if (action.payload.isCommon || action.payload.staff.length === 0) {//如果没有项目成员
				return $$state.merge({
					'currentProject': action.payload,
					'currentProjectMembers': [],
					'editingProjectMembers': []
				});
			} else {
				return $$state.merge({'currentProject': action.payload});
			}

		case types.PROJECT_FETCH_PROJECT_MEMBERS:
			return $$state.merge({
				currentProjectMembers: action.payload.members,
				editingProjectMembers: action.payload.members,
				projectMemberSearchType: action.payload.status
			});

		case types.PROJECT_BEGIN_EDIT_PROJECT:
			return $$state.merge({
				'showEditModal': action.payload.editModalVisible,
				'editType': action.payload.editType,
				'editingProject': action.payload.editType === 'edit' ? $$state.get('currentProject') : $$initialState.get('editingProject')
			});

		case types.PROJECT_END_EDIT_PROJECT:
			return $$state.merge({'showEditModal': action.payload});

		case types.PROJECT_UPDATE_ADDING_PROJECT:
			return $$state.updateIn(['editingProject', action.payload.name], (value) => {
				return action.payload.value;
			});

		case types.PROJECT_BATCH_SYNC:
			return $$state.updateIn(['batchEditData', action.payload.name], (value) => {
				return action.payload.value;
			});

		case types.PROJECT_CHANGE_BATCH_EDIT_PROJECT_FLAG:
			return $$state.merge({'showBatchEditModal': action.payload});

		case types.PROJECT_CHANGE_ADD_MEMBERS_FLAG:
			return $$state.merge({'isAddingMembers': action.payload});

		case types.PROJECT_CHANGE_EDIT_MEMBERS_FLAG:
			return $$state.merge({
				'isEditingMembers': action.payload,
				'editingProjectMembers': $$state.get('currentProjectMembers')
			});

		case types.PROJECT_UPDATE_EDITING_MEMBERS:
			return $$state.updateIn(['editingProjectMembers', action.payload.index, 'status'], () => {
				return action.payload.member.status;
			});

		case types.PROJECT_CHANGE_FILE_CHOOSE_FLAG:
			return $$state.updateIn(['editFields', action.payload.index, 'choosing'], () => {
				return action.payload.flag;
			});

		case types.PROJECT_SAVE_MEMBERS:
			return $$state.merge({currentProjectMembers: $$state.get('editingProjectMembers')});

		case types.PROJECT_RELOAD_TREE://重新加载树
			return $$state;

		//tree
		case types.PROJECT_TREE_SET_PROJECT_DATA:
			// action['whichData'] === departmentData或者disburseData或者projectData
			let treeData = $$state.get(action['whichData']);
			let appendData = action.payload;

			const showRightPage = $$state.get('showRightPage');
			if (showRightPage) {

			} else {
				$$state = $$state.set('showRightPage', true);
			}
			return constructTree(treeData, appendData, $$state, action['whichData']);

		case types.PROJECT_TREE_SET_PAGE:
			// action['whichPage'] === departmentPage或者disbursePage或者projectPage

			return $$state.set(action['whichPage'], action.payload);

		case types.PROJECT_TREE_ClEAR:
			//清空数据
			$$state = $$state.set(action['whichData'], null);
			console.log(action['whichData']);
			return $$state.set(action['whichPage'], null);

		//新增项目 新增子项目
		case types.PROJECT_ADD_PROJECT:
			//如果是新加子项目 需要查找parent追加子节点
			let treeData1 = $$state.get('projectData');
			const payload = {
				data: [
					{
						isLeaf: true,
						...action.payload,
						parentId: action.payload.parent && action.payload.parent.id,
					},
				]
			};
			return constructTree(treeData1, payload, $$state, 'projectData');

		//编辑项目
		case types.PROJECT_UPDATE_PROJECT:
			let node = action.payload;
			node.parentId = node.parent;
			let treeData2 = $$state.get('projectData');

			return changeTreeNode($$state, 'projectData', treeData2, node);

		case types.PROJECT_GET_LIST:
			return $$state.merge({projectList: action.payload});
		case types.PROJECT_CHANGE_KEY_VALUE:
			return $$state.merge({[action.payload.key]: action.payload.value});
		default:
			return $$state;
	}
}