/**
 * Created by uncle on 17/2/12.
 */
import Immutable from 'immutable';
import * as types from '../actions/actionTypes';

const $$initialState = Immutable.fromJS({
	userInfo: null,
	clientHeight: document.body.clientHeight,
	clientWidth: document.body.clientWidth,
	show: false,
	current: window.location.hash.substr(2),
	problem: {
		"phoneType": "web",
		"systemType": "web",
		"appVersion": navigator.userAgent,
		"suggestion": ""
	},
	willReRenderPage: 1,
});

export default function appReducer($$state = $$initialState, action = {}) {
	switch (action.type) {
		case types.APP_GET_USER_INFO:
			const userInfo = action.payload;
			window.getUserInfo = () => {
				return userInfo;
			};
			window.FILETYPE = {
				staff: 'staff',//人员
				operation: 'operation',	//业务序列
				station: 'station',	//岗位
				level: 'level',	//人员级别
				workplace: 'workplace',	//工作地点
				department: 'department',	//部门
				disburse: 'disburse',	// 支出
				project: 'project',	// 项目
				city: 'city',	// 城市列表
				country: 'country',//国家
				group: 'group',	// 集团下所有公司
				selfDefine: 'selfDefine',	//自定义
				bank: 'bank',	//银行
				supplier: 'supplier',	// 供应商
				fundSource: 'fundSource'	// 资金来源
			};
			return $$state.merge({'userInfo': action.payload});
		case types.APP_CHANGE_CLIENT_HEIGHT:
			return $$state.merge({
				'clientHeight': action.payload.currentHeight,
				'clientWidth': action.payload.currentWidth,
				willReRenderPage: action.payload.willReRenderPage,
			});
		case types.APP_PROBLEM_SHOW:
			return $$state.merge({
				show: action.payload
			});
		case types.APP_PUT_PROBLEM:
			return $$state.merge({
				problem: action.payload.returnData,
				suggestion: action.payload.suggestion
			});
		case types.APP_CHANGE_LEFTMENU_SELECTED:
			return $$state.merge({
				current: action.payload
			})
		default:
			return $$state;
	}
}



