import * as types from '../../../actions/actionTypes';
import Immutable from 'immutable';
import api from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';

const $$initialState = Immutable.fromJS({
	billRuleList: [],
	disabledRuleList: [],
	billRuleListSuccess: false,
	disabledBillRuleListSuccess: false,
	billTypes: {},
	billTypesSuccess: false,
	addBillTitleData: [],
	addBillBodyData: [],
	getCanUseItemsLoadingShow: false,
	saveSuccess: false,
	billRule: {},
	detailBillHead: [],
	detailBilBody: [],
	detailBillHeadSuccess: false,
	detailBilBodySuccess: false,
	detailHeadItems: {},
	detailBodyItems: {},
	detailHeadItemsSuccess: false,
	detailBodyItemsSuccess: false,
	saveBillRuleDetailsSuccess: false,
	selectedRule: {},
	minorBillTypeItems: [],
	deleteRuleSuccess: false
});

export default ($$state = $$initialState, action = {}) => {
	switch (action.type) {
		case types.ENTRY_BILL_RULE_GET_BILL_RULE_LIST:
			return $$state.merge({
				billRuleList: action.payload
			});
		case types.ENTRY_BILL_RULE_GET_DISABLED_BILL_RULE_LIST:
			return $$state.merge({
				disabledRuleList: action.payload
			});
		case types.ENTRY_BILL_RULE_GET_BILL_RULE_LIST_SUCCESS:
			return $$state.set('billRuleListSuccess', action.payload);
		case types.ENTRY_BILL_RULE_GET_DISABLED_BILL_RULE_LIST_SUCCESS:
			return $$state.set('disabledBillRuleListSuccess', action.payload);
		case types.ENTRY_BILL_RULE_GET_BILL_TYPES:
			return $$state.merge({
				billTypes: action.payload
			});
		case types.ENTRY_BILL_RULE_GET_BILL_TYPES_SUCCESS:
			return $$state.set('billTypesSuccess', action.payload);
		case types.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_TITLE:
			return $$state.merge({
				'addBillTitleData': action.payload
			});
		case types.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_BODY:
			return $$state.merge({
				'addBillBodyData': action.payload
			});
		case types.ENTRY_BILL_RULE_EDIT_OR_ADD_SAVE_FLAG:
			return $$state.set("saveSuccess", action.payload);
		case types.ENTRY_BILL_RULE_GET_BILL_RULE:
			return $$state.merge({
				'billRule': action.payload
			});

		case types.ENTRY_BILL_RULE_DETAIL_BILL_HEAD:
			return $$state.merge({
				'detailBillHead': action.payload
			});

		case types.ENTRY_BILL_RULE_DETAIL_BILL_BODY:
			return $$state.merge({
				'detailBilBody': action.payload
			});

		case types.ENTRY_BILL_RULE_DETAIL_BILL_HEAD_SUCCESS:
			return $$state.set('detailBillHeadSuccess', action.payload);

		case types.ENTRY_BILL_RULE_DETAIL_BILL_BODY_SUCCESS:
			return $$state.set('detailBilBodySuccess', action.payload);
		case types.ENTRY_BILL_RULE_SELECTED_RULE:
			return $$state.merge({ 'selectedRule': action.payload });

		case types.ENTRY_BILL_RULE_DETAIL_HEAD_TIEMS:
			return $$state.merge({
				'detailHeadItems': action.payload
			});

		case types.ENTRY_BILL_RULE_DETAIL_BODY_TIEMS:
			return $$state.merge({
				'detailBodyItems': action.payload
			});
		case types.ENTRY_BILL_RULE_DETAIL_HEAD_TIEMS_SUCCESS:
			return $$state.set('detailHeadItemsSuccess', action.payload);
		case types.ENTRY_BILL_RULE_DETAIL_BODY_TIEMS_SUCCESS:
			return $$state.set('detailBodyItemsSuccess', action.payload);

		case types.ENTRY_BILL_RULE_SAVE_BILL_RULE_DETAILS_SUCCESS:
			return $$state.set('saveBillRuleDetailsSuccess', action.payload);
		case types.ENTRY_BILL_RULE_GET_MINOR_BILL_TYPE:
			return $$state.merge({
				'minorBillTypeItems': action.payload
			});
		case types.ENTRY_BILL_RULE_DELETE_RULE_SUCCESS:
			return $$state.set('deleteRuleSuccess', action.payload);

		default:
			return $$state;
	}
}

export function getBillRuleList(p1) {
	return (dispatch, getState) => {
		let state = getState().get('entryBillRuleState');
		let selectedRule = state.get('selectedRule').toJS();
		let url = api.ENTRY_BILL_RULE_GET_BILL_RULE_LIST + p1 + '/'
		NetWork.get(url, {}, (json) => {

			if (p1 === 1) {
				dispatch({
					type: types.ENTRY_BILL_RULE_GET_BILL_RULE_LIST,
					payload: json
				});
				dispatch({
					type: types.ENTRY_BILL_RULE_GET_BILL_RULE_LIST_SUCCESS,
					payload: true
				});
				let dom = document.querySelectorAll('.entry-rule-left-content-item');

				let selectedRuleId = selectedRule['id'];
				if (selectedRuleId === undefined) {
					if (dom && dom[0]) {
						setTimeout(() => {
							dom[0].click();
						}, 0)
					}
				} else if (selectedRuleId === 'addRuleid') {
					if (dom && dom[dom.length - 1]) {
						setTimeout(() => {
							dom[dom.length - 1].click();
						}, 0)
					}
				} else {
					for (let i = 0, len = json.length; i < len; i++) {
						if (json[i]['id'] === selectedRuleId) {
							if (dom && dom[i]) {
								setTimeout(() => {
									dom[i].click();
								}, 0)
							}
							break;
						}
					}
				}



			} else if (p1 === 0) {
				dispatch({
					type: types.ENTRY_BILL_RULE_GET_DISABLED_BILL_RULE_LIST,
					payload: json
				});
				dispatch({
					type: types.ENTRY_BILL_RULE_GET_DISABLED_BILL_RULE_LIST_SUCCESS,
					payload: true
				});
				let dom = document.querySelectorAll('.entry-rule-left-content-item');

				let selectedRuleId = selectedRule['id'];
				if (selectedRuleId === undefined) {
					if (dom && dom[0]) {
						setTimeout(() => {
							dom[0].click();
						}, 0)
					}
				} else if (selectedRuleId === 'addRuleid') {
					if (dom && dom[dom.length - 1]) {
						setTimeout(() => {
							dom[dom.length - 1].click();
						}, 0)
					}

				} else {
					for (let i = 0, len = json.length; i < len; i++) {
						if (json[i]['id'] === selectedRuleId) {
							if (dom && dom[i]) {
								setTimeout(() => {
									dom[i].click();
								}, 0)

							}
							break;
						}
					}
				}

			}

		})
	}
}

export function getBillTypes(params) {

	return (dispatch, getState) => {
		dispatch({
			type: types.ENTRY_BILL_RULE_GET_BILL_TYPES_SUCCESS,
			payload: false
		});
		NetWork.get(api.ENTRY_BILL_RULE_BILL_TYPES, {}, (json) => {
			dispatch({
				type: types.ENTRY_BILL_RULE_GET_BILL_TYPES,
				payload: json['data']
			});
			dispatch({
				type: types.ENTRY_BILL_RULE_GET_BILL_TYPES_SUCCESS,
				payload: true
			});
		});
	}
}

export function getBillCanUseItems(req) {

	return (dispatch, getState) => {
		if (req.isBody) {
			dispatch({
				type: types.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_BODY,
				payload: []
			});
		} else {
			dispatch({
				type: types.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_TITLE,
				payload: []
			});
		}

		NetWork.get(api.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS, req, (json) => {
			if (req.isBody) {
				dispatch({
					type: types.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_BODY,
					payload: json
				});
			} else {
				dispatch({
					type: types.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_TITLE,
					payload: json
				});
			}
			if (!req.isBody) {
			}

		});

	}
}


