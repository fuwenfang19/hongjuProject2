import Immutable from 'immutable';
import * as types from '../../../actions/actionTypes';
import api from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';

const $$initialState = Immutable.fromJS({
    sourceOfFundData: [],
    getSourceOfFundDataSuccess: false,
    editing: false,
    saveSuccess: false,
    saveFail: false,
    saveMessage: ''
});
export default ($$state = $$initialState, action = {}) => {
    switch (action.type) {
        case types.SOURCE_OF_FUND_GET_DATA:
            return $$state.merge({
                sourceOfFundData: action.payload
            });
        case types.SOURCE_OF_FUND_GET_DATA_SUCCESS:
            return $$state.set('getSourceOfFundDataSuccess', action.payload);
        case types.SOURCE_OF_FUND_EDIT:
            return $$state.merge({
                editing: action.payload
            });
        case types.SOURCE_OF_FUND_ADD:
            return $$state.merge({
                sourceOfFundData: $$state.get('sourceOfFundData').push(action.payload)
            });
        case types.SOURCE_OF_FUND_SAVE_SUCCESS:
            return $$state.set('saveSuccess', action.payload);
        case types.SOURCE_OF_FUND_SAVE_FAIL:
            return $$state.set('saveFail', action.payload).set('saveMessage', action.message);
        default:
            return $$state;
    }
}


//保存和更新
export function getSourceOfFundSaveData(reqParam) {
    return (dispatch) => {
        window.loading.add();
        NetWork.post(api.GET_FUND_SOURCE_SAVE_DATA, reqParam, (json) => {
            dispatch({
                type: types.SOURCE_OF_FUND_SAVE_SUCCESS,
                payload: true
            });
            window.loading.remove();
        }, (json) => {
            dispatch({
                type: types.SOURCE_OF_FUND_SAVE_FAIL,
                payload: true,
                message: json['msg']
            });
            window.loading.remove();
        })
    }
}

//获取数据
export function getSourceOfFundData() {

    return (dispatch) => {
        dispatch({
            type: types.SOURCE_OF_FUND_GET_DATA_SUCCESS,
            payload: false
        });
        window.loading.add();
        NetWork.get(api.GET_FUND_SOURCE, { "status": null }, (json) => {
            dispatch({
                type: types.SOURCE_OF_FUND_GET_DATA,
                payload: json
            });
            dispatch({
                type: types.SOURCE_OF_FUND_GET_DATA_SUCCESS,
                payload: true
            });
            window.loading.remove();
        })
    }
}

