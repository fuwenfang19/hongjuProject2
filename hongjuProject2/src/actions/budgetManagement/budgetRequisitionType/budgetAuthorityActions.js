/**
 * Created by yeyawei on 17/5/27.
 * 预算申请权限分配
 */

import * as types from '../../actionTypes';
import api from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';
import { Toast } from '../../../components/common';

export const showBudgetAuthority = (show) => {
  return (dispatch,getState) => {
    dispatch({
      type: types.BUDGETAUTHORITY_SHOWBUDGETAUTHORITY,
      payload: show
    })
  }
}
