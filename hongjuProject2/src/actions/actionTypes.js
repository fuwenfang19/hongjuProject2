//app
export const APP_GET_USER_INFO = 'APP_GET_USER_INFO';
export const APP_CHANGE_CLIENT_HEIGHT = 'APP_CHANGE_CLIENT_HEIGHT';
export const APP_PROBLEM_SHOW = 'APP_PROBLEM_SHOW';//
export const APP_PUT_PROBLEM = 'APP_PUT_PROBLEM';//发送问题
export const APP_CHANGE_LEFTMENU_SELECTED = 'APP_CHANGE_LEFTMENU_SELECTED'
//部门成员
export const FETCH_ALL_DEPTS = 'FETCH_ALL_DEPTS';//部门详情
export const DEPARTMENT_MEMBERS = 'DEPARTMENT_MEMBERS';//部门成员
export const DEPARTMENT_MEMBERS_DETAILS = 'DEPARTMENT_MEMBERS_DETAILS';//部门成员详情
export const FETCH_ALL_DEPTS_COMPANY = 'FETCH_ALL_DEPTS_COMPANY';//点击公司修改参数

export const DEPARTMENT_UPDATE_ADDING_MEMBERS = 'DEPARTMENT_UPDATE_ADDING_MEMBERS';//更新正在编辑的部门成员state
export const DEPARTMENT_BEGIN_EDIT_MEMBERS = 'DEPARTMENT_BEGIN_EDIT_MEMBERS';//开始编辑部门成员
export const DEPARTMENT_END_EDIT_MEMBERS = 'DEPARTMENT_END_EDIT_MEMBERS';//停止编辑部门成员
export const DEPARTMENT_ADD_DEPARTMENT_MEMBERS = 'DEPARTMENT_ADD_DEPARTMENT_MEMBERS';//新增部门成员
export const DEPARTMENT_UPDATE_MEMBERS = 'DEPARTMENT_UPDATE_MEMBERS';//编辑部门成员
export const DEPARTMENT_CHANGE_FILE_CHOOSE_FLAG_MEMBERS = 'DEPARTMENT_CHANGE_FILE_CHOOSE_FLAG_MEMBERS';//档案选择是否选择

export const DEPARTMENT_UPDATE_ADDING = 'DEPARTMENT_UPDATE_ADDING';//更新正在编辑的state
export const DEPARTMENT_BEGIN_EDIT = 'DEPARTMENT_BEGIN_EDIT';//开始编辑部门
export const DEPARTMENT_END_EDIT = 'DEPARTMENT_END_EDIT';//停止编辑部门
export const DEPARTMENT_RELOAD_TREE = 'DEPARTMENT_RELOAD_TREE';//重新渲染树
export const DEPARTMENT_ADD_DEPARTMENT = 'DEPARTMENT_ADD_DEPARTMENT';//新增部门
export const DEPARTMENT_UPDATE = 'DEPARTMENT_UPDATE';//编辑部门
export const TREE_UPDATE_DEPARTMENT = 'TREE_UPDATE_DEPARTMENT';

export const DEPARTMENT_BEGIN_BATCH_EDIT = 'DEPARTMENT_BEGIN_BATCH_EDIT';//开始批量编辑部门
export const DEPARTMENT_END_BATCH_EDIT = 'DEPARTMENT_END_BATCH_EDIT';//停止批量编辑部门
export const DEPARTMENT_CHANGE_BATCH_EDIT_DEPARTMENT_FLAG = 'DEPARTMENT_CHANGE_BATCH_EDIT_DEPARTMENT_FLAG';//开始批量编辑部门成员
export const DEPARTMENT_BATCH_UPDATE = 'DEPARTMENT_BATCH_UPDATE';//批量编辑部门
export const DEPARTMENT_BATCH_SYNC = 'DEPARTMENT_BATCH_SYNC';//批量编辑部门-更新store
export const DEPARTMENT_CHANGE_FILE_CHOOSE_FLAG = 'DEPARTMENT_CHANGE_FILE_CHOOSE_FLAG';//档案选择是否显示
export const DEPARTMENT_CHANGE_EDIT_MEMBERS_FLAG = 'DEPARTMENT_CHANGE_EDIT_MEMBERS_FLAG';//批量编辑部门成员

export const DEPARTMENT_CHANGE_ADD_MEMBERS_FLAG = 'DEPARTMENT_CHANGE_ADD_MEMBERS_FLAG';//添加 members
export const DEPARTMENT_UPDATE_EDITING_MEMBERS = 'DEPARTMENT_UPDATE_EDITING_MEMBERS';//更新members的store
export const DEPARTMENT_SAVE_MEMBERS = 'DEPARTMENT_SAVE_MEMBERS';//保存members

export const DEPARTMENT_QUIT_STAFFS = 'DEPARTMENT_QUIT_STAFFS';//点击离职人员
export const DEPARTMENT_INVITE_STAFFS = 'DEPARTMENT_INVITE_STAFFS';//邀请人员
export const DEPARTMENT_RESET_PASSWORD = 'DEPARTMENT_RESET_PASSWORD';//重置密码
export const DEPARTMENT_SEARCH_STAFFS = 'DEPARTMENT_SEARCH_STAFFS';//查询人员
export const DEPARTMENT_SEARCH_ENDS = 'DEPARTMENT_SEARCH_ENDS';//查询完显示人员

export const NEXT_DEPARTMENT_MEMBERS_DETAIL = 'NEXT_DEPARTMENT_MEMBERS_DETAIL';//下一个
export const PREV_DEPARTMENT_MEMBERS_DETAIL = 'PREV_DEPARTMENT_MEMBERS_DETAIL';//上一个

