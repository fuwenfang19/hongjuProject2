/**
 * Created by yangyfe on 2017/2/22.
 * 预算报销单未审批
 */

import React, {Component} from 'react';
import {Icon, Button, Checkbox,Tabs} from 'antd';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import * as types from '../../actions/actionTypes';
import BudgetApprovedInfo from './BudgetApprovedInfo';
import {bindActionCreators} from 'redux';
import {getMyBudgetApprovedList,changeBudgetApprovedKeyValue} from '../../reducers/budgetApproved/budgetApprovedReducer';

const TabPane = Tabs.TabPane;

class budgetApproved extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'left',
        }
    }
    componentDidMount() {
        this.props.getMyBudgetApprovedList();
    }

    changeTabsIndex = (key) => {
        this.props.dispatch({
            type: types.BUDGET_CHANGE_APPROVED_TABS_INDEX,
            payload:key
        })
    }

    render() {
        return (
            <div className="page budgetApproved-page">
                {/*左侧的新增搜索项*/}
                <div className="gutter-box content-right">

                    <Tabs
                        defaultActiveKey="1"
                        tabPosition={this.state.mode}
                        onChange={this.changeTabsIndex}
                    >
                        <TabPane tab="预算单" key="1">
                            <BudgetApprovedInfo ref="BudgetApprovedInfo"/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
//将dispatch传递进来
function mapStateToProps(state) {
    let budgetApprovedState = state.get('budgetApprovedState');
    let isShow = budgetApprovedState.get('isShow');
    return {
        isShow,
        clientHeight: state.get('baseState').toJS().clientHeight
    };
}
function mapDispatchToProps(dispatch) {
    let method = {
        getMyBudgetApprovedList,
        changeBudgetApprovedKeyValue
    };
    let boundActionCreators = bindActionCreators(method, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(budgetApproved);
