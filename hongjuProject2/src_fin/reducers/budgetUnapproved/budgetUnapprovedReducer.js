/**
 * Created by yangyfe on 2017/5/17.
 */
import * as types from '../../actions/actionTypes';
import Immutable from 'immutable';
import NetWork from '../../global/utils/network';
import budgetUnapprovedInterface from '../../global/utils/api';
import {Toast} from '../../components/common';
import moment from  'moment';
import {inputTypesMap} from '../../constants/inputType';
import _ from 'lodash';

const getBudgetUnapprovedState = (getState) => {
    return getState().get('budgetUnapprovedState').toJS();
};

// 获得请求后台接口的查询数据
const getReqSearchData = (originData) => {
    for (let item in originData) {
        if (originData.hasOwnProperty(item)) {
            if (originData[item] != null && ['braidDateBegin', 'braidDateEnd'].indexOf(item) !== -1) {
                originData[item] = moment(originData[item]).format('YYYY-MM-DD');
            } else if (originData[item] != null && Object.prototype.toString.call(originData[item]) == '[object Array]') {
                originData[item] = originData[item].map(item => {
                    if (item.id) {
                        return item.id;
                    } else {
                        return item;
                    }
                });
            }
        }
    }
    return originData;
};

const $$initialState = Immutable.fromJS({

    // 我的预算社情查询条件
    myBudgetUnapprovedSearchConditions: {
        objectclassids: [],//申请单类型ids
        codes: [],//编码
        listtype: ['application'],//application申请 adjustment调整
        createrids:[],//编制人
        createrdepartmentids:[],//编制部门
        braidDateBegin: null,//编制开始日期
        braidDateEnd: null,//编制结束日期
        kinds:[],//# 期间类型# (0:全年,1:半年,2:季度,3:月份,4:自定义期间)
        budgetYearBegin: '',//年度开始
        budgetYearEnd: '',//年度结束
        departmentids:[],//部门维度
        projectitemids:[],//项目维度
        disburseclassids:[],//支出类型
        budgetstaffitemids:[],//人员
        fundsourceids:[],//资金来源
        pagenum: 1,//页码
        countperpage: 50,//每页多少条数据
    },
    //申请单数据
    budgetUnapprovedList: { total: 0, rows: {}},
    budgetList:[],
    isShow:false,
    schemaDefine1: {
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
})

export default function budgetUnapprovedReducer($$state = $$initialState, action = {}) {
    switch (action.type) {
        case types.BUDGET_CHANGE_SHOW_OR_HIDE:
            return $$state.merge({
                isShow:action.payload
            })
        case types.CHANGE_BUDGET_UNAPPROVED_KEY_VALUE:
            return $$state.merge({[action.payload.key]: action.payload.value});
        default:
            return $$state;
    }
}



// 获取待审批单据列表
export const getMyBudgetUnapprovedList = () => {
    return (dispatch, getState) => {
        let state = getBudgetUnapprovedState(getState);
        let reqData = getReqSearchData(state.myBudgetUnapprovedSearchConditions);
        let url = budgetUnapprovedInterface.getBudgetUnapprovedList;
        NetWork.get(url, reqData,
            (returnData) => {
                dispatch(changeBudgetUnapprovedKeyValue('budgetUnapprovedList', returnData));
            },
            (data) => {
                Toast.error(data.msg);
            })
    }
};



// 进入详情
export const getBudgetUnapprovedDefine = () => {
    return (dispatch, getState) => {
        let url = budgetUnapprovedInterface.getBudgetUnapprovedDefine;
        NetWork.get(url,
            (returnData) => {
                dispatch(changeBudgetUnapprovedKeyValue('schemaDefine1', returnData))
            },
            (data) => {
                Toast.error(data.msg);
            })
    }
};

// 更改key Value
export const changeBudgetUnapprovedKeyValue = (key, value) => {
    return {
        type: types.CHANGE_BUDGET_UNAPPROVED_KEY_VALUE,
        payload: {
            key,
            value
        }
    }
};