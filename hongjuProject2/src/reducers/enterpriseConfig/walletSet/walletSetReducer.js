/**
 * Created by yangyfe on 2017/3/30.
 */
import * as types from '../../actions/actionTypes';
import Immutable from 'immutable';
import api from '../../global/utils/api';
import NetWork from '../../global/utils/network';

const $$initialState = Immutable.fromJS({

});

export default  ($$state = $$initialState, action = {})=>{
    switch (action.type) {

        default:
            return $$state;
    }
}