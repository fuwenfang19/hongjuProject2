import Immutable from 'immutable';
import * as types from '../../../actions/actionTypes';
import api from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';

const $$initialState = Immutable.fromJS({
    positionData: [],
    editing: false,
    saveSuccess: false,
    saveFail: false,
    saveMessage: ''
});
export default ($$state = $$initialState, action = {}) => {
    switch (action.type) {
        case types.POSITION_GET_DATA:
            return $$state.merge({
                positionData: action.payload
            });
        case types.POSITION_EDIT:
            return $$state.merge({
                editing: action.payload
            });
        case types.POSITION_ADD:
            return $$state.merge({
                positionData: $$state.get('positionData').push(action.payload)
            });
        case types.POSITION_SAVE_SUCCESS:
            return $$state.set('saveSuccess', action.payload);
        case types.POSITION_SAVE_FAIL:
            return $$state.set('saveFail', action.payload).set('saveMessage', action.message);
        default:
            return $$state;
    }
}


//保存和更新
export function positionSaveData(reqParam) {
    return (dispatch) => {
        window.loading.add();
        NetWork.put(api.POSITION_GET_OR_PUT, reqParam, (json) => {
            dispatch({
                type: types.POSITION_SAVE_SUCCESS,
                payload: true
            });
            window.loading.remove();
        }, (json) => {
            dispatch({
                type: types.POSITION_SAVE_FAIL,
                payload: true,
                message: json['msg']
            });
            window.loading.remove();
        })
    }
}

//获取数据
export function getPositionData() {

    return (dispatch) => {
        window.loading.add();
        NetWork.get(api.POSITION_GET_OR_PUT, (json) => {

            dispatch({
                type: types.POSITION_GET_DATA,
                payload: json['data']
            });
            window.loading.remove();
        })
    }
}

