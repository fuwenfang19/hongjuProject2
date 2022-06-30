/**
 * Created by fuwenfang on 3/16/17.
 * 费用类型actions
 */
import * as types from '../../actionTypes';
import api from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';
import { Toast } from '../../../components/common';

//有过编辑改变
export const haveBeenEdited = (flag) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.EXPENSETYPE_HAVEBEENEDITED,
			payload: {
				saveId: flag ? flag : '',
			}
		})
	}
}

//获取交易订单费用类型
export const getTicketExpenseList = ()=>{
  return (dispatch, getState) => {
		dispatch({
			type: types.EXPENSETYPE_GETTICKETLIST_LOADING,
			payload: {ticketListLoading:true}
		});
		NetWork.get(api.GET_TICKET_EXPENSESETTING,{},
			(returnData) => {
				dispatch({
					type: types.EXPENSETYPE_GETTICKETLIST,
					payload: returnData
				});
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
}
//改变对应的费用类型
export const choseChargeStyleSelect = (item,i)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:types.EXPENSETYPE_CHOSECHARGESTYLE,
			payload:{
				item,
				i
			}
		})
	}
}
//保存交易订单费用类型
export const saveTicketExpenseList = (data)=>{
  return (dispatch, getState) => {
		NetWork.post(api.SAVE_TICKET_EXPENSESETTING,data,
			(returnData) => {
				Toast.success('更改成功！')
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
}
//点击+号
export const addChargestyleList = ()=>{
	let paramData = {"grouprange":false,"type":4}
	return (dispatch, getState) => {
		NetWork.get(api.GET_CHARGESTYLE_TEMPLATELIST,paramData,
			(returnData) => {
				dispatch({
					type: types.EXPENSETYPE_CHARGESTYLE_TEMPLATELIST,
					payload: returnData.data
				});
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
}

//更新左侧菜单
export const changeLeftExpenseListData = (data)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:types.EXPENSETYPE_CHANGELEFTLIST,
			payload:data
		})
	}
}

//获取自定义档案的枚举值
export const getCustomBaseDefine_expenseStyle = () => {
	return (dispatch, getState) => {
		NetWork.get(api.GET_CUSTOMBASEDEFINE,
			(returnData) => {
				dispatch({
					type: types.EXPENSESTYLE_CUSTOMBASEDEFINE,
					payload: { fakeSelfDefineData: returnData }
				})
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_StaffItem_expenseStyle = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'StaffItem' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.EXPENSESTYLE_GETFILEDATA_StaffItem,
					payload: { fields_template_StaffItem: returnData.data.fields_template }
				})
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_Department_expenseStyle = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'Department' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.EXPENSESTYLE_GETFILEDATA_Department,
					payload: { fields_template_Department: returnData.data.fields_template }
				})
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_ExpenseItem_expenseStyle = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'ExpenseItem' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.EXPENSESTYLE_GETFILEDATA_ExpenseItem,
					payload: { fields_template_ExpenseItem: returnData.data.fields_template }
				})
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_City_expenseStyle = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'City' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.EXPENSESTYLE_GETFILEDATA_City,
					payload: { fields_template_City: returnData.data.fields_template }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_Transport_expenseStyle = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'Transport' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.EXPENSESTYLE_GETFILEDATA_Transport,
					payload: { fields_template_Transport: returnData.data.fields_template }
				})
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_Country_expenseStyle = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'Country' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.EXPENSESTYLE_GETFILEDATA_Country,
					payload: { fields_template_Country: returnData.data.fields_template }
				})
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}

