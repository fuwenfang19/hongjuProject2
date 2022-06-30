import * as types from '../../../actions/actionTypes';
import Immutable from 'immutable';
import api from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';

const $$initialState = Immutable.fromJS({
    templateList: [],
    choosedTemplate: {},
    choosedTemplateDetail: {},
    budgetClassList: [],
    choosedBudgetRequitionType: {},
    editHtmlType: 0,
    budgetClass: {},
    dimensionList: [],
    budgetPlansList: [],
    showBudgetAuthority: false
});


export default function reducer($$state = $$initialState, action = {}) {
    switch (action.type) {
        case types.BUDGET_REQUISITION_TYPE_GET_DIMENSION_LIST:
            return $$state.merge({
                dimensionList: action.payload
            });
        case types.BUDGET_REQUISITION_TYPE__GET_TEMPLATE_LIST:
            return $$state.merge({
                templateList: action.payload
            });
        case types.BUDGET_REQUISITION_TYPE_CHOOSE_TEMPLATE:
            return $$state.merge({
                choosedTemplate: action.payload
            });
        case types.BUDGET_REQUISITION_TYPE__GET_TEMPLATE_DETAIL:
            return $$state.merge({
                choosedTemplateDetail: action.payload
            });
        case types.BUDGET_REQUISITION_TYPE__GET_BUDGET_CLASS_LIST:
            return $$state.merge({
                budgetClassList: action.payload
            });
        case types.BUDGET_REQUISITION_TYPE__CHOOSED_BUDGET_REQUITION_TYPE:
            return $$state.merge({
                choosedBudgetRequitionType: action.payload
            });
        case types.BUDGET_REQUISITION_TYPE__SWITCH_IS_USED:
            var choosedBudgetRequitionType = $$state.get('choosedBudgetRequitionType').toJS();
            var budgetClass = $$state.get('budgetClass').toJS();
            choosedBudgetRequitionType['isUsed'] = action.payload;
            budgetClass['isUsed'] = action.payload;
            return $$state.merge({
                choosedBudgetRequitionType,
                budgetClass
            });
        case types.BUDGET_REQUISITION_TYPE_EDIT_NAME:
            var choosedBudgetRequitionType = $$state.get('choosedBudgetRequitionType').toJS();
            var budgetClass = $$state.get('budgetClass').toJS();
            choosedBudgetRequitionType['name'] = action.payload;
            budgetClass['name'] = action.payload;
            return $$state.merge({
                choosedBudgetRequitionType,
                budgetClass
            });
        case types.BUDGET_REQUISITION_TYPE_CONTROL_HTML_TYPE:
            return $$state.merge({
                editHtmlType: action.payload
            });
        case types.BUDGET_REQUISITION_TYPE_READ_BUDGET_CLASS:
            return $$state.merge({
                budgetClass: action.payload
            });

        case types.BUDGET_REQUISITION_TYPE_ADD_BUDGET_CLASS_LIST:
            var budgetClassList = $$state.toJS()['budgetClassList'];
            budgetClassList.push(action.payload);

            return $$state.merge({
                budgetClassList
            });
        case types.BUDGET_REQUISITION_TYPE_GET_BUDGET_PLANS_LIST:
            return $$state.merge({
                budgetPlansList: action.payload
            });
        case types.BUDGET_REQUISITION_TYPE_BUDGET_KIND_CHANGE:
            return $$state.merge({
                budgetClass: action.payload
            });
        case types.BUDGET_REQUISITION_TYPE_BUDGET_CONFIG_PLANS:
            return $$state.merge({
                budgetClass: action.payload
            });
        case types.BUDGET_REQUISITION_TYPE_EDIT_TABLE_HEADER:
            return $$state.merge({
                budgetClass: action.payload
            });
        //预算申请权限分配
        case types.BUDGETAUTHORITY_SHOWBUDGETAUTHORITY:
            return $$state.merge({
                showBudgetAuthority: action.payload
            })
        default:
            return $$state;
    }
}

//获取预算维度定义列表/budget/dimensionrefinfo/

export function getDimensionList() {
    let url = api.BUDGET_REQUISITION_TYPE_DIMENSION_LIST;
    return (dispatch, getState) => {
        NetWork.get(url, {}, (json) => {
            dispatch({
                type: types.BUDGET_REQUISITION_TYPE_GET_DIMENSION_LIST,
                payload: json
            })
        });
    }

}
//获取预算编制类型定义模板列表
export function getBudgetTemplatesList() {
    return (dispatch, getState) => {
        NetWork.get(api.BUDGET_REQUISITION_TYPE, { type: 8 }, (json) => {
            dispatch({
                type: types.BUDGET_REQUISITION_TYPE__GET_TEMPLATE_LIST,
                payload: json['data']
            });
        });
        //期间类型(0:全年,1:半年,2:季度,3:月份,4:自定义期间);
    }
}

