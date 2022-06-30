import React, {Component} from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import App from './components/App';
// import domUtil from './global/utils/domutil';

// 预算申请单列表 和 录入 以及调整
import BudgetApplication from './components/budgetapplication/BudgetApplication'
import BudgetAdjustApplication from './components/budgetapplication/BudgetAdjustApplication'
import BudgetApplicationDetail from './components/budgetapplication/BudgetApplicationOrAdjustDetail'
import BudgetApplicationEdit from './components/budgetapplication/BudgetApplicationOrAdjustEdit'
import DetailTest from './components/testdetail/test'

//待审批
import BudgetUnapproved from './components/budgetUnapproved';
//已审批
import BudgetApproved from './components/budgetApproved';
// Test
import Test from './templates/test'

export default class RootRouters extends Component {
	render() {
		return (
			<Router history={hashHistory}>
				<Route path="/" component={App}>
					<IndexRoute component={BudgetApplication}/>
					<Route path="test" component={Test}/>
					<Route path="BudgetUnapproved" component={BudgetUnapproved}/>
					<Route path="BudgetApproved" component={BudgetApproved}/>
					<Route path="budget_application" component={BudgetApplication}/>
					<Route path="budget_application_edit/:id" component={BudgetApplicationEdit}/>
					<Route path="budget_application_detail/:id" component={BudgetApplicationDetail}/>
					<Route path="budget_adjust_application" component={BudgetAdjustApplication}/>
					<Route path="detailTEST" component={DetailTest}/>
				</Route>
			</Router>
		)
	};
}
