/**
 * Created by fuwenfang on 17/2/12.
 */
import * as types from '../../../actions/actionTypes';
import Immutable from 'immutable';

const $$initialState = Immutable.fromJS({
	saveId: -3,// ’‘是页面有修改之后的值 -3 获取已设置过的设置数据  -2 单据类型模板设置项
	expenseChargeModalList: [],
	ticketListLoading:false,
	charstyleList: [],
	expenseList: [],
	localexpenseList:[],
	defaultBillingSetting: {
		'name': '',
		viewdefines: [{
			templatedefine: {
				fields_template: []
			}
		}],
		billSettingInfor: [],
		digestDesign: []
	},
	recoverSetting:{},
	expenseName:'',
	currentModel:'',
	highSettingEnums: {
		FieldTypes: [
			{ "name": '布尔', "value": 0, "type": 'base' },
			{ "name": '单行文本', "value": 1, "type": 'base' },
			{ "name": '日期', "value": 2, "type": 'base' },
			{ "name": '数值', "value": 3, "type": 'base' },
			{ "name": '整数', "value": 10, "type": 'base' },
			{ "name": '档案', "value": 7, "type": 'base' },
			{ "name": '自定义档案', "value": 11, "type": 'base' },
		],
		RelationTypes: [
			{ "name": '人员', "value": 1, "code": 'StaffItem' },
			{ "name": '部门', "value": 2, "code": 'Department' },
			{ "name": '预算项目', "value": 4, "code": 'ExpenseItem' },
			{ "name": '城市', "value": 5, "code": 'City' },
			{ "name": '交通工具', "value": 6, "code": 'Transport' },
			{ "name": '国家', "value": 11, "code": 'Country' },
			{ "name": '支出类型', "value": 13, "code": 'DisburseClass' },
			{ "name": '供应商', "value": 16, "code": 'Supplier' },
		],
		fakeSelfDefineData: [{ 'name': '' }],
		fields_template_StaffItem: [{ 'name': '名称', 'code': 'name', 'defid': 699 }],
		fields_template_Department: [{ 'name': '名称', 'code': 'name', 'defid': 699 }],
		fields_template_ExpenseItem: [{ 'name': '名称', 'code': 'name', 'defid': 699 }],
		fields_template_City: [{ 'name': '名称', 'code': 'name', 'defid': 699 }],
		fields_template_Transport: [{ 'name': '名称', 'code': 'name', 'defid': 699 }],
		fields_template_Country: [{ 'name': '名称', 'code': 'name', 'defid': 699 }],
		fields_template_DisburseClass: [{ 'name': '名称', 'code': 'name', 'defid': 699 }],
		fields_template_Supplier: [{ 'name': '名称', 'code': 'name', 'defid': 699 }],
	},
});

