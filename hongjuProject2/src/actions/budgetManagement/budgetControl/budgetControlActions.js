/**
 * Created by fuwenfang on 3/30/17.
 * 预算控制actions
 */
import * as types from '../../actionTypes';
import api from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';
import { Toast } from '../../../components/common';
import {fileTypeDimCode} from '../../../components/budgetManagement/budgetControl/constant'

//获取预算控制定义维度
export const getDimensionrefinfo = (data)=>{
	return (dispatch, getState) => {
		NetWork.get(api.BUDGET_DIMENSIONREFINFO,
			(returnData) => {
				const dimensionData = returnData.filter((item,i)=>{
					return item.dimension.code !=='DisburseClass'
				})				
				if(data.length!==0){
					dispatch(getBudgetPlanDetail(data[0].id,dimensionData))
				}
				dispatch({
					type: types.BUDGET_GETBUDGETDIMENSIONREFINFO,
					payload: { 
						dimensionRefInfor: returnData
					 }
				})
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//获取控制方案
export const getBudgetPlanList = ()=>{
	window.loading.add() 
	let paramData = {"namelike":'',"status":'',"values":[]}
	return (dispatch, getState) => {
		NetWork.get(api.BUDGET_GETPLANLIST, paramData,
			(returnData) => {
				dispatch(getDimensionrefinfo(returnData))
				dispatch({
					type: types.BUDGET_GETBUDGETPLANLIST,
					payload: { 
						budgetList: returnData,
						currentBudgetPlanId:returnData.length===0?'':returnData[0].id
					 }
				})
			window.loading.remove()
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
//读取预算编制方案内容
export const getBudgetPlanDetail =(id,dimensionDataPram)=>{
	window.loading.add()
	let url = api.BUDGET_GETPLANDETAIL + id +'/'
	return (dispatch, getState) => {
		let dimensionData = dimensionDataPram===undefined?getState().toJS().budgetControlState.dimensionData:dimensionDataPram
		let originColumns = getState().toJS().budgetControlState.originBudgetControlListColumns
		let columnData = originColumns.length === 0?getState().toJS().budgetControlState.budgetControlListColumns:originColumns
		NetWork.get(url, {},
			(returnData) => {
				const dimensionRefs = returnData.dimensionRefs
					if(dimensionRefs.length===0){
						dimensionData.map((item,i)=>{
							item.isChecked = false
						})
					}else{
						dimensionData.map((item,i)=>{
							item.isChecked = false
						})
						for(let i = 0;i<dimensionData.length;i++){
							for(let j=0;j<returnData.dimensionRefs.length;j++){
								if(dimensionData[i].id*1 === returnData.dimensionRefs[j].dimensionRef.id*1){
									dimensionData[i].isChecked = true
								}
							}
						}
					}
					dispatch({
						type: types.BUDGET_GETBUDGETPLANDETAIL,
						payload: { 
							budgetPlanDetail: returnData,
							dimensionData:dimensionData,
							id:id
						}
					})
					//获取数据之后根据budgetPlanDetail.dimensionRefs来动态改变column的值
					let newColumns = []
					if(dimensionRefs.length>0){
						dimensionRefs.map((item,i)=>{
							let newColumnItem = {title: item.dimensionRef.dimension.name,
									dataIndex: item.dimensionRef.item_code,
									key: item.dimensionRef.item_code,
									width:200,
									dataType:{
										type: 'file',
										fileType: fileTypeDimCode[item.dimensionRef.item_code],
										isRadio: true,
									}}
							//先判断新增的newColumnItem不在原来的column中  防止重复
							 newColumns = columnData.filter((p,i)=>{
								return p.dataIndex !== item.dimensionRef.item_code
							})
							newColumns.unshift(newColumnItem)
						})
					}
					//动态改变dataSource的值  把已勾选的dimensionRefs对应的item_code的值拿出来
					 let dataSource = returnData.dims
					 const dimensionRefs_itemCodes = dimensionRefs.map(p=>p.dimensionRef.item_code)
					 for(let i = 0;i<dataSource.length;i++){
							for(let key in dataSource[i].controlItemPlan){
								if(dimensionRefs_itemCodes.indexOf(key)>-1){
									dataSource[i][key] = [{id:dataSource[i].controlItemPlan[key],name:dataSource[i].controlItemPlan[key+'Name']}]
								}
							}
					 }
					 
					 dataSource.map((item,i)=>{
						 item.warnLimit = item.warnLimit.slice(0,item.warnLimit.indexOf('.'))
						 item.controlLimit = item.controlLimit.slice(0,item.controlLimit.indexOf('.'))
						 item.overageKind = 0  //此处是因为初始数据不准 给了100 防止editTable报错 暂时给0
						 if(item.controlKind === 5){
							item.controlKind = item.startDate +'~'+ item.endDate
						 }
					 })
					dispatch(changeOriginColumnDataSource(newColumns,dataSource))
					window.loading.remove()
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
	}
}
export const addBudgetControl = (budgetList,budgetPlanDetail_template,budgetColumn_template)=>{
  return (dispatch,getState)=>{
		let dimensionData = getState().toJS().budgetControlState.dimensionData
		let budgetControlListColumns = budgetColumn_template

		const dimensionRefs = budgetPlanDetail_template.dimensionRefs
		if(dimensionRefs.length===0){
			dimensionData.map((item,i)=>{
				item.isChecked = false
			})
		}else{
			dimensionData.map((item,i)=>{
				item.isChecked = false
			})
			for(let i = 0;i<dimensionData.length;i++){
				for(let j=0;j<returnData.dimensionRefs.length;j++){
					if(dimensionData[i].id*1 === budgetPlanDetail_template.dimensionRefs[j].dimensionRef.id*1){
						dimensionData[i].isChecked = true
					}
				}
			}
		}
		
		//获取数据之后根据budgetPlanDetail_template.dimensionRefs来动态改变column的值
		//新增控制方案时budgetPlanDetail_template.dimensionRefs是空  所以就不改变column

		//动态改变dataSource的值  把已勾选的dimensionRefs对应的item_code的值拿出来
		//新增控制方案时budgetPlanDetail_template.dimensionRefs是空  所以就不改变column
			let dataSource = budgetPlanDetail_template.dims
			dataSource.map((item,i)=>{
				item.warnLimit = item.warnLimit.slice(0,item.warnLimit.indexOf('.'))
				item.controlLimit = item.controlLimit.slice(0,item.controlLimit.indexOf('.'))
				if(item.controlKind === 5){
				item.controlKind = item.startDate +'~'+ item.endDate
				}
			})
		dispatch(changeOriginColumnDataSource(budgetControlListColumns,dataSource))

		dispatch({
			type: types.BUDGETCONTROL_ADDCASE,
			payload:{budgetList,budgetPlanDetail_template,dimensionData}
		})
	}
}
//修改左侧控制方案列表
export const changeBudgetList = (data)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_CHANGEBUDGETLIST,
			payload:{data}
		})
	}
}
export const rowDataChange = (data)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_ROWDATACHANGE,
			payload:{data}
		})
	}
}

export const checkedDimensionData = (checked,i)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_CHECKEDDIMENSIONDATA,
			payload:{checked,i}
		})
	}
}
//选择支出类型的回调
export const selectDisburse = (data)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_SELECTDISBURSE,
			payload:data
		})
	}
}

