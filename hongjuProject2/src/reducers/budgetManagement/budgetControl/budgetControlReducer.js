/**
 * Created by fuwenfang on 30/3/17.
 */
import * as types from '../../../actions/actionTypes';
import Immutable from 'immutable';
const $$initialState = Immutable.fromJS({
  budgetList:[],//左侧方案列表
  localBudgetList:[],
  currentBudgetPlanId:'',
  budgetPlanDetail:{
    status:1,
    startDimValue:{
      name:'',
      id:''
    }
  },// 右侧控制方案详请 支出类型的改动直接对应改值的startDimValue{}
  localBudgetPlanDetail:{},// 右侧控制方案详情(不改动) 
  dimensionRefInfor:[],
  dimensionData :[{dimension:{name:''}}], //根据dimensionRefInfor获取 对应页面上控制维度的数据 有ischecked
  disburseList:[],
  currentStatus:'view',
  originBudgetControlListColumns:[],  //最近一次获取的 没有改动过的
  budgetControlListColumns:[{
    title: '控制方式',
    dataIndex: 'controlLevel',
    key: 'controlLevel',
    width:100,
    dataType: {
      type: 'select',
      selectList: [
        {
          name: '记录',
          value: 0
        }, {
          name: '提醒',
          value: 1
        }, {
          name: '弹性',
          value: 2
        },{
          name: '刚性',
          value: 3
        }
      ]
    }
  }, {
    title: '控制期间类型',
    dataIndex: 'controlKind',
    key: 'controlKind',
    width:200,
    dataType: {
      type: 'customRangeType',
    }
  }, {
    title: '预算累计周期',
    dataIndex: 'overageKind',
    key: 'overageKind',
    width:200,
    dataType: {
      type: 'select',
      selectList: [
        {
          name: '按月初累计',
          value: 0
        }, {
          name: '按季初累计',
          value: 1
        }, {
          name: '按半年初累计',
          value: 2
        },{
          name: '按年初累计',
          value: 3
        },{
          name: '按整个自定义期间初累计',
          value: 4
        },{
          name: '按单个自定义期间初',
          value: 5
        }
      ]
    }
  }, {
    title: '预警百分比',
    dataIndex: 'warnLimit',
    key: 'warnLimit',
    width:100,
    dataType:{
      type:'numberPercent'
    }
  }, {
    title: '控制百分比',
    dataIndex: 'controlLimit',
    key: 'controlLimit',
    width:100,
    dataType:{
      type:'numberPercent'
    }
  }], //页面上每次改动改值  不动对应的origin值
  dataSource:[],//页面上每次改动改值  不动对应的origin值
  originDataSource:[],//最近一次获取的 没有改动过的
  selectedRowKeys:[]
})

export default function rootPageReducer($$state = $$initialState, action = {}) {
  switch (action.type) {
    case types.BUDGETCONTROL_CHANGEBUDGETLIST:
      return $$state.merge({
        budgetList:action.payload.data
      })
    case types.BUDGETCONTROL_CLICKEDITPAGECANCLEBTN:
      return $$state.merge({
        dataSource :action.payload.originDataSource,
        budgetControlListColumns :action.payload.originBudgetControlListColumns,
        budgetPlanDetail:action.payload.localBudgetPlanDetail,
        budgetList:action.payload.localBudgetList,
        dimensionData:action.payload.localDimensionData,
        currentStatus:'view'
      })
    case types.BUDGETCONTROL_CLICKADDPAGECANCLEBTN:
      return $$state.merge({
        dataSource :action.payload.originDataSource,
        budgetControlListColumns :action.payload.originBudgetControlListColumns,
        budgetPlanDetail:action.payload.localBudgetPlanDetail,
        dimensionData:action.payload.localDimensionData,
      })    
    case types.BUDGETCONTROL_CHANGEORIGINCOLUMNDATASOURCE:
      return $$state.merge({
        originDataSource :action.payload.dataSource,
        originBudgetControlListColumns :action.payload.columnData,
        dataSource :action.payload.dataSource,
        budgetControlListColumns :action.payload.columnData,
      })
    case types.BUDGETCONTROL_CHANGEDIMENSIONREFS:
      return $$state.merge({
        dimensionData:action.payload.dimensionData,
        budgetPlanDetail:action.payload.budgetPlanDetail
      })
    case types.BUDGET_GETBUDGETDIMENSIONREFINFO:
      return $$state.merge({
        dimensionRefInfor:action.payload.dimensionRefInfor,
      })
    case types.BUDGETCONTROL_CHANGEBUDGETNAME:
      return $$state.updateIn(['budgetPlanDetail','name'],(value)=>{
        return action.payload
      })
    case types.BUDGETCONTROL_CLICKEDITBTN:
      return $$state.merge({
        currentStatus:'edit'
      })
    case types.BUDGETCONTROL_CHANGESWITCHBTN:
      return $$state.updateIn(['budgetPlanDetail','status'],(value)=>{
        return action.payload
      })
    case types.BUDGET_GETBUDGETPLANLIST:
      return $$state.merge({
        budgetList:action.payload.budgetList,
        localBudgetList:action.payload.budgetList,
        currentBudgetPlanId:action.payload.currentBudgetPlanId
      })
    case types.BUDGET_GETBUDGETPLANDETAIL:
      return $$state.merge({
        budgetPlanDetail:action.payload.budgetPlanDetail,
        localBudgetPlanDetail:action.payload.budgetPlanDetail,
        dimensionData:action.payload.dimensionData,
        localDimensionData:action.payload.dimensionData,
        currentBudgetPlanId:action.payload.id,
        currentStatus:'view'
      })
		case types.BUDGETCONTROL_ADDCASE:
      return $$state.merge({
        budgetList:action.payload.budgetList,
        currentStatus:'add',
        currentBudgetPlanId:'',
        budgetPlanDetail:action.payload.budgetPlanDetail_template,
        localBudgetPlanDetail:action.payload.budgetPlanDetail_template,
        dimensionData:action.payload.dimensionData,
        localDimensionData:action.payload.dimensionData,
      })
    case types.BUDGETCONTROL_ROWDATACHANGE:
      return $$state.merge({
        dataSource:action.payload.data
      })
    case types.BUDGETCONTROL_CHECKEDDIMENSIONDATA:
      return $$state.updateIn(['dimensionData',action.payload.i,'isChecked'],(value)=>{
        return action.payload.checked
      })
    case types.BUDGETCONTROL_SELECTDISBURSE:
      return $$state.updateIn(['budgetPlanDetail','startDimValue'],(value)=>{
        return action.payload
      })
    case types.BUDGETCONTROL_CHANGECOLUMNDATASOURCE:
      return $$state.merge({
        budgetControlListColumns:action.payload.columnData,
        dataSource:action.payload.dataSource
      })
    case types.BUDGETCONTROL_CLICKADDTABLEITEM:
      return $$state.merge({
        dataSource:action.payload
      })
    case types.BUDGETCONTROL_CLICKDELETETABLEITEM:
      return $$state.merge({
        dataSource:action.payload.data,
        selectedRowKeys:action.payload.selectedRowKeys,
        lastOneRowDataSource:action.payload.lastOneRowDataSource
      })
    case types.BUDGETCONTROL_ONSELECTCHANGE :
      return $$state.merge({
        selectedRowKeys:action.payload
      })
    default:
			return $$state;
  }
}