//获取预算编制类型定义模板
export function getBudgetTemplatesDetail(item) {
    return (dispatch, getState) => {
        let url = api.BUDGET_REQUISITION_TYPE_DETAIL;
        NetWork.get(url, { id: item['id'] }, (json) => {
            dispatch({
                type: types.BUDGET_REQUISITION_TYPE__GET_TEMPLATE_DETAIL,
                payload: json['data']
            });
        });
    }
}

//读取预算编制类型定义列表
export function getBudgetClassList(item) {
    return (dispatch, getState) => {
        let url = api.BUDGET_REQUISITION_TYPE_BUDDET_CLASS_LIST;
        NetWork.get(url, {}, (data) => {
            dispatch({
                type: types.BUDGET_REQUISITION_TYPE__GET_BUDGET_CLASS_LIST,
                payload: data
            });
            let len = data.length;
            if (len > 0) {
                dispatch({
                    type: types.BUDGET_REQUISITION_TYPE__CHOOSED_BUDGET_REQUITION_TYPE,
                    payload: data[0]
                });
                dispatch(readBudgetClassPk(data[0]));
            }
        });
    }
}

//读取类型定义
export function readBudgetClassPk(item) {
    return (dispatch, getState) => {
        let url = api.BUDGET_REQUISITION_TYPE_READ_BUDGET_CLASS.replace('pk/', item['id'] + '/');
        NetWork.get(url, {}, (data) => {
            dispatch({
                type: types.BUDGET_REQUISITION_TYPE_READ_BUDGET_CLASS,
                payload: data
            });

            let {
                headerDimensionRefs,
                bodyDimensionRefs
            } = data;
            let refs = [];
            let refids = [];
            for (let i = 0; i < headerDimensionRefs.length; i++) {
                refs.push(headerDimensionRefs[i]['dimensionRef']['item_code']);
                refids.push(headerDimensionRefs[i]['id']);
            }
            for (let i = 0; i < bodyDimensionRefs.length; i++) {
                refs.push(bodyDimensionRefs[i]['dimensionRef']['item_code']);
                refids.push(bodyDimensionRefs[i]['id']);
            }
            let dimens = {
                "status": 0,
                "refs": refs,
                "refids": refids
            };

            dispatch(getBudgetPlansList(dimens));

        });
    }
}

//新增类型定义
let newClass = {
    "code": "",
    "parent": "BudgetApplication",
    "color": null,
    "company": 3,
    "remark": "",
    "approvalDefine": "{\"enable\": false, \"condition\": \"\", \"author\": \"\"}",
    "fromCorp": false,
    "budget_settings": {
        "budgetConfigPlans": [
            {
                "id": 1
            }
        ],

        "headerDimensionRefs": [
            {
                "budgetOrder": 1,
                "dimensionRef": 3
            }
        ],
        "bodyDimensionRefs": [
            {
                "budgetOrder": 1,
                "dimensionRef": 4
            },
            {
                "budgetOrder": 2,
                "dimensionRef": 1
            }
        ],
        "horizontalBody": [
            {
                "showOrder": 1,
                "dimensionRef": 4
            }
        ],

        "horizontalBodyValues": [
            
        ],
        "verticalBody": [
            {
                "showOrder": 1,
                "dimensionRef": 1
            }
        ],

        "verticalBodyValues": [
           
        ],



        "permissions": [
            {
                "staffItem": 707
            }
        ]
    },
    "digestDesign": [
    ],
    "digestDefine": "[ {u\"title\":  u\"创建时间\", u\"col\":  u\"createTime\",  \"func\": u\"strftime('%m-%d %H:%M')\",  \"format\": u\"出差申请 %s\"},{u\"title\":  u\"事由\", u\"col\": u\"reason\",  \"format\":  u\"%s\"} ,  {u\"title\":  u\"目的城市\", u\"col\":  u\"toCitys\",  \"format\":u\"目的地-%s\"}]",
    "icon": 1,
    "kind": 1,
    "group": 1,
    "name": "预算编制申请单类型1",
    "isUsed": true,
    "viewdefines": [

    ],
    "canModify": true,
    "useBudget": false,
    "canDeleteAfterApproval": false,
    "autogenvoucher": false
};

