let budgetApplicationInterface = {
	getBudgetApplicationList: '/budget/web/budget/list/',
	getBudgetApplicationTypeList: '/expense/getobjectclassbytopclass/',
	getBudgetApplicationDefine:'/budget/budgetclass/:id/',
};
let budgetAdjustApplicationInterface = {
	getBudgetAdjustApplicationList: '/budget/web/budget/list/',
	getBudgetAdjustApplicationTypeList: '/expense/getobjectclassbytopclass/',
	getBudgetAdjustApplicationDefine:'/budget/budgetclass/:id/',
};
let budgetUnapprovedInterface = {
    getBudgetUnapprovedList:'/budget/web/budget/pendingapprovallist/',
    getBudgetUnapprovedDefine:'/budget/web/budget/pendingapprovaldetail/',
}
let budgetApprovedInterface = {
    getBudgetApprovedList:'/budget/web/budget/approvedlist/',
    getBudgetApprovedDefine:'/budget/web/budget/approveddetail/',
}
const
	api = {
		...budgetApplicationInterface,
		...budgetAdjustApplicationInterface,
		...budgetUnapprovedInterface,
		...budgetApprovedInterface,
	};

export default api;
