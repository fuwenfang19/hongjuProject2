/**
 * Created by uncle on 17/2/12.
 */
import * as types from '../../../actions/actionTypes';
import Immutable from 'immutable';

const $$initialState = Immutable.fromJS({
	saveId: -3,//’‘是页面有修改之后的值 -3 获取已设置过的设置数据  -2 单据类型模板设置项
	billingStyleList: [],
	localLeftMenuData: {'2': [], '3': [], '15': []},
	leftMenuData: {'2': [], '3': [], '15': []},
	defaultBillingSetting: {
		'name': '出差申请',
		viewdefines: [{
			templatedefinetemplate: {
				fieldtemplates_template: []
			}
		}],
		digestDesign: [],
		expenseClasses: [],
		billSettingInfor: []
	},
	recoverBillingSetting: {},
	billName: '',
	disburseClasses: [],
	currentModel: 'add',
	currentBillStyle: '2',
	shenqindanRelatebaoxiaodan: [{'name': '', 'id': '1'}],
	highSettingEnums: {
		FieldTypes: [
			{"name": '布尔', "value": 0, "type": 'base'},
			{"name": '单行文本', "value": 1, "type": 'base'},
			{"name": '日期', "value": 2, "type": 'base'},
			{"name": '数值', "value": 3, "type": 'base'},
			{"name": '整数', "value": 10, "type": 'base'},
			{"name": '档案', "value": 7, "type": 'base'},
			{"name": '自定义档案', "value": 11, "type": 'base'},
		],
		RelationTypes: [
			{"name": '人员', "value": 1, "code": 'StaffItem'},
			{"name": '部门', "value": 2, "code": 'Department'},
			{"name": '预算项目', "value": 4, "code": 'ExpenseItem'},
			{"name": '城市', "value": 5, "code": 'City'},
			{"name": '交通工具', "value": 6, "code": 'Transport'},
			{"name": '国家', "value": 11, "code": 'Country'},
			{"name": '支出类型', "value": 13, "code": 'DisburseClass'},
			{"name": '供应商', "value": 16, "code": 'Supplier'},
		],
		fakeSelfDefineData: [{'name': ''}],
		// fakeSelfDefineExpandData:[
		// 	{"key":1,"name": '人员', "value": 1, "code": 'StaffItem'},
		// 	{"key":2,"name": '部门', "value": 2, "code": 'Department'},
		// 	{"key":3,"name": '预算项目', "value": 4, "code": 'ExpenseItem'},
		// 	{"key":4,"name": '城市', "value": 5, "code": 'City'},
		// 	{"key":5,"name": '交通工具', "value": 6, "code": 'Transport'},
		// 	{"key":6,"name": '国家', "value": 11, "code": 'Country'},
		// 	{"key":7,"name": '支出类型', "value": 13, "code": 'DisburseClass'},
		// 	{"key":8,"name": '供应商', "value": 16, "code": 'Supplier'},
		// ],
		fields_template_StaffItem: [{'name': '名称', 'code': 'name', 'defid': 699}],
		fields_template_Department: [{'name': '名称', 'code': 'name', 'defid': 699}],
		fields_template_ExpenseItem: [{'name': '名称', 'code': 'name', 'defid': 699}],
		fields_template_City: [{'name': '名称', 'code': 'name', 'defid': 699}],
		fields_template_Transport: [{'name': '名称', 'code': 'name', 'defid': 699}],
		fields_template_Country: [{'name': '名称', 'code': 'name', 'defid': 699}],
		fields_template_DisburseClass: [{'name': '名称', 'code': 'name', 'defid': 699}],
		fields_template_Supplier: [{'name': '名称', 'code': 'name', 'defid': 699}],
	},
	highSettingBtnListData: [],
	chargeStyleList: []
});

export default function rootPageReducer($$state = $$initialState, action = {}) {
	switch (action.type) {
		case types.BILLINGSTYLE_GETLEFTMENU:
			return $$state.merge({
				localLeftMenuData: action.payload,
				leftMenuData: action.payload
			})
		case types.BILLINGSTYLE_CHANGELEFTMENUDATA:
			return $$state.merge({
				leftMenuData: action.payload
			})
		case types.BILLINGSTYLE_CHANGELEFTMENUDATADELETE:
			return $$state.merge({
				leftMenuData: action.payload,
				localLeftMenuData: action.payload,
			})
		case types.BILLINGSTYLE_CHANGEAUTOTRANSCHECK:
			return $$state.updateIn(['defaultBillingSetting', 'autoTrans'], (autoTrans) => {
				return action.payload.checked
			})
		case types.BILLINGSTYLE_CHANGEBILLISUSED:
			return $$state.updateIn(['defaultBillingSetting', 'isUsed'], (isUsed) => {
				return action.payload.checked
			})
		case types.BILLINGSTYLE_ADDSTYLE:
			return $$state.merge({
				billingStyleList: action.payload.data,
				//currentBillStyle: action.payload.currentBillStyle,
			})
		case types.BILLINGSTYLE_GETDISBURSECLASSES:
			return $$state.merge({
				disburseClasses: action.payload,
			})
		case types.BILLINGSTYLE_GETDEFAULTSETTING:
			return $$state.merge({
				defaultBillingSetting: action.payload.data,
				recoverBillingSetting: action.payload.data,
				billName: action.payload.data.name,
				currentModel: action.payload.currentModel,
				currentBillStyle: action.payload.currentBillStyle,
			})
		case types.BILLINGSTYLE_GETAPPLIACATIONSETTING:
			return $$state.merge({
				defaultBillingSetting: action.payload.data,
				recoverBillingSetting: action.payload.data,
				billName: action.payload.data.name,
				currentModel: action.payload.currentModel,
				currentBillStyle: action.payload.currentBillStyle,
				shenqindanRelatebaoxiaodan: action.payload.shenqindanRelatebaoxiaodan
			})
		case types.BILLINGSTYLE_CANCLESETTING:
			return $$state.merge({
				defaultBillingSetting: action.payload.settingData,
				leftMenuData: action.payload.leftMenu,
				saveId: -3
			})
		case types.BILLINGSTYLE_RELATETYPE:
			return $$state.merge({
				shenqindanRelatebaoxiaodan: action.payload.shenqindanRelatebaoxiaodan,
				//currentBillStyle: action.payload.currentBillStyle
			})
		case types.BILLINGSTYLE_SROTEDSETTINGDATA:
			return $$state.updateIn(['defaultBillingSetting', 'billSettingInfor'], (billSettingInfor) => {
				return action.payload.data
			})
		//return $$state
		case types.BILLINGSTYLE_DELETESETTINGDATA:
			return $$state.merge({defaultBillingSetting: action.payload})
		case types.BILLINGSTYLE_CHANGEBILLNAME:
			return $$state.merge({
				leftMenuData: action.payload.newleftMenuData
			})
		case types.BILLINGSTYLE_CHANGEBILLNAMEDONE:
			return $$state.updateIn(['defaultBillingSetting', 'name'], (name) => {
				return action.payload
			})
		case types.BILLINGSTYLE_CHANGEBILLNAMEINPUT:
			if (action.isCode) {
				return $$state.updateIn(['defaultBillingSetting', 'code'], () => {
					return action.payload;
				})
			} else {
				return $$state.merge({
					billName: action.payload,
				})
			}
		case types.BILLINGSTYLE_CHECKEDSETTINGDATAITEM:
			return $$state.updateIn(['defaultBillingSetting', 'billSettingInfor'], (billSettingInfor) => {
				return action.payload
			})
		case types.BILLINGSTYLE_CHANGEBASICCHECKALL:
			return $$state.updateIn(['defaultBillingSetting', 'billSettingInfor'], (billSettingInfor) => {
				return action.payload
			})
		case types.BILLINGSTYLE_GETFILEDATA:
			return $$state.updateIn(['highSettingEnums', 'fields_template'], (fields_template) => {
				return action.payload.fields_template
			})
		case types.BILLINGSTYLE_RELATEBAOXIAOBILL:
			return $$state.merge({defaultBillingSetting: action.payload})
		case types.BILLINGSTYLE_CUSTOMBASEDEFINE:
			return $$state.updateIn(['highSettingEnums', 'fakeSelfDefineData'], (fakeSelfDefineData) => {
				return action.payload.fakeSelfDefineData
			})
		case types.BILLINGSTYLE_CHANGEHIGHDATASTYLE:
			return $$state.merge({defaultBillingSetting: action.payload.defaultBillingSetting})
		case types.BILLINGSTYLE_GETFILEDATA_StaffItem:
			return $$state.updateIn(['highSettingEnums', 'fields_template_StaffItem'], (fields_template_StaffItem) => {
				return action.payload.fields_template_StaffItem
			})
		case types.BILLINGSTYLE_GETFILEDATA_Department:
			return $$state.updateIn(['highSettingEnums', 'fields_template_Department'], (fields_template_Department) => {
				return action.payload.fields_template_Department
			})
		case types.BILLINGSTYLE_GETFILEDATA_ExpenseItem:
			return $$state.updateIn(['highSettingEnums', 'fields_template_ExpenseItem'], (fields_template_ExpenseItem) => {
				return action.payload.fields_template_ExpenseItem
			})
		case types.BILLINGSTYLE_GETFILEDATA_City:
			return $$state.updateIn(['highSettingEnums', 'fields_template_City'], (fields_template_City) => {
				return action.payload.fields_template_City
			})
		case types.BILLINGSTYLE_GETFILEDATA_Transport:
			return $$state.updateIn(['highSettingEnums', 'fields_template_Transport'], (fields_template_Transport) => {
				return action.payload.fields_template_Transport
			})
		case types.BILLINGSTYLE_GETFILEDATA_Country:
			return $$state.updateIn(['highSettingEnums', 'fields_template_Country'], (fields_template_Country) => {
				return action.payload.fields_template_Country
			})
		case types.BILLINGSTYLE_GETFILEDATA_DisburseClass:
			return $$state.updateIn(['highSettingEnums', 'fields_template_DisburseClass'], (fields_template_DisburseClass) => {
				return action.payload.fields_template_DisburseClass
			})
		case types.BILLINGSTYLE_GETFILEDATA_Supplier:
			return $$state.updateIn(['highSettingEnums', 'fields_template_Supplier'], (fields_template_Supplier) => {
				return action.payload.fields_template_Supplier
			})
		case types.BILLINGSTYLE_SAVESETTINGDATA:
			return $$state.merge({
				saveId: action.payload.saveId,
			})
		case types.BILLINGSTYLE_HAVEBEENEDITED:
			return $$state.set('saveId', action.payload.saveId)
		case types.BILLINGSTYLE_CHANGEUSEBUDGET:
			return $$state.updateIn(['defaultBillingSetting', 'useBudget'], (useBudget) => {
				return action.payload.checked
			})
		case types.BILLINGSTYLE_CHANGEISREVERSAL:
			return $$state.updateIn(['defaultBillingSetting', 'isreversal'], (isreversal) => {
				return action.payload.checked
			})
		case types.BILLINGSTYLE_CHANGEAUTOGENVOUCHER:
			return $$state.updateIn(['defaultBillingSetting', 'autogenvoucher'], (autogenvoucher) => {
				return action.payload.checked
			})
		case types.BILLINGSTYLE_CHANGECANDELETEAFTERAPPROVAL:
			return $$state.updateIn(['defaultBillingSetting', 'canDeleteAfterApproval'], (canDeleteAfterApproval) => {
				return action.payload.checked
			})
		case types.BILLINGSTYLE_CHANGEFROMAPPLICATION:
			return $$state.updateIn(['defaultBillingSetting', 'fromApplication'], (fromApplication) => {
				return action.payload.checked
			})
		case types.BILLINGSTYLE_CHANGELIMITLOANAMOUNT:
			return $$state.updateIn(['defaultBillingSetting', 'limitLoanAmount'], (limitLoanAmount) => {
				return action.payload.checked
			})
		case types.BILLINGSTYLE_CHANGEDISPLAYBYEXPENSE:
			return $$state.updateIn(['defaultBillingSetting', 'displayByExpense'], (displayByExpense) => {
				return action.payload.checked
			})
		case types.BILLINGSTYLE_CHANGEAPPROVALDEFINEAUTHOR:
			return $$state.updateIn(['defaultBillingSetting', 'approvalDefine', 'author'], (author) => {
				return action.payload.value
			})
		case types.BILLINGSTYLE_GETDIGESTTEMPLATES:
			return $$state.merge({highSettingBtnListData: action.payload.highSettingBtnListData})
		case types.BILLINGSTYLE_CLOSEBILLLIST:
			return $$state.updateIn(['defaultBillingSetting', 'digestDesign'], (digestDesign) => {
				return action.payload.data
			})
		case types.REPORTTYLE_CHANGECHARGESTYLE:
			return $$state.updateIn(['defaultBillingSetting', 'expenseClasses'], (expenseClasses) => {
				return action.payload.data
			})
		case types.BILLINGSTYLE_GETCHARGELISTDATA:
			return $$state.merge({
				chargeStyleList: action.payload
			})
		case types.REPORTTYLE_CHANGECHARGESTYLECHECKBOX:
			return $$state.updateIn(['defaultBillingSetting', 'expenseClasses'], (expenseClasses) => {
				return action.payload.data
			})
		case types.REPORTTYLE_DRAGCHARGESTYLEITEM:
			return $$state.updateIn(['defaultBillingSetting', 'expenseClasses'], (expenseClasses) => {
				return action.payload.data
			})
		default:
			return $$state;
	}
}