export const CHANGE_STAFFID = 'CHANGE_STAFFID';//修改staffids
//树
export const DEPARTMENT_TREE_SET_DEPARTMENT_DATA = 'DEPARTMENT_TREE_SET_DEPARTMENT_DATA';
export const DEPARTMENT_TREE_SET_PAGE = 'DEPARTMENT_TREE_SET_PAGE';
export const DEPARTMENT_TREE_ClEAR = 'DEPARTMENT_TREE_ClEAR';

//停用部门，搜索部门
export const DEPARTMENT_GET_LIST = 'DEPARTMENT_GET_LIST';
export const DEPARTMENT_CHANGE_KEY_VALUE = 'DEPARTMENT_CHANGE_KEY_VALUE';

/*项目档案*/
export const PROJECT_FETCH_PROJECT = 'PROJECT_FETCH_PROJECT';//项目详情
export const PROJECT_FETCH_PROJECT_MEMBERS = 'PROJECT_FETCH_PROJECT_MEMBERS';//项目成员
export const PROJECT_UPDATE_ADDING_PROJECT = 'PROJECT_UPDATE_ADDING_PROJECT';//更新正在编辑的store
export const PROJECT_ADD_PROJECT = 'PROJECT_ADD_PROJECT';//新增项目
export const PROJECT_UPDATE_PROJECT = 'PROJECT_UPDATE_PROJECT';//编辑项目
export const PROJECT_BATCH_UPDATE_PROJECT = 'PROJECT_BATCH_UPDATE_PROJECT';//批量编辑项目
export const PROJECT_BATCH_SYNC = 'PROJECT_BATCH_SYNC';//批量编辑项目-更新store
export const PROJECT_RELOAD_TREE = 'PROJECT_RELOAD_TREE';//重新渲染树

export const PROJECT_CHANGE_FILE_CHOOSE_FLAG = 'PROJECT_CHANGE_FILE_CHOOSE_FLAG';//档案选择是否显示
export const PROJECT_BEGIN_EDIT_PROJECT = 'PROJECT_BEGIN_EDIT_PROJECT';//编辑项目
export const PROJECT_END_EDIT_PROJECT = 'PROJECT_END_EDIT_PROJECT';//停止编辑项目

export const PROJECT_CHANGE_BATCH_EDIT_PROJECT_FLAG = 'PROJECT_CHANGE_BATCH_EDIT_PROJECT_FLAG';//批量编辑项目
export const PROJECT_CHANGE_EDIT_MEMBERS_FLAG = 'PROJECT_CHANGE_EDIT_MEMBERS_FLAG';//批量编辑项目成员
export const PROJECT_UPDATE_EDITING_MEMBERS = 'PROJECT_UPDATE_EDITING_MEMBERS';//更新members的store
export const PROJECT_SAVE_MEMBERS = 'PROJECT_SAVE_MEMBERS';//保存members
export const PROJECT_CHANGE_ADD_MEMBERS_FLAG = 'PROJECT_CHANGE_ADD_MEMBERS_FLAG';//添加 members

export const PROJECT_TREE_SET_PROJECT_DATA = 'PROJECT_TREE_SET_PROJECT_DATA';
export const PROJECT_TREE_SET_PAGE = 'PROJECT_TREE_SET_PAGE';
export const PROJECT_TREE_ClEAR = 'PROJECT_TREE_ClEAR';

export const PROJECT_GET_LIST = 'PROJECT_GET_LIST';
export const PROJECT_CHANGE_KEY_VALUE = 'PROJECT_CHANGE_KEY_VALUE';

/*供应商*/
export const SUPPLIER_SEARCHDCOUNT = 'SUPPLIER_SEARCHDCOUNT';
export const SUPPLIER_SEARCHDATA = 'SUPPLIER_SEARCHDATA';
export const SUPPLIER_SUPPLIER_LIST = 'SUPPLIER_SUPPLIER_LIST';
export const SUPPLIER_CURRENT_SUPPLIER = 'SUPPLIER_CURRENT_SUPPLIER';
export const SUPPLIER_CURRENT_SUPPLIER_DETAIL = 'SUPPLIER_CURRENT_SUPPLIER_DETAIL';
export const SUPPLIER_SHOW_EDIT = 'SUPPLIER_SHOW_EDIT';
export const SUPPLIER_EDIT_SUPPLIER = 'SUPPLIER_EDIT_SUPPLIER';
export const SUPPLIER_BANK_LIST = 'SUPPLIER_BANK_LIST';
export const SUPPLIER_EDIT_CHANGED = 'SUPPLIER_EDIT_CHANGED';

//支出类型树
export const DISBURSE_TREE_SET_PROJECT_DATA = 'DISBURSE_TREE_SET_PROJECT_DATA';
export const DISBURSE_TREE_SET_PAGE = 'DISBURSE_TREE_SET_PAGE';
export const DISBURSE_TREE_ClEAR = 'DISBURSE_TREE_ClEAR';
export const DISBURSE_RELOAD_TREE = 'DISBURSE_RELOAD_TREE';
//支出类型操作
export const DISBURSE_ADD_DISBURSE = 'DISBURSE_ADD_DISBURSE';//新增支出类型
export const DISBURSE_FETCH_DISBURSE = 'DISBURSE_FETCH_DISBURSE';//支出类型详情
export const DISBURSE_BEGIN_EDIT_DISBURSE = 'DISBURSE_BEGIN_EDIT_DISBURSE';//编辑支出类型
export const DISBURSE_BEGIN_EDIT_DISBURSE_OTHER = 'DISBURSE_BEGIN_EDIT_DISBURSE_OTHER';//编辑支出类型OTHER
export const DISBURSE_END_EDIT_DISBURSE = 'DISBURSE_END_EDIT_DISBURSE';//编辑支出类型
export const DISBURSE_UPDATE_DISBURSE = 'DISBURSE_UPDATE_DISBURSE';//编辑支出类型
export const DISBURSE_SHOWIMPORTMODEL = 'DISBURSE_SHOWIMPORTMODEL';//导入模块的显示
export const DISBURSE_EDIT_DISBURSE = 'DISBURSE_EDIT_DISBURSE';
export const DISBURSE_CHANGE_KEY_VALUE = 'DISBURSE_CHANGE_KEY_VALUE';
export const DISBURSE_CANSAVE = 'DISBURSE_CANSAVE';//支出类型保存按钮的
export const TREE_UPDATE_DISBURSE = 'TEST_UPDATE_DISBURSE';//编辑支出类型
export const DISBURSE_STATUS = 'DISBURSE_STATUS';
export const DISABLE_DISBURSE_STATUS = 'DISABLE_DISBURSE_STATUS';
export const DISABLE_DISBURSE_LIST = 'DISABLE_DISBURSE_LIST';