export function getBillCanUseItemsOnlyBody(req) {

	return (dispatch, getState) => {
		dispatch({
			type: types.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_BODY,
			payload: []
		});

		NetWork.get(api.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS, req, (json) => {
			dispatch({
				type: types.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_BODY,
				payload: json
			});

		});

	}
}

// 保存和编辑规则接口
export function saveOrAddRule(req, Toast) {
	return (dispatch, getState) => {
		dispatch({
			type: types.ENTRY_BILL_RULE_EDIT_OR_ADD_SAVE_FLAG,
			payload: false
		});

		NetWork.post(api.ENTRY_BILL_RULE_SAVE_OR_ADD_RULE, req, (json) => {
			//用于初始化页面;
			dispatch({
				type: types.ENTRY_BILL_RULE_EDIT_OR_ADD_SAVE_FLAG,
				payload: true
			});
		}, (errData) => {
			Toast.error(errData['msg']);
			dispatch({
				type: types.ENTRY_BILL_RULE_EDIT_OR_ADD_SAVE_FLAG,
				payload: true
			});
		});

	}
}

//获取单据规则详情
export function getBillRule(id) {
	// ENTRY_BILL_RULE_GET_BILL_RULE
	return (dispatch, getState) => {
		let url = api.ENTRY_BILL_RULE_GET_BILL_RULE.replace(':id', id);

		NetWork.get(url, {}, (json) => {

			dispatch({
				type: types.ENTRY_BILL_RULE_GET_BILL_RULE,
				payload: json
			});

			let entryrule_bodyrules = json['entryrule_bodyrules'];
			let objectClasses = json['objectClasses'];
			let object_ids = [];

			for (let i = 0; i < objectClasses.length; i++) {
				object_ids[i] = objectClasses[i]['id'];
			}

			dispatch({
				type: types.ENTRY_BILL_RULE_DETAIL_BILL_BODY_SUCCESS,
				payload: false
			});

			if (entryrule_bodyrules.length > 0) {
				dispatch(getBillGetBody({ "object_ids": object_ids, "isBody": true }));
			} else {
				dispatch({
					type: types.ENTRY_BILL_RULE_DETAIL_BILL_BODY_SUCCESS,
					payload: true
				});
				// 初始化
				dispatch({
					type: types.ENTRY_BILL_RULE_DETAIL_BILL_BODY,
					payload: []
				});
			}

			dispatch({
				type: types.ENTRY_BILL_RULE_DETAIL_BILL_HEAD_SUCCESS,
				payload: false
			});

			dispatch(getBillGetHead({ "object_ids": object_ids, "isBody": false }));
		}, (errData) => {

		});

	}
}

//获取单据规则详情 获取单据头 
export function getBillGetHead(req) {
	return (dispatch, getState) => {
		dispatch({
			type: types.ENTRY_BILL_RULE_DETAIL_BILL_HEAD,
			payload: []
		});
		NetWork.get(api.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS, req, (json) => {

			let state = getState();
			let entryBillRuleState = state.get('entryBillRuleState');
			let billRule = entryBillRuleState.get('billRule').toJS();

			let arr = [];
			for (let i = 0; i < json.length; i++) {
				if (billRule[json[i]['code']]) {
					arr.push(json[i]);
				}
			}

			dispatch({
				type: types.ENTRY_BILL_RULE_DETAIL_BILL_HEAD,
				payload: arr
			});
			
			dispatch({
				type: types.ENTRY_BILL_RULE_DETAIL_BILL_HEAD_SUCCESS,
				payload: true
			});

		});

	}
}
//获取单据规则详情 单据体
export function getBillGetBody(req) {
	return (dispatch, getState) => {
		dispatch({
			type: types.ENTRY_BILL_RULE_DETAIL_BILL_BODY,
			payload: []
		});
		NetWork.get(api.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS, req, (json) => {

			let state = getState();
			let entryBillRuleState = state.get('entryBillRuleState');
			let billRule = entryBillRuleState.get('billRule').toJS();
			let entryrule_bodyrules = billRule['entryrule_bodyrules'];
			let arr = [];

			if (entryrule_bodyrules.length > 0) {
				let len = entryrule_bodyrules.length;
				let obj = entryrule_bodyrules[len - 1];
				for (let i = 0; i < json.length; i++) {
					if (obj[json[i]['code']]) {
						arr.push(json[i]);
					}
				}
			}


			dispatch({
				type: types.ENTRY_BILL_RULE_DETAIL_BILL_BODY,
				payload: arr
			});
			dispatch({
				type: types.ENTRY_BILL_RULE_DETAIL_BILL_BODY_SUCCESS,
				payload: true
			});

		});

	}
}

