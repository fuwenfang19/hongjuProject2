/**
 * Created by fuwenfang on 2/25/17.
 * 单据类型actions
 */
import * as types from '../../actionTypes';
import api from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';
import { Toast } from '../../../components/common';
import uuid from 'uuid';
import { NewUserIntroduce } from '../../../components/common'

//有过编辑改变
export const haveBeenEdited = (flag) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.BILLINGSTYLE_HAVEBEENEDITED,
			payload: {
				saveId: flag ? flag : '',
			}
		})
	}
}
//改变左侧菜单(增加)
export const changeBillLeftMenuData = (leftMenuData) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.BILLINGSTYLE_CHANGELEFTMENUDATA,
			payload: leftMenuData
		})
	}
}
//改变左侧菜单（删除单据类型）
export const deleteBillingStyle = (leftMenuData, currentBillStyle, id,currentModel) => {
	return (dispatch, getState) => {
		let paramData = { param: { "id": id } }
		let url
		if (currentBillStyle + '' === '15') {
			url = api.DELETE_REPAYSETTING
		} else if (currentBillStyle + '' === '2') {
			url = api.DELETE_BILLSETTING
		} else if (currentBillStyle + '' === '3') {
			url = api.DELETE_REPORTSETTING
		}
		if(currentModel === 'add'){
			//不请求接口 直接删掉
			let newleftMenuData = leftMenuData
			newleftMenuData[currentBillStyle] = leftMenuData[currentBillStyle].filter((item) => {
				return item.id * 1 !== id * 1
			})
			dispatch({
				type: types.BILLINGSTYLE_CHANGELEFTMENUDATADELETE,
				payload: newleftMenuData
			})
			dispatch(getApplicationSettingData(leftMenuData[currentBillStyle][0].id + '', currentBillStyle))
			//删除后滚动条滚动到顶部
			setTimeout(()=>{
					if(currentBillStyle*1 === 2){
							const div = document.getElementsByClassName('leftCollapseListWrap')[0]
							div.scrollTop = 0;
					}else if(currentBillStyle*1 === 3){
							const div = document.getElementsByClassName('leftCollapseListWrap')[1]
							div.scrollTop = 0;
					}else if(currentBillStyle*1 === 15){
							const div = document.getElementsByClassName('leftCollapseListWrap')[2]
							div.scrollTop = 0;
					}
			},300)
		}else{
			NetWork.post(url,
			paramData,
			(returnData) => {
				let newleftMenuData = leftMenuData
				newleftMenuData[currentBillStyle] = leftMenuData[currentBillStyle].filter((item) => {
					return item.id * 1 !== id * 1
				})
				dispatch({
					type: types.BILLINGSTYLE_CHANGELEFTMENUDATADELETE,
					payload: newleftMenuData
				})
				dispatch(getApplicationSettingData(leftMenuData[currentBillStyle][0].id + '', currentBillStyle))
				//删除后滚动条滚动到顶部
				setTimeout(()=>{
						if(currentBillStyle*1 === 2){
								const div = document.getElementsByClassName('leftCollapseListWrap')[0]
								div.scrollTop = 0;
						}else if(currentBillStyle*1 === 3){
								const div = document.getElementsByClassName('leftCollapseListWrap')[1]
								div.scrollTop = 0;
						}else if(currentBillStyle*1 === 15){
								const div = document.getElementsByClassName('leftCollapseListWrap')[2]
								div.scrollTop = 0;
						}
				},300)
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
		}
	}
}

//改变自动生成checked
export const changeBillAutoTransCheck = (checked) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGEAUTOTRANSCHECK,
			payload: { checked }
		})
	}
}
//改变是否启用
export const changeBillIsused = (checked) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())

		dispatch({
			type: types.BILLINGSTYLE_CHANGEBILLISUSED,
			payload: { checked }
		})
	}
}

//获取申请单关联报销单类型
export const getShenqinBillRelateType = () => {
	return (dispatch, getState) => {
		let paramData = { "grouprange": false }
		NetWork.get(api.GET_SHENQINBILL_RELATETYPE,
			paramData,
			(returnData) => {
				let data = {}
				//data.currentBillStyle = '2'
				data.shenqindanRelatebaoxiaodan = returnData
				dispatch({
					type: types.BILLINGSTYLE_RELATETYPE,
					payload: data
				});
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
}
//单据类型新增类型
export const addBillingStyle = (type) => {
	return (dispatch, getState) => {
		let paramData = { "grouprange": false, "type": type }
		NetWork.get(api.GET_BILLING_STYLE,
			paramData,
			(returnData) => {
				//returnData.currentBillStyle = type+''
				if (type + '' === '2') {
					//只有申请单才会关联报销单类型
					dispatch(getShenqinBillRelateType())
				} else if (type + '' === '3') {
					//只有报销单才会获取支付类型枚举值
					dispatch(getDisburseClasses(returnData.data))
				}
				dispatch({
					type: types.BILLINGSTYLE_ADDSTYLE,
					payload: returnData
				});
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};


//重新排序设置项
export const sortedBillingStyleData = (data) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_SROTEDSETTINGDATA,
			payload: data
		})
	}
}

//删除设置项
export const deleteBillSettingItem = (defaultBillingSetting) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())

		dispatch({
			type: types.BILLINGSTYLE_DELETESETTINGDATA,
			payload: defaultBillingSetting
		})
	}
}
//改变是否必填
export const changeBillCheckedSettingItem = (data) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHECKEDSETTINGDATAITEM,
			payload: data
		})
	}
}
//改变单据类型名称
export const changeBillingNameBlur = (newleftMenuData) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGEBILLNAME,
			payload: {
				newleftMenuData,
			}
		})
	}
}
export const changeBillingNameInput = (value,isCode) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGEBILLNAMEINPUT,
			payload: value,
			isCode,
		})
	}
}
export const changeBillingNameBlurDone = (name) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGEBILLNAMEDONE,
			payload: name
		})
	}
}
export const changeBillbasichighCheckAll = (data) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGEBASICCHECKALL,
			payload: data
		})
	}
}

//关联档案
export const changeBillRelateFile = (value) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		let paramData = { "code": value }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_GETFILEDATA,
					payload: { fields_template: returnData.data.fields_template }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取自定义档案的枚举值
