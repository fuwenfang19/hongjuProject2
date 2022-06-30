/**
 * Created by yangyfe on 2017/2/21.
 * 部门成员actions
 */
import * as types from '../actionTypes';
import * as departmentConstants from '../../constants/department/department';
import NetWork from '../../global/utils/network';
import departmentInterface from '../../global/utils/api';
import { Toast } from '../../components/common';
import moment from 'moment';

const getDepartmentState = (getState) => {
    return getState().get('departmentState').toJS();
};
export const getReqDepartmentData = (editingDepartment) => {
    for (let item in editingDepartment) {
        if (editingDepartment.hasOwnProperty(item)) {
            if (editingDepartment[item] != null && ['startDate', 'endDate'].indexOf(item) !== -1) {
                editingDepartment[item] = moment(editingDepartment[item]).format('YYYY-MM-DD');
            } else if (editingDepartment[item] != null && Object.prototype.toString.call(editingDepartment[item]) == '[object Object]') {
                editingDepartment[item] = editingDepartment[item].id;
            }
        }
    }
    return editingDepartment;
};
//部门成员界面-获取部门详情
export const getDepartmentById = (departmentId, status) => {
    return (dispatch, getState) => {
        let url = '/organization/department/' + departmentId + '/';
        let data = {"version":'2.0',"status":status}
        NetWork.get(url, data,
            (returnData) => {
                dispatch(getDepartmentMembersById(departmentId, status));
                dispatch({
                    type: types.FETCH_ALL_DEPTS,
                    payload: {
                        returnData: returnData,
                        status: status
                    }
                });
            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
};
//获取部门成员
export const getDepartmentMembersById = (departmentId, status) => {
    return (dispatch, getState) => {
        // 这是人员列表的接口
        let url = '/organization/getstaffsforwebbyrecursivedownview/';
        let pagenum = getDepartmentState(getState).currentDepartmentMembers.total;
        let data = { "version":'2.0',"department": departmentId, "searchtype": "treeclick", "pagenum": 1, "countperpage": 10000, "status": status }
        NetWork.get(url, data,
            (returnData) => {
                dispatch({
                    type: types.DEPARTMENT_MEMBERS,
                    payload: {
                        returnData: returnData,
                        status: status,
                    }
                })
                window.loading.remove();
                
            },
            (returnData) => {
                Toast.error(returnData.msg);
                window.loading.remove();
                
            });
    }
};

//获取部门成员详细信息
export const getDepartmentMembersDetailById = (keyword,code, status, pagenum, department) => {
    return (dispatch, getState) => {

        let url = '/organization/getstaffdetailsforwebbyrecursivedownview/';
        let data = {"version":'2.0',"namelike":keyword,"status": status, "department": department, "searchtype": "treeclick", "pagenum": pagenum, "countperpage": 1, "startcode": code, "islast": false }
        NetWork.get(url, data,
            (returnData) => {
                dispatch({
                    type: types.DEPARTMENT_MEMBERS_DETAILS,
                    payload: {
                        returnData: returnData.row,
                        visible: true,
                        pagenum:pagenum
                    }
                })
            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
};

//编辑部门成员的状态
export const changeEditMembersFlagDepartment = (flag) => {
    return {
        type: types.DEPARTMENT_CHANGE_EDIT_MEMBERS_FLAG,
        payload: flag
    }
};
//添加部门成员的flag
export const changeAddMembersFlagDepartment = (flag) => {
    return {
        type: types.DEPARTMENT_CHANGE_ADD_MEMBERS_FLAG,
        payload: flag
    }
};
//档案选择的flag
export const changeFileChooseFlagDepartment = (index, flag) => {
    return {
        type: types.DEPARTMENT_CHANGE_FILE_CHOOSE_FLAG,
        payload: { index: index, flag: flag }
    }
};
//档案选择的flag
export const changeFileChooseFlagDepartmentMembers = (index, flag) => {
    return {
        type: types.DEPARTMENT_CHANGE_FILE_CHOOSE_FLAG_MEMBERS,
        payload: { index: index, flag: flag }
    }
};
//sync 更新正在编辑部门的字段值
export const updateAddingDepartment = (filedData) => {
    return (dispatch, getState) => {
        dispatch({
            type: types.DEPARTMENT_UPDATE_ADDING,
            payload: filedData
        })
    }
};

//sync 更新正在批量编辑的字段值
export const batchSyncStoreDepartment = (filedData) => {
    return (dispatch, getState) => {
        dispatch({
            type: types.DEPARTMENT_BATCH_SYNC,
            payload: filedData
        })
    }
};
//开始编辑部门
export const beginEditDepartment = (editType) => {
    return {
        type: types.DEPARTMENT_BEGIN_EDIT,
        payload: { editType: editType, editModalVisible: true }
    }
};
//停止编辑部门
export const endEditDepartment = () => {
    return {
        type: types.DEPARTMENT_END_EDIT,
        payload: false
    }
};
//新增或者编辑部门
export const addDepartment = () => {
    return (dispatch, getState) => {
        let departmentState = getDepartmentState(getState);
        let editingDepartment = departmentState.editingDepartment;

        editingDepartment = getReqDepartmentData(editingDepartment);

        if (departmentState.editType == 'add') {
            editingDepartment.parent = null;
        } else if (departmentState.editType == 'addChild') {
            editingDepartment.parent = departmentState.currentDepartment.id;
        } else if (departmentState.editType == 'edit') {
            dispatch(editDepartment(editingDepartment,'edit'));
            return;
        }
        let url = departmentInterface.DEPARTMENT_ADD_DEPARTMENT;
        NetWork.post(url, editingDepartment,
            (returnData) => {
                if (departmentState.editType == 'add') {
                    Toast.success('新增部门成功...');
                } else if (departmentState.editType == 'addChild') {
                    Toast.success('新增子部门成功...');
                }
                dispatch(endEditDepartment());
                console.log(returnData,121212121)
                dispatch({
                    type: types.DEPARTMENT_ADD_DEPARTMENT,
                    payload: returnData
                });
                dispatch(getDepartmentMembersById(departmentState.currentDepartment.id, departmentState.departmentMemberSearchType));
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
//编辑部门
export const editDepartment = (departmentData,type) => {
    return (dispatch, getState) => {
        if (departmentData.id == null) {
            departmentData.id = getDepartmentState(getState).currentDepartment.id;
        }
        let departmentState = getDepartmentState(getState);
        let url = departmentInterface.DEPARTMENT_UPDATE_DEPARTMENT.replace(':departmentId', departmentData.id);
        NetWork.put(url, departmentData,
            (returnData) => {
                if(type=='edit'){
                    Toast.success('编辑部门'+returnData.name+'成功');
                }else {
                    Toast.success('部门'+returnData.name+'已'+(returnData.status=='正常'?'启用':'停用'));
                }
                dispatch({
                    type: types.TREE_UPDATE_DEPARTMENT,
                    payload: returnData
                });
                dispatch(getDepartmentById(departmentState.currentDepartment.id,departmentState.status))
                dispatch(endEditDepartment());
                dispatch({
                    type: types.DEPARTMENT_UPDATE,
                    payload: returnData
                })
            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
};

/********************************新增编辑部门成员**********************************/
//开始编辑部门成员
export const beginEditDepartmentMembers = (editMembersType) => {
    return {
        type: types.DEPARTMENT_BEGIN_EDIT_MEMBERS,
        payload: { editMembersType: editMembersType, editModalVisible: true }
    }
};
// sync 更新正在编辑 部门成员的字段值
export const updateAddingDepartmentMembers = (filedData) => {
    return (dispatch, getState) => {
        dispatch({
            type: types.DEPARTMENT_UPDATE_ADDING_MEMBERS,
            payload: filedData
        })
    }
};
//停止编辑部门成员
export const endEditDepartmentMembers = () => {
    return {
        type: types.DEPARTMENT_END_EDIT_MEMBERS,
        payload: false
    }
};
//添加成员
export const addDepartmentMembers = () => {
    return (dispatch, getState) => {
        let departmentState = getDepartmentState(getState);
        let editingDepartmentMembers = departmentState.editingDepartmentMembers;
        editingDepartmentMembers = getReqDepartmentData(editingDepartmentMembers);
        if (departmentState.editMembersType == 'editMembers') {
            dispatch(editDepartmentMembers(editingDepartmentMembers));
            return;
        }
        let url = departmentInterface.DEPARTMENT_ADD_DEPARTMENT_MEMBERS;
        NetWork.post(url,editingDepartmentMembers,
            (returnData) => {
                Toast.success('新增成员成功，请到'+returnData.department.name+'查看成员');
                dispatch(endEditDepartmentMembers());
                dispatch({
                    type: types.DEPARTMENT_ADD_DEPARTMENT_MEMBERS,
                    payload: returnData
                });
                dispatch(getDepartmentMembersById(departmentState.currentDepartment.id, departmentState.status))
                dispatch(getDepartmentMembersById(departmentState.currentDepartment.id, departmentState.departmentMemberSearchType));
                try {
                    const li = document.getElementById('click' + returnData.id);
                    li.click();
                    li.scrollIntoView(true);
                } catch (e) {

                }

            },
            (error) => {
                Toast.error(error.msg);
            });
    }

};
//保存编辑成员
export const editDepartmentMembers = (departmentMembersData) => {
    return (dispatch, getState) => {
        if (departmentMembersData.id == null) {
            departmentMembersData.id = getDepartmentState(getState).editingDepartmentMembers.id;
        }
        if(departmentMembersData.version == null){
            departmentMembersData.version = getDepartmentState(getState).version;
        }
        if(departmentMembersData.systemusedstatus == true){
            departmentMembersData.systemusedstatus = '正常'
        }else{
            departmentMembersData.systemusedstatus = '禁止'
        }
        const deptState = getState().get('departmentState').toJS();
        let url = departmentInterface.DEPARTMENT_SAVE_MEMBERS.replace(':staffId', departmentMembersData.id );
        NetWork.put(url,departmentMembersData,
            (returnData) => {
                Toast.success('编辑成功');
                dispatch(endEditDepartmentMembers());
                dispatch({
                    type: types.DEPARTMENT_CHANGE_ADD_MEMBERS_FLAG,
                    payload: returnData
                });
                dispatch(getDepartmentMembersById(deptState.currentDepartment.id, deptState.status))
                dispatch(getDepartmentMembersDetailById(null,deptState.currentDepartmentMemberDetails.code,deptState.currentDepartmentMemberDetails.status,deptState.pagenum,deptState.currentDepartment.id))
            },
            (error) => {
                Toast.error(error.msg);
            });
    }
};
//开始批量编辑成员
export const changeBatchEditDepartmentFlag = (flag) => {
    return {
        type: types.DEPARTMENT_CHANGE_BATCH_EDIT_DEPARTMENT_FLAG,
        payload: flag
    }
};
//批量编辑
export const batchEditDepartment = (departmentData) => {
    return (dispatch, getState) => {
        let url = departmentInterface.DEPARTMENT_BATCH_UPDATE_DEPARTMENT;
         const deptState = getState().get('departmentState').toJS();
        NetWork.put(url, departmentData,
            (returnData) => {
                Toast.success('保存成功...');
                dispatch({
                    type: types.DEPARTMENT_BATCH_UPDATE,
                    payload: returnData
                })
                dispatch(getDepartmentMembersById(deptState.currentDepartment.id, deptState.status))
            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
};


//离职，重新入职
export const getDepartmentQuitStaff = (staffids, entryquit) => {
    return (dispatch, getState) => {
        let url = '/organization/entryorquitstaffitemview/';
        let data = { "staffids": staffids, "type": entryquit };
        const deptState = getState().get('departmentState').toJS();

        NetWork.put(url, data,
            (returnData) => {
                if (data.type === "quit") {
                    Toast.success('离职成功...');
                    dispatch(getDepartmentMembersById(deptState.currentDepartment.id, deptState.status))
                } else {
                    Toast.success('重新入职成功...');
                    dispatch(getDepartmentMembersById(deptState.currentDepartment.id, "离职"))
                }
                dispatch({
                    type: types.DEPARTMENT_QUIT_STAFFS,
                    payload: returnData
                });
            },
            (returnData) => {
                if (data.type === "quit") {
                    Toast.error('离职失败...');
                } else {
                    Toast.error('重新入职失败...');
                }
            });
    }
};
//邀请
export const getDepartmentInvite = (staffids) => {
    return (dispatch, getState) => {
        let url = '/organization/inviteRegist/';
        let data = { "staffIds": staffids };
        NetWork.post(url, data,
            (returnData) => {
                Toast.success('邀请成功...');
                dispatch({
                    type: types.DEPARTMENT_INVITE_STAFFS,
                    payload: returnData
                });
            },
            (returnData) => {
                Toast.error('此手机号已存在');
            });
    }
};
//重置密码
export const getDepartmentReset = (staffids) => {
    return (dispatch, getState) => {
        let url = departmentInterface.DEPARTMENT_RESET;
        let data = { "department": null, "searchtype": "treeclick", "pagenum": 1, "countperpage": 10000, "status": "正常" }
        NetWork.get(url, data,
            (returnData) => {
                Toast.success('重置密码成功...');
                dispatch({
                    type: types.DEPARTMENT_RESET_PASSWORD,
                    payload: returnData
                });
            },
            (returnData) => {
                Toast.error('重置密码失败');
            });
    }
};
//查询人员
export const staffSearch = (keyword, status,department) => {
    return (dispatch, getState) => {
        let url = '/organization/getstaffsforwebbyrecursivedownview/';
        let data = { "version":"2.0","namelike": keyword, "searchtype": "treeclick", "pagenum": 1, "countperpage": 10000, "status": status,"department": department};
        const deptState = getState().get('departmentState').toJS();
        NetWork.get(url, data,
            (returnData) => {
                dispatch({
                    type: types.DEPARTMENT_SEARCH_STAFFS,
                    payload: {
                        returnData: returnData,
                        status: status
                    }
                });
                dispatch({
                    type: types.DEPARTMENT_SEARCH_ENDS,
                    payload: returnData.rows
                });

            },
            (returnData) => {
                Toast.error(returnData.msg);
            });
    }
}
//获取停用部门列表
export const getSearchDepartmentList = () => {
    return (dispatch, getState) => {
        const DepartmentState = getDepartmentState(getState);
        const {searchKeys, showingDisableLists} = DepartmentState;
        const params = {namelike: searchKeys, status: !showingDisableLists ? '正常' : '停用'};
        let url = departmentInterface.DEPARTMENT_SEARCH_LIST;
        NetWork.get(url, params,
            (returnData) => {
                dispatch({
                    type: types.DEPARTMENT_GET_LIST,
                    payload: returnData,
                })
            },
            (returnData) => {
                Toast.error(returnData.msg);
            })
    }
};
//搜索部门
export const changeKeyValueOfDepartmentState = (key, value) => {
    return {
        type: types.DEPARTMENT_CHANGE_KEY_VALUE,
        payload: {
            key: key,
            value: value,
        }
    }
};
//部门是否启用
export const changeDepartmentStatus = (checked) => {
    return (dispatch, getState) => {
        let departmentState = getDepartmentState(getState);
        let currentDepartment = departmentState.currentDepartment;
        currentDepartment = getReqDepartmentData(currentDepartment);
        currentDepartment.status = checked ? '正常' : '停用'
        dispatch({
            type: types.DISBURSE_STATUS,
            payload: currentDepartment
        });
        dispatch(editDepartment(currentDepartment, 'status'));

    }
};
//详情里下一个
export const nextDepartmentMembersDetail = () => {
    return (dispatch, getState) => {
        let departmentState = getDepartmentState(getState);
        let currentDepartmentMembers = departmentState.currentDepartmentMembers.rows;
        let num = departmentState.pagenum;
        let num2 = num+1;
        departmentState.pagenum = num2;
        let currentDepartmentMemberDetails = currentDepartmentMembers[num2-1];
            dispatch({
                type: types.NEXT_DEPARTMENT_MEMBERS_DETAIL,
                payload: {
                    pagenum:num2
                }
            });
    }
};
//详情里上一个
export const prevDepartmentMembersDetail = () => {
    return (dispatch, getState) => {
        let departmentState = getDepartmentState(getState);
        let currentDepartmentMembers = departmentState.currentDepartmentMembers.rows;
        let num = departmentState.pagenum;
        let num1 = num-1;
        departmentState.pagenum = num1;
        let currentDepartmentMemberDetails = currentDepartmentMembers[num1-1];
            dispatch({
                type: types.PREV_DEPARTMENT_MEMBERS_DETAIL,
                payload: {
                    pagenum:num1
                }
            });
    }
};