export const clickAddTableItem = (data)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_CLICKADDTABLEITEM,
			payload:data
		})
	}
}

export const clickDeleteTableItem = (data,selectedRowKeys,lastOneRowDataSource)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_CLICKDELETETABLEITEM,
			payload:{data,selectedRowKeys,lastOneRowDataSource}
		})
	}
}

export const onSelectChange = (selectedRowKeys)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_ONSELECTCHANGE,
			payload:selectedRowKeys
		})
	}
}

//启用开关
export const changeSwicthBtn = (status)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_CHANGESWITCHBTN,
			payload:status
		})
	}
}
//点击编辑按钮
export const clickEditBtn = ()=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_CLICKEDITBTN,
			payload:status
		})
	}
}
//修改方案名称
export const clickBlurInput = (value)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_CHANGEBUDGETNAME,
			payload:value
		})
	}
}
//控制维度选择回调
export const changeDimensionRefs=(dimensionData,budgetPlanDetail)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_CHANGEDIMENSIONREFS,
			payload:{dimensionData,budgetPlanDetail}
		})
	}
}

//根据budgetPlanDetail.dimensionRefs的改变来动态改变columns
export const changeColumnDataSource = (columnData,dataSource)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_CHANGECOLUMNDATASOURCE,
			payload:{columnData,dataSource}
		})
	}
}

//存储初始表头以及数据
export const changeOriginColumnDataSource = (columnData,dataSource)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_CHANGEORIGINCOLUMNDATASOURCE,
			payload:{columnData,dataSource}
		})
	}
}
//编辑页面取消状态
export const clickEditPageCancleBtn = (originDataSource,originBudgetControlListColumns,localBudgetPlanDetail,localBudgetList,localDimensionData)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_CLICKEDITPAGECANCLEBTN,
			payload:{originDataSource,originBudgetControlListColumns,localBudgetPlanDetail,localBudgetList,localDimensionData}
		})
	}
}
//新增页面取消状态
export const clickAddPageCancleBtn = (originDataSource,originBudgetControlListColumns,localBudgetPlanDetail,localDimensionData)=>{
	return (dispatch,getState)=>{
		dispatch({
			type: types.BUDGETCONTROL_CLICKADDPAGECANCLEBTN,
			payload:{originDataSource,originBudgetControlListColumns,localBudgetPlanDetail,localDimensionData}
		})
	}
}
