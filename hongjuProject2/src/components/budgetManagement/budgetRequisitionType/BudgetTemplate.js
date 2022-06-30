import React, { Component } from 'react';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as types from './../../../actions/actionTypes';
import { getBudgetTemplatesDetail } from './../../../reducers/budgetManagement/budgetRequisitionType/budgetRequisitionTypeReducer';
import BudgetTemplateTable from './BudgetTemplateTable';

class BudgetTemplate extends Component {
    constructor() {
        super();
    }
    handleChoose = (item) => {
        this.props.dispatch({
            type: types.BUDGET_REQUISITION_TYPE_CHOOSE_TEMPLATE,
            payload: item
        });
        if (item['id']) {
            this.props.getBudgetTemplatesDetail(item);
        }

    }
    render() {
        return (
            <div className="new-requisition-box">
                <div className="new-requisition-title">选择适合您的预算申请单模版:</div>
                {
                    this.props.data.map((item, index) => {
                        return (
                            <div key={index} className="template-item">
                                <div className="template-item-title">
                                    <i>{index + 1}</i>
                                    <span>{item['name']}</span>
                                </div>
                                {
                                    this.props.choosedTemplate['id'] === item['id'] ? (
                                        <div className="template-item-detail" >
                                            <Icon type="check-circle" className="icon-t" onClick={() => {
                                                this.handleChoose({});
                                            }} />
                                            <div className="template-item-detail-choosed" >
                                                <BudgetTemplateTable data={this.props.choosedTemplateDetail} />
                                            </div>
                                        </div>
                                    ) : (
                                            <div className="template-item-detail" >
                                                <i className="icon-normal" onClick={() => {
                                                    this.handleChoose(item);
                                                }}></i>
                                                <span className="template-item-detail-unchoosed" onClick={() => {
                                                    this.handleChoose(item);
                                                }}></span>
                                            </div>
                                        )
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
function mapStateToProps($$state) {
    let state = $$state.get('budgetRequisitionTypeState');
    let choosedTemplate = state.get('choosedTemplate').toJS();
    let choosedTemplateDetail = state.get('choosedTemplateDetail').toJS();
    return {
        choosedTemplate,
        choosedTemplateDetail
    }
}

function mapDispatchToProps(dispatch) {
    let methods = {
        getBudgetTemplatesDetail
    };
    let boundActionCreators = bindActionCreators(methods, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetTemplate);
