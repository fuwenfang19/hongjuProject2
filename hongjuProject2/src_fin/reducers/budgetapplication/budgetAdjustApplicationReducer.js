/**
 * Created by uncle on 17/2/12.
 */
import Immutable from 'immutable';
import * as types from '../../actions/actionTypes';

const $$initialState = Immutable.fromJS({
		// 我的预算社情查询条件
		myBudgetAdjustApplicationSearchConditions: {
			codes: [],
			objectclassids: [],
			braidDateBegin: null,
			braidDateEnd: null,
			statuses: ['0'],
			adjustedBegin: null,
			adjustedEnd: null,
			remarks: '',
			listtype: 'adjustment',//application adjustment
			pagenum: 1,
			countperpage: 50,
		},
		// 我的预算申请列表数据
		budgetAdjustApplicationList: {total: 0, rows: []},
		// 所有的预算申请单类型列表
		budgetBillTypes: [],

		//预算申请单类型定义
		schemaDefine: {
			"id": 3,
			"code": "BudgetApplication1",
			"name": "预算编制申请单类型1",
			"version": 1,
			"kind": 1,
			"isUsed": true,
			"createTime": "2017-05-24T13:23:44.376339",
			"budgetConfigPlans": [
				{
					"id": 4,
					"code": "BP000004",
					"name": "档案支出1",
					"startDimensionRef": {
						"id": 4,
						"item_code": "dim_three",
						"dimension": {
							"id": 2,
							"code": "DisburseClass",
							"name": "支出类型"
						}
					},
					"startDimValue": 157,
					"status": 0,
					"creater": {
						"id": 707,
						"code": "0000043716",
						"name": "王威"
					},
					"createTime": "2017-05-23"
				}
			],
			"headerDimensionRefs": [
				{
					"id": 3,
					"budgetOrder": 1,
					"dimensionRef": {
						"id": 3,
						"item_code": "dim_two",
						"dimension": {
							"id": 1,
							"code": "Department",
							"name": "部门"
						}
					}
				}
			],
			"bodyDimensionRefs": [
				{
					"id": 3,
					"budgetOrder": 1,
					"dimensionRef": {
						"id": 3,
						"item_code": "dim_two",
						"dimension": {
							"id": 1,
							"code": "Department",
							"name": "部门"
						}
					}
				}
			],
			"horizontalBody": [
				{
					"id": 3,
					"showOrder": 1,
					"dimensionRef": {
						"id": 4,
						"item_code": "dim_three",
						"dimension": {
							"id": 2,
							"code": "DisburseClass",
							"name": "支出类型"
						}
					}
				}
			],
			"horizontalBodyValues": [
				{
					"id": 3,
					"horizontalBody": 3,
					"dimensionRef": {
						"id": 4,
						"item_code": "dim_three",
						"dimension": {
							"id": 2,
							"code": "DisburseClass",
							"name": "支出类型"
						}
					},
					"value": {
						"name": "档案支出1",
						"id": 157
					}
				}
			],
			"verticalBody": [
				{
					"id": 3,
					"showOrder": 1,
					"dimensionRef": {
						"id": 1,
						"item_code": "dim_one",
						"dimension": {
							"id": 3,
							"code": "ExpenseItem",
							"name": "项目"
						}
					}
				}
			],
			"verticalBodyValues": [
				{
					"id": 3,
					"verticalBody": 3,
					"dimensionRef": {
						"id": 1,
						"item_code": "dim_one",
						"dimension": {
							"id": 3,
							"code": "ExpenseItem",
							"name": "项目"
						}
					},
					"value": {
						"name": "需求调研",
						"id": 7017
					}
				}
			],
			"permissions": [
				{
					"id": 3,
					"createTime": "2017-05-24",
					"staffItem": {
						"id": 707,
						"code": "0000043716",
						"name": "王威"
					}
				}
			],
			"viewdefines": [],
			"parent": "BudgetApplication"
		},
		detailData: {
			"id": 2,
			"projectItem": null,
			"disburseClass": null,
			"department": null,
			"fundSource": null,
			"budgetStaffItem": null,
			"creater": null,
			"createrDepartment": null,
			"approver": null,
			"budgetClass": {
				"id": 3,
				"group": 1,
				"company": 3,
				"code": "BudgetApplication",
				"name": "\u9884\u7b97\u7f16\u5236\u7533\u8bf7\u5355\u7c7b\u578b1",
				"version": 1,
				"kind": 1,
				"isUsed": true,
				"createTime": "2017-05-24T13:23:44.376339",
				"lastUpdate": "2017-05-24T13:23:44.376429",
				"objectClass": 3,
				"budgetConfigPlans": [4]
			},
			"budget_options": [],
			"objectClass": {
				"id": 3,
				"code": "BudgetApplication1",
				"type": 8,
				"name": "\u9884\u7b97\u7f16\u5236\u7533\u8bf7\u5355\u7c7b\u578b1",
				"groupID": 1,
				"companyID": 3,
				"isUsed": true,
				"fromCorp": false,
				"canModify": true,
				"remark": "",
				"transTo": "[]",
				"useBudget": false,
				"budgetMapping": "{}",
				"ExpenseTopClass": null
			},
			"group": 1,
			"company": 3,
			"code": "BA0000000000001",
			"budgetClassVersion": 1,
			"budgetClassInfo": "1",
			"kind": 1,
			"budgetYear": 2016,
			"startDate": null,
			"endDate": null,
			"braidDate": "2017-05-25",
			"initialAlloc": "0.000000",
			"amount": "0.000000",
			"adjusted": "0.000000",
			"remark": "1",
			"createTime": "2017-05-25T13:30:05",
			"lastUpdate": "2017-05-25T13:30:08",
			"status": {"code": 0, "name": "\u672a\u63d0\u4ea4", "id": 0},
			"flowId": null,
			"taskId": null,
			"submitTime": null,
			"approveTime": null,
			"version": 0,
			"effectived": false,
			"effectTime": null,
			"application": null,
			"approvals": [],
			"isEditable": false,
			"budgetdatas": [{
				"dim_two": {"code": "sfdsg1", "id": 490, "name": "\u98ce\u90e8\u95e81"},
				"dim_one": {"code": "001", "id": 7017, "name": "\u9700\u6c42\u8c03\u7814"},
				"columndict": {
					"1_2017_1_0_157": {
						"startDate": "2017-01-01",
						"adjusted": "0.00",
						"controlitemenabled": false,
						"endDate": "2017-03-31",
						"controlitemvalid": true,
						"initialAlloc": "0.00",
						"config_id": 285,
						"control_level": 0,
						"allocated": "0.00",
						"id": 684,
						"controlitemid": 288,
						"config_kind": 2,
						"control_limit": "100.00",
						"available": "100.00",
						"used": "0.00",
						"controlitemkind": 0,
						"control_kind": 2,
						"controlitemautogen": false,
						"warn_limit": "100.00",
						"name": "\u4e00\u5b63",
						"amount": "100.00",
						"controlitembudgetYear": 2017,
						"overage_kind": 1,
						"order": 0
					},
					"1_2017_1_1_157": {
						"startDate": "2017-04-01",
						"adjusted": "0.00",
						"controlitemenabled": false,
						"endDate": "2017-06-30",
						"controlitemvalid": true,
						"initialAlloc": "0.00",
						"config_id": 285,
						"control_level": 0,
						"allocated": "0.00",
						"id": 685,
						"controlitemid": 288,
						"config_kind": 2,
						"control_limit": "100.00",
						"available": "100.00",
						"used": "0.00",
						"controlitemkind": 0,
						"control_kind": 2,
						"controlitemautogen": false,
						"warn_limit": "100.00",
						"name": "\u4e8c\u5b63",
						"amount": "100.00",
						"controlitembudgetYear": 2017,
						"overage_kind": 1,
						"order": 1
					},
					"157_0_2017_2_2": {
						"startDate": "2017-07-01",
						"adjusted": "0.00",
						"controlitemenabled": false,
						"endDate": "2017-09-30",
						"controlitemvalid": true,
						"initialAlloc": "0.00",
						"config_id": 285,
						"control_level": 0,
						"allocated": "0.00",
						"id": 686,
						"controlitemid": 288,
						"config_kind": 2,
						"control_limit": "100.00",
						"available": "100.00",
						"used": "0.00",
						"controlitemkind": 0,
						"control_kind": 2,
						"controlitemautogen": false,
						"warn_limit": "100.00",
						"name": "\u4e09\u5b63",
						"amount": "100.00",
						"controlitembudgetYear": 2017,
						"overage_kind": 1,
						"order": 2
					},
					"157_0_2017_2_3": {
						"startDate": "2017-10-01",
						"adjusted": "0.00",
						"controlitemenabled": false,
						"endDate": "2017-12-31",
						"controlitemvalid": true,
						"initialAlloc": "0.00",
						"config_id": 285,
						"control_level": 0,
						"allocated": "0.00",
						"id": 687,
						"controlitemid": 288,
						"config_kind": 2,
						"control_limit": "100.00",
						"available": "100.00",
						"used": "0.00",
						"controlitemkind": 0,
						"control_kind": 2,
						"controlitemautogen": false,
						"warn_limit": "100.00",
						"name": "\u56db\u5b63",
						"amount": "100.00",
						"controlitembudgetYear": 2017,
						"overage_kind": 1,
						"order": 3
					}
				}
			}]
		}


	})
;

export default function budgetAdjustApplicationReducer($$state = $$initialState, action = {}) {
	switch (action.type) {
		case types.CHANGE_BUDGET_ADJUST_APPLICATION_KEY_VALUE:
			return $$state.merge({[action.payload.key]: action.payload.value});
		default:
			return $$state;
	}
}



