//部门成员
let departmentInterface = {
	GET_DEPARTMENT_MESSAGE: '/organization/department/:departmentId',//获取公司部门列表
	GET_DEPARTMENT_MEMBERS: '/organization/getstaffsforwebbyrecursivedownview/',//获取部门成员列表

	// DEPARTMENT_ADD_DEPARTMENT: '/organization/webstaffitemsforcombo/', //新增部门
	DEPARTMENT_ADD_DEPARTMENT: '/organization/webdepartments/', //新增部门
	DEPARTMENT_UPDATE_DEPARTMENT: '/organization/department/:departmentId/', //编辑部门
	DEPARTMENT_BATCH_UPDATE_DEPARTMENT: '/organization/betcheditparent/', //批量编辑人员
	DEPARTMENT_ADD_DEPARTMENT_MEMBERS: '/organization/webstaffitems/',//新增部门成员
	DEPARTMENT_SAVE_MEMBERS: '/organization/staffitem/:staffId/', //保存部门成员修改

	DEPARTMENT_RESET: '/organization/getstaffsforwebbyrecursivedownview/',//重置密码
	DEPARTMENT_DISABLE_LIST: '/organization/webdepartments/',//停用部门
	DEPARTMENT_SEARCH_LIST: '/organization/webdepartments/'//搜索部门
};

//基础档案-项目
let baseFilesInterface = {
	PROJECT_GET_COMPANY_PROJECT: '/organization/expenseitem/:projectId/', //获取公司项目列表
	PROJECT_GET_PROJECT_MEMBERS: '/organization/expenseitemstaff/:projectId/', //获取项目成员列表
	PROJECT_SAVE_MEMBERS: '/organization/expenseitemstaff/:projectId/', //保存项目成员修改  [{"staffItem":"31826","status":"在项目"}]
	PROJECT_ADD_PROJECT: '/organization/expenseitems/', //新增项目
	PROJECT_UPDATE_PROJECT: '/organization/expenseitem/:projectId/', //编辑项目
	PROJECT_DO_BATCH_EDIT: '/organization/web/expenseitemdirectorbatchmodify/', //批量编辑项目
	PROJECT_BATCH_UPDATE_PROJECT: '/organization/web/expenseitemdirectorbatchmodify/', //批量编辑项目 {"expenseitem":"7016","department":"4357","director":"31869"}
	PROJECT_GET_LIST: '/organization/webexpenseitems/',//获取项目列表

	SUPPLIER_GET_SUPPLIER_LIST: '/organization/web/supplier/list/',//获取供应商列表
	SUPPLIER_GET_SUPPLIER_DETAIL: '/organization/web/supplier/detail/:supplierId/',//获取供应商详情
	SUPPLIER_GET_BANK_LIST: '/organization/web/bank/list/', //获取银行列表
	SUPPLIER_EDIT_SUPPLIER: '/organization/web/supplier/modify/',//修改、添加供应商
};
//基础档案-银行账号
let bankAccountInterface = {
	GET_BANK_LIST: '/organization/web/bank/list/',//获取银行列表 param {enable:true}
	MODIFY_BANK_LIST: '/organization/web/bank/detail/modify/',//保存
	MODIFY_PAY_METHOD_LIST: '/organization/web/paymentmethod/detail/modify/',//保存
	MODIFY_BANK_ACCOUNT_LIST: '/organization/web/bankaccount/detail/modify/',//保存

	GET_BANK_ACCOUNT_LIST: '/organization/web/bankaccount/list/',//获取银行账号列表
	GET_PAY_METHOD_LIST: '/organization/web/paymentmethod/list/',//获取支付方式列表
};

//基础档案-资金来源
let sourcesOfFound = {
	GET_FUND_SOURCE: '/organization/getfundsource/',
	GET_FUND_SOURCE_SAVE_DATA: '/organization/saveorupdatefundsource/'
};
//审批-审批流
let workFlowInterface = {
	GET_WORKFLOW_ORG_EXPR: '/workflow/orgexpr/', //获取组织表达式 - 步骤（知会人）
	GET_WORKFLOW_ACTIONS_EXPR: '/workflow/actiondesign/', //获取高级动作表达式
	GET_WORKFLOW_CONDITIONS_EXPR: '/workflow/conditionexpr/', //获取条件表达式 - 条件（触发条件）
	GET_WORKFLOW_BILL_TYPES: '/workflow/typelist/', //获取所有单据类型 申请 报销 还款 订票
	GET_WORKFLOW_ADD_LIST: '/workflow/getbiglist/', //获取所有单据类型 申请 报销 还款 订票 可以增加的列表
	GET_WORKFLOW_DESIGN_BY_ID: '/workflow/processdesignsbypid/:id/', //获取流程定义
	GET_WORKFLOW_EXPENSE_STANDARDS: '/expense/reportcompanyrule/:id/', //获取报销单对应的设置过费控政策的费用类型

	SAVE_WORKFLOW_DESIGN: '/workflow/release/', //保存流程定义
	WORKFLOW_DESIGN_ON: '/workflow/startprocessmodel/:id/', //启用流程定义
	WORKFLOW_DESIGN_OFF: '/workflow/stopprocessmodel/:id/', //停用流程定义
	DELETE_WORKFLOW_DESIGN: '/workflow/processmodel/:id/', //删除流程定义
	COPY_WORKFLOW: '/workflow/copyflow/', //新增流程定义
	CHANGE_WORKFLOW_NAME: '/workflow/updateprocessname/:id/', //修改名字

};
//审批-岗位
let workFlowPosition = {
	POSITION_GET_OR_PUT: '/organization/web/position/list/'
};
//审批-审批额度
let workFlowApprovelLimit = {
	APPROVEL_LIMIT_GET_OR_PUT: '/organization/web/approvelimit/list/'
}

