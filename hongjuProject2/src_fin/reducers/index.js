import {combineReducers} from 'redux-immutablejs';
import baseState from './appReducer';
//待审批 已审批
import budgetUnapprovedState from './budgetUnapproved/budgetUnapprovedReducer';
import budgetApprovedState from './budgetApproved/budgetApprovedReducer';

//我的申请 budgetApplicationReducer
import budgetApplicationState from './budgetapplication/budgetApplicationReducer';
import budgetAdjustApplicationState from './budgetapplication/budgetAdjustApplicationReducer';
import budgetAppOrAdjustDetailState from './budgetapplication/budgetAppOrAdjustEditReducer';
import budgetAppOrAdjustEditState from './budgetapplication/budgetAppOrAdjustEditReducer';

const rootReducer = combineReducers({
	baseState,
	budgetUnapprovedState,
	budgetApprovedState,
	budgetApplicationState,
	budgetAdjustApplicationState,
	budgetAppOrAdjustDetailState,
	budgetAppOrAdjustEditState,
});

export default rootReducer;