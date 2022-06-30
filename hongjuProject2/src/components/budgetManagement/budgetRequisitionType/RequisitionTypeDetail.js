import React, { Component } from 'react';
import {
    updateBudgetClass,
    addBudgetClass
} from './../../../reducers/budgetManagement/budgetRequisitionType/budgetRequisitionTypeReducer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Input, Tooltip, Button, Select } from 'antd';
import * as types from './../../../actions/actionTypes';
import EditTable from './EditTable';
import BudgetTable from './BudgetTable';
import CustomRangeType from './../../common/customRangeType'
const Option = Select.Option;

class RequisitionTypeDetail extends Component {
    constructor() {
        super();
        this.state = {
            editName: false,
            value: 0
        };
    }
    //编辑是否启用
    handleIsUsed = (val) => {
        this.props.dispatch({
            type: types.BUDGET_REQUISITION_TYPE__SWITCH_IS_USED,
            payload: val
        });
    }
    //编辑预算申请单类型名字
    handleNameChange = (e) => {
        this.props.dispatch({
            type: types.BUDGET_REQUISITION_TYPE_EDIT_NAME,
            payload: e.target.value
        });
    }
    //编辑预算申请单类型名字可用
    toEditName = () => {
        this.setState({
            editName: true
        });
        setTimeout(() => {
            if (this.refs.nameInp) {
                this.refs.nameInp.focus();
            }
        }, 0);
    }
    //编辑预算申请单类型名字不可用
    handleNameBlur = () => {
        this.setState({
            editName: false
        });
    }
    //选择预算编制期间
    handlePeriod = (value) => {

    }
    //选择预算编制控制方案
    handlePlan = (value) => {
        let {
            budgetPlansList,
            budgetClass
         } = this.props;

        let temArr = [];
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < budgetPlansList.length; j++) {
                if (budgetPlansList[j]['id'].toString() === value[i]) {
                    temArr.push(budgetPlansList[j]);
                    break;
                }
            }
        }
        budgetClass['budgetConfigPlans'] = temArr;
        this.props.dispatch({
            type: types.BUDGET_REQUISITION_TYPE_BUDGET_CONFIG_PLANS,
            payload: budgetClass
        });
    }
    //编辑预算申请单类型 表头
    handleTbleHead = (value) => {
        this.props.dispatch({
            type: types.BUDGET_REQUISITION_TYPE_CONTROL_HTML_TYPE,
            payload: 1
        });
    }
    //编辑预算申请单类型 表体
    handleTbleBody = (value) => {
        this.props.dispatch({
            type: types.BUDGET_REQUISITION_TYPE_CONTROL_HTML_TYPE,
            payload: 2
        });
    }
    ///保存预算申请单类型
    handleSave = () => {
        let {
            budgetClass
        } = this.props;
        // this.props.updateBudgetClass(budgetClass);
        this.props.addBudgetClass(budgetClass);
    }
    onKindChange = (val) => {
        let { budgetClass } = this.props;
        if (typeof val === 'string') {

        } else {
            budgetClass['kind'] = val;
            this.props.dispatch({
                type: types.BUDGET_REQUISITION_TYPE_BUDGET_KIND_CHANGE,
                payload: budgetClass
            })
        }
    }
    render() {
        let data = this.props.choosedBudgetRequitionType;
        let budgetClass = this.props.budgetClass;
        let budgetPlansList = this.props.budgetPlansList;
        if(!budgetClass.hasOwnProperty('id')){
            return <div>没有数据</div>
        }

        return (
            <div className="content-right">
                <div className="content-right-head content-right-head-margin">
                    {
                        (() => {
                            if (this.state.editName) {
                                return (
                                    <div className="head-left edit-name">
                                        <Tooltip title={data['name']}>
                                            <Input ref="nameInp" value={data['name']} onChange={this.handleNameChange} onBlur={this.handleNameBlur} />
                                        </Tooltip>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="head-left edit-name">
                                        <Tooltip title={data['name']}>
                                            <span className="edit-name-span">{data['name']}</span>
                                        </Tooltip>
                                        <i onClick={this.toEditName}>编辑</i>
                                    </div>
                                );
                            }
                        })()
                    }
                    <div className="head-right">
                        <span className="budget-operator-item-check">{data['isUsed'] ? '启用' : '停用'}</span>
                        <Switch checked={data['isUsed']} onChange={this.handleIsUsed} />
                        <Button type="primary">生成分析方案</Button>
                        <Button type="primary">删除</Button>
                        <Button type="primary">取消</Button>
                        <Button type="primary" onClick={this.handleSave}>保存</Button>
                    </div>
                </div>
                {
                    (() => {
                        if (this.props.editHtmlType === 0) {
                            return (
                                <div>
                                    <div className="box-item fn-clear">
                                        <div className="content-item">
                                            <Tooltip title='预算编制期间'>
                                                <i className="content-item-title">预算编制期间</i>
                                            </Tooltip>
                                            <div className="content-item-select">
                                                <CustomRangeType value={this.props.budgetClass.kind || 0}
                                                    onSelect={(value) => {
                                                        this.onKindChange(value);
                                                    }} />
                                            </div>

                                        </div>
                                        <div className="content-item">
                                            <Tooltip title='预算控制方案'>
                                                <i className="content-item-title">预算控制方案</i>
                                            </Tooltip>
                                            <Select
                                                mode="multiple"
                                                className="content-item-select"
                                                placeholder="请选择预算控制方案"
                                                optionFilterProp="children"
                                                onChange={this.handlePlan}
                                            >
                                                {
                                                    budgetPlansList.map((item, index) => {

                                                        return (
                                                            <Option key={index} value={item['id'].toString()}>{item['name']}</Option>
                                                        );
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="box-item fn-clear">
                                        <div className="fn-clear">
                                            <div className="content-item-operator fn-clear">
                                                <span onClick={this.handleTbleHead}>编辑</span>
                                            </div>
                                        </div>
                                        {(() => {
                                            if (budgetClass && budgetClass['headerDimensionRefs']) {
                                                let arr = budgetClass['headerDimensionRefs'];
                                                return arr.map((item, index) => {
                                                    return (
                                                        <div key={index} className="content-item">
                                                            <i className="content-item-title">{item['dimensionRef']['dimension']['name']}</i>
                                                        </div>
                                                    );
                                                });
                                            } else {
                                                return null;
                                            }
                                        })()}
                                    </div>
                                    <div className="box-item fn-clear">
                                        <div className="fn-clear">
                                            <div className="content-item-operator">
                                                <span onClick={this.handleTbleBody}>编辑</span>
                                            </div>
                                        </div>
                                        <BudgetTable data={this.props.budgetClass} />
                                    </div>
                                </div>
                            );
                        } else if (this.props.editHtmlType === 1) {
                            return (
                                <EditTable />
                            );
                        } else if (this.props.editHtmlType === 2) {
                            return (
                                <EditTable />
                            );

                        }
                    })()
                }

            </div>
        );
    }
}

function mapStateToProps($$state) {
    let state = $$state.get('budgetRequisitionTypeState');
    let choosedBudgetRequitionType = state.get('choosedBudgetRequitionType').toJS();
    let editHtmlType = state.get('editHtmlType');
    let budgetClass = state.get('budgetClass').toJS();
    let budgetPlansList = state.get('budgetPlansList').toJS();

    return {
        choosedBudgetRequitionType,
        editHtmlType,
        budgetClass,
        budgetPlansList
    }
}

function mapDispatchToProps(dispatch) {
    let methods = {
        updateBudgetClass,
        addBudgetClass
    };
    let boundActionCreators = bindActionCreators(methods, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequisitionTypeDetail);