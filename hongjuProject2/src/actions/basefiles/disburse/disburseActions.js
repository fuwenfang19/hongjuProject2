/**
 * Created by chezhanluo on 2017/3/14.
 */
//基础档案
import * as types from '../../actionTypes';
import disburseInterface from '../../../global/utils/api';
import baseFilesInterface from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';
import {Toast} from '../../../components/common';


const getProjectState = (getState) => {
    return getState().get('disburseState').toJS();
};

//项目档案界面-获取档案详情
export const getDisburseById = (projectId) => {
    return (dispatch, getState) => {
        let url = disburseInterface.DISBURSE_GET_COMPANY_DISBURSE.replace(':disburseId', projectId);
        NetWork.get(url,
            (returnData) => {
                dispatch({
                    type: types.DISBURSE_FETCH_DISBURSE,
                    payload: returnData
                });
            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
};

//支出类型编辑
export const beginEditDisburse = (editType) => {
    return {
        type: types.DISBURSE_BEGIN_EDIT_DISBURSE,
        payload: {editType: editType, editModalVisible: true}
    }
};
export const changeKeyValueOfDisburseState = (key,value) => {
	return {
		type: types.DISBURSE_CHANGE_KEY_VALUE,
		payload: {key,value}
	}
};
export const canSave = (Data) => {
    return {
        type: types.DISBURSE_CANSAVE,
        payload: {canSaveValue: Data}
    }
};
export const onFilesChange = (changeItem) => {
    return (dispatch, getState) => {
        let editingDisburse = getState().toJS().disburseState.editingDisburse;
        editingDisburse[changeItem.name] = changeItem.value;
        dispatch({
            type: types.DISBURSE_EDIT_DISBURSE,
            payload: editingDisburse
        })
    }
}
//支出类型编辑
export const beginEditDisburseOther = (editType,value) => {
    return {
        type: types.DISBURSE_BEGIN_EDIT_DISBURSE_OTHER,
        payload: {editType: editType, showEdit: value}
    }
};
//关闭弹出框
export const endEditDisburse = () => {
    return {
        type: types.DISBURSE_END_EDIT_DISBURSE,
        payload: false
    }
};
//新增或者编辑支出类型
export const addDisburse = (Data) => {
    return (dispatch, getState) => {
        let disburseState = getProjectState(getState);
        let editingDisburse = Data;
        if (disburseState.editType == 'add') {
            editingDisburse.parent = null;
        } else if (disburseState.editType == 'addChild') {
            editingDisburse.parent = disburseState.currentDisburse.code;
        } else if (disburseState.editType == 'edit') {
            dispatch(editDisburse(editingDisburse,'edit'));
            return;
        }

        let url = disburseInterface.DISBURSE_ADD_DISBURSE;
        NetWork.post(url, editingDisburse,
            (returnData) => {
                Toast.success('新增支出类型成功');
                dispatch(endEditDisburse());
                dispatch({
                    type: types.DISBURSE_ADD_DISBURSE,
                    payload: returnData
                });
                dispatch(getDisburseById(disburseState.currentDisburse.id));
                try {
                    const li = document.getElementById('click' + returnData.id);
                    li.click();
                    li.scrollIntoView(true);
                } catch (e) {

                }


            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
};
//编辑项目editingDisburse
export const editDisburse = (disburseData,type) => {
    return (dispatch, getState) => {
        if (disburseData.id == null) {
            disburseData.id = getProjectState(getState).currentDisburse.id;
        }
        let url = baseFilesInterface.DISBURSE_UPDATE_DISBURSE.replace(':disburseId', disburseData.id);
        NetWork.put(url, disburseData,
            (returnData) => {
                if(type=='edit'){
                    Toast.success('编辑支出类型'+returnData.name+'成功');
                }else {
                    Toast.success('支出类型'+returnData.name+'已'+(returnData.status=='正常'?'启用':'停用'));
                }

                dispatch({
                    type: types.DISBURSE_UPDATE_DISBURSE,
                    payload: returnData
                });
                dispatch(endEditDisburse());
                dispatch({
                    type: types.TREE_UPDATE_DISBURSE,
                    payload: returnData
                });

            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
};
export const changeDisburseStatus = (checked)=> {
    return (dispatch, getState) => {
        let disburseState = getProjectState(getState);
        disburseState.currentDisburse.status=checked ? '正常' : '停用'
        dispatch({
            type: types.DISBURSE_STATUS,
            payload: disburseState.currentDisburse
        });
        dispatch(editDisburse(disburseState.currentDisburse,'status'));

    }
};
export const changeDisableDisburseStatus = (vaule,text)=> {
    return (dispatch, getState) => {
        let baseState = getState().get('baseState').toJS();
        dispatch({
            type: types.DISABLE_DISBURSE_STATUS,
            payload: vaule
        });
        let disableReqParam = {
            company: baseState.userInfo.company,
            status: vaule?'停用':'正常',
            parentid: 0,
            namelike: text
        };
        let url = disburseInterface.DISBURSE_DISABLE_LIST;
        NetWork.get(url, disableReqParam,
            (returnData) => {
                dispatch({
                    type: types.DISABLE_DISBURSE_LIST,
                    payload: returnData
                });
            },
            (returnData) => {
                Toast.error(returnData.msg);
            });

    }
};
export const showSearchDisburse = (text,value)=> {
    return (dispatch, getState) => {
        // dispatch({
        //     type: types.DISABLE_DISBURSE_STATUS,
        //     payload: vaule
        // });
        if(text){
            let searchReqParam = {
                namelike: text,
                status: value?'停用':'正常',
            };
            let url = disburseInterface.DISBURSE_SEARCH_LIST;
            NetWork.get(url, searchReqParam,
                (returnData) => {
                    dispatch({
                        type: types.DISABLE_DISBURSE_LIST,
                        payload: returnData
                    });

                },
                (returnData) => {
                    Toast.error(returnData.msg);
                });
        }
        

    }
};

//tree
