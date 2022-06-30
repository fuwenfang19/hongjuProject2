/**
 * Created by fuwenfang on 3/30/17.
 * 公司信息actions
 */
import * as types from '../../actionTypes';
import api from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';
import { Toast } from '../../../components/common';

//获取公司信息
export const getCompanyInfor = ()=>{
  return (dispatch, getState) => {
		const companyId = window.getUserInfo().company
		NetWork.get(api.GET_COMPANYINFOR+companyId+'/',
			(returnData) => {
				returnData.isComplete = window.getUserInfo().isComplete
				dispatch({
					type: types.COMPANYINFOR_GETINFOR,
					payload: returnData
				});
				//dispatch(getCompanyLogo())
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
}
//获取公司logo
export const getCompanyLogo = ()=>{
	return (dispatch,getState) =>{
		NetWork.get(api.GET_COMPANYLOGO,
			(returnData) => {
				dispatch({
					type: types.COMPANYINFOR_GETLOGO,
					payload: ''
				});
			},
			(returnData) => {
				// dispatch({
				// 		type: types.COMPANYINFOR_GETLOGO,
				// 		payload: ''
				// 	});
				//Toast.error(returnData.msg);
			});
	}
}

//点击编辑按钮
export const clickEditBtn = ()=>{
	return (dispatch,getState)=>{
		dispatch(isEdited())
		dispatch({
			type: types.COMPANYINFOR_CLICKEDIT,
			payload: false
		})
	}
}

//增加上传资质图片
export const addUploadPic = (data)=>{
	return (dispatch,getState)=>{
		dispatch(isEdited())
		dispatch({
			type: types.COMPANYINFOR_ADDUPLODPIC,
			payload: data
		})
		dispatch({
			type: types.COMPANYINFOR_ADDUPLODPIC_UPDATEINIT,
			payload: data
		})
	}
}

//提交核验
export const submitCheck = (data)=>{
	const companyId = window.getUserInfo().company
	return (dispatch,getState)=>{
		NetWork.put(api.CHECK_SUBMINT+companyId+'/',data,
			(returnData) => {
				dispatch({
					type: types.COMPANYINFOR_SUBMITCHECK,
					payload: returnData
				})
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
}
//删除税务资质图片
export const deletetaxPic = (data)=>{
	return (dispatch,getState)=>{
		dispatch(isEdited())
		dispatch({
			type: types.COMPANYINFOR_DELETETAXPIC,
			payload: data
		})
		dispatch({
			type: types.COMPANYINFOR_DELETETAXPIC_UPDATEINIT,
			payload: data
		})
	}
}
//取消
export const clickCancle = (data)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.COMPANYINFOR_CLICKCANCLE,
			payload: data
		})
	}
}
//修改公司信息
export const changeCompanyInfor  = (value,type)=>{
	return (dispatch,getState)=>{
		dispatch(isEdited())
		dispatch({
			type: types.COMPANYINFOR_CHANGEINFOR,
			payload: {value,type}
		})
	}
}
//保存
export const saveCompanyInfor = (data)=>{
	const companyId = window.getUserInfo().company
	//let compeletData = data
	//compeletData.isComplete = true
	return (dispatch,getState)=>{
		NetWork.put(api.CHECK_SUBMINT+companyId+'/',data,
			(returnData) => {
				dispatch({
					type: types.COMPANYINFOR_SAVECOMPANYINFOR,
					payload: returnData
				})
				Toast.success('保存成功啦！');
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
}
//是否有改变
export const isEdited = ()=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.COMPANYINFOR_ISEDITED,
			payload: true
		})
	}
}
//删除图片
export const deletetaxPicInterface = (id,data)=>{
	return (dispatch,getState)=>{
		NetWork.delete(api.DELETE_TAXPIC+id+'/',
			(returnData) => {
    		dispatch(deletetaxPic(data))
				// dispatch({
				// 	type: types.COMPANYINFOR_SAVECOMPANYINFOR,
				// 	payload: data
				// })
				//Toast.success('保存成功啦！');
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
}