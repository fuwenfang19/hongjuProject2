/**
 * Created by uncle on 2017/3/14.
 */
import * as types from '../../../actions/actionTypes';
import Immutable from 'immutable';
import * as workFlowConstants from '../../../constants/workflow/workflow'


const $$initialState = Immutable.fromJS({
	currentBigType: 2,//当前单据大类
	currentBillType: null,//当前单据类型

	activeBigTypeKey: '2',
	activeBillTypeKey: undefined,

	allDesigns: [],//所有的单据类型对应的流程定义
	currentDesign: {},//当前的流程定义
	currentDesignInfo: {},//当前流程定义详情

	allCanAddList: [],
	org_expr: {//所有的步骤表达式
		step_arr: [],
		step_high_arr: [],
		notify_arr: [],
		notify_high_arr: [],

	},
	condition_expr: {//所有的条件表达式
		con_arr: [],
		con_high_arr: [],
		trigger_con_arr: [],
		trigger_high_arr: [],
	},
	action_expr: {//所有的高级动作表达式 对应不同的单据大类
		2: [],
		3: [],
		7: [],
		15: []
	},
	allExpenseStandards: [],//所有设置过报销标准的费用
	showChangeNameModal: false,

});

const getSorter = (sortKey) => {
	return (item1, item2) => {
		return item1[sortKey] - item2[sortKey];
	}
};