export default function rootPageReducer($$state = $$initialState, action = {}) {
	switch (action.type) {
		case types.EXPENSESTYLE_GETEXPENSETEMPLATE:
			return $$state.merge({ 
				dbName: action.payload.dbName,
				url:action.payload.url,
				expenseClassCode:action.payload.expenseClassCode
			})
		case types.EXPENSETYPE_GETTICKETLIST:
			return $$state.merge({ expenseChargeModalList: action.payload,ticketListLoading:false })
		case types.EXPENSETYPE_GETTICKETLIST_LOADING:
			return $$state.merge({ticketListLoading:true})
		case types.EXPENSETYPE_CHOSECHARGESTYLE:
			return $$state.updateIn(['expenseChargeModalList', action.payload.i, 'expenseClass'], (expenseClass) => {
				return action.payload.item
			})
		case types.EXPENSETYPE_CHARGESTYLE_TEMPLATELIST:
			return $$state.merge({ charstyleList: action.payload })
		case types.EXPENSETYPE_CHARGESTYLE_EXPENSELIST:
			return $$state.merge({ 
				expenseList: action.payload,
				localexpenseList: action.payload
			 })
		case types.EXPENSETYPE_CHANGELEFTLIST:
			return $$state.merge({expenseList: action.payload,})
		case types.EXPENSETYPE_CANCLESETTING:
			return $$state.merge({
				defaultBillingSetting: action.payload.settingData,
				expenseList:action.payload.leftMenu,
				saveId:-3
			})
		case types.EXPENSETYPE_VIEW_DEFINES:
			return $$state.merge({ 
				defaultBillingSetting: action.payload.data,
				recoverSetting: action.payload.data,
				expenseName:action.payload.data.name,
				currentModel:action.payload.currentModel
			 })
		case types.EXPENSESTYLE_GETDEFAULTSETTING:
			return $$state.merge({ 
				defaultBillingSetting: action.payload.data,
				recoverSetting: action.payload.data,
				expenseName:action.payload.data.name,
				currentModel:action.payload.currentModel
			})
		case types.EXPENSESTYLE_CUSTOMBASEDEFINE:
			return $$state.updateIn(['highSettingEnums', 'fakeSelfDefineData'], (fakeSelfDefineData) => {
				return action.payload.fakeSelfDefineData
			})
		case types.EXPENSESTYLE_GETFILEDATA_StaffItem:
			return $$state.updateIn(['highSettingEnums', 'fields_template_StaffItem'], (fields_template_StaffItem) => {
				return action.payload.fields_template_StaffItem
			})
		case types.EXPENSESTYLE_GETFILEDATA_Department:
			return $$state.updateIn(['highSettingEnums', 'fields_template_Department'], (fields_template_Department) => {
				return action.payload.fields_template_Department
			})
		case types.EXPENSESTYLE_GETFILEDATA_ExpenseItem:
			return $$state.updateIn(['highSettingEnums', 'fields_template_ExpenseItem'], (fields_template_ExpenseItem) => {
				return action.payload.fields_template_ExpenseItem
			})
		case types.EXPENSESTYLE_GETFILEDATA_City:
			return $$state.updateIn(['highSettingEnums', 'fields_template_City'], (fields_template_City) => {
				return action.payload.fields_template_City
			})
		case types.EXPENSESTYLE_GETFILEDATA_Transport:
			return $$state.updateIn(['highSettingEnums', 'fields_template_Transport'], (fields_template_Transport) => {
				return action.payload.fields_template_Transport
			})
		case types.EXPENSESTYLE_GETFILEDATA_Country:
			return $$state.updateIn(['highSettingEnums', 'fields_template_Country'], (fields_template_Country) => {
				return action.payload.fields_template_Country
			})
		case types.EXPENSESTYLE_GETFILEDATA_DisburseClass:
			return $$state.updateIn(['highSettingEnums', 'fields_template_DisburseClass'], (fields_template_DisburseClass) => {
				return action.payload.fields_template_DisburseClass
			})
		case types.EXPENSESTYLE_GETFILEDATA_Supplier:
			return $$state.updateIn(['highSettingEnums', 'fields_template_Supplier'], (fields_template_Supplier) => {
				return action.payload.fields_template_Supplier
			})
		case types.EXPENSESTYLE_CHAGEISUED:
			return $$state.updateIn(['defaultBillingSetting', 'isUsed'], (isUsed) => {
				return action.payload
			})
		case types.EXPENSETYPE_CHANGEBILLNAME:
			return $$state.merge({ expenseName: action.payload })
		case types.EXPENSETYPE_CHANGEBILLNAMEDONE:
			return $$state.updateIn(['defaultBillingSetting', 'name'], (name) => {
				return action.payload
			})
		case types.EXPENSETYPE_CHANGELEFTLISTNAME:
			return $$state.merge({ expenseList: action.payload })
		case types.EXPENSETYPE_CHANGEISREQUIRED:
			return $$state.updateIn(['defaultBillingSetting', 'billSettingInfor'], (billSettingInfor) => {
				return action.payload
			})
		case types.EXPENSETYPE_DELETEEDITITEM:
			return $$state.merge({ defaultBillingSetting: action.payload })
		case types.EXPENSETYPE_DRAGINORITITEM:
			return $$state.updateIn(['defaultBillingSetting', 'billSettingInfor'], (billSettingInfor) => {
				return action.payload
			})
		case types.EXPENSESTYLE_DELETECHARGESTYLE:
			return $$state.merge({ 
				expenseList: action.payload ,
				localexpenseList:action.payload
			})
		case types.EXPENSESTYLE_CHANGEBASICCHECK:
			return $$state.updateIn(['defaultBillingSetting', 'billSettingInfor'], (billSettingInfor) => {
				return action.payload
			})
		case types.EXPENSESTYLE_CHANGEHIGHSELECT:
			return $$state.merge({ defaultBillingSetting: action.payload })
		case types.EXPENSESTYLE_CHANGECANVATDEDUCT:
			return $$state.updateIn(['defaultBillingSetting','canVatDeduct'],(canVatDeduct)=>{
				return action.payload
			})
		case types.EXPENSESTYLE_CHANGEISPOPULAR:
			return $$state.updateIn(['defaultBillingSetting','isPopular'],(isPopular)=>{
				return action.payload
			})
		case types.EXPENSESTYLE_CHANGEDISPNAME:
			return $$state.updateIn(['defaultBillingSetting','billSettingInfor'],(billSettingInfor)=>{
				return action.payload
			})
		case types.EXPENSESTYLE_SAVESETTINGDATA:
			return $$state.merge({
				saveId:action.payload.saveId,
			})
		case types.EXPENSETYPE_HAVEBEENEDITED:
			return $$state.merge({saveId:action.payload.saveId})
		default:
			return $$state;
	}
}