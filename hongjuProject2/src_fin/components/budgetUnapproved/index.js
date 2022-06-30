/**
 * Created by yangyfe on 2017/2/22.
 * 预算报销单未审批
 */

import React, {Component} from 'react';
import {Icon, Button, Checkbox,Tabs} from 'antd';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import * as types from '../../actions/actionTypes';
import BudgetUnapprovedInfo from './BudgetUnapprovedInfo';
import {bindActionCreators} from 'redux';
import {getMyBudgetUnapprovedList,changeBudgetUnapprovedKeyValue} from '../../reducers/budgetUnapproved/budgetUnapprovedReducer';

const TabPane = Tabs.TabPane;

class budgetUnapproved extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'left',
        }
    }
    componentDidMount() {
        this.props.getMyBudgetUnapprovedList();
        // this.isEmpty();
    }
  // isEmpty = () =>
  //       {
  //           for (var objectclassid in this.props.budgetUnapprovedList.rows)
  //           {
  //               return <TabPane tab={this.props.budgetUnapprovedList.rows.title} key={this.props.budgetUnapprovedList.rows.key}>{objectclassid}<BudgetUnapprovedInfo ref="BudgetUnapprovedInfo"/></TabPane>;
  //           }
  //           return true;
  //       };
    render() {
        return (
            <div className="page budgetUnapproved-page">
                {/*左侧的新增搜索项*/}
                <div className="gutter-box content-right">
                    <Tabs
                        defaultActiveKey="1"
                        tabPosition={this.state.mode}
                        onChange={this.changeTabsIndex}
                    >
                        <TabPane tab="预算单" key="1">
                            <BudgetUnapprovedInfo ref="BudgetUnapprovedInfo"/>
                        </TabPane>

                    </Tabs>
                </div>
            </div>
        )
    }
}
//将dispatch传递进来
function mapStateToProps(state) {
    let budgetUnapprovedState = state.get('budgetUnapprovedState');
    let budgetUnapprovedList = budgetUnapprovedState.get('budgetUnapprovedList');
    return {
        budgetUnapprovedList,
        clientHeight: state.get('baseState').toJS().clientHeight
    };
}
function mapDispatchToProps(dispatch) {
    let method = {
        getMyBudgetUnapprovedList,
        changeBudgetUnapprovedKeyValue,
    };
    let boundActionCreators = bindActionCreators(method, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(budgetUnapproved);
