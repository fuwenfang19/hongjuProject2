/**
 * Created by yangyfe on 2017/3/15.
 */
import * as types from '../../actions/actionTypes';
import Immutable from 'immutable';
import NetWork from '../../global/utils/network';
import {Toast} from '../../components/common';

const getCustomState = (getState) => {
    return getState().get('customFilesState').toJS();
};
const $$initialState = Immutable.fromJS({
    CustomMembers:[{
        "name": "请输入档案名称",
        "remark": "",
        "isPublic": false,
        "childs": [{
            "code": "abc",
            "search_code": "abc",
            "name": "项目一",
            "search_name": "项目一",
            "enable": true
        }],
        "$$hashKey": "object:754"}],
    editExpand:[
        {key:1,status:false,name:'自定义扩展栏1',showName:'',dataType:'',canEdit:false},
        {key:2,status:false,name:'自定义扩展栏2',showName:'',dataType:'',canEdit:false},
        {key:3,status:false,name:'自定义扩展栏3',showName:'',dataType:'',canEdit:false},
        {key:4,status:false,name:'自定义扩展栏4',showName:'',dataType:'',canEdit:false},
        {key:5,status:false,name:'自定义扩展栏5',showName:'',dataType:'',canEdit:false},
        {key:6,status:false,name:'自定义扩展栏6',showName:'',dataType:'',canEdit:false},
        {key:7,status:false,name:'自定义扩展栏7',showName:'',dataType:'',canEdit:false},
        {key:8,status:false,name:'自定义扩展栏8',showName:'',dataType:'',canEdit:false},
        {key:9,status:false,name:'自定义扩展栏9',showName:'',dataType:'',canEdit:false},
        {key:10,status:false,name:'自定义扩展栏10',showName:'',dataType:'',canEdit:false}
    ],
    editing: false,
    saveSuccess: false,
    saveFail: false,
    saveMessage: '',
    currentIndex:0,
    staffPagenum:[],
    searchValues:[],
    showCustomExpand:false,
    addNewCustom:false
});