/*审批流设置*/
export const GET_WORKFLOW_DESIGN_BY_ID = 'GET_WORKFLOW_DESIGN_BY_ID';//根据id获取流程定义
export const GET_WORKFLOW_BILL_TYPES = 'GET_WORKFLOW_BILL_TYPES';//获取左侧所有单据类型
export const GET_WORKFLOW_ADD_LIST = 'GET_WORKFLOW_ADD_LIST';//获取左侧所有单据类型
export const GET_WORKFLOW_CONDITIONS_EXPR = 'GET_WORKFLOW_CONDITIONS_EXPR';//条件表达式
export const GET_WORKFLOW_ORG_EXPR = 'GET_WORKFLOW_ORG_EXPR';//组织表达式
export const GET_WORKFLOW_ACTIONS_EXPR = 'GET_WORKFLOW_ACTIONS_EXPR';//高级表达式
export const GET_WORKFLOW_EXPENSE_STANDARDS = 'GET_WORKFLOW_EXPENSE_STANDARDS';//获取设置过报销标准的费用类型

export const ADD_WORKFLOW_CONDITION = 'ADD_WORKFLOW_CONDITION';//增加条件
export const UPDATE_WORKFLOW_CONDITION = 'UPDATE_WORKFLOW_CONDITION';//编辑条件
export const REMOVE_WORKFLOW_CONDITION = 'REMOVE_WORKFLOW_CONDITION';//删除条件

export const ADD_WORKFLOW_STEP = 'ADD_WORKFLOW_STEP';//增加步骤
export const UPDATE_WORKFLOW_STEP = 'UPDATE_WORKFLOW_STEP';//编辑步骤
export const REMOVE_WORKFLOW_STEP = 'REMOVE_WORKFLOW_STEP';//删除步骤
export const UPDATE_WORKFLOW_STEP_ORDER = 'UPDATE_WORKFLOW_STEP_ORDER';//删除步骤

export const SAVE_WORKFLOW = 'SAVE_WORKFLOW';//保存审批流
export const DELETE_WORKFLOW = 'DELETE_WORKFLOW';//保存审批流
export const ON_OFF_WORKFLOW = 'ON_OFF_WORKFLOW';//启用停用审批流

export const CHANGE_WORKFLOW_KEY_VALUE = 'CHANGE_WORKFLOW_KEY_VALUE';//编辑字段
export const CHANGE_WORKFLOW_ROOT_KEY_VALUE = 'CHANGE_WORKFLOW_ROOT_KEY_VALUE';//编辑字段
export const RESET_WORKFLOW_STEP = 'RESET_WORKFLOW_STEP';//编辑字段
export const REMOVE_WORKFLOW_STEP_TRIGGER_CONDITION_OR_NOTIFY = 'REMOVE_WORKFLOW_STEP_TRIGGER_CONDITION_OR_NOTIFY';//移除触发条件
export const COPY_WORKFLOW = 'COPY_WORKFLOW';//增加流程
export const CHANGE_WORKFLOW_NAME = 'CHANGE_WORKFLOW_NAME';//修改流程名称


//银行账号 支付方式
export const GET_BANK_LIST = 'GET_BANK_LIST';//获取银行列表
export const GET_BANK_ACCOUNT_LIST = 'GET_BANK_ACCOUNT_LIST';//获取银行账号列表
export const GET_PAY_METHOD_LIST = 'GET_PAY_METHOD_LIST';//获取支付方式列表
export const UPDATE_BAP_TABLE_DATA = 'UPDATE_BAP_TABLE_DATA';//获取支付方式列表
export const CHANGE_FILE_TAB = 'CHANGE_FILE_TAB';//修改tab
export const CHANGE_FILE_EDITING_FLAG = 'CHANGE_FILE_EDITING_FLAG';//修改修改标识
export const CHANGE_TO_ORIGIN = 'CHANGE_TO_ORIGIN';//修改到原始数据
export const ADD_BAP_TABLE_DATA = 'ADD_BAP_TABLE_DATA';//增加表格数据
export const DELETE_BAP_TABLE_DATA = 'DELETE_BAP_TABLE_DATA';//删除表格数据

/*单据类型 */
export const BILLINGSTYLE_ADDSTYLE = 'BILLINGSTYLE_ADDSTYLE';//新增类型
export const BILLINGSTYLE_GETDEFAULTSETTING = 'BILLINGSTYLE_GETDEFAULTSETTING';//获取默认模板设置
export const BILLINGSTYLE_GETAPPLIACATIONSETTING = 'BILLINGSTYLE_GETAPPLIACATIONSETTING';//获取已经设置过的设置项
export const BILLINGSTYLE_GETLEFTMENU = 'BILLINGSTYLE_GETLEFTMENU';//读取已经设置的单据类型的左侧列表
export const BILLINGSTYLE_SROTEDSETTINGDATA = 'BILLINGSTYLE_SROTEDSETTINGDATA';//拖拽重排
export const BILLINGSTYLE_DELETESETTINGDATA = 'BILLINGSTYLE_DELETESETTINGDATA';//删除设置项
export const BILLINGSTYLE_CHANGEBILLNAME = 'BILLINGSTYLE_CHANGEBILLNAME';//改变单据名称
export const BILLINGSTYLE_CHANGEBILLNAMEINPUT = 'BILLINGSTYLE_CHANGEBILLNAMEINPUT'
export const BILLINGSTYLE_CHECKEDSETTINGDATAITEM = 'BILLINGSTYLE_CHECKEDSETTINGDATAITEM'//改变必填项
export const BILLINGSTYLE_CHANGEBASICCHECKALL = 'BILLINGSTYLE_CHANGEBASICCHECKALL'//基础设置全选
export const BILLINGSTYLE_GETFILEDATA = 'BILLINGSTYLE_GETFILEDATA'//档案关联
export const BILLINGSTYLE_RELATETYPE = 'BILLINGSTYLE_RELATETYPE' //获取申请单关联报销单类型
export const BILLINGSTYLE_RELATEBAOXIAOBILL = 'BILLINGSTYLE_RELATEBAOXIAOBILL' //改变申请单关联报销单类型
export const BILLINGSTYLE_CUSTOMBASEDEFINE = 'BILLINGSTYLE_CUSTOMBASEDEFINE'//获取自定义档案枚举值
export const BILLINGSTYLE_CHANGEHIGHDATASTYLE = 'BILLINGSTYLE_CHANGEHIGHDATASTYLE'//改变高级设置数据类型
export const BILLINGSTYLE_CANCLESETTING = 'BILLINGSTYLE_CANCLESETTING' //取消单据设置
export const BILLINGSTYLE_CHANGELIMITLOANAMOUNT = 'BILLINGSTYLE_CHANGELIMITLOANAMOUNT' //允许冲借款金额大于报销金额 
export const BILLINGSTYLE_CHANGEDISPLAYBYEXPENSE = 'BILLINGSTYLE_CHANGEDISPLAYBYEXPENSE' //查看方式
//单据-单据录入规则
export const ENTRY_BILL_RULE_GET_BILL_RULE_LIST = 'ENTRY_BILL_RULE_GET_BILL_RULE_LIST';
export const ENTRY_BILL_RULE_GET_DISABLED_BILL_RULE_LIST = 'ENTRY_BILL_RULE_GET_DISABLED_BILL_RULE_LIST';
export const ENTRY_BILL_RULE_GET_BILL_RULE_LIST_SUCCESS = 'ENTRY_BILL_RULE_GET_BILL_RULE_LIST_SUCCESS';
export const ENTRY_BILL_RULE_GET_DISABLED_BILL_RULE_LIST_SUCCESS = 'ENTRY_BILL_RULE_GET_DISABLED_BILL_RULE_LIST_SUCCESS';
export const ENTRY_BILL_RULE_GET_BILL_TYPES = 'ENTRY_BILL_RULE_GET_BILL_TYPES';
export const ENTRY_BILL_RULE_GET_BILL_TYPES_SUCCESS = 'ENTRY_BILL_RULE_GET_BILL_TYPES_SUCCESS';
export const ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_TITLE = 'ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_TITLE';
export const ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_BODY = 'constENTRY_BILL_RULE_GET_CAN_USE_ITEMS_BODY';
export const ENTRY_BILL_RULE_EDIT_OR_ADD_SAVE_FLAG = 'ENTRY_BILL_RULE_EDIT_OR_ADD_SAVE_FLAG';
export const ENTRY_BILL_RULE_GET_BILL_RULE = 'ENTRY_BILL_RULE_GET_BILL_RULE';
export const ENTRY_BILL_RULE_DETAIL_BILL_HEAD = 'ENTRY_BILL_RULE_DETAIL_BILL_HEAD';
export const ENTRY_BILL_RULE_DETAIL_BILL_BODY = 'ENTRY_BILL_RULE_DETAIL_BILL_BODY';
export const ENTRY_BILL_RULE_DETAIL_BILL_HEAD_SUCCESS = 'ENTRY_BILL_RULE_DETAIL_BILL_HEAD_SUCCESS';
export const ENTRY_BILL_RULE_DETAIL_BILL_BODY_SUCCESS = 'ENTRY_BILL_RULE_DETAIL_BILL_BODY_SUCCESS';
export const ENTRY_BILL_RULE_DETAIL_HEAD_TIEMS = 'ENTRY_BILL_RULE_DETAIL_HEAD_TIEMS';
export const ENTRY_BILL_RULE_DETAIL_BODY_TIEMS = 'ENTRY_BILL_RULE_DETAIL_BODY_TIEMS';
export const ENTRY_BILL_RULE_DETAIL_HEAD_TIEMS_SUCCESS = 'ENTRY_BILL_RULE_DETAIL_HEAD_TIEMS_SUCCESS';
export const ENTRY_BILL_RULE_DETAIL_BODY_TIEMS_SUCCESS = 'ENTRY_BILL_RULE_DETAIL_BODY_TIEMS_SUCCESS';
export const ENTRY_BILL_RULE_SAVE_BILL_RULE_DETAILS_SUCCESS = 'ENTRY_BILL_RULE_SAVE_BILL_RULE_DETAILS_SUCCESS';
export const ENTRY_BILL_RULE_SELECTED_RULE = 'ENTRY_BILL_RULE_SELECTED_RULE';
export const ENTRY_BILL_RULE_GET_MINOR_BILL_TYPE = 'ENTRY_BILL_RULE_GET_MINOR_BILL_TYPE';
export const ENTRY_BILL_RULE_DELETE_RULE_SUCCESS = 'ENTRY_BILL_RULE_DELETE_RULE_SUCCESS';


//一次性获取档案关联枚举值
export const BILLINGSTYLE_GETFILEDATA_StaffItem = 'BILLINGSTYLE_GETFILEDATA_StaffItem'
export const BILLINGSTYLE_GETFILEDATA_Department = 'BILLINGSTYLE_GETFILEDATA_Department'
export const BILLINGSTYLE_GETFILEDATA_ExpenseItem = 'BILLINGSTYLE_GETFILEDATA_ExpenseItem'
export const BILLINGSTYLE_GETFILEDATA_City = 'BILLINGSTYLE_GETFILEDATA_City'
export const BILLINGSTYLE_GETFILEDATA_Transport = 'BILLINGSTYLE_GETFILEDATA_Transport'
export const BILLINGSTYLE_GETFILEDATA_Country = 'BILLINGSTYLE_GETFILEDATA_Country'
export const BILLINGSTYLE_GETFILEDATA_DisburseClass = 'BILLINGSTYLE_GETFILEDATA_DisburseClass'
export const BILLINGSTYLE_GETFILEDATA_Supplier = 'BILLINGSTYLE_GETFILEDATA_Supplier'
export const BILLINGSTYLE_CHANGELEFTMENUDATA = 'BILLINGSTYLE_CHANGELEFTMENUDATA' //改变左侧菜单增加
export const BILLINGSTYLE_CHANGELEFTMENUDATADELETE = 'BILLINGSTYLE_CHANGELEFTMENUDATADELETE'// 改变左侧菜单删除
export const BILLINGSTYLE_CHANGEAUTOTRANSCHECK = 'BILLINGSTYLE_CHANGEAUTOTRANSCHECK'//改变是否自动生成
export const BILLINGSTYLE_CHANGEBILLISUSED = 'BILLINGSTYLE_CHANGEBILLISUSED' //改变是否启用
export const BILLINGSTYLE_SAVESETTINGDATA = 'BILLINGSTYLE_SAVESETTINGDATA' //保存设置项
export const BILLINGSTYLE_HAVEBEENEDITED = 'BILLINGSTYLE_HAVEBEENEDITED' //判断是否被编辑过
export const BILLINGSTYLE_CHANGEUSEBUDGET = 'BILLINGSTYLE_CHANGEUSEBUDGET'//改变占用预算
export const BILLINGSTYLE_CHANGEISREVERSAL = 'BILLINGSTYLE_CHANGEISREVERSAL'
export const BILLINGSTYLE_CHANGEAUTOGENVOUCHER = 'BILLINGSTYLE_CHANGEAUTOGENVOUCHER'
export const BILLINGSTYLE_CHANGECANDELETEAFTERAPPROVAL = 'BILLINGSTYLE_CHANGECANDELETEAFTERAPPROVAL'
export const BILLINGSTYLE_CHANGEFROMAPPLICATION = 'BILLINGSTYLE_CHANGEFROMAPPLICATION'
export const BILLINGSTYLE_CHANGEAPPROVALDEFINEAUTHOR = 'BILLINGSTYLE_CHANGEAPPROVALDEFINEAUTHOR'//改变审批流发起人
export const BILLINGSTYLE_CLOSEBILLLIST = 'BILLINGSTYLE_CLOSEBILLLIST' //删除申请单列表条目
export const BILLINGSTYLE_GETDIGESTTEMPLATES = 'BILLINGSTYLE_GETDIGESTTEMPLATES' //获取摘要定义模板列表
export const REPORTTYLE_CHANGECHARGESTYLE = 'REPORTTYLE_CHANGECHARGESTYLE' //修改报销单的支付类型
export const REPORTTYLE_CHANGECHARGESTYLECHECKBOX = 'REPORTTYLE_CHANGECHARGESTYLECHECKBOX'//修改费用列表的复选框
export const REPORTTYLE_DRAGCHARGESTYLEITEM = 'REPORTTYLE_DRAGCHARGESTYLEITEM' //拖拽费用类型项目
export const BILLINGSTYLE_GETDISBURSECLASSES = 'BILLINGSTYLE_GETDISBURSECLASSES' //获取支出类型可选范围
export const BILLINGSTYLE_GETCHARGELISTDATA = 'BILLINGSTYLE_GETCHARGELISTDATA' //获取费用类型列表
export const BILLINGSTYLE_CHANGEBILLNAMEDONE = 'BILLINGSTYLE_CHANGEBILLNAMEDONE'
// 测试


// 通用树
export const TREE_GET_DATA = 'TREE_GET_DATA';
export const TREE_GET_PAGE = 'TREE_GET_PAGE';
export const TREE_ClEAR = 'TREE_ClEAR';

//资金来源
export const SOURCE_OF_FUND_GET_DATA = 'SOURCE_OF_FUND_GET_DATA';
export const SOURCE_OF_FUND_GET_DATA_SUCCESS = 'SOURCE_OF_FUND_GET_DATA_SUCCESS';
export const SOURCE_OF_FUND_EDIT = 'SOURCE_OF_FUND_EDIT';
export const SOURCE_OF_FUND_ADD = 'SOURCE_OF_FUND_ADD';
export const SOURCE_OF_FUND_SAVE_SUCCESS = 'SOURCE_OF_FUND_SAVE_SUCCESS';
export const SOURCE_OF_FUND_SAVE_FAIL = 'SOURCE_OF_FUND_SAVE_FAIL';

//费用类型 
export const EXPENSETYPE_GETTICKETLIST = 'EXPENSETYPE_GETTICKETLIST' //获取交易费用类型
export const EXPENSETYPE_GETTICKETLIST_LOADING = 'EXPENSETYPE_GETTICKETLIST_LOADING' //获取交易费用类型开始
export const EXPENSETYPE_CHOSECHARGESTYLE = 'EXPENSETYPE_CHOSECHARGESTYLE' //改变对应的费用类型
export const EXPENSETYPE_CHARGESTYLE_TEMPLATELIST = 'EXPENSETYPE_CHARGESTYLE_TEMPLATELIST' //点击+号
export const EXPENSETYPE_CHARGESTYLE_EXPENSELIST = 'EXPENSETYPE_CHARGESTYLE_EXPENSELIST'
export const EXPENSETYPE_VIEW_DEFINES = 'EXPENSETYPE_VIEW_DEFINES'//获取已经定义的费用类型详情信息
export const EXPENSESTYLE_GETDEFAULTSETTING = 'EXPENSESTYLE_GETDEFAULTSETTING' //获取预制模板详情信息
export const EXPENSESTYLE_CUSTOMBASEDEFINE = 'EXPENSESTYLE_CUSTOMBASEDEFINE'//获取自定义档案枚举值
//一次性获取档案关联枚举值
export const EXPENSESTYLE_GETFILEDATA_StaffItem = 'EXPENSESTYLE_GETFILEDATA_StaffItem'
export const EXPENSESTYLE_GETFILEDATA_Department = 'EXPENSESTYLE_GETFILEDATA_Department'
export const EXPENSESTYLE_GETFILEDATA_ExpenseItem = 'EXPENSESTYLE_GETFILEDATA_ExpenseItem'
export const EXPENSESTYLE_GETFILEDATA_City = 'EXPENSESTYLE_GETFILEDATA_City'
export const EXPENSESTYLE_GETFILEDATA_Transport = 'EXPENSESTYLE_GETFILEDATA_Transport'
export const EXPENSESTYLE_GETFILEDATA_Country = 'EXPENSESTYLE_GETFILEDATA_Country'
export const EXPENSESTYLE_GETFILEDATA_DisburseClass = 'EXPENSESTYLE_GETFILEDATA_DisburseClass'
export const EXPENSESTYLE_GETFILEDATA_Supplier = 'EXPENSESTYLE_GETFILEDATA_Supplier'
export const EXPENSETYPE_CHANGELEFTLIST = 'EXPENSETYPE_CHANGELEFTLIST' //更新左侧菜单
export const EXPENSESTYLE_CHAGEISUED = 'EXPENSESTYLE_CHAGEISUED' //改变是否启用
export const EXPENSETYPE_CHANGEBILLNAME = 'EXPENSETYPE_CHANGEBILLNAME' //改变费用类型名称
export const EXPENSETYPE_CHANGELEFTLISTNAME = 'EXPENSETYPE_CHANGELEFTLISTNAME' //改变左侧菜单名称
export const EXPENSETYPE_CHANGEISREQUIRED = 'EXPENSETYPE_CHANGEISREQUIRED' //改变是否必填
export const EXPENSETYPE_DELETEEDITITEM = 'EXPENSETYPE_DELETEEDITITEM' //删除表头字段
export const EXPENSETYPE_DRAGINORITITEM = 'EXPENSETYPE_DRAGINORITITEM' //拖拽表头字段
export const EXPENSESTYLE_DELETECHARGESTYLE = 'EXPENSESTYLE_DELETECHARGESTYLE' //删除费用类型
export const EXPENSESTYLE_CHANGEBASICCHECK = 'EXPENSESTYLE_CHANGEBASICCHECK' //基础设置单选
export const EXPENSESTYLE_CHANGEHIGHSELECT = 'EXPENSESTYLE_CHANGEHIGHSELECT' //改变高级设置的下拉框
export const EXPENSESTYLE_CHANGECANVATDEDUCT = 'EXPENSESTYLE_CHANGECANVATDEDUCT' //改变进项税允许抵扣
export const EXPENSESTYLE_CHANGEISPOPULAR = 'EXPENSESTYLE_CHANGEISPOPULAR'//改变员工常用
export const EXPENSESTYLE_SAVESETTINGDATA = 'EXPENSESTYLE_SAVESETTINGDATA' //保存费用类型
export const EXPENSESTYLE_CHANGEDISPNAME = 'EXPENSESTYLE_CHANGEDISPNAME' //修改设置项的内容
export const EXPENSETYPE_HAVEBEENEDITED = 'EXPENSETYPE_HAVEBEENEDITED' //做过修改
export const EXPENSETYPE_CHANGEBILLNAMEDONE = 'EXPENSETYPE_CHANGEBILLNAMEDONE'
export const EXPENSETYPE_CANCLESETTING = 'EXPENSETYPE_CANCLESETTING' //取消修改
export const EXPENSESTYLE_GETEXPENSETEMPLATE = 'EXPENSESTYLE_GETEXPENSETEMPLATE'
//岗位
export const POSITION_GET_DATA = 'POSITION_GET_DATA';
export const POSITION_SAVE_FAIL = 'POSITION_SAVE_FAIL';
export const POSITION_SAVE_SUCCESS = 'POSITION_SAVE_SUCCESS';
export const POSITION_ADD = 'POSITION_ADD';
export const POSITION_EDIT = 'POSITION_EDIT';

//审批额度
export const APPROVE_LIMIT_GET_DATA = 'APPROVE_LIMIT_GET_DATA';
export const APPROVE_LIMIT_EDIT = 'APPROVE_LIMIT_EDIT';
export const APPROVE_LIMIT_ADD = 'APPROVE_LIMIT_ADD';
export const APPROVE_LIMIT_SAVE_SUCCESS = 'APPROVE_LIMIT_SAVE_SUCCESS';
export const APPROVE_LIMIT_SAVE_FAIL = 'APPROVE_LIMIT_SAVE_FAIL';
export const APPROVE_LIMIT_POSITION_GET_DATA = 'APPROVE_LIMIT_POSITION_GET_DATA';

//自定义档案
export const CUSTOM_GET_DATA = 'CUSTOM_GET_DATA';//获取自定义档案的数据
export const CUSTOM_FUND_EDIT = 'CUSTOM_FUND_EDIT';//是否编辑记录
export const SHOW_CUSTOM_EXPAND_MODAL = 'SHOW_CUSTOM_EXPAND_MODAL';//是否显示自定义扩展栏
export const CHANGE_CUSTOM_EXPAND_LIST = 'CHANGE_CUSTOM_EXPAND_LIST';//修改自定义扩展栏
export const CUSTOM_EDIT_CUSTOMS = 'CUSTOM_EDIT_CUSTOMS';//是否编辑自定义档案
export const CUSTOM_INDEX = 'CUSTOM_INDEX';//，列表数据索引
export const CUSTOM_FUND_ADD = 'CUSTOM_FUND_ADD';//新增记录
export const CUSTOM_SAVE_SUCCESS = 'CUSTOM_SAVE_SUCCESS';//保存成功
export const CUSTOM_SAVE_FAIL = 'CUSTOM_SAVE_FAIL';//保存失败
export const CHANGE_REMARK = 'CHANGE_REMARK';//修改remrk值
export const CHANGE_NAME = 'CHANGE_NAME';//修改name值
export const CHANGE_ISPUBLIC = 'CHANGE_ISPUBLIC';//修改isPublic值
export const CHANGE_ISUSED_CUSTOMTILES = 'CHANGE_ISUSED_CUSTOMTILES';//修改isUsed
export const DELETE_TABLE_DATA = 'DELETE_TABLE_DATA';//删除档案列表
export const CHANGE_CUSTOM_STAFFID = 'CHANGE_CUSTOM_STAFFID';//修改自定义档案里面的选择
export const SEARCH_TABLE_DATA = 'SEARCH_TABLE_DATA';//
export const ADD_NEW_CUSTOM = 'ADD_NEW_CUSTOM';//是否新增档案

//管理参数配置
export const CONFIGURATION_GET_DATA = 'CONFIGURATION_GET_DATA';//获取公司信息
export const CONFIGURATION_FOUND_EDITING = 'CONFIGURATION_FOUND_EDITING';//是否编辑管理参数配置
export const CONFIGURATION_UPDATE_DATA = 'CONFIGURATION_UPDATE_DATA';//获取公司信息
export const CONFIGURATION_SELECT_DATA = 'CONFIGURATION_SELECT_DATA';//修改选择框里面的值
export const CONFIGURATION_TYPE_CHANGE = 'CONFIGURATION_TYPE_CHANGE';//修改type的switch
export const CONFIGURATION_DATE_CHANGE = 'CONFIGURATION_DATE_CHANGE';//修改date的switch
export const CONFIGURATION_DATA_CHANGE = 'CONFIGURATION_DATA_CHANGE';//修改数字

//公司信息
export const COMPANYINFOR_GETINFOR = 'COMPANYINFOR_GETINFOR' //获取公司信息 
export const COMPANYINFOR_GETLOGO = 'COMPANYINFOR_GETLOGO' //获取公司logo
export const COMPANYINFOR_GETLOGO_DEFAULT = 'COMPANYINFOR_GETLOGO_DEFAULT' //获取公司默认logo
export const COMPANYINFOR_CLICKEDIT = 'COMPANYINFOR_CLICKEDIT' //点击编辑按钮
export const COMPANYINFOR_ADDUPLODPIC = 'COMPANYINFOR_ADDUPLODPIC' //添加资质图片
export const COMPANYINFOR_SUBMITCHECK = 'COMPANYINFOR_SUBMITCHECK' //提交核验
export const COMPANYINFOR_CLICKCANCLE = 'COMPANYINFOR_CLICKCANCLE' //取消
export const COMPANYINFOR_DELETETAXPIC = 'COMPANYINFOR_DELETETAXPIC' //删除上传图片
export const COMPANYINFOR_CHANGEINFOR = 'COMPANYINFOR_CHANGEINFOR' //修改公司信息
export const COMPANYINFOR_SAVECOMPANYINFOR = 'COMPANYINFOR_SAVECOMPANYINFOR' //保存信息
export const COMPANYINFOR_ISEDITED = 'COMPANYINFOR_ISEDITED'//是否编辑了
export const COMPANYINFOR_ADDUPLODPIC_UPDATEINIT = 'COMPANYINFOR_ADDUPLODPIC_UPDATEINIT'
export const COMPANYINFOR_DELETETAXPIC_UPDATEINIT = 'COMPANYINFOR_DELETETAXPIC_UPDATEINIT'
//首页
export const HOMEPAGE_GET_DEPARTMENT_STAFF = 'HOMEPAGE_GET_DEPARTMENT_STAFF';//获取部门成员列表
export const HOMEPAGE_INVITE_STAFFS = 'HOMEPAGE_INVITE_STAFFS';//邀请人员
export const HOMEPAGE_GO_XIN = 'HOMEPAGE_GO_XIN';//跳转到新手引导
export const HOMEPAGE_GO_SOU = 'HOMEPAGE_GO_SOU';//返回到首页
export const HOMEPAGE_EDIT_BEGIN = 'HOMEPAGE_EDIT_BEGIN';//开始编辑
export const CHANGE_RADIO = 'CHANGE_RADIO';//单选框的选择
export const CHANGE_CLICK = 'CHANGE_CLICK';//点击确定改变的状态
export const HOMEPAGE_PUT_SELECT = 'HOMEPAGE_PUT_SELECT';//PUT修改的行业信息
export const COMPANYINFOR_INFOR = 'COMPANYINFOR_INFOR' //获取公司信息

//预算控制方案
export const BUDGET_GETBUDGETPLANLIST = 'BUDGET_GETBUDGETPLANLIST' //获取预算控制方案
export const BUDGET_GETBUDGETPLANDETAIL = 'BUDGET_GETBUDGETPLANDETAIL' //获取控制档案详情
export const BUDGETCONTROL_ADDCASE = 'BUDGETCONTROL_ADDCASE' //新增预算控制方案
export const BUDGETCONTROL_ROWDATACHANGE = 'BUDGETCONTROL_ROWDATACHANGE' //改变数据table行数据
export const BUDGETCONTROL_CHECKEDDIMENSIONDATA = 'BUDGETCONTROL_CHECKEDDIMENSIONDATA' //改变控制维度
export const BUDGETCONTROL_SELECTDISBURSE = 'BUDGETCONTROL_SELECTDISBURSE' //改变支出类型
export const BUDGETCONTROL_CHANGECOLUMNDATASOURCE = 'BUDGETCONTROL_CHANGECOLUMNDATASOURCE' //动态改变表头以及数据
export const BUDGETCONTROL_CLICKADDTABLEITEM = 'BUDGETCONTROL_CLICKADDTABLEITEM' //新增表格行
export const BUDGETCONTROL_CLICKDELETETABLEITEM = 'BUDGETCONTROL_CLICKDELETETABLEITEM' //删除表格行
export const BUDGETCONTROL_ONSELECTCHANGE = 'BUDGETCONTROL_ONSELECTCHANGE' //选择表格行
export const BUDGET_GETBUDGETDIMENSIONREFINFO = 'BUDGET_GETBUDGETDIMENSIONREFINFO' //获取维度定义
export const BUDGETCONTROL_CHANGESWITCHBTN = 'BUDGETCONTROL_CHANGESWITCHBTN'//启用停用开关
export const BUDGETCONTROL_CLICKEDITBTN = 'BUDGETCONTROL_CLICKEDITBTN' //编辑按钮
export const BUDGETCONTROL_CHANGEBUDGETNAME = 'BUDGETCONTROL_CHANGEBUDGETNAME' //修改方案名称
export const BUDGETCONTROL_CHANGEDIMENSIONREFS = 'BUDGETCONTROL_CHANGEDIMENSIONREFS' //改变预算控制维度勾选
export const BUDGETCONTROL_CHANGEORIGINCOLUMNDATASOURCE = 'BUDGETCONTROL_CHANGEORIGINCOLUMNDATASOURCE'//存储初始表头以及数据
export const BUDGETCONTROL_CLICKEDITPAGECANCLEBTN = 'BUDGETCONTROL_CLICKEDITPAGECANCLEBTN' //取消编辑态
export const BUDGETCONTROL_CLICKADDPAGECANCLEBTN = 'BUDGETCONTROL_CLICKADDPAGECANCLEBTN' //取消编辑态
export const BUDGETCONTROL_CHANGEBUDGETLIST = 'BUDGETCONTROL_CHANGEBUDGETLIST' //修改左侧控制方案列表
export const BUDGETCONTROL_CLICKCANCLEBTN = 'BUDGETCONTROL_CLICKCANCLEBTN' //取消编辑态

//预算申请权限分配
export const BUDGETAUTHORITY_SHOWBUDGETAUTHORITY = 'BUDGETAUTHORITY_SHOWBUDGETAUTHORITY'
//预算申请单类型
export const BUDGET_REQUISITION_TYPE_GET_DIMENSION_LIST = 'BUDGET_REQUISITION_TYPE_GET_DIMENSION_LIST';//获取预算维度定义列表
export const BUDGET_REQUISITION_TYPE__GET_TEMPLATE_LIST = 'BUDGET_REQUISITION_TYPE__GET_TEMPLATE_LIST'; //获取预算编制类型定义模板列表
export const BUDGET_REQUISITION_TYPE_CHOOSE_TEMPLATE = 'BUDGET_REQUISITION_TYPE_CHOOSE_TEMPLATE';//选择预算表模版
export const BUDGET_REQUISITION_TYPE__GET_TEMPLATE_DETAIL = 'BUDGET_REQUISITION_TYPE__GET_TEMPLATE_DETAIL'; ////获取预算编制类型定义模板具体数据
export const BUDGET_REQUISITION_TYPE__GET_BUDGET_CLASS_LIST = 'BUDGET_REQUISITION_TYPE__GET_BUDGET_CLASS_LIST';//读取预算编制类型定义列表
export const BUDGET_REQUISITION_TYPE__CHOOSED_BUDGET_REQUITION_TYPE = 'BUDGET_REQUISITION_TYPE__CHOOSED_BUDGET_REQUITION_TYPE';//选中的预算申请单类型
export const BUDGET_REQUISITION_TYPE__SWITCH_IS_USED = 'BUDGET_REQUISITION_TYPE__SWITCH_IS_USED';//预算申请单类型启用停用开关
export const BUDGET_REQUISITION_TYPE_EDIT_NAME = 'BUDGET_REQUISITION_TYPE_EDIT_NAME'; //编辑预算申请单类型名字
export const BUDGET_REQUISITION_TYPE_CONTROL_HTML_TYPE = 'BUDGET_REQUISITION_TYPE_CONTROL_HTML_TYPE'; //控制编辑态html显示
export const BUDGET_REQUISITION_TYPE_READ_BUDGET_CLASS = 'BUDGET_REQUISITION_TYPE_READ_BUDGET_CLASS';//读取类型定义
export const BUDGET_REQUISITION_TYPE_ADD_BUDGET_CLASS_LIST = 'BUDGET_REQUISITION_TYPE_ADD_BUDGET_CLASS_LIST'; //新增预算类型列表
export const BUDGET_REQUISITION_TYPE_GET_BUDGET_PLANS_LIST = 'BUDGET_REQUISITION_TYPE_GET_BUDGET_PLANS_LIST'; //获取预算编制方案列表
export const BUDGET_REQUISITION_TYPE_BUDGET_KIND_CHANGE = 'BUDGET_REQUISITION_TYPE_BUDGET_KIND_CHANGE';//预算编制期间改变
export const BUDGET_REQUISITION_TYPE_BUDGET_CONFIG_PLANS = 'BUDGET_REQUISITION_TYPE_BUDGET_CONFIG_PLANS'; //预算控制方案改变
export const BUDGET_REQUISITION_TYPE_EDIT_TABLE_HEADER = 'BUDGET_REQUISITION_TYPE_EDIT_TABLE_HEADER'; //编辑表头