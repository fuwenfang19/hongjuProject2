/**
 * Created by chezhanluo on 2017/3/14.
 */
import * as types from '../../../actions/actionTypes';
import Immutable from 'immutable';
import {constructTree, changeTestTreeNode} from '../../../global/utils/tree';

const $$initialState = Immutable.fromJS({
	currentDisburse: {},//当前选中的项目
	showRightPage: false,
	editingDisburse: {
		"id": null,
		"parent": "",
		"code": "",
		"name": "",
		"status": "正常"
	},
	disableDisburseList: [],
	//当前编辑的支出类型/新增支出类型模板对象
	editFields: [
		{code: 'code', labelName: '编码', inputType: 'input', isRequire: true, disabled: true},
		{code: 'name', labelName: '名称', inputType: 'input', isRequire: true},
		{code: 'parent', labelName: '上级编码', inputType: 'input'},
		{code: 'status', labelName: '状态', inputType: 'select'}
	],
	editNoParentFields: [
		{code: 'code', labelName: '编码', inputType: 'input', isRequire: true, disabled: true},
		{code: 'name', labelName: '名称', inputType: 'input', isRequire: true},
		{code: 'status', labelName: '状态', inputType: 'select'}
	],
	editType: '',//add addChild edit
	showEditModal: false,//是否在编辑
	showDisableDisburse: false,
	showEdit: false,
	showImportModel: true,
	canSaveValue: true,
	//tree
	disburseData: null,
	disbursePage: null
});
export default function DisbursePageReducer($$state = $$initialState, action = {}) {
	switch (action.type) {
		//详情
		case types.DISBURSE_FETCH_DISBURSE:
			return $$state.merge({'currentDisburse': action.payload});
		//编辑
		case types.DISBURSE_BEGIN_EDIT_DISBURSE:
			return $$state.merge({
				'showEditModal': action.payload.editModalVisible,
				'editType': action.payload.editType,
				'editingDisburse': action.payload.editType === 'edit' ? $$state.get('currentDisburse') : $$initialState.get('editingDisburse')
			});
		//编辑other
		case types.DISBURSE_BEGIN_EDIT_DISBURSE_OTHER:
			return $$state.merge({
				'showEdit': action.payload.showEdit,
				'editType': action.payload.editType,
				'editingDisburse': action.payload.editType === 'edit' ? $$state.get('currentDisburse') : $$initialState.get('editingDisburse')
			});
		// case  types.DISBURSE_SHOWIMPORTMODEL:
		//     return $$state.merge({
		//         'showImportModel': action.payload.showImportModel
		//     });
		case  types.DISBURSE_CANSAVE:
			return $$state.updateIn(['canSaveValue'], () => {
				return action.payload.canSaveValue;
			});
		// return $$state.merge({canSaveValue: action.payload.canSaveValue});
		case types.DISBURSE_END_EDIT_DISBURSE:
			return $$state.merge({'showEditModal': action.payload});
		case types.DISBURSE_RELOAD_TREE://重新加载树
			return $$state.merge({projects: [], currentDisburse: {}});
		case types.DISBURSE_EDIT_DISBURSE:
			return $$state.merge({editingDisburse: action.payload});
		//新增项目
		case types.DISBURSE_ADD_DISBURSE:
			//如果是新加子项目 需要查找parent追加子节点
			let treeData1 = $$state.get('disburseData');
			const payload = {
				data: [
					{
						isLeaf: true,
						...action.payload,
						parentId: action.payload.parent,
					},
				]
			};
			return constructTree(treeData1, payload, $$state, 'disburseData');
		//编辑支出类型
		case types.DISBURSE_UPDATE_DISBURSE:
			return $$state.merge({currentDisburse: action.payload, editingDisburse: action.payload});
		case types.DISBURSE_CHANGE_KEY_VALUE:
			return $$state.merge({
				[action.payload.key]: action.payload.value
			});
		case types.TREE_UPDATE_DISBURSE:
			let node = action.payload;
			node.parentId = node.parent;
			let treeData2 = $$state.get('disburseData');

			return changeTestTreeNode($$state, 'disburseData', treeData2, node);
		//tree
		case types.DISBURSE_TREE_SET_PROJECT_DATA:
			// action['whichData'] === departmentData或者disburseData或者projectData
			let treeData = $$state.get(action['whichData']);
			let appendData = action.payload;

			const showRightPage = $$state.get('showRightPage');
			if (showRightPage) {

			} else {
				$$state = $$state.set('showRightPage', true);
			}

			return constructTree(treeData, appendData, $$state, action['whichData']);
		case types.DISBURSE_STATUS:
			return $$state.merge({currentDisburse: action.payload});
		case types.DISABLE_DISBURSE_STATUS:
			return $$state.merge({showDisableDisburse: action.payload});
		case types.DISBURSE_TREE_SET_PAGE:
			return $$state.set(action['whichPage'], action.payload);
		case types.DISABLE_DISBURSE_LIST:
			if (action.payload.length > 0) {
				return $$state.merge({disableDisburseList: action.payload});
			} else {
				return $$state.merge({disableDisburseList: 'null'});
			}

		case types.DISBURSE_TREE_ClEAR:
			//清空数据
			$$state = $$state.set(action['whichData'], null);
			return $$state.set(action['whichPage'], null);

		default:
			return $$state;
	}
}