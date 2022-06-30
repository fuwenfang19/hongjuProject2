/**
 * Created by chezhanluo on 2017/5/25.
 */
export const FIELDS_IN_BUDGET_DETAIL=[
    {}
];
export const FIELDS_IN_REIM_DETAIL={
    needJudge:[
        {name:'费用部门',key:'department',type:'name',isEdit:true,width:8,order:3},
        {name:'项目',key:'projectItem',type:'name',isEdit:true,width:8,order:4},
        {name:'支出类型',key:'disburseClass',type:'name',isEdit:true,width:8,order:5},
        {name:'冲销借款金额',key:'loanAmount',type:'number',isEdit:false,width:8,order:15},
        {name:'资金来源',key:'fundSource',type:'name',isEdit:false,width:8,order:21}
    ],
    noJudge:[
        {name:'录入人',key:'creater',type:'name',isEdit:false,width:8,order:1},
        {name:'业务主管',key:'manager',type:'name',isEdit:false,width:8,order:2},
        {name:'报销日期',key:'submitTime',type:'date',isEdit:false,width:8,order:6},
        {name:'单据类型',key:'reportClass',type:'name',isEdit:false,width:8,order:7},
        {name:'报销人',key:'togethers',type:'list',listKey:'name',isEdit:false,width:8,order:8},
        {name:'所属部门',key:'togetherDeptNames',type:'text',isEdit:false,width:8,order:9},
        {name:'银行账号',key:'bankAccount',type:'text',isEdit:false,width:8,order:10},
        {name:'报销金额',key:'totalAmount',type:'number',isEdit:false,width:8,order:11},
        {name:'税额',key:'sumTax',type:'null',isEdit:false,width:8,order:12},
        {name:'支付金额',key:'payAmount',type:'number',isEdit:false,width:8,order:13},
        {name:'垫付金额',key:'repaidAmount',type:'number',isEdit:false,width:8,order:14},
        {name:'供应商',key:'supplierName',type:'text',isEdit:false,width:8,order:16},
        {name:'供应商开户行',key:'supplierBank',type:'text',isEdit:false,width:8,order:17},
        {name:'供应商地址',key:'supplierAddress',type:'text',isEdit:false,width:8,order:18},
        {name:'外部人员',key:'visitors',type:'list',listKey:'name',isEdit:false,width:8,order:19},
        {name:'目的地国家',key:'toCountrys',type:'text',isEdit:false,width:8,order:20}, 
        {name:'支付状态',key:'paymentStatus',type:'name',isEdit:false,width:8,order:22},
        {name:'事由',key:'reason',type:'text',isEdit:true,width:8,order:23}
    ]
};