export default function customFilesReducer($$state = $$initialState, action = {}) {
    const state = $$state.toJS();
    const CustomMembers = $$state.get('CustomMembers').toJS();
    const currentIndex = $$state.get('currentIndex');
    let staffPagenum = $$state.get('staffPagenum');
    switch (action.type) {
        case types.ADD_NEW_CUSTOM:
            return $$state.merge({
                addNewCustom:action.payload
            });
        case types.SEARCH_TABLE_DATA:
            return $$state.merge({
                searchValues:action.payload
            })
        case types.CHANGE_CUSTOM_STAFFID:
            return $$state.set('staffPagenum', action.payload);
        // 删除数据
        case types.DELETE_TABLE_DATA:
            const currentList = CustomMembers[currentIndex].childs;
            let oldTable = currentList;
            let deleteIndex = staffPagenum.slice();
            let hasSavedData = false;
            let newTable = oldTable.filter((item, index) => {
                const delIndex = deleteIndex.indexOf(index);
                if (delIndex === -1) {
                    return true;
                } else {
                    if (item.id) {
                        hasSavedData = true;
                        return true;
                    } else {
                        deleteIndex.splice(delIndex, 1);
                    }
                }
            });
            if (hasSavedData) {
                Toast.info('已经保存过的数据不允许删除');
            }
            let newCustomMembers = CustomMembers.slice();
	          newCustomMembers[currentIndex].childs = newTable;
            return $$state.merge({'CustomMembers': newCustomMembers,'staffPagenum': deleteIndex});
        case types.CUSTOM_GET_DATA:
            if(action.payload.length === 0){
                return $$state;
            }else{
                return $$state.merge({
                CustomMembers: action.payload
            });
            }

        case types.CUSTOM_FUND_EDIT:
            return $$state.merge({
                editing: action.payload
            });
        case types.CUSTOM_INDEX:
            return $$state.merge({
                currentIndex: action.payload
            });
        case types.CUSTOM_FUND_ADD:
            let index = $$state.get('currentIndex');
            let arr = $$state.get('CustomMembers').toJS();
            let  arr2 = arr[index]['childs']
            arr2.push(action.payload)
            return $$state.merge({
                'CustomMembers':arr
            });
        case types.CUSTOM_SAVE_SUCCESS:
            return $$state.set('saveSuccess', action.payload);
        case types.CUSTOM_SAVE_FAIL:
            return $$state.set('saveFail', action.payload).set('saveMessage', action.message);
        case 'xinzeng':
            let aa =  $$state.toJS();
            aa['CustomMembers']=action.payload.concat(aa['CustomMembers']);
            aa['currentIndex'] = 0;
            return  Immutable.fromJS(aa);
        case types.CHANGE_REMARK:
            let i = $$state.get('currentIndex');
            let arr3 = $$state.get('CustomMembers').toJS();
            let arr4 = arr3[i]['remark'];
            arr4=action.payload;
            arr3[i]['remark']=arr4;
                return $$state.merge({
                    'CustomMembers':arr3
                });
        case types.CHANGE_NAME:
            let index2 = $$state.get('currentIndex');
            let arr5 = $$state.get('CustomMembers').toJS();
            let arr6 = arr5[index2]['name'];
            arr6=action.payload;
            arr5[index2]['name']=arr6;
                return $$state.merge({
                    'CustomMembers':arr5
                });
        case types.CHANGE_ISPUBLIC:
            let index3 = $$state.get('currentIndex');
            let arr7 = $$state.get('CustomMembers').toJS();
            let arr8 = arr7[index3]['isPublic'];
            arr8=action.payload;
            arr7[index3]['isPublic']=arr8;
            return $$state.merge({
                'CustomMembers':arr7
            });
        case types.CHANGE_ISUSED_CUSTOMTILES:
            let index4 = $$state.get('currentIndex');
            let arr9 = $$state.get('CustomMembers').toJS();
            let arr10 = arr9[index4]['isUsed'];
            arr10=action.payload;
            arr9[index4]['isUsed']=arr10;
            return $$state.merge({
                'CustomMembers':arr9
            });
        case types.SHOW_CUSTOM_EXPAND_MODAL:
            return $$state.merge({
                'showCustomExpand':action.payload
            }); 
        case types.CHANGE_CUSTOM_EXPAND_LIST:
            return $$state.updateIn(['editExpand', action.payload.index, action.payload.key], () => {
                return action.payload.value;
            });
        // case types.EDIT_CUSTOM_EXPAND_LIST:
        //     return $$state.updateIn(['editExpand', action.payload.index, action.payload.key], () => {
        //     return action.payload.value;
        //   });
        default:
            return $$state;
    }
}
//获取档案信息Actions
export const getCustomMembers = () => {
    return (dispatch, getState) => {
        // 这是人员列表的接口
        let url = '/expense/getcustombase/';
        NetWork.get(url,
            (returnData) => {
                dispatch({
                    type: types.CUSTOM_GET_DATA,
                    payload: returnData
                })
            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
};
//保存编辑
export function SaveEidtData(reqParam) {
    return (dispatch,getState) => {
        let index = getCustomState(getState).currentIndex;
        let data = reqParam[index];
        let id = getCustomState(getState).CustomMembers[index].id;
        let url1 = '/expense/addcustombase/';
        let url = '/expense/updatacustombase/';
        if(id){
                NetWork.post(url,data,
                (json) => {
                dispatch({
                    type: types.CUSTOM_SAVE_SUCCESS,
                    payload: true
                });
            }, (json) => {
                dispatch({
                    type: types.CUSTOM_SAVE_FAIL,
                    payload: true,
                    message: json['msg']
                });
            })
        }else{
            NetWork.post(url1,data,
                (json) => {
                dispatch({
                    type: types.CUSTOM_SAVE_SUCCESS,
                    payload: true
                });
            }, (json) => {
                dispatch({
                    type: types.CUSTOM_SAVE_FAIL,
                    payload: true,
                    message: json['msg']
                });
            })
        }

    }
}
