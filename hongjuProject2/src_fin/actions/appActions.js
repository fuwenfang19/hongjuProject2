// 页面整体框架的actions
import cookie from 'react-cookie';
import * as types from './actionTypes';
import NetWork from '../global/utils/network';
import {Toast} from '../components/common';
const USER_NAME = 'wecaiwu';
const PASSWORD = '12345';
const USER_TYPE = 'companyadmin';


// 获取用户信息 测试方法 正式环境没有作用
export const doLogin = () => {
	return (dispatch, getState) => {
		let url = '/sso/login/';
		return fetch(url, {
			method: 'post',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "username=" + USER_NAME + "&password=" + PASSWORD + "&usertype=" + USER_TYPE + "&appid=managebackend&db_test=true",
			credentials: 'include',
			mode: "no-cors",
		}).then(() => {
			dispatch(getCookieUserInfo());
		})
	}
};

// 获取用户信息 测试方法 正式环境没有作用
export const getCookieUserInfo = () => {
	return (dispatch, getState) => {
		let u = undefined;
		try {
			u = cookie.load('userinfo');
			u = unescape(u.replace(/\\054/g, ',').replace(/\\"/g, '"').replace(/\\u/g, '%u').replace(/\\/g, ''));
			u = JSON.parse(u);
			u = u.userinfo[0];
			dispatch({
				type: types.APP_GET_USER_INFO,
				payload: u
			});
		} catch (e) {
			console.error('获取cookie出错.', e);
		}
	}
};

//问题反馈页面show
export const showProblem = () => {
	return {
		type: types.APP_PROBLEM_SHOW,
		payload: true
	}
}
//问题反馈页面hide
export const hideProblem = () => {
	return {
		type: types.APP_PROBLEM_SHOW,
		payload: false
	}
}
//发送问题反馈内容
export const putProblem = (suggestion) => {
	return (dispatch, getState) => {
		let url = '/organization/suggestion/';
		let data = {
			"phoneType": 'Chrome',
			"systemType": 'windows',
			"appVersion": "navigator.userAgent",
			"suggestion": suggestion
		};
		NetWork.post(url, data,
			(returnData) => {
				Toast.success('发送成功...');
				dispatch({
					type: types.APP_PUT_PROBLEM,
					payload: {
						returnData: returnData,
						suggestion: suggestion,
					}
				});
			},
		);
	}
}
export const changeClientHeight = (currentHeight, currentWidth) => {
	return {
		type: types.APP_CHANGE_CLIENT_HEIGHT,
		payload: {currentHeight, currentWidth, willReRenderPage: +new Date()}
	}
};
export const changeLeftMenuSelected = (current) => {
	return {
		type: types.APP_CHANGE_LEFTMENU_SELECTED,
		payload: current
	}
}