//单据类型
let BillingStyleInterface = {
	GET_BILLING_STYLE: '/expense/getobjectclasstemplatebytopclass/',  //获取模板类型（新增的时候弹出的类型列表）
	GET_BILLINGSTYLE_DEFAULTSETTING: '/expense/getviewdefinetemplatesbyobjectclass/',  //获取默认模板设置数据
	GET_BILLINGSTYLE_APPLICATIONSETTING: '/expense/getapplicationclassviewdefines/',  //获取已经应用的设置数据
	GET_BILLINGSTYLE_LEFTMENU: '/expense/getdefinedbillclasses/',   //读取已经设置的单据类型的左侧列表
	GET_BILLINGSTYLE_GETFILEDATA: '/expense/get_template_define/',   //根据档案类型关联
	GET_SHENQINBILL_RELATETYPE: '/expense/getreporttypes/',//获取申请单关联报销单类型
	GET_CUSTOMBASEDEFINE: '/expense/custombasedefine/',//获取自定义档案枚举值
	SAVE_BILLINGSETTING_DATA: '/expense/saveorppdateapplicationclass/', //保存单据类型设置项
	DELETE_BILLSETTING: '/expense/removeapplicationclass/', //删除当前申请单
	DELETE_REPORTSETTING: '/expense/removereportclass/', //删除当前报销单
	DELETE_REPAYSETTING: '/expense/removerepayclass/', //删除当前还款单
	GETDIGEST_TEMPLATES: '/expense/digesttemplates/', //获取摘要定义模板列表
	GET_REPAYSTYLE_APPLICATIONSETTING: '/expense/getrepayclassviewdefines/',//获取还款单已经设置的数据
	GET_REPORTSTYLE_APPLICATIONSETTING: '/expense/getreportclassviewdefines/',//获取报销单已经设置的数据
	SAVE_REPAYBILL_APPLICATIONSETTING: '/expense/saveorupdaterepayclass/',//保存还款单
	SAVE_REPORTBILL_APPLICATIONSETTING: '/expense/saveorupdatereportclass/',//保存报销单
	GET_REPORT_EXPENSELIST: '/expense/getreportexpenselist/', //获取费用类型右侧侧滑列表
	GET_ADDREPORTBILL_DISBURSE: '/organization/alldisburse/',//获取新增报销单支出类型可选范围
};
//单据-单据录入规则
let entryBillRule = {
	ENTRY_BILL_RULE_GET_BILL_RULE_LIST: '/expense/getbillrulelist/',
	ENTRY_BILL_RULE_DOWNLOAD_TEMPLATE: '/expense/entryrule/template/',
	ENTRY_BILL_RULE_UPLOAD_TEMPLATE: '/expense/entryrule/upload/',
	ENTRY_BILL_RULE_BILL_TYPES: '/erp/common/billtypes/',
	ENTRY_BILL_RULE_GET_CAN_USE_ITEMS: '/expense/getcanuseitems/',
	ENTRY_BILL_RULE_SAVE_OR_ADD_RULE: '/expense/savebillrule/',
	ENTRY_BILL_RULE_GET_BILL_RULE: '/expense/getbillrule/:id/',
	ENTRY_BILL_RULE_GET_BILL_RULE_DETAILS: '/expense/getbillruledetails/:id/',
	ENTRY_BILL_RULE_DELETE_RULE: '/expense/delrule/:id/',
	ENTRY_BILL_RULE_SAVE_BILL_RULE_DETAILS: '/expense/savebillruledetails/',
	ENTRY_BILL_RULE_GET_EXPENSE_TYPE: '/expense/objectclasschildren/:id/',
	ENTRY_BILL_RULE_GET_MINOR_EXPENSE_TYPE: '/expense/getbills/:bigtype/'
};

