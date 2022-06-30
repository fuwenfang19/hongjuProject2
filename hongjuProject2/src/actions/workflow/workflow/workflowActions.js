/**
 * Created by uncle on 2017/3/14.
 */
import * as types from '../../actionTypes';
import workFlowInterface from '../../../global/utils/api';
import * as workFlowConstants from '../../../constants/workflow/workflow';
import NetWork from '../../../global/utils/network';
import {Toast} from '../../../components/common';
import _ from 'lodash';

const getWorkFlowState = (getState) => {
	return getState().get('workFlowState').toJS();
};

//无条件对应的保存表达式
export const noCondition = {
	design_id: 2,
	designId: 2,
	operate: null,
	value: null,
	dType: -2,//前端标识
	name: '无条件'
};

//获取所有单据类型和流程定义
export const getWorkFlowBillTypes = (defaultCurrentDesign) => {
	return (dispatch, getState) => {
		let url = workFlowInterface.GET_WORKFLOW_BILL_TYPES;
		window.loading.add();
		NetWork.get(url,
			(returnData) => {
				dispatch({
					type: types.GET_WORKFLOW_BILL_TYPES,
					payload: returnData
				});

				//设置默认的流程定义
				if (defaultCurrentDesign) {//给默认值了，按照默认值来
					if (defaultCurrentDesign.flowid) {
						dispatch(getWorkFlowById(defaultCurrentDesign, defaultCurrentDesign));
					}
				} else {//没有默认值默认第一条
					let defaultCurrentDesign = {};
					for (const item  of returnData) {
						if (item.ptype_id === 2 && item.processDesigns.length > 0) {
							defaultCurrentDesign = item.processDesigns[0];
							break;
						}
					}
					if (defaultCurrentDesign.flowid) {
						dispatch(getWorkFlowById(defaultCurrentDesign));
					}
				}

				window.loading.remove();

			},
			(returnData) => {
				Toast.error(returnData.msg);
				window.loading.remove();
			});
	}
};

//获取所有单据类型和流程定义
export const getWorkFlowAddList = () => {
	return (dispatch, getState) => {
		let url = workFlowInterface.GET_WORKFLOW_ADD_LIST;
		window.loading.add();
		NetWork.get(url,
			(returnData) => {
				dispatch({
					type: types.GET_WORKFLOW_ADD_LIST,
					payload: returnData
				});
				window.loading.remove();
			},
			(returnData) => {
				Toast.error(returnData.msg);
				window.loading.remove();
			});
	}
};

//获取流程定义
export const getWorkFlowById = (process, defaultFlow) => {
	return (dispatch, getState) => {
		const id = process.flowid;
		let url = workFlowInterface.GET_WORKFLOW_DESIGN_BY_ID.replace(':id', id);
		NetWork.get(url,
			(returnData) => {
				dispatch({
					type: types.GET_WORKFLOW_DESIGN_BY_ID,
					payload: returnData[0],
				});

				if (defaultFlow) {
					dispatch(changeWorkFlowRootKeyValue('activeBigTypeKey', `${defaultFlow.currentBigType}`));
					dispatch(changeWorkFlowRootKeyValue('activeBillTypeKey', `${defaultFlow.currentBigType}-${defaultFlow.typeid}`));
				} else {
					const state = getState().toJS().workFlowState;
					dispatch(changeWorkFlowRootKeyValue('activeBigTypeKey', `${state.currentBigType}`));
					dispatch(changeWorkFlowRootKeyValue('activeBillTypeKey', `${state.currentBigType}-${state.currentDesign.typeid}`));
				}
				const wfState = getWorkFlowState(getState);
				if (wfState.currentBigType === 3) {//如果是报销单，那么获取当前单据对应的设置过的费用类型
					dispatch(getWorkFlowExpense(wfState.currentDesign.typeid));
				}
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};

//获取组织表达式
export const getWorkFlowOrgExpr = () => {
	return (dispatch, getState) => {
		let url = workFlowInterface.GET_WORKFLOW_CONDITIONS_EXPR;
		NetWork.get(url,
			(returnData) => {
				dispatch({
					type: types.GET_WORKFLOW_CONDITIONS_EXPR,
					payload: returnData
				});
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};

//获取费用类型
export const getWorkFlowExpense = (reimTypeId) => {
	return (dispatch, getState) => {
		let url = workFlowInterface.GET_WORKFLOW_EXPENSE_STANDARDS.replace(':id', reimTypeId);
		NetWork.get(url,
			(datas) => {
				let arr = [];
				for (let i = 0; i < datas.length; i++) {
					let temp = {};
					temp.id = datas[i].id;
					temp.name = datas[i].rule.name;
					arr.push(temp);
				}
				dispatch(changeWorkFlowRootKeyValue('allExpenseStandards', arr));
			},
			(returnData) => {
				if (returnData.errorCode === 2300) {

				} else {
					Toast.error(returnData.msg);
				}
			});
	}
};
//获取高级动作表达式
export const getWorkFlowActionsExpr = () => {
	return (dispatch, getState) => {
		let url = workFlowInterface.GET_WORKFLOW_ACTIONS_EXPR;
		NetWork.get(url,
			(returnData) => {
				dispatch({
					type: types.GET_WORKFLOW_ACTIONS_EXPR,
					payload: returnData
				});
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};
//获取条件表达式
export const getWorkFlowConditionsExpr = () => {
	return (dispatch, getState) => {
		let url = workFlowInterface.GET_WORKFLOW_ORG_EXPR;
		NetWork.get(url,
			(returnData) => {
				dispatch({
					type: types.GET_WORKFLOW_ORG_EXPR,
					payload: returnData
				});
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};


//新增条件
export const addWorkFlowCondition = (condition) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.ADD_WORKFLOW_CONDITION,
			payload: condition
		});
	}
};

//编辑条件
export const editWorkFlowCondition = (index, condition) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.UPDATE_WORKFLOW_CONDITION,
			payload: {
				index: index,
				condition: condition
			}
		});
	}
};
//删除条件
export const removeWorkFlowCondition = (index) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.REMOVE_WORKFLOW_CONDITION,
			payload: index
		});
	}
};

