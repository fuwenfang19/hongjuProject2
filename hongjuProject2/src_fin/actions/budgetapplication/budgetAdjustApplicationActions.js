/**
 * Created by uncle on 2017/3/14.
 */
import * as types from '../actionTypes';
import NetWork from '../../global/utils/network';
import budgetAdjustApplicationInterface from '../../global/utils/api';
import {Toast} from '../../components/common';
import {inputTypesMap} from '../../constants/inputType';
import _ from 'lodash';
import moment from  'moment';

const getBudgetAdjustApplicationState = (getState) => {
	return getState().get('budgetAdjustApplicationState').toJS();
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
export const getMyBudgetAdjustApplicationList = () => {
	return (dispatch, getState) => {
		let state = getBudgetAdjustApplicationState(getState);
		let reqData = getReqSearchData(state.myBudgetAdjustApplicationSearchConditions);
		let url = budgetAdjustApplicationInterface.getBudgetAdjustApplicationList;
		NetWork.get(url, reqData,
			(returnData) => {
				dispatch(changeBudgetAdjustApplicationKeyValue('budgetAdjustApplicationList', returnData));
			},
			(data) => {
				Toast.error(data.msg);
			})
	}
};


// 更改key Value
export const changeBudgetAdjustApplicationKeyValue = (key, value) => {
	return {
		type: types.CHANGE_BUDGET_ADJUST_APPLICATION_KEY_VALUE,
		payload: {
			key,
			value
		}
	}
};