/**
 * Created by chezhanluo on 2017/5/25.
 */
import React from 'react';
import {connect} from 'react-redux';
import BudgetApplicationDetailComponent from '../common/billdetail/BudgetApplicationDetailComponent'
const param = {
    "togethers": [],
    "company": null,
    "objectclassids": [],
    "reportbegindate": null,
    "reportenddate": null,
    "reportcodes": [],
    "loanAmount": false,
    "reason": "",
    "pagenum": 1,
    "countperpage": 1,
    "departments": []
}
class test extends React.Component {
    constructor() {
        super();
    }
    /*
     如果是按id查     传id别传param
     如果是按param查  传param别传id
     */
    render() {
        return (
            <div onClick={()=>{
                console.log(1111);
            }}>
                我是一个入口

                <BudgetApplicationDetailComponent
                    param={param}
                    detailType={'报销单'}
                    detailUrl={'/expense/getpendingapprovaldetail/'}
                    detailSchemaUrl={'/expense/objectschema/'}
                    detailApprovepathUrl={'/expense/approvepath/'}
                >
                </BudgetApplicationDetailComponent>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        clientHeight: state.get('baseState').toJS().clientHeight,
    }
}
export default connect(mapStateToProps)(test);