export function getbillruledetails(id, req, isBody) {
	window.loading.add();
	return (dispatch, getState) => {
		let url = api.ENTRY_BILL_RULE_GET_BILL_RULE_DETAILS.replace(':id', id);
		NetWork.get(url, req, (json) => {

			if (isBody) {
				dispatch({
					type: types.ENTRY_BILL_RULE_DETAIL_BODY_TIEMS,
					payload: json
				});
				dispatch({
					type: types.ENTRY_BILL_RULE_DETAIL_BODY_TIEMS_SUCCESS,
					payload: true
				});
			} else {
				dispatch({
					type: types.ENTRY_BILL_RULE_DETAIL_HEAD_TIEMS,
					payload: json
				});
				dispatch({
					type: types.ENTRY_BILL_RULE_DETAIL_HEAD_TIEMS_SUCCESS,
					payload: true
				});
			}
			window.loading.remove();

		});

	}
}

// 删除规则接口
export function deleteRule(id) {
	return (dispatch, getState) => {
		let url = api.ENTRY_BILL_RULE_DELETE_RULE.replace(':id', id);
		NetWork.get(url, {}, (json) => {
			// dispatch(getBillRuleList(1));
			// dispatch(getBillRuleList(0));
			dispatch({
				type: types.ENTRY_BILL_RULE_DELETE_RULE_SUCCESS,
				payload: true
			});
		});



	}
}

//保存规则详细接口 删除接口
export function saveBillRuleDetails(req) {
	return (dispatch, getState) => {
		dispatch({
			type: types.ENTRY_BILL_RULE_SAVE_BILL_RULE_DETAILS_SUCCESS,
			payload: false
		});
		NetWork.post(api.ENTRY_BILL_RULE_SAVE_BILL_RULE_DETAILS, req, (json) => {
			dispatch({
				type: types.ENTRY_BILL_RULE_SAVE_BILL_RULE_DETAILS_SUCCESS,
				payload: true
			});
		});

	}
}

//获取费用类型
//ENTRY_BILL_RULE_GET_EXPENSE_TYPE
export function getExpenseType(id, that, Toast) {
	return (dispatch, getState) => {
		let url = api.ENTRY_BILL_RULE_GET_EXPENSE_TYPE.replace(':id', id);
		NetWork.get(url, {}, (json) => {

			that.setState({
				data: json
			});
		}, (errData) => {
			that.setState({
				flag: true
			});
			Toast.error(errData['msg']);
		});

	}
}


//影响单据类型 小类接口
export function getExpenseMinorType(bigtype) {
	window.loading.add();
	return (dispatch, getState) => {
		let url = api.ENTRY_BILL_RULE_GET_MINOR_EXPENSE_TYPE.replace(':bigtype', bigtype);
		NetWork.get(url, {}, (json) => {
			for (let i = 0, len = json.length; i < len; i++) {
				json[i]['type_id'] = bigtype;
			}

			dispatch({
				type: types.ENTRY_BILL_RULE_GET_MINOR_BILL_TYPE,
				payload: json
			});
			window.loading.remove();
		});
	}
}