//获取档案关联项
export const getBaseFileRelate_DisburseClass_expenseStyle = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'DisburseClass' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.EXPENSESTYLE_GETFILEDATA_DisburseClass,
					payload: { fields_template_DisburseClass: returnData.data.fields_template }
				})
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_Supplier_expenseStyle = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'Supplier' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.EXPENSESTYLE_GETFILEDATA_Supplier,
					payload: { fields_template_Supplier: returnData.data.fields_template }
				})
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取设置模板对应的费用类型详情信息
export const getDefaultTemplateViewdifine = (id)=>{
	window.loading.add() 
	let paramData = { "id": id + '' }
	return (dispatch, getState) => {
		NetWork.get(api.GET_EXPENSESTYLE_DEFAULTSETTING,
			paramData,
			(returnData) => {
				//先按order排序
				let billingStyleData = returnData.data.viewdefines[0].templatedefinetemplate.fieldtemplates_template
				
				let billSettingInfor = []
				billingStyleData.map((item) => {
					if (item.visible) {
						billSettingInfor.push(item)
					}
					return item 
				})
				billSettingInfor.sort(function (b, a) {
					return b.order - a.order;
				});
				billingStyleData.sort(function (b, a) {
					return b.order - a.order;
				});
				let fields_template = returnData.data.viewdefines[0].templatedefinetemplate.fieldtemplates_template
				returnData.data.viewdefines[0].templatedefinetemplate.fields_template = fields_template
				delete returnData.data.viewdefines[0].templatedefinetemplate.fieldtemplates_template
				let templatedefine = returnData.data.viewdefines[0].templatedefinetemplate
				returnData.data.viewdefines[0].templatedefine = templatedefine
				delete returnData.data.viewdefines[0].templatedefinetemplate

				returnData.data.viewdefines[0].templatedefine.fields_template = billingStyleData
				returnData.data.billSettingInfor = billSettingInfor
				returnData.currentModel = 'add'
				returnData.currentBillStyle = 4 + ''

				dispatch(getCustomBaseDefine_expenseStyle())
				dispatch(getBaseFileRelate_StaffItem_expenseStyle())
				dispatch(getBaseFileRelate_Department_expenseStyle())
				dispatch(getBaseFileRelate_ExpenseItem_expenseStyle())
				dispatch(getBaseFileRelate_City_expenseStyle())
				dispatch(getBaseFileRelate_Transport_expenseStyle())
				dispatch(getBaseFileRelate_Country_expenseStyle())
				dispatch(getBaseFileRelate_DisburseClass_expenseStyle())
				dispatch(getBaseFileRelate_Supplier_expenseStyle())
				dispatch({
					type: types.EXPENSESTYLE_GETDEFAULTSETTING,
					payload: returnData
				});
				dispatch(haveBeenEdited('-2'))
				window.loading.remove()
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
}
//获取已定义好的费用类型详情信息
export const getexpenseviewdefine = (id)=>{
	window.loading.add() 
	let paramData = { "id": id + '' }
	return (dispatch, getState) => {
		NetWork.get(api.GET_EXPENSEVIEWDEFINED,paramData,
			(returnData) => {
				//先按order排序
				let billingStyleData = returnData.data.viewdefines[0].templatedefine.fields_template
				let billSettingInfor = []
				billingStyleData.map((item) => {
					if (item.visible) {
						billSettingInfor.push(item)
					}
					return item
				})
				billSettingInfor.sort(function (b, a) {
					return b.order - a.order;
				});
				billingStyleData.sort(function (b, a) {
					return b.order - a.order;
				});
				returnData.data.viewdefines[0].templatedefine.fields_template = billingStyleData
				returnData.data.billSettingInfor = billSettingInfor
				returnData.currentModel = 'edit'
				returnData.currentBillStyle = 4 + ''
				dispatch(getCustomBaseDefine_expenseStyle())
				dispatch(getBaseFileRelate_StaffItem_expenseStyle())
				dispatch(getBaseFileRelate_Department_expenseStyle())
				dispatch(getBaseFileRelate_ExpenseItem_expenseStyle())
				dispatch(getBaseFileRelate_City_expenseStyle())
				dispatch(getBaseFileRelate_Transport_expenseStyle())
				dispatch(getBaseFileRelate_Country_expenseStyle())
				dispatch(getBaseFileRelate_DisburseClass_expenseStyle())
				dispatch(getBaseFileRelate_Supplier_expenseStyle())
				dispatch({
					type: types.EXPENSETYPE_VIEW_DEFINES,
					payload: returnData
				});
				dispatch(haveBeenEdited('-3'))
				window.loading.remove()
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
}
//获取左侧菜单列表
export const getLeftExpenseList = (id)=>{
	let paramData = {"grouprange":false}
	return (dispatch, getState) => {
		NetWork.get(api.GET_CHARGESTYLE_EXPENSELIST,paramData,
			(returnData) => {
				if (id === undefined) {
					dispatch(getexpenseviewdefine(returnData.data[0].id))
				}else{
					dispatch(getexpenseviewdefine(id))
				}
				dispatch({
					type: types.EXPENSETYPE_CHARGESTYLE_EXPENSELIST,
					payload: returnData.data
				});
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
}
//改变是否使用
export const changeExpenseTypeIsUsed = (checked)=>{
	return (dispatch,getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type:types.EXPENSESTYLE_CHAGEISUED,
			payload:checked
		})
	}
}
//改变单据名称
export const changeBillingNameInput_expenseType = (value)=>{
	return (dispatch,getState)=>{
		dispatch(haveBeenEdited())
		dispatch({
			type:types.EXPENSETYPE_CHANGEBILLNAME,
			payload:value
		})
	}
}
export const changeBillingNameBlurDone_expenseType = (value)=>{
	return (dispatch,getState)=>{
		dispatch(haveBeenEdited())
		dispatch({
			type:types.EXPENSETYPE_CHANGEBILLNAMEDONE,
			payload:value
		})
	}
}
//改变左侧菜单名称
export const changeBillingNameBlur_expenseType = (data)=>{
	return (dispatch,getState)=>{
		dispatch({
			type:types.EXPENSETYPE_CHANGELEFTLISTNAME,
			payload:data
		})
	}
}
//改变是否必填
export const changeCheckedSettingItem_expenseType = (data)=>{
	return (dispatch,getState)=>{
		dispatch(haveBeenEdited())
		dispatch({
			type:types.EXPENSETYPE_CHANGEISREQUIRED,
			payload:data
		})
	}
}
//删除编辑卡片
export const deleteSettingItem_expenseType = (data)=>{
	return (dispatch,getState)=>{
		dispatch(haveBeenEdited())
		dispatch({
			type:types.EXPENSETYPE_DELETEEDITITEM,
			payload:data
		})
	}
}
//拖拽表头字段排序
export const drageExpenseStyleInforData = (data)=>{
	return (dispatch,getState)=>{
		dispatch(haveBeenEdited())
		dispatch({
			type:types.EXPENSETYPE_DRAGINORITITEM,
			payload:data.data
		})
	}
}
//删除当前费用类型
export const delete_expenseType = (id,currentModel)=>{
	return (dispatch, getState) => {
		let paramData = { param: { "id": id } }
		if(currentModel === 'add'){
			let expenseList = getState().toJS().expenseTypeState.expenseList
			let newexpenseList = expenseList.filter((item) => {
				return item.id * 1 !== id * 1
			})
			dispatch({
				type: types.EXPENSESTYLE_DELETECHARGESTYLE,
				payload: newexpenseList
			})
			dispatch(getexpenseviewdefine(newexpenseList[0].id + ''))
			//删除后滚动条滚动到顶部
			setTimeout(()=>{
					const div = document.getElementsByClassName('leftCollapseListWrap')[0]
					div.scrollTop = 0;
			},300)
		}else{
			NetWork.post(api.DELETE_EXPENSESTYPE,
			paramData,
			(returnData) => {
				let expenseList = getState().toJS().expenseTypeState.expenseList
				let newexpenseList = expenseList.filter((item) => {
					return item.id * 1 !== id * 1
				})
				dispatch({
					type: types.EXPENSESTYLE_DELETECHARGESTYLE,
					payload: newexpenseList
				})
				dispatch(getexpenseviewdefine(newexpenseList[0].id + ''))
				//删除后滚动条滚动到顶部
				setTimeout(()=>{
						const div = document.getElementsByClassName('leftCollapseListWrap')[0]
						div.scrollTop = 0;
				},300)			
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
		}
	}
}
//基础单选设置改变详情卡片
export const changebasichighCheck = (data)=>{
	return (dispatch,getState)=>{
		dispatch(haveBeenEdited())
		dispatch({
			type:types.EXPENSESTYLE_CHANGEBASICCHECK,
			payload:data
		})
	}
}	
//通过改变高级设置的下拉框改变数据
export const changeExpenseBySelelct = (data)=>{
	return (dispatch,getState)=>{
		dispatch(haveBeenEdited())
		dispatch({
			type:types.EXPENSESTYLE_CHANGEHIGHSELECT,
			payload:data
		})
	}
}
//高级按钮改变进项税允许抵扣
export const changeCanVatDeduct = (checked)=>{
	return (dispatch,getState)=>{
		dispatch(haveBeenEdited())
		dispatch({
			type:types.EXPENSESTYLE_CHANGECANVATDEDUCT,
			payload:checked
		})
	}
}
//高级按钮改变员工常用
export const changeIsPopular = (checked)=>{
	return (dispatch,getState)=>{
		dispatch(haveBeenEdited())
		dispatch({
			type:types.EXPENSESTYLE_CHANGEISPOPULAR,
			payload:checked
		})
	}
}
//保存
export const saveExpenseSettingData = (data)=>{
	return (dispatch, getState) => {
		NetWork.post(api.SAVE_EXPENSETYPE_SETTING, data,
			(returnData) => {
				Toast.success('保存成功啦！')
				
				//保存成功后重新获取一次左侧菜单数据
				dispatch(getLeftExpenseList(returnData.data.id))
				dispatch({
					type: types.EXPENSESTYLE_SAVESETTINGDATA,
					payload: { 
						saveId: -3,
					 }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}

export const cancleExpenseSettingData = (settingData,leftMenu)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.EXPENSETYPE_CANCLESETTING,
			payload: {settingData,leftMenu}
		})
	}
}
//修改设置项的内容
export const changeExpenseCheckedSettingItem = (data) =>{
	return (dispatch,getState)=>{
		dispatch(haveBeenEdited())
		dispatch({
			type:types.EXPENSESTYLE_CHANGEDISPNAME,
			payload:data
		})
	}
}

//获取费用模板
export const getexpensetemplate = (key) =>{
	let paramData = {"id":key}
	return (dispatch, getState) => {
		NetWork.get(api.GET_EXPENSETEMPLATE, paramData,
			(returnData) => {
				dispatch({
					type: types.EXPENSESTYLE_GETEXPENSETEMPLATE,
					payload: { 
						dbName: returnData.data.dbName,
						url: returnData.data.url,
						expenseClassCode:returnData.data.code,
					 }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}