export default function WorkFlowReducer($$state = $$initialState, action = {}) {
	let state = $$state.toJS();
	switch (action.type) {
		case types.GET_WORKFLOW_BILL_TYPES:
			return $$state.merge({allDesigns: action.payload});
		case types.GET_WORKFLOW_ADD_LIST:
			return $$state.merge({allCanAddList: action.payload});

		case types.GET_WORKFLOW_DESIGN_BY_ID:
			const info = JSON.parse(action.payload.info);
			//info中activities的actions(高级)存的是一个字符串，不是JSON对象，所以还需要转一下，呵呵
			info.activities.map((item) => {
				let actions = item.actions;
				item.notify = item.notify ? item.notify : [];
				if (actions === '[]' || actions === '' || actions === '{}' || actions === null || actions === undefined) {
					actions = [];
				} else {
					actions = JSON.parse(actions);
				}
				item.actions = actions;
				return item;
			});

			//去掉无条件的表达式，无条件的显示在前端处理，判断依据是beginConditions的长度是否为0
			info.beginConditions = info.beginConditions.filter((item) => {
				return item.designId !== 2;
			});

			return $$state.merge({
				currentDesign: action.payload,
				currentDesignInfo: info,
				currentBigType: info.toptype,//当前单据大类
				currentBillType: info.typeid,//当前单据类型
			});

		case types.GET_WORKFLOW_CONDITIONS_EXPR:
			const condition_expr = action.payload;
			const con_arr = [];
			const con_high_arr = [];
			const trigger_con_arr = [];
			const trigger_high_arr = [];

			condition_expr.forEach((item) => {
				if ([workFlowConstants.DTYPE.NOT_SHOW, workFlowConstants.DTYPE.ADVICE_CONDITION].indexOf(item.dType) === -1) {
					if (item[workFlowConstants.BASE_START_CONDITION_FLAG]) {//基础发起条件
						con_arr.push(item);
					} else {
						con_high_arr.push(item);
					}
					if (item[workFlowConstants.BASE_TRIGGER_CONDITION_FLAG]) {//基础触发条件
						trigger_con_arr.push(item);
					} else {
						trigger_high_arr.push(item);
					}
				}
			});

			con_high_arr.sort(getSorter(workFlowConstants.HIGH_START_CONDITION_ORDER_FLAG));
			trigger_high_arr.sort(getSorter(workFlowConstants.HIGH_TRIGGER_CONDITION_ORDER_FLAG));


			return $$state.merge({
				condition_expr: {
					con_arr: con_arr,
					con_high_arr: con_high_arr,
					trigger_con_arr: trigger_con_arr,
					trigger_high_arr: trigger_high_arr,
				}
			});

		case types.GET_WORKFLOW_ORG_EXPR:
			const org_expr = action.payload;

			const step_arr = [];
			const step_high_arr = [];
			const notify_arr = [];
			const notify_high_arr = [];

			org_expr.forEach((item) => {
				if (item.otype !== workFlowConstants.OTYPE.NOT_SHOW) {
					if (item[workFlowConstants.BASE_STEP_FLAG]) {
						step_arr.push(item);
					} else {
						step_high_arr.push(item);
					}
					if (item[workFlowConstants.BASE_NOTIFY_FLAG]) {
						notify_arr.push(item);
					} else {
						notify_high_arr.push(item);
					}
				}
			});
			step_high_arr.sort(getSorter(workFlowConstants.HIGH_STEP_ORDER_FLAG));
			notify_high_arr.sort(getSorter(workFlowConstants.HIGH_NOTIFY_ORDER_FLAG));

			return $$state.merge(
				{
					org_expr: {
						step_arr: step_arr,
						step_high_arr: step_high_arr,
						notify_arr: notify_arr,
						notify_high_arr: notify_high_arr,
					}
				});
		case types.GET_WORKFLOW_ACTIONS_EXPR:
			const actions = action.payload;
			return $$state.merge({
				action_expr: {
					2: actions.filter((item) => ([4, 5].indexOf(item.id) !== -1)),
					3: actions.filter((item) => ([1, 6].indexOf(item.id) !== -1)),
					7: actions.filter((item) => (false)),
					15: actions.filter((item) => ([8, 9].indexOf(item.id) !== -1)),
				}
			});

		//条件新增 编辑 删除
		case types.ADD_WORKFLOW_CONDITION:
			let newInfoConditions = state.currentDesignInfo.beginConditions.slice(0);
			newInfoConditions.push(action.payload);
			return $$state.updateIn(['currentDesignInfo', 'beginConditions'], () => {
				return newInfoConditions;
			});

		case types.UPDATE_WORKFLOW_CONDITION:
			let oldConditions = state.currentDesignInfo.beginConditions.slice(0);
			const editIndex = action.payload.index;
			oldConditions[editIndex] = action.payload.condition;

			return $$state.updateIn(['currentDesignInfo', 'beginConditions'], () => {
				return oldConditions;
			});

		case types.REMOVE_WORKFLOW_CONDITION:
			let newInfo_condition = state.currentDesignInfo.beginConditions.slice(0);
			newInfo_condition.splice(action.payload, 1);
			return $$state.updateIn(['currentDesignInfo', 'beginConditions'], () => {
				return newInfo_condition;
			});
		//步骤新增 编辑 删除
		case types.ADD_WORKFLOW_STEP:
			let newInfo = state.currentDesignInfo.activities.slice(0);
			newInfo.push({
				isSubmitterNeedApprove: false,//提交人是否需要审批
				isIgnoreDuplication: true,
				typeid: 0,
				performer: action.payload,
				repeater: null,
				startConditions: [],
				actions: [],
				notify: [],
				loopCondition: [],
				stepAudit: false,
				order: 999,
			});
			return $$state.updateIn(['currentDesignInfo', 'activities'], () => {
				return newInfo;
			});

		case types.UPDATE_WORKFLOW_STEP:
			let oldSteps = state.currentDesignInfo.activities.slice(0);
			const {stepIndex, editItemKey, editItemIndex, item} = action.payload;

			let currentEdit = oldSteps[stepIndex][editItemKey];

			// performer actions 是替换关系 不是改变值
			if (Object.prototype.toString.call(currentEdit) === '[object Object]' || editItemIndex === null) {
				oldSteps[stepIndex][editItemKey] = item;
			} else {
				oldSteps[stepIndex][editItemKey][editItemIndex] = item;
			}

			return $$state.updateIn(['currentDesignInfo', 'activities'], () => {
				return oldSteps;
			});

		case types.UPDATE_WORKFLOW_STEP_ORDER:
			return $$state.updateIn(['currentDesignInfo', 'activities'], () => {
				return action.payload;
			});

		case types.CHANGE_WORKFLOW_NAME://修改审批流名称
			let allDesigns = state.allDesigns;
			allDesigns.forEach((item) => {
				if (item.ptype_id === state.currentBigType) {
					item.processDesigns.forEach((design) => {
						if (design.id === state.currentDesign.id) {
							design.name = action.payload;
						}
					})
				}
			});
			return $$state.updateIn(['currentDesignInfo', 'name'], () => {
				return action.payload;
			}).set('allDesigns', allDesigns);

		case types.REMOVE_WORKFLOW_STEP:
			let newInfo_step = state.currentDesignInfo.activities.slice(0);
			newInfo_step.splice(action.payload, 1);
			return $$state.updateIn(['currentDesignInfo', 'activities'], () => {
				return newInfo_step;
			});
		case types.REMOVE_WORKFLOW_STEP_TRIGGER_CONDITION_OR_NOTIFY:
			let newInfo_steps = state.currentDesignInfo.activities.slice(0);
			const {editStepIndex, key, delIndex} = action.payload;
			newInfo_steps[editStepIndex][key].splice(delIndex, 1);
			return $$state.updateIn(['currentDesignInfo', 'activities'], () => {
				return newInfo_steps;
			});
		//启用停用
		case types.ON_OFF_WORKFLOW:
			return $$state.updateIn(['currentDesign', 'isused'], () => {
				return action.payload;
			});
		//保存 SAVE_WORKFLOW
		//删除 DELETE_WORKFLOW
		case types.DELETE_WORKFLOW:
			return $$state;
		//修改值 CHANGE_WORKFLOW_KEY_VALUE
		case types.CHANGE_WORKFLOW_KEY_VALUE:
			return $$state.updateIn(['currentDesignInfo', action.payload.key], () => {
				return action.payload.value;
			});
		case types.CHANGE_WORKFLOW_ROOT_KEY_VALUE:
			const {routerKey, value} = action.payload;
			let keyOfValue = action.payload.key;
			if (routerKey) {
				return $$state.updateIn([routerKey, keyOfValue], () => {
					return value
				});
			} else {
				return $$state.merge({
					[keyOfValue]: value
				});
			}

		case types.RESET_WORKFLOW_STEP:
			let old_Steps = state.currentDesignInfo.activities.slice(0);
			old_Steps[action.payload.index] = action.payload.value;
			return $$state.updateIn(['currentDesignInfo', 'activities'], () => {
				return old_Steps;
			});
		default:
			return $$state;
	}
}