export const getCustomBaseDefine = () => {
	return (dispatch, getState) => {
		NetWork.get(api.GET_CUSTOMBASEDEFINE, {},
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_CUSTOMBASEDEFINE,
					payload: { fakeSelfDefineData: returnData }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_StaffItem = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'StaffItem' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_GETFILEDATA_StaffItem,
					payload: { fields_template_StaffItem: returnData.data.fields_template }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_Department = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'Department' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_GETFILEDATA_Department,
					payload: { fields_template_Department: returnData.data.fields_template }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_ExpenseItem = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'ExpenseItem' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_GETFILEDATA_ExpenseItem,
					payload: { fields_template_ExpenseItem: returnData.data.fields_template }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_City = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'City' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_GETFILEDATA_City,
					payload: { fields_template_City: returnData.data.fields_template }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_Transport = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'Transport' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_GETFILEDATA_Transport,
					payload: { fields_template_Transport: returnData.data.fields_template }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_Country = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'Country' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_GETFILEDATA_Country,
					payload: { fields_template_Country: returnData.data.fields_template }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}

//获取档案关联项
export const getBaseFileRelate_DisburseClass = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'DisburseClass' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_GETFILEDATA_DisburseClass,
					payload: { fields_template_DisburseClass: returnData.data.fields_template }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取档案关联项
export const getBaseFileRelate_Supplier = () => {
	return (dispatch, getState) => {
		let paramData = { "code": 'Supplier' }
		NetWork.get(api.GET_BILLINGSTYLE_GETFILEDATA, paramData,
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_GETFILEDATA_Supplier,
					payload: { fields_template_Supplier: returnData.data.fields_template }
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}


//获取申请单关联报销单类型
export const choseRelateBaoxiaobill = (data) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_RELATEBAOXIAOBILL,
			payload: data
		})
	}
}
//改变高级设置数据类型
export const changeBillingSettingBySelelct = (defaultBillingSetting) => {
	//console.log(defaultBillingSetting)
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGEHIGHDATASTYLE,
			payload: {
				defaultBillingSetting: defaultBillingSetting,
			}
		})
	}
}
//保存设置项
export const saveBillSettingData = (settingData, type) => {
	let url
	if (type + '' === '15') {
		url = api.SAVE_REPAYBILL_APPLICATIONSETTING
	} else if (type + '' === '2') {
		url = api.SAVE_BILLINGSETTING_DATA
	} else if (type + '' === '3') {
		url = api.SAVE_REPORTBILL_APPLICATIONSETTING
	}
	return (dispatch, getState) => {
		NetWork.post(url, settingData,
			(returnData) => {
				Toast.success('保存成功啦！')
				
				//保存成功后重新获取一次左侧菜单数据
				dispatch(getLeftBillingStyleList({ "grouprange": false },returnData.data.id,type))
				dispatch({
					type: types.BILLINGSTYLE_SAVESETTINGDATA,
					payload: { saveId: -3}
				})

			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}

//改变预算占用
export const changeBillUseBudget = (checked) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGEUSEBUDGET,
			payload: {
				checked: checked,
			}
		})
	}
}
//改变是否冲销
export const changeIsreversal = (checked) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGEISREVERSAL,
			payload: {
				checked: checked,
			}
		})
	}
}
//改变自动生成凭证
export const changeAutogenvoucher = (checked) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGEAUTOGENVOUCHER,
			payload: {
				checked: checked,
			}
		})
	}
}
//改变审批后是否删除
export const changeCanDeleteAfterApproval = (checked) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGECANDELETEAFTERAPPROVAL,
			payload: {
				checked: checked,
			}
		})
	}
}
//改变审批流发起人
export const changeApprovalDefineAuthor = (value) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGEAPPROVALDEFINEAUTHOR,
			payload: {
				value: value,
			}
		})
	}
}
//是否先申请
export const changeFromApplication = (checked) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGEFROMAPPLICATION,
			payload: {
				checked: checked,
			}
		})
	}
}
//是否先申请
export const changeLimitLoanAmount = (checked) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGELIMITLOANAMOUNT,
			payload: {
				checked: checked,
			}
		})
	}
}
//查看方式
export const changeDisplayByExpense = (checked) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CHANGEDISPLAYBYEXPENSE,
			payload: {
				checked: checked,
			}
		})
	}
}


//删除单据列表条目
export const closeBIllLIst = (data) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.BILLINGSTYLE_CLOSEBILLLIST,
			payload: {
				data: data,
			}
		})
	}
}
//获取已经设置的左侧单据类型摘要的列表
export const getDigesttemplates = (type) => {
	//let paramData = { "pk":type }
	return (dispatch, getState) => {
		NetWork.get(api.GETDIGEST_TEMPLATES + type + '/',
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_GETDIGESTTEMPLATES,
					payload: { highSettingBtnListData: returnData.data }
				})
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}