//新增步骤
export const addWorkFlowStep = (step) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.ADD_WORKFLOW_STEP,
			payload: step
		});
	}
};


//编辑步骤
export const editWorkFlowStep = (stepIndex, editItemKey, editItemIndex, item) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.UPDATE_WORKFLOW_STEP,
			payload: {
				stepIndex: stepIndex,
				editItemKey: editItemKey,
				editItemIndex: editItemIndex,
				item: item
			}
		});
	}
};
//步骤排序
export const editWorkFlowStepOrder = (newSteps) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.UPDATE_WORKFLOW_STEP_ORDER,
			payload: newSteps
		});
	}
};

//删除步骤
export const removeWorkFlowStep = (index) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.REMOVE_WORKFLOW_STEP,
			payload: index
		});
	}
};

//停用启用
export const startOrStopWorkFlow = (flag, id) => {
	return (dispatch, getState) => {
		if (flag) {//启用
			let url = workFlowInterface.WORKFLOW_DESIGN_ON.replace(':id', id);
			NetWork.put(url, null,
				(returnData) => {
					dispatch({
						type: types.ON_OFF_WORKFLOW,
						payload: true
					});
					Toast.success('启用成功!');
				},
				(returnData) => {
					Toast.error(returnData.msg);
				});
		} else {//停用
			let url = workFlowInterface.WORKFLOW_DESIGN_OFF.replace(':id', id);
			NetWork.put(url, null,
				(returnData) => {
					dispatch({
						type: types.ON_OFF_WORKFLOW,
						payload: false
					});
					Toast.success('停用成功!');
				},
				(returnData) => {
					Toast.error(returnData.msg);
				});
		}
	}
};
//保存
export const saveWorkFlow = (id) => {
	return (dispatch, getState) => {
		const workFlowState = getWorkFlowState(getState);
		let designOrigin = workFlowState.currentDesign;
		let design = workFlowState.currentDesignInfo;
		let hasError = false;
		// 创建提交的对象
		let reqData = {
			id: designOrigin.id,
			name: designOrigin.name,
			toptype: workFlowState.currentBigType,
			typeid: workFlowState.currentBillType,
			beginConditions: design.beginConditions.map((condition, order) => {
				let value = condition.value;
				const dType = condition.dType;

				if (dType !== workFlowConstants.DTYPE.NOT_SHOW && dType !== workFlowConstants.DTYPE.YES_OR_NO) {
					hasError = getErrorMsg(condition, order, 'value', '', true);
				}

				if (Object.prototype.toString.call(value) === '[object Object]') {
					if (dType === workFlowConstants.DTYPE.POSITION) {
						value = value.code;
					} else {
						value = value.id;
					}
				} else if (Object.prototype.toString.call(value) === '[object Array]') {
					if (dType === workFlowConstants.DTYPE.POSITION) {
						value = value.map((item) => {
							return item.code;
						});
					} else {
						value = value.map((item) => {
							return item.id;
						});
					}

				} else {

				}
				if (dType === workFlowConstants.DTYPE.ONE_DIGITS_NUMBER) {
					value = isNaN(Number(value)) ? '0.0' : Number(value).toFixed(1);
				} else if (dType === workFlowConstants.DTYPE.TWO_DIGITS_NUMBER) {
					value = isNaN(Number(value)) ? '0.00' : Number(value).toFixed(2);
				}
				return {
					designId: condition.designId,
					operate: condition.operate && condition.operate.id,
					value: value,
				}
			}),
			activities: design.activities.map((activity, order) => {
				let valueKey, value = undefined; //staffid  positions  positioncode
				let performer = activity.performer;

				if (performer.otype === workFlowConstants.OTYPE.STAFF) {
					hasError = getErrorMsg(performer, order, 'staff', '审批人');

					valueKey = 'staffid';
					if (_.isArray(performer.staff)) {
						value = performer.staff[0].id;
					} else {
						value = performer.staff.id;
					}
				} else if (performer.otype === workFlowConstants.OTYPE.POSITIONS) {
					hasError = getErrorMsg(performer, order, 'positions', '岗位');

					valueKey = 'positions';
					value = performer.positions.map((item) => {
						return item.code;
					});
				} else if (performer.otype === workFlowConstants.OTYPE.POSITION) {
					hasError = getErrorMsg(performer, order, 'position', '岗位');

					valueKey = 'positioncode';
					value = performer.position.code;
				}
				return {
					isSubmitterNeedApprove: activity.isSubmitterNeedApprove,//提交人是否需要审批
					isIgnoreDuplication: activity.isIgnoreDuplication,//是否去重审批
					typeid: activity.typeid,//是否逐级 repeater不传了
					performer: performer.id,
					[valueKey]: value,

					startConditions: activity.startConditions.map((condition) => {
						let value = condition.value;
						let dType = condition.dType;
						if (dType !== workFlowConstants.DTYPE.NOT_SHOW && dType !== workFlowConstants.DTYPE.YES_OR_NO) {
							hasError = getErrorMsg(condition, order, 'value', '触发条件');
						}

						if (Object.prototype.toString.call(value) === '[object Object]') {
							if (dType === workFlowConstants.DTYPE.POSITION) {
								value = value.code;
							} else {
								value = value.id;
							}
						} else if (Object.prototype.toString.call(value) === '[object Array]') {
							if (dType === workFlowConstants.DTYPE.POSITION) {
								value = value.map((item) => {
									return item.code;
								});
							} else {
								value = value.map((item) => {
									return item.id;
								});
							}
						} else {

						}
						return {
							designId: condition.designId,
							operate: condition.operate && condition.operate.id,
							value: value,
						}
					}),
					actions: (activity.actions && activity.actions.map((action) => {
						return action.id;
					})) || [],
					notify: activity.notify.map((notifyItem) => {
						let valueKey, value = undefined; //staffid  positions  positioncode
						const otype = notifyItem.otype;
						if (otype === workFlowConstants.OTYPE.STAFF) {
							hasError = getErrorMsg(notifyItem, order, 'staffs', '知会人员');

							valueKey = 'staffids';
							value = notifyItem.staffs.map((staffItem) => {
								return staffItem.id;
							});//
						} else if (otype === workFlowConstants.OTYPE.POSITIONS) {
							hasError = getErrorMsg(notifyItem, order, 'positions', '知会岗位');

							valueKey = 'positions';
							value = notifyItem.positions.map((item) => {
								return item.code;
							});
						} else if (otype === workFlowConstants.OTYPE.POSITION) {
							hasError = getErrorMsg(notifyItem, order, 'position', '知会岗位');

							valueKey = 'positioncode';
							value = notifyItem.position.code;
						}
						return {
							id: notifyItem.id,
							[valueKey]: value
						}
					}),
					order: order
				}
			}),
		};
		if (hasError) {
			return false;
		}
		let url = workFlowInterface.SAVE_WORKFLOW_DESIGN;
		// 判断是否无条件
		if (reqData.beginConditions.length === 0) {
			let noCondition_expr = Object.assign({}, noCondition);
			//删除前端冗余参数
			delete noCondition_expr.dType;
			delete noCondition_expr.design_id;
			reqData.beginConditions.push(noCondition_expr);
		}
		NetWork.post(url, reqData,
			(returnData) => {
				const workFlowState = getWorkFlowState(getState);

				dispatch(getWorkFlowById({flowid: returnData}, {
					flowid: returnData,
					currentBigType: workFlowState.currentBigType,
					typeid: workFlowState.currentDesign.typeid
				}));
				Toast.success('保存成功!');
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};
function getErrorMsg(item, order, key, msg, isCondition) {
	if (item[key] === undefined || item[key] === null || (_.isArray(item[key]) && item[key].length === 0)) {
		if (isCondition) {
			Toast.error('请在第' + (order + 1) + '发起条件中完善选择');
		} else {
			Toast.error('请在第' + (order + 1) + '步骤中选择指定的' + msg);
		}
		return true;
	}
	return false;
}
//删除
export const deleteWorkFlow = (id) => {
	return (dispatch, getState) => {
		const workFlowState = getWorkFlowState(getState);
		let url = workFlowInterface.DELETE_WORKFLOW_DESIGN.replace(':id', id);
		NetWork.delete(url,
			(returnData) => {
				let defaultChoose = undefined;
				let allDesigns = workFlowState.allDesigns;
				let allDesignsCopy = workFlowState.allDesigns.slice();
				let {currentDesign, currentBigType} = workFlowState;

				allDesigns.map((item, i) => {
					if (item.ptype_id === currentBigType) {//单据大类
						if (item.id === currentDesign.typeid) {//单据类型
							item.processDesigns.map((process, j) => {
								if (process.id === currentDesign.id) {//流程id
									allDesignsCopy[i]['processDesigns'].splice(j, 1);//本次删除的
								} else {
									defaultChoose = process;
								}
								return process;
							});
						}
					}
					return item;
				});

				if (defaultChoose) {
					dispatch(changeWorkFlowRootKeyValue('allDesigns', allDesignsCopy));
					dispatch(getWorkFlowById(defaultChoose, {
						currentBigType,
						typeid: currentDesign.typeid
					}));
				} else {
					dispatch(getWorkFlowBillTypes());
				}

				Toast.success('删除成功!');
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};
//新增
export const addWorkFlow = (billTypeId, addedList, bigTypeId) => {
	return (dispatch, getState) => {
		let url = workFlowInterface.COPY_WORKFLOW;
		NetWork.post(url, {typeid: billTypeId, ...addedList},
			(returnData) => {
				dispatch(getWorkFlowBillTypes({flowid: returnData[0][0], currentBigType: bigTypeId, typeid: billTypeId}));
				Toast.success('新增成功!');
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};

//修改名称
export const changeWorkFlowName = (name) => {
	return (dispatch, getState) => {
		const workFlowState = getWorkFlowState(getState);
		let design = workFlowState.currentDesign;

		let url = workFlowInterface.CHANGE_WORKFLOW_NAME.replace(':id', design.id);
		NetWork.put(url, {"name": name},
			() => {
				dispatch({
					type: types.CHANGE_WORKFLOW_NAME,
					payload: name
				});
				dispatch(changeWorkFlowRootKeyValue('showChangeNameModal', false));
				dispatch(changeWorkFlowRootKeyValue('name', name, 'currentDesign'));
				Toast.success('修改成功!');
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};

//改变key value // 重置条件
export const changeWorkFlowKeyValue = (key, value) => {
	return {
		type: types.CHANGE_WORKFLOW_KEY_VALUE,
		payload: {
			key,
			value
		}
	}
};
//改变key value // 重置条件
export const changeWorkFlowRootKeyValue = (key, value, routerKey) => {
	return {
		type: types.CHANGE_WORKFLOW_ROOT_KEY_VALUE,
		payload: {
			key,
			value,
			routerKey
		}
	}
};
//重置step
export const resetWorkFlowStep = (index, value) => {
	return {
		type: types.RESET_WORKFLOW_STEP,
		payload: {
			index,
			value
		}
	}
};

//移除触发条件
export const removeWorkFlowStepTriggerCondition = (editStepIndex, key, delIndex) => {
	return {
		type: types.REMOVE_WORKFLOW_STEP_TRIGGER_CONDITION_OR_NOTIFY,
		payload: {
			editStepIndex,
			key,
			delIndex
		}
	}
};

