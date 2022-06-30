import { combineReducers } from 'redux-immutablejs';
import baseState from './appReducer';

//基础档案
import projectState from './basefiles/project/projectReducer';
import disburseState from './basefiles/disburse/disburseReducer';
import supplierState from './basefiles/supplier/supplierReducer';
import bankAccountState from './basefiles/bankaccountpay/bankAccountReducer';
import sourcesOfFundState from './basefiles/sourcesOfFund/sourcesOfFundReducer';

//其他档案
import departmentState from './department/departmentReducer';
import customFilesState from './customFiles/customFilesReducer';

//审批流
import workFlowState from './workflow/workflow/workflowReducer';
import positionState from './workflow/position/positionReducer';
import approvelLimitState from './workflow/approveLimit/approveLimitReducer';

//单据类型
import billSettingState from './bill/billingSetting/billingSettingReducer';
import expenseTypeState from './bill/expenseType/expenseTypeReducer';
import entryBillRuleState from './bill/entryBillRule/entryBillRuleReducer';

//公司设置
import configurationParamState from './configurationParam/configurationParamReducer';
import companyInforState from './enterpriseConfig/companyInfor/companyInforReducer';

//首页
import homePageState from './homePage/homePageReducer';

//预算控制方案
import budgetControlState from './budgetManagement/budgetControl/budgetControlReducer';
import budgetRequisitionTypeState from './budgetManagement/budgetRequisitionType/budgetRequisitionTypeReducer';

const rootReducer = combineReducers({
	baseState,
	departmentState,
	projectState,
	bankAccountState,
	supplierState,
	workFlowState,
	billSettingState,
	sourcesOfFundState,
	disburseState,
	expenseTypeState,
	positionState,
	customFilesState,
	approvelLimitState,
	entryBillRuleState,
	configurationParamState,
	companyInforState,
	homePageState,
	budgetControlState,
	budgetRequisitionTypeState,
});

export default rootReducer;