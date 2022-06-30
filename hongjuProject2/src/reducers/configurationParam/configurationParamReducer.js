/**
 * Created by yangyfe on 2017/3/29.
 */
import * as types from '../../actions/actionTypes';
import Immutable from 'immutable';
import NetWork from '../../global/utils/network';
import configurationInterface from '../../global/utils/api';
import {Toast} from '../../components/common';


const getConfigurationParamState = (getState) => {
	return getState().get('configurationParamState').toJS();
};
const $$initialState = Immutable.fromJS({
	currentConfiguration: {
		approvePathType: null,
		orderTicketType: '',
		isCheckFlightOrderDate: '',
		allowedTravelDateRange: 0,
		id: ''
	},
	editing: false,
});

export default function configurationParamReducer($$state = $$initialState, action = {}) {
	switch (action.type) {
		case types.CONFIGURATION_GET_DATA:
			return $$state.merge({
				currentConfiguration: action.payload
			});
		case types.CONFIGURATION_UPDATE_DATA:
			return $$state.merge({
				currentConfiguration: action.payload
			});
		case types.CONFIGURATION_FOUND_EDITING:
			return $$state.merge({
				editing: action.payload
			});
		case types.CONFIGURATION_SELECT_DATA:
			let data = $$state.get('currentConfiguration').toJS();
			let arr = action.payload;
			data['approvePathType'] = arr;
			return $$state.merge({
				'currentConfiguration': data
			});
		case types.CONFIGURATION_TYPE_CHANGE:
			let data1 = $$state.get('currentConfiguration').toJS();
			let arr1 = action.payload;
			let arr4 = (arr1 == true ? 'needapplication' : 'noapplication')
			data1['orderTicketType'] = arr4;
			return $$state.merge({
				'currentConfiguration': data1
			});
		case types.CONFIGURATION_DATE_CHANGE:
			let data2 = $$state.get('currentConfiguration').toJS();
			let arr2 = action.payload;
			data2['isCheckFlightOrderDate'] = arr2;
			return $$state.merge({
				'currentConfiguration': data2
			});
		case types.CONFIGURATION_DATA_CHANGE:
			let data3 = $$state.get('currentConfiguration').toJS();
			let arr3 = action.payload;
			data3['allowedTravelDateRange'] = arr3;
			return $$state.merge({
				'currentConfiguration': data3
			});
		default:
			return $$state;
	}
}


//获取管理参数配置的公司信息
export const getConfigurationParam = (reqParam) => {
	return (dispatch, getState) => {
		let companyId = window.getUserInfo().company;
		let url = configurationInterface.CONFIGURATION_GET_DATA.replace(':companyId', companyId);
		NetWork.get(url, reqParam,
			(returnData) => {
				dispatch({
					type: types.CONFIGURATION_GET_DATA,
					payload: returnData
				})
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};

//保存编辑
export const updateConfigurationParam = (data) => {
	return (dispatch, getState) => {
		let companyId = window.getUserInfo().company;
		let url = configurationInterface.CONFIGURATION_GET_DATA.replace(':companyId', companyId);
		NetWork.put(url, data,
			(returnData) => {
				dispatch({
					type: types.CONFIGURATION_UPDATE_DATA,
					payload: returnData
				})
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};
