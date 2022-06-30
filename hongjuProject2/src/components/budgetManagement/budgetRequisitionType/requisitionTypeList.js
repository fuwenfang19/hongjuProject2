import React, { Component } from 'react';
import Searchbar from '../../common/Searchbar';
import { Icon, Checkbox, Modal } from 'antd';
import {
    getBudgetTemplatesList,
    getBudgetClassList,
    readBudgetClassPk,
    getDimensionList,
    addBudgetClass
} from './../../../reducers/budgetManagement/budgetRequisitionType/budgetRequisitionTypeReducer';

import {
    showBudgetAuthority
} from '../../../actions/budgetManagement/budgetRequisitionType/budgetAuthorityActions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BudgetTemplate from './BudgetTemplate';
import * as types from './../../../actions/actionTypes';
import BudgetAuthority from './BudgetAuthority';
class RequisitionTypeList extends Component {
    constructor() {
        super();
        this.state = { visible: false };
    }
    componentWillMount() {
        this.props.getBudgetClassList();
        this.props.getDimensionList();
    }
    //新增预算申请单类型
    showModal = () => {
        this.setState({
            visible: true,
        });
        this.props.getBudgetTemplatesList();
    }
    //新增预算申请单类型确定
    handleOk = (e) => {
        let { choosedTemplate, userInfo ,choosedTemplateDetail} = this.props;

        if (choosedTemplate && choosedTemplate['id']) {
            this.setState({
                visible: false,
            });
            let data = {
                remark: "",
                transTo: "[]",
                isUsed: true,
                budgetMapping: "{}",
                canModify: true,
                name: "新增" + choosedTemplate['name'],
                useBudget: false,
                code: "",
                fromCorp: false,
                companyID: userInfo['company'],
                type: 8,
                groupID: userInfo['groupid'],
                id: null,
                ExpenseTopClass: null
            };
            let newClass = {
                "id": null,
                "code": "BudgetApplication1",
                "name": "新增" + choosedTemplate['name'],
                "objectClass": 3,
                "version": 1,
                "kind": 1,
                "isUsed": true,
                "createTime": "2017-05-24T13:23:44.376339",
                "budgetConfigPlans": [],
                "headerDimensionRefs": choosedTemplateDetail['headerDimensionRefs'],
                "bodyDimensionRefs": choosedTemplateDetail['bodyDimensionRefs'],
                "horizontalBody": choosedTemplateDetail['horizontalBody'],
                "horizontalBodyValues": [],
                "verticalBody": choosedTemplateDetail['verticalBody'],
                "verticalBodyValues": [],
                "permissions": [],
                "canModify": true,
                "fromCorp": false,
                "useBudget": false,
                "remark": "",
                "approvalDefine": {
                    "enable": false,
                    "condition": "",
                    "author": ""
                },
                "autoTrans": false,
                "autogenvoucher": false,
                "digestDefine": [
                    {
                        "format": "出差申请 %s",
                        "col": "createTime",
                        "func": "strftime('%m-%d %H:%M')",
                        "title": "创建时间"
                    },
                    {
                        "format": "%s",
                        "col": "reason",
                        "title": "事由"
                    },
                    {
                        "format": "目的地-%s",
                        "col": "toCitys",
                        "title": "目的城市"
                    }
                ],
                "digestDesign": [],
                "viewdefines": choosedTemplateDetail['viewdefines'],
                "parent": "BudgetApplication"
            };
            this.props.dispatch({
                type: types.BUDGET_REQUISITION_TYPE_ADD_BUDGET_CLASS_LIST,
                payload: data
            });
            this.props.dispatch({
                type: types.BUDGET_REQUISITION_TYPE_READ_BUDGET_CLASS,
                payload: newClass
            });
            this.props.dispatch({
                type: types.BUDGET_REQUISITION_TYPE__CHOOSED_BUDGET_REQUITION_TYPE,
                payload: data
            });
        } else {
            return;
        }
    }
    //新增预算申请单类型取消
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    //停用的预算申请单类型
    showStopedRequisition = (e) => {
    }
    //选择申请单类型
    chooseRequitionType = (item) => {
        this.props.dispatch({
            type: types.BUDGET_REQUISITION_TYPE__CHOOSED_BUDGET_REQUITION_TYPE,
            payload: item
        });
        if (item['id']) {
            this.props.readBudgetClassPk(item);
        }
    }
    //-------------预算申请权限分配
    showBudgetAuthority = (data) => {
        this.props.dispatch(showBudgetAuthority(data))
    }
    render() {
        let choosedBudgetRequitionType = this.props.choosedBudgetRequitionType;
        return (
            <div className="content-left list-box">
                <div className="list-top">
                    <Searchbar
                        placeholder="搜索预算申请单"
                        onChange={(e) => {
                        }}
                        style={{
                            marginBottom: '10px'
                        }}
                    />
                    <div className="new-requisition" onClick={this.showModal}>
                        <Icon type="plus-circle" />
                        <span>新增预算申请单类型</span>
                        <Modal
                            title="选择预算表模版建立预算申请单"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            width={900}
                        >
                            <BudgetTemplate data={this.props.templateList} />
                        </Modal>
                    </div>
                    <div className="new-requisition" onClick={() => this.showBudgetAuthority(true)}>
                        <Icon type="plus-circle" />
                        <span>预算申请权限分配</span>
                        <BudgetAuthority
                            dispatch={this.props.dispatch}
                            parentprops={this.props}
                            visible={this.props.showBudgetAuthority}></BudgetAuthority>
                    </div>
                    <div className="stoped-requisition">
                        <Checkbox onChange={this.showStopedRequisition}>停用的预算申请单类型</Checkbox>
                    </div>
                </div>
                <div className="list-bottom">
                    {
                        this.props.budgetClassList.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className={choosedBudgetRequitionType['id'] === item['id'] ? 'list-bottom-item list-bottom-item-choosed' : 'list-bottom-item'}
                                    onClick={this.chooseRequitionType.bind(this, item)}>
                                    {choosedBudgetRequitionType['id'] === item['id'] ? choosedBudgetRequitionType['name'] : item['name']}
                                </div>
                            );

                        })
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps($$state) {
    let state = $$state.get('budgetRequisitionTypeState');
    let templateList = state.get('templateList').toJS();
    let budgetClassList = state.get('budgetClassList').toJS();
    let choosedBudgetRequitionType = state.get('choosedBudgetRequitionType').toJS();
    let choosedTemplate = state.get('choosedTemplate').toJS();
    let choosedTemplateDetail = state.get('choosedTemplateDetail').toJS();
    let baseState = $$state.get('baseState');
    let userInfo = baseState.get('userInfo').toJS();
    //预算申请权限分配
    let showBudgetAuthority = state.get('showBudgetAuthority');

    return {
        templateList,
        budgetClassList,
        choosedBudgetRequitionType,
        choosedTemplate,
        userInfo,
        showBudgetAuthority,
        choosedTemplateDetail
    }
}

function mapDispatchToProps(dispatch) {
    let methods = {
        getBudgetTemplatesList,
        getBudgetClassList,
        readBudgetClassPk,
        getDimensionList,
        addBudgetClass
    };
    let boundActionCreators = bindActionCreators(methods, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequisitionTypeList);