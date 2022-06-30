import Immutable from 'immutable';
import * as types from '../../../actions/actionTypes';
import api from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';

const $$initialState = Immutable.fromJS({
    approvelLimitData: [],
    positionData: [],
    editing: false,
    saveSuccess: false,
    saveFail: false,
    saveMessage: ''
});
export default ($$state = $$initialState, action = {}) => {
    switch (action.type) {
        case types.APPROVE_LIMIT_GET_DATA:
            return $$state.merge({
                approvelLimitData: action.payload
            });
        case types.APPROVE_LIMIT_EDIT:
            return $$state.merge({
                editing: action.payload
            });
        case types.APPROVE_LIMIT_ADD:
            return $$state.merge({
                approvelLimitData: $$state.get('approvelLimitData').push(action.payload)
            });
        case types.APPROVE_LIMIT_SAVE_SUCCESS:
            return $$state.set('saveSuccess', action.payload);
        case types.APPROVE_LIMIT_SAVE_FAIL:
            return $$state.set('saveFail', action.payload).set('saveMessage', action.message);
        case types.APPROVE_LIMIT_POSITION_GET_DATA:
            return $$state.merge({
                positionData: action.payload
            });
        default:
            return $$state;
    }
}


//保存和更新
export function approvelLimitSaveData(reqParam) {
    return (dispatch) => {
        window.loading.add();
        NetWork.put(api.APPROVEL_LIMIT_GET_OR_PUT, reqParam, (json) => {
            dispatch({
                type: types.APPROVE_LIMIT_SAVE_SUCCESS,
                payload: true
            });
            window.loading.remove();
        }, (json) => {
            dispatch({
                type: types.APPROVE_LIMIT_SAVE_FAIL,
                payload: true,
                message: json['msg']
            });
            window.loading.remove();
        })
    }
}

//获取数据
export function getApprovelLimitData() {
    return (dispatch) => {
        window.loading.add();
        NetWork.get(api.APPROVEL_LIMIT_GET_OR_PUT, (json) => {

            dispatch({
                type: types.APPROVE_LIMIT_GET_DATA,
                payload: json['data']
            });
            window.loading.remove();
        });
    }
}


//获取岗位数据
export function getPositionData() {
    window.loading.add();
    return (dispatch) => {
        NetWork.get(api.POSITION_GET_OR_PUT, (json) => {

            dispatch({
                type: types.APPROVE_LIMIT_POSITION_GET_DATA,
                payload: json['data']
            });
            window.loading.remove();

        })
    }
}