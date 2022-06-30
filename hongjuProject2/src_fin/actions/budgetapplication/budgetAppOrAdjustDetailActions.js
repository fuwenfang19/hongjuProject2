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

const budgetAppOrAdjustDetailState = (getState) => {
	return getState().get('budgetAppOrAdjustDetailState').toJS();
};


// 更改key Value
export const changeBudgetAppOrAdjustDetailKeyValue = (key, value) => {
	return {
		type: types.CHANGE_BUDGET_APP_OR_ADJUST_DETAIL_KEY_VALUE,
		payload: {
			key,
			value
		}
	}
};