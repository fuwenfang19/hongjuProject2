import React, { Component } from 'react';
import RequisitionTypeList from './requisitionTypeList';
import RequisitionTypeDetail from './RequisitionTypeDetail';

class BudgetRequisitionType extends Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div className="page budget-requisition-type">
                <RequisitionTypeList />
                <RequisitionTypeDetail />
            </div>
        );
    }
}

export default BudgetRequisitionType;