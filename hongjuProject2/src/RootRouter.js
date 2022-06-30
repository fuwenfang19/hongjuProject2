import React, {Component} from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

import App from './components/App';
// 首页
import HomePage from './components/homePage/HomePage';

// 基础档案
import Project from './components/basefiles/project/Project';
import Supplier from './components/basefiles/supplier/Supplier';
import sourcesOfFund from './components/basefiles/sourcesOfFund/index';
import Disburse from './components/basefiles/disburse/Disburse';
import BankAccountPay from './components/basefiles/bankaccountpay/index';

// 其他档案
import Department from './components/department/Department';
import CustomFile from './components/customFiles/CustomFile';

// 审批流
import WorkFlow from './components/workflow/workflow/index';
import Position from './components/workflow/position/index';
import ApproveLimit from './components/workflow/approveLimit/index';

// 单据设置
import BillingSetting from './components/bill/billingSetting';
import ExpenseType from './components/bill/expenseType';
import EntryBillRule from './components/bill/entryBillRule';

// 公司设置
import CompanyInfor from './components/enterpriseConfig/companyInfor';
import ConfigurationParam from './components/enterpriseConfig/configurationParam/ConfigurationParam';
import WalletSet from './components/enterpriseConfig/walletSet/WalletSet';

//预算控制方案
import BudgetControl from './components/budgetManagement/budgetControl';
import BudgetRequisitionType from './components/budgetManagement/budgetRequisitionType';
// Test界面
import UserIntroduce from './components/demo/userIntroduce';
import domUtil from './global/utils/domutil';
export default class RootRouters extends Component {
	render() {

		const userInfo = domUtil.getUserInfo();

		return (
			<Router history={hashHistory}>
				{userInfo.isComplete ?
					<Route path="/" component={App}>
						<IndexRoute component={HomePage}/>
						<Route path="workflow" component={WorkFlow}/>
						<Route path="bank_account" component={BankAccountPay}/>
						<Route path="department" component={Department}/>
						<Route path="project" component={Project}/>
						<Route path="disburse" component={Disburse}/>
						<Route path="supplier" component={Supplier}/>
						<Route path="fund" component={sourcesOfFund}/>
						<Route path="position" component={Position}/>
						<Route path="approveLimit" component={ApproveLimit}/>
						<Route path="billingSetting" component={BillingSetting}/>
						<Route path="expenseType" component={ExpenseType}/>
						<Route path="entryRule" component={EntryBillRule}/>
						<Route path="customFiles" component={CustomFile}/>
						<Route path="company_info" component={CompanyInfor}/>
						<Route path="configurationParam" component={ConfigurationParam}/>
						<Route path="walletSet" component={WalletSet}/>
						<Route path="userIntroduce" component={UserIntroduce}/>
						<Route path="homePage" component={HomePage}/>
						<Route path="budgetControl" component={BudgetControl}/>
						<Route path="budgetRequisitionType" component={BudgetRequisitionType}/>
					</Route>
					:
					<Route path="/" component={App}>
						<IndexRoute component={CompanyInfor}/>
						<Route path="company_info" component={CompanyInfor}/>
					</Route>
				}
			</Router>
		)
	};
}