//费控政策
let CostControlPolicy = {
	// 获取公司项目列表
	GET_COMPANY_PROJECT: '/organization/webexpenseitems/'
};
//通用树----部门树，支付树，项目树

let commonTree = {
	// 部门树(人员树)
	TREE_DEPARTMENT: '/organization/webdepartments/',
	// 支出类型树
	TREE_DISBURSE: '/organization/getdisburse/',
	// 项目树---已经改好
	TREE_PROJECT: '/organization/webexpenseitems/'

};


//支出类型
let disburseInterface = {
	DISBURSE_GET_COMPANY_DISBURSE: '/organization/getdisbursebyid/:disburseId/', //获取支出类型
	DISBURSE_ADD_DISBURSE: '/organization/creatdisburse/',//新增支出类型
	DISBURSE_UPDATE_DISBURSE: '/organization/updatadisburse/:disburseId/',//编辑支出类型
	DISBURSE_DISABLE_LIST: '/organization/getdisburse/',//停用支出类型
	DISBURSE_SEARCH_LIST: '/organization/getdisburse/'//停用支出类型
};
//费用类型 
let expenseType = {
	GET_TICKET_EXPENSESETTING: '/expense/gettickettoexpensesettings/', //获取交易订单费用类型
	SAVE_TICKET_EXPENSESETTING: '/expense/settickettoexpensesettings/',//保存交易订单费用类型
	GET_CHARGESTYLE_TEMPLATELIST: '/expense/getobjectclasstemplatebytopclass/', //获取费用类型模板列表
	GET_CHARGESTYLE_EXPENSELIST: '/expense/getreportexpenselist/',//获取左侧菜单列表
	GET_EXPENSEVIEWDEFINED: '/expense/getexpenseviewdefines/',//获取已经定义的费用类型详情信息
	GET_EXPENSESTYLE_DEFAULTSETTING: '/expense/getviewdefinetemplatesbyobjectclass/',//获取预置的模板信息
	DELETE_EXPENSESTYPE: '/expense/removeexpenseclass/',//删除费用类型
	SAVE_EXPENSETYPE_SETTING: '/expense/saveorupdateexpenseclass/',//保存费用类型设置
	GET_EXPENSETEMPLATE: '/expense/getexpensetemplate/' //获取费用类型模板接口
}
//公司信息
let companyInfor = {
	GET_COMPANYINFOR: '/organization/company/',  //获取公司信息
	GET_COMPANYLOGO: '/organization/getlogo/',//获取公司logo
	CHECK_SUBMINT: '/organization/company/',//提交核验
	DELETE_TAXPIC: '/organization/companyimg/' //删除图片
}
//管理参数配置
let configurationInterface = {
	CONFIGURATION_GET_DATA: '/organization/company/:companyId/',//获取公司信息参数
}

//预算申请单类型
let budgetRequisitionType = {
	BUDGET_REQUISITION_TYPE_DIMENSION_LIST:'/budget/dimensionrefinfo/',//获取预算维度定义列表
	BUDGET_REQUISITION_TYPE: '/expense/getobjectclasstemplatebytopclass/',//获取预算编制类型定义模板列表
	BUDGET_REQUISITION_TYPE_DETAIL: '/expense/getviewdefinetemplatesbyobjectclass/',//获取预算编制类型定义模板
	BUDGET_REQUISITION_TYPE_BUDDET_CLASS_LIST:'/budget/classlist/',//读取预算编制类型定义列表
	BUDGET_REQUISITION_TYPE_READ_BUDGET_CLASS:'/budget/budgetclass/pk/',//读取类型定义
	BUDGET_REQUISITION_TYPE_ADD_BUDGET_CLASS:'/budget/budgetclass/',//新增类型定义
	BUDGET_REQUISITION_TYPE_GET_PLANS:'/budget/plans/',//获取预算编制方案列表
	BUDGET_REQUISITION_TYPE_UPDATE_BUDGET_CLASS:'/budget/budgetclass/pk/',//修改类型定义
}
//预算控制方案
let budgetControl = { 
	BUDGET_GETPLANLIST:'/budget/plans/' ,//获取预算控制方案列表
	BUDGET_GETPLANDETAIL:'/budget/plan/', //用pk获取控制方案详情
	BUDGET_DIMENSIONREFINFO:'/budget/dimensionrefinfo/' //获取预算维度定义列表
}
const
	api = {
		...departmentInterface,
		...baseFilesInterface,
		...workFlowInterface,
		...BillingStyleInterface,
		...CostControlPolicy,
		...commonTree,
		...sourcesOfFound,
		...disburseInterface,
		...expenseType,
		...workFlowPosition,
		...workFlowApprovelLimit,
		...entryBillRule,
		...companyInfor,
		...configurationInterface,
		...bankAccountInterface,
		...budgetRequisitionType,
		...budgetControl
	};

export default api;