//修改报销单的支付类型
export const ChangeChargeStyle = (data) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.REPORTTYLE_CHANGECHARGESTYLE,
			payload: {
				data: data,
			}
		})
	}
}
//修改费用类型列表的复选框
export const changeChargeStyleCheckbox = (data) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.REPORTTYLE_CHANGECHARGESTYLECHECKBOX,
			payload: {
				data: data,
			}
		})
	}
}
//拖拽费用类型项目
export const dragChargeStyleItem = (data) => {
	return (dispatch, getState) => {
		dispatch(haveBeenEdited())
		dispatch({
			type: types.REPORTTYLE_DRAGCHARGESTYLEITEM,
			payload: data
		})
	}
}
//单据类型模板设置项
export const getDefaultBillingStyle = (id, type) => {
	window.loading.add()
	return (dispatch, getState) => {
		if (type + '' === '3') {
			dispatch(getChargeListData())
		}
		let paramData = { "id": id }
		NetWork.get(api.GET_BILLINGSTYLE_DEFAULTSETTING,
			paramData,
			(returnData) => {
				//先按order排序
				let billingStyleData = returnData.data.viewdefines[0].templatedefinetemplate.fieldtemplates_template
				/* APP端摘要设置数据处理过程
				let digestDesign = returnData.data.digestDesign
				digestDesign.map((item, i) => {
					if (!item.option) {
						item.option = i
					}
					return item
				})
				let digestDesignOption = digestDesign.map(p => p.option)
				let arry = [0, 1, 2, 3, 4]
				let newdigestDesign = digestDesign.concat()

				arry.map((item) => {
					if (digestDesignOption.indexOf(item) < 0) {
						newdigestDesign.push({ "id": uuid.v4(), "format": "", "col": "", "title": "", option: item })
					}
					return item
				})
				//console.log(newdigestDesign)
				//按option排序
				newdigestDesign.sort(function (b, a) {
					return b.option - a.option;
				});
				returnData.data.digestDesign = newdigestDesign
				*/
				let billSettingInfor = []
				billingStyleData.map((item) => {
					if (item.visible) {
						billSettingInfor.push(item)
					}
				})
				billSettingInfor.sort(function (b, a) {
					return b.order - a.order;
				});
				billingStyleData.sort(function (b, a) {
					return b.order - a.order;
				});
				if (!returnData.data.approvalDefine) {
					returnData.data.approvalDefine = { author: "", condition: "", enable: true }
				}
				returnData.data.viewdefines[0].templatedefinetemplate.fieldtemplates_template = billingStyleData
				returnData.data.billSettingInfor = billSettingInfor
				returnData.currentModel = 'add'
				returnData.currentBillStyle = type + ''
				returnData.data.objectModel = returnData.data.code;
				returnData.data.parent = returnData.data.code;
				returnData.data.code = returnData.data.code + '_' + uuid.v1();
				returnData.data.originNameOfTemplate = returnData.data.name;
				dispatch(getCustomBaseDefine())
				dispatch(getBaseFileRelate_StaffItem())
				dispatch(getBaseFileRelate_Department())
				dispatch(getBaseFileRelate_ExpenseItem())
				dispatch(getBaseFileRelate_City())
				dispatch(getBaseFileRelate_Transport())
				dispatch(getBaseFileRelate_Country())
				dispatch(getBaseFileRelate_DisburseClass())
				dispatch(getBaseFileRelate_Supplier())
				dispatch({
					type: types.BILLINGSTYLE_GETDEFAULTSETTING,
					payload: returnData
				});
				setTimeout(() => {
					dispatch(haveBeenEdited('-2'))
				}, 500)
				window.loading.remove()
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});

	}
};
//取消单据设置
export const cancleBillSettingData = (settingData,leftMenu)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BILLINGSTYLE_CANCLESETTING,
			payload: {
				settingData,leftMenu}
		})
	}
}
//新增报销单的时候 需要单独接口获取支付类型的枚举值
export const getDisburseClasses = () => {
	return (dispatch, getState) => {
		let paramData = { "company": 3, "pagenum": 1, "countperpage": 10000, "status": "正常" }
		NetWork.get(api.GET_ADDREPORTBILL_DISBURSE,
			paramData,
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_GETDISBURSECLASSES,
					payload: returnData
				});
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
}
//获取报销单的费用类型列表
export const getChargeListData = () => {
	let paramData = { "grouprange": false }
	return (dispatch, getState) => {
		NetWork.get(api.GET_REPORT_EXPENSELIST, paramData,
			(returnData) => {
				dispatch({
					type: types.BILLINGSTYLE_GETCHARGELISTDATA,
					payload: returnData.data
				})
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取已设置过的设置数据
export const getApplicationSettingData = (id, type) => {
	window.loading.add()
	return (dispatch, getState) => {
		let paramData = { "id": id + '' }
		let url
		if (type + '' === '15') {
			url = api.GET_REPAYSTYLE_APPLICATIONSETTING
		} else if (type + '' === '2') {
			url = api.GET_BILLINGSTYLE_APPLICATIONSETTING
		} else if (type + '' === '3') {
			url = api.GET_REPORTSTYLE_APPLICATIONSETTING
			dispatch(getChargeListData())
		}
		NetWork.get(url, paramData,
			(returnData) => {
				//先按order排序
				let billingStyleData = returnData.data.viewdefines[0].templatedefine.fields_template
				/* APP端摘要设置数据处理过程
				let digestDesign = returnData.data.digestDesign
				digestDesign.map((item, i) => {
					if (!item.option) {
						item.option = i
					}
					return item
				})
				let digestDesignOption = digestDesign.map(p => p.option)
				let arry = [0, 1, 2, 3, 4]
				let newdigestDesign = digestDesign.concat()

				arry.map((item) => {
					if (digestDesignOption.indexOf(item) < 0) {
						newdigestDesign.push({ "id": uuid.v4(), "format": "", "col": "", "title": "", option: item })
					}
					return item
				})
				//console.log(newdigestDesign)
				//按option排序
				newdigestDesign.sort(function (b, a) {
					return b.option - a.option;
				});
				returnData.data.digestDesign = newdigestDesign
				*/
				let billSettingInfor = []
				billingStyleData.map((item) => {
					if (item.visible) {
						billSettingInfor.push(item)
					}
				})
				billSettingInfor.sort(function (b, a) {
					return b.order - a.order;
				});
				billingStyleData.sort(function (b, a) {
					return b.order - a.order;
				});
				if (type + '' === '3') {
					let expenseClasses = returnData.data.expenseClasses
					expenseClasses.sort(function (b, a) {
						return b.showOrder - a.showOrder;
					})
				}
				returnData.data.viewdefines[0].templatedefine.fields_template = billingStyleData
				returnData.data.billSettingInfor = billSettingInfor
				returnData.currentModel = 'edit'
				returnData.currentBillStyle = type + ''
				returnData.shenqindanRelatebaoxiaodan = [returnData.data.defaultReportType]
				if (type + '' === '2') {
					//只有申请单才会关联报销单类型
					dispatch(getShenqinBillRelateType())
				} else if (type + '' === '3') {
					//只有报销单才会获取支付类型枚举值
					dispatch(getDisburseClasses(returnData.data))
				}
				dispatch(getCustomBaseDefine())
				dispatch(getBaseFileRelate_StaffItem())
				dispatch(getBaseFileRelate_Department())
				dispatch(getBaseFileRelate_ExpenseItem())
				dispatch(getBaseFileRelate_City())
				dispatch(getBaseFileRelate_Transport())
				dispatch(getBaseFileRelate_Country())
				dispatch(getBaseFileRelate_DisburseClass())
				dispatch(getBaseFileRelate_Supplier())
				dispatch({
					type: types.BILLINGSTYLE_GETAPPLIACATIONSETTING,
					payload: returnData
				})
				setTimeout(() => {
					dispatch(haveBeenEdited('-3'))
				}, 500)
				window.loading.remove()
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取已经设置的左侧单据类型的列表
export const getLeftBillingStyleList = (paramData, id, type) => {
	return (dispatch, getState) => {
		NetWork.get(api.GET_BILLINGSTYLE_LEFTMENU, paramData,
			(returnData) => {
				if (id === undefined) {
					dispatch(getApplicationSettingData(returnData['2'][0].id + '', '2'))
				} else {
					dispatch(getApplicationSettingData(id + '', type + ''))
				}
				dispatch({
					type: types.BILLINGSTYLE_GETLEFTMENU,
					payload: returnData
				})
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
