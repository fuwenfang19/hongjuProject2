/**
 * Created by uncle on 2017/3/16.
 */

export const BIG_TYPE = {
	2: '申请单',
	3: '报销单',
	15: '还款单',
	7: '订票单',
}

export const DATATYPE = {
	BASE_CONDITIONS: 'base_conditions',
	HIGH_CONDITIONS: 'high_conditions',
	BASE_STEPS: 'base_steps',
	HIGH_STEPS: 'high_steps',
	BASE_TRIGGER_CONDITIONS: 'base_trigger_conditions',
	HIGH_TRIGGER_CONDITIONS: 'high_trigger_conditions',
	BASE_NOTIFY: 'base_NOTIFY',
	HIGH_NOTIFY: 'high_NOTIFY',
};

export const DTYPE = {
	NOT_SHOW: -1,//不显示
	CUSTOM: 0,//自定义条件 文本框
	YES_OR_NO: 1,//是或者否 下拉
	ONE_DIGITS_NUMBER: 2,//一位小数
	TWO_DIGITS_NUMBER: 3,//两位小数
	DEPARTMENTS: 4,//部门档案参照
	POSITION: 5,//岗位参照
	ADVICE_CONDITION: 6,//提交人是否需要审批
	PROJECT: 7,//项目档案参照
	STAFF: 8,//人员档案参照
	COMPANY: 9,//公司档案参照
	FUND_SOURCE: 10,//资金来源档案参照
	EXPENSE_RULE: 11,//报销标准（设置过报销标准的费用列表）
};

export const DTYPE_WHICH_FILE = {
	//	// department position project staff company fundSource
	[DTYPE.DEPARTMENTS]: 'department',
	[DTYPE.POSITION]: 'station',
	[DTYPE.PROJECT]: 'project',
	[DTYPE.STAFF]: 'staff',
	[DTYPE.COMPANY]: 'group',
	[DTYPE.FUND_SOURCE]: 'fundSource',
};

export const OTYPE = {
	NOT_SHOW: -1,//不显示
	FIXED: 0,//固定条件
	STAFF: 1,//人员参照 单选
	POSITIONS: 2,//岗位参照 多选
	POSITION: 3,//岗位参照 单选
};

export const OTYPE_WHICH_FILE = {
	[OTYPE.STAFF]: 'staff',
	[OTYPE.POSITIONS]: 'station',
	[OTYPE.POSITION]: 'station',
};

export const BASE_START_CONDITION_FLAG = 'typical1';
export const BASE_TRIGGER_CONDITION_FLAG = 'typical2';
export const BASE_STEP_FLAG = 'typical1';
export const BASE_NOTIFY_FLAG = 'typical2';

export const HIGH_START_CONDITION_ORDER_FLAG = 'order1';
export const HIGH_TRIGGER_CONDITION_ORDER_FLAG = 'order2';
export const HIGH_STEP_ORDER_FLAG = 'order1';
export const HIGH_NOTIFY_ORDER_FLAG = 'order2';



