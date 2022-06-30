import * as appActions from './appActions';

// 基础档案
import * as projectActions from './basefiles/project/projectActions';
import * as disburseActions from './basefiles/disburse/disburseActions';
import * as supplierAction from './basefiles/supplier/supplierActions';
import * as bankAccountActions from './basefiles/bankaccountpay/bankAccountPayActions';

// 其他档案
import * as departmentActions from './department/departmentActions';
import * as customFilesActions from './customFiles/customFilesActions';

// 审批流
import * as workFlowActions from './workflow/workflow/workflowActions';

// 单据类型
import * as billingSettingActions from './bill/billingSetting/billingSettingActions';
import * as expenseTypeActions from './bill/expenseType/expenseTypeActions';

// 公司设置
import * as companyInforActions from './enterpriseConfig/companyInfor/companyInforActions';

//预算控制
import * as budgetControlActions from './budgetManagement/budgetControl/budgetControlActions';

module.exports = {
	...appActions,
	...projectActions,
	...supplierAction,
	...workFlowActions,
	...billingSettingActions,
	...departmentActions,
	...disburseActions,
	...expenseTypeActions,
	...customFilesActions,
	...companyInforActions,
	...bankAccountActions,
	...budgetControlActions,
};