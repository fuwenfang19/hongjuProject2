/**
 * Created by uncle on 2017/3/14.
 */
import * as types from '../actionTypes';
import NetWork from '../../global/utils/network';
import budgetApplicationInterface from '../../global/utils/api';
import {Toast} from '../../components/common';
import {inputTypesMap} from '../../constants/inputType';
import _ from 'lodash';
import moment from  'moment';

const budgetAppOrAdjustEditState = (getState) => {
	return getState().get('budgetAppOrAdjustEditState').toJS();
};

//获取保存的数据
const getSaveData = (detailData) => {
	for (let code in  detailData) {
		if (detailData.hasOwnProperty(code)) {
			let value = detailData[code];
			if (_.isString(value)) {

			} else if (_.isArray(value)) {//需要判断单选还是多选 单选返回id 多选返回id数组
				detailData[code] = value && value.map(item => {
						return item.id;
					})
			} else if (_.isObject(value)) {
				detailData[code] = value && value.id;
			}
		}
	}

	return detailData;
};

// 更改key Value
export const changeBudgetAppOrAdjustEditKeyValue = (key, value) => {
	return {
		type: types.CHANGE_BUDGET_APP_OR_ADJUST_EDIT_KEY_VALUE,
		payload: {
			key,
			value
		}
	}
};