export function addBudgetClass(budgetClass) {
    return (dispatch, getState) => {
        let url = api.BUDGET_REQUISITION_TYPE_ADD_BUDGET_CLASS;
        let baseState = getState().get('baseState').toJS();
        let {
            budgetConfigPlans,
            headerDimensionRefs,
            bodyDimensionRefs
        } = budgetClass;
        let temPan = [];
        for (let i = 0; i < budgetConfigPlans.length; i++) {
            temPan[i] = {};
            temPan[i]['id'] = budgetConfigPlans[i]['id'];
        }

        let temHeaderD = [];
        for (let i = 0; i < headerDimensionRefs.length; i++) {
            temHeaderD[i] = {};
            temHeaderD[i]['budgetOrder'] = headerDimensionRefs[i]['budgetOrder'];
            temHeaderD[i]['dimensionRef'] = headerDimensionRefs[i]['dimensionRef']['id'];
        }
        let temBodyD = [];
        for (let i = 0; i < bodyDimensionRefs.length; i++) {
            temBodyD[i] = {};
            temBodyD[i]['budgetOrder'] = bodyDimensionRefs[i]['budgetOrder'];
            temBodyD[i]['dimensionRef'] = bodyDimensionRefs[i]['dimensionRef']['id'];
        }
        newClass['company'] = baseState['userInfo']['company'];
        newClass['budget_settings']['budgetConfigPlans'] = temPan;
        newClass['budget_settings']['headerDimensionRefs'] = temHeaderD;
        newClass['budget_settings']['bodyDimensionRefs'] = temBodyD;
        newClass['viewdefines'] = budgetClass['viewdefines'];

        NetWork.post(url, newClass, (data) => {

        });
    }
}


//编辑类型定义
let editClass = {
    "id": 3,
    "code": "BudgetApplication1",
    "parent": "BudgetApplication",
    "color": null,
    "company": 3,
    "remark": "",
    "approvalDefine": "{\"enable\": false, \"condition\": \"\", \"author\": \"\"}",
    "fromCorp": false,
    "budget_settings": {
        "budgetConfigPlans": [
            {
                "id": 1
            }
        ],

        "headerDimensionRefs": [
            {
                "budgetOrder": 1,
                "dimensionRef": 3
            }
        ],
        "bodyDimensionRefs": [
            {
                "budgetOrder": 1,
                "dimensionRef": 4
            },
            {
                "budgetOrder": 2,
                "dimensionRef": 1
            }
        ],
        "horizontalBody": [
            {
                "showOrder": 1,
                "dimensionRef": 4
            }
        ],

        "horizontalBodyValues": [
            {
                "value": 157,
                "dimensionRef": 4
            }
        ],
        "verticalBody": [
            {
                "showOrder": 1,
                "dimensionRef": 1
            }
        ],

        "verticalBodyValues": [
            {
                "value": 7017,
                "dimensionRef": 1
            }
        ],



        "permissions": [
            {
                "staffItem": 707
            }
        ]
    },
    "digestDesign": [
    ],
    "digestDefine": "[ {u\"title\":  u\"创建时间\", u\"col\":  u\"createTime\",  \"func\": u\"strftime('%m-%d %H:%M')\",  \"format\": u\"出差申请 %s\"},{u\"title\":  u\"事由\", u\"col\": u\"reason\",  \"format\":  u\"%s\"} ,  {u\"title\":  u\"目的城市\", u\"col\":  u\"toCitys\",  \"format\":u\"目的地-%s\"}]",
    "icon": 1,
    "kind": 1,
    "group": 1,
    "name": "预算编制申请单类型1",
    "isUsed": true,
    "viewdefines": [

    ],
    "canModify": true,
    "useBudget": false,
    "canDeleteAfterApproval": false,
    "autogenvoucher": false
}


//修改类型定义
export function updateBudgetClass(budgetClass) {
    return (dispatch, getState) => {
        let url = api.BUDGET_REQUISITION_TYPE_UPDATE_BUDGET_CLASS.replace('pk/', budgetClass['id'] + '/');
        console.log(budgetClass);
        console.log('修改');
        NetWork.put(url, editClass, (data) => {

        });
    }
}


// 获取预算编制方案列表
export function getBudgetPlansList(reqData) {

    return (dispatch, getState) => {
        let url = api.BUDGET_REQUISITION_TYPE_GET_PLANS;
        NetWork.get(url, reqData, (data) => {
            dispatch({
                type: types.BUDGET_REQUISITION_TYPE_GET_BUDGET_PLANS_LIST,
                payload: data
            })
        });
    }

}