/**
 * Created by yangyfe on 2017/4/6.
 */
import * as types from '../../actions/actionTypes';
import Immutable from 'immutable';
import NetWork from '../../global/utils/network';
import {Toast} from '../../components/common';
import api from '../../global/utils/api';

const $$initialState = Immutable.fromJS({
    companyInfor:{},
    currentDepartmentStaffs:{},
    sou:true,
    condition:false,
    value:'',
});

export default function ($$state = $$initialState, action = {}) {
    switch (action.type) {
        case types.HOMEPAGE_GET_DEPARTMENT_STAFF:
            return $$state.merge({
                currentDepartmentStaffs: action.payload.returnData,
                status:action.payload.status
            });
        case types.HOMEPAGE_INVITE_STAFFS:
            return $$state.set('staffInvite', action.payload);
        case types.HOMEPAGE_GO_XIN:
            return $$state.merge({
                sou: action.payload
            });
        case types.HOMEPAGE_GO_SOU:
            return $$state.merge({
                sou: action.payload
            });
        case types.CHANGE_RADIO:
            return $$state.merge({
                value: action.payload
            });
        case types.CHANGE_CLICK:
            return $$state.merge({
                condition: action.payload
            })
        case types.COMPANYINFOR_INFOR:
            return $$state.merge({
                value:action.payload
            })
        default:
            return $$state;
    }
}

//获取部门成员
export const getDepartmentStaffsById = (status) => {
    return (dispatch, getState) => {
        // 这是人员列表的接口
        let companyId = window.getUserInfo().company;
        let url = '/organization/getstaffsforwebbyrecursivedownview/';
        let data = {"department":null,"searchtype":"treeclick","pagenum":1,"countperpage":200,"status":status,"isInvited":false}
        NetWork.get(url,data,
            (returnData) => {
                dispatch({
                    type: types.HOMEPAGE_GET_DEPARTMENT_STAFF,
                    payload: {
                        returnData:returnData,
                        status:status,
                    }
                })
                window.loading.remove();
            },
        );
    }
};
//邀请
export const homeDepartmentInvite= (staffids) => {
    return (dispatch, getState) => {
        let url = '/organization/inviteRegist/';
        let data = {"staffIds":staffids};
        NetWork.post(url,data,
            (returnData) => {
                Toast.success('邀请成功...');
                dispatch({
                    type: types.HOMEPAGE_INVITE_STAFFS,
                    payload: returnData
                });
                dispatch(getDepartmentStaffsById("正常"));
            },
            (returnData) => {
                Toast.error('此手机号已存在');
            });
    }
};


//保存修改
export const homePageSelect= (industry) => {
    return (dispatch, getState) => {
        let url = '/organization/setindustry/';
        let data = {"industry":industry};
        NetWork.put(url,data,
            (returnData) => {
                Toast.success('选择行业成功');
                dispatch({
                    type: types.HOMEPAGE_PUT_SELECT,
                    payload: returnData
                });
                dispatch(getCompany())
            },
            (returnData) => {
                Toast.error('此手机号已存在');
            });
    }
};
//获取公司信息
export const getCompany = ()=>{
    return (dispatch, getState) => {
        const companyId = window.getUserInfo().company
        NetWork.get(api.GET_COMPANYINFOR+companyId+'/',
            (returnData) => {
                returnData.isComplete = window.getUserInfo().isComplete
                dispatch({
                    type: types.COMPANYINFOR_INFOR,
                    payload: returnData.Industry
                });
                //dispatch(getCompanyLogo())
            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
}