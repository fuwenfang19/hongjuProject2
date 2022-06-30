/**
 * Created by uncle on 2017/3/14.
 */
import * as types from '../actionTypes';
import NetWork from '../../global/utils/network';
import budgetApplicationInterface from '../../global/utils/api';
import {Toast} from '../../components/common';
import moment from  'moment';

const getBudgetApplicationState = (getState) => {
	return getState().get('budgetApplicationState').toJS();
};

// 获得请求后台接口的查询数据
const getReqSearchData = (originData) => {
	for (let item in originData) {
		if (originData.hasOwnProperty(item)) {
			if (originData[item] != null && ['braidDateBegin', 'braidDateEnd'].indexOf(item) !== -1) {
				originData[item] = moment(originData[item]).format('YYYY-MM-DD');
			} else if (originData[item] != null && Object.prototype.toString.call(originData[item]) == '[object Array]') {
				originData[item] = originData[item].map(item => {
					if (item.id) {
						return item.id;
					} else {
						return item;
					}
				});
			}
		}
	}
	return originData;
};

// 获取我的预算申请单列表
export const getMyBudgetApplicationList = () => {
	return (dispatch, getState) => {
		let state = getBudgetApplicationState(getState);
		let reqData = getReqSearchData(state.myBudgetApplicationSearchConditions);
		let url = budgetApplicationInterface.getBudgetApplicationList;
		NetWork.get(url, reqData,
			(returnData) => {
				dispatch(changeBudgetApplicationKeyValue('budgetApplicationList', returnData));
			},
			(data) => {
				Toast.error(data.msg);
			})
	}
};

// 获取预算申请单单据类型列表
export const getBudgetApplicationTypeList = () => {
	return (dispatch, getState) => {
		let url = budgetApplicationInterface.getBudgetApplicationTypeList;
		NetWork.get(url, {type: 8},
			(returnData) => {
				returnData.data = [{name: '申请1'}, {name: '申请1'}, {name: '申请1'}, {name: '申请1'}, {name: '申请1'}, {name: '申请1'}, {name: '申请1'}];
				dispatch(changeBudgetApplicationKeyValue('budgetBillTypes', returnData.data))
			},
			(data) => {
				Toast.error(data.msg);
			})
	}
};

// 根据类型id,获取预算申请单定义
export const getBudgetApplicationDefine = (id) => {
	return (dispatch, getState) => {
		let url = budgetApplicationInterface.getBudgetApplicationDefine.replace(':id', id);
		NetWork.get(url,
			(returnData) => {
				dispatch(changeBudgetApplicationKeyValue('schemaDefine', returnData))
			},
			(data) => {
				Toast.error(data.msg);
			})
	}
};


// 更改key Value
export const changeBudgetApplicationKeyValue = (key, value) => {
	return {
		type: types.CHANGE_BUDGET_APPLICATION_KEY_VALUE,
		payload: {
			key,
			value
		}
	}
};