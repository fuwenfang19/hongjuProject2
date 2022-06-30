import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as types from './../../../actions/actionTypes';
import Animate from 'rc-animate';
import DragItem from './dragItem/Container';
import { Checkbox } from 'antd';

class EditTable extends Component {
    constructor() {
        super();
    }
    handleOk = () => {
        this.props.dispatch({
            type: types.BUDGET_REQUISITION_TYPE_CONTROL_HTML_TYPE,
            payload: 0
        });
    }
    //处理全选全不选
    handleCheckAll = () => {

    }
    //单据头可选数据项
    handleChange = (item, e) => {
        let {
            budgetClass
        } = this.props;
        let headerDimensionRefs = budgetClass['headerDimensionRefs'];

        // if (item['dimension']) {
        //     if (e.target.checked) {
        //         let flag = false;
        //         for (let i = 0; i < headerDimensionRefs.length; i++) {

        //             if(headerDimensionRefs[i]['id'] === item['id']){
        //                 flag = false;
        //                 break;
        //             }else{
        //                 flag = true;
        //             }
        //         }
        //         if(flag){
        //             headerDimensionRefs.push(item);
        //         }
        //     }
        // }

    }
    render() {
        let budgetClass = this.props.budgetClass;
        let dimensionList = this.props.dimensionList;

        if (!budgetClass['viewdefines']) {
            return null;
        }
        if (this.props.editHtmlType === 1) {
            // concat(budgetClass['viewdefines'])
            let arr = dimensionList;
            let arrLength = arr.length+10;

            return (
                <div className="budget-edit-table-box">
                    <div className="budget-edit-table">
                        <div className="ok fn-clear" >
                            <span onClick={this.handleOk}>完成</span>
                        </div>
                        <div className="title">单据头数据项设置</div>
                        <div className="content">
                            <div className="content-th">
                                <i>显示字段</i>
                                <span>必输项</span>
                            </div>
                            <div className="budget-drag-box">
                                <DragItem />
                            </div>
                        </div>
                    </div>
                    <div className="budget-edit-table-add-field">
                        <Animate transitionName="move-right">
                            <div className="slide-box">
                                <div className="title"> 单据头可选数据项 </div>
                                <div className="field-item-title">
                                    <Checkbox onChange={this.handleCheckAll} className="ckeck-item">点击选择至详情区域</Checkbox>
                                </div>
                                {
                                    arr.map((item, index) => {
                                        return (
                                            <div key={index} className="field-item">
                                                <Checkbox onChange={this.handleChange.bind(this, item)} className="ckeck-item">
                                                    {item['dimension']['name']}
                                                </Checkbox>
                                                {item['dimension']['id'] === dimensionList[index]['dimension']['id'] ? <div className="field-tips">该字段为分析维度字段</div> : null}
                                            </div>
                                        );
                                    })
                                }
                                {
                                    budgetClass['viewdefines'].map((item, index) => {
                                        return (
                                            <div key={index + arrLength} className="field-item">
                                                <Checkbox onChange={this.handleChange.bind(this, item)} className="ckeck-item">
                                                    {item['vname']}
                                                </Checkbox>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </Animate>
                    </div>

                </div>

            );
        } else if (this.props.editHtmlType === 2) {
             // concat(budgetClass['viewdefines'])
            let arr = dimensionList;
            let arrLength = arr.length+10;

            return (
                <div className="budget-edit-table-box">
                    <div className="budget-edit-table">
                        <div className="ok fn-clear" >
                            <span onClick={this.handleOk}>完成</span>
                        </div>
                        <div className="title">单据体数据项设置</div>
                        <div className="content">
                            <div className="content-th">
                                <i>显示字段</i>
                                <span>必输项</span>
                                <b className="budget-position">布局方式</b>
                                <b className="budget-reference">档案参照</b>
                            </div>
                            <div className="budget-drag-box">
                                <DragItem />
                            </div>
                        </div>
                    </div>
                    <div className="budget-edit-table-add-field">
                        <Animate transitionName="move-right">
                            <div className="slide-box">
                                <div className="title"> 单据体可选数据项 </div>
                                <div className="field-item-title">
                                    <Checkbox onChange={this.handleCheckAll} className="ckeck-item">点击选择至详情区域</Checkbox>
                                </div>
                                {
                                    arr.map((item, index) => {
                                        return (
                                            <div key={index} className="field-item">
                                                <Checkbox onChange={this.handleChange.bind(this, item)} className="ckeck-item">
                                                    {item['dimension']['name']}
                                                </Checkbox>
                                                {item['dimension']['id'] === dimensionList[index]['dimension']['id'] ? <div className="field-tips">该字段为分析维度字段</div> : null}
                                            </div>
                                        );
                                    })
                                }
                                {
                                    budgetClass['viewdefines'].map((item, index) => {
                                        return (
                                            <div key={index + arrLength} className="field-item">
                                                <Checkbox onChange={this.handleChange.bind(this, item)} className="ckeck-item">
                                                    {item['vname']}
                                                </Checkbox>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </Animate>
                    </div>

                </div>

            );
        } else {
            return null;
        }
    }
}

function mapStateToProps($$state) {
    let state = $$state.get('budgetRequisitionTypeState');
    let editHtmlType = state.get('editHtmlType');
    let dimensionList = state.get('dimensionList').toJS();
    let budgetClass = state.get('budgetClass').toJS();

    return {
        editHtmlType,
        dimensionList,
        budgetClass
    }
}

function mapDispatchToProps(dispatch) {
    let methods = {
    };
    let boundActionCreators = bindActionCreators(methods, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTable);