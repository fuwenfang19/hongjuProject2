/**
 * Created by uncle on 2017/5/17.
 */
//来自后台schema的常量定义
const inputTypes = {
	SingleLine: 1,// 单行文本
	MultipleLine: 2,// 多行文本
	Calendar: 3,// 日历日期
	Transport: 4,// 交通工具
	Company: 5,// 公司
	City: 6,// 城市
	Currency: 7,// 金额
	Digital: 8,// 数字
	Time: 9,// 时间
	SeatClass: 10,// 席别
	Person: 11,// 人员
	Boolean: 12,// 布尔
	ExpenseReport: 13,// 报销单列表
	Department: 14,// 部门
	Project: 15,// 项目
	ApprovalDetail: 16,// 审批详情(预测)
	Remark: 17,// 备注文本
	Formula: 18,// 公式
	Enum: 19,// 枚举
	Custom: 20,// 自定义档案
	Schema: 21,// 实体元数据
	Country: 22,// 国家
	ObjectClass: 23,// 单据类型
	AllowanceRank: 24,// 出差补贴等级
	DisburseClass: 25,// 支出大类
	Contact: 26,// 常用联系人
	Month: 27,// 日历月份
	Percentage: 28,// 百分比
	LoanAmount: 29,// 借款冲销
	Bank: 30,// 银行
	Supplier: 31,// 供应商档案
	FundSource: 32,// 资金来源
	// Repayment   : 33    ,// 还款单
};
// 人员 部门 项目 支出类型 资金来源 供应商 自定义档案
export const inputTypesMap = {
	11: 'staff',
	14: 'department',
	15: 'project',
	25: 'disburse',
	32: 'fundSource',
	31: 'supplier',
	20: 'selfDefine',
	23: 'expenseType',
	6:'city',
	22:'country',
	4:'transport'
};

export default inputTypes;