//基础档案
import * as types from '../../actionTypes';
import * as projectConstants from '../../../constants/basefiles/project'
import baseFilesInterface from '../../../global/utils/api';
import domUtil from '../../../global/utils/domutil';
import NetWork from '../../../global/utils/network';
import {Toast} from '../../../components/common';
import moment from 'moment';

const getProjectState = (getState) => {
	return getState().get('projectState').toJS();
};

const getReqProjectData = (editingProject) => {
	for (let item in editingProject) {
		if (editingProject.hasOwnProperty(item)) {
			if (editingProject[item] != null && ['startDate', 'endDate'].indexOf(item) !== -1) {
				editingProject[item] = moment(editingProject[item]).format('YYYY-MM-DD');
			} else if (editingProject[item] != null && Object.prototype.toString.call(editingProject[item]) == '[object Object]') {
				editingProject[item] = editingProject[item].id;
				if(item === 'director'){
					editingProject.director_id = editingProject[item].id;
				}
			}
		}
	}
	return editingProject;
};

//PROJECT_GET_ENABLE_PROJECT
export const getSearchProjectList = () => {
	return (dispatch, getState) => {
		const projectState = getProjectState(getState);
		const {searchKey, showingDisableList} = projectState;
		const params = {key: searchKey, status: !showingDisableList ? '正常' : '停用'};
		let url = baseFilesInterface.PROJECT_GET_LIST;
		NetWork.get(url, params,
			(returnData) => {
				dispatch({
					type: types.PROJECT_GET_LIST,
					payload: returnData,
				})
			},
			(returnData) => {
				Toast.error(returnData.msg);
			})
	}
};

export const changeKeyValueOfProjectState = (key, value) => {
	return {
		type: types.PROJECT_CHANGE_KEY_VALUE,
		payload: {
			key: key,
			value: value,
		}
	}
};


//项目档案界面-获取档案详情
export const getProjectById = (projectId) => {
	return (dispatch, getState) => {
		let url = baseFilesInterface.PROJECT_GET_COMPANY_PROJECT.replace(':projectId', projectId);
		NetWork.get(url,
			(returnData) => {
				dispatch({
					type: types.PROJECT_FETCH_PROJECT,
					payload: returnData
				});
				if (!returnData.isCommon) {//公共项目
					dispatch(getProjectMembersById(projectId, projectConstants.MEMBER_IN_PROJECT));
				}
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};
//获取项目成员
export const getProjectMembersById = (projectId, status) => {
	return (dispatch, getState) => {
		if (!getProjectState(getState).currentProject.isCommon) {
			let url = baseFilesInterface.PROJECT_GET_PROJECT_MEMBERS.replace(':projectId', projectId);
			NetWork.get(url, {status: status},
				(returnData) => {
					// Toast.success('获取项目成员成功...');
					dispatch({
						type: types.PROJECT_FETCH_PROJECT_MEMBERS,
						payload: {members: returnData, status: status}
					})
				},
				(returnData) => {
					Toast.error(returnData.msg);
				});
		}
	}
};
//开始编辑项目
export const beginEditProject = (editType) => {
	return {
		type: types.PROJECT_BEGIN_EDIT_PROJECT,
		payload: {editType: editType, editModalVisible: true}
	}
};
//停止编辑项目
export const endEditProject = () => {
	return {
		type: types.PROJECT_END_EDIT_PROJECT,
		payload: false
	}
};
//编辑项目成员的状态
export const changeEditMembersFlag = (flag) => {
	return {
		type: types.PROJECT_CHANGE_EDIT_MEMBERS_FLAG,
		payload: flag
	}
};
//开始批量编辑项目
export const changeBatchEditProjectFlag = (flag) => {
	return {
		type: types.PROJECT_CHANGE_BATCH_EDIT_PROJECT_FLAG,
		payload: flag
	}
};
//添加项目成员的flag
export const changeAddMembersFlag = (flag) => {
	return {
		type: types.PROJECT_CHANGE_ADD_MEMBERS_FLAG,
		payload: flag
	}
};
//档案选择的flag
export const changeFileChooseFlag = (index, flag) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.PROJECT_CHANGE_FILE_CHOOSE_FLAG,
			payload: {index: index, flag: flag}
		});
		if (flag) {
			//处理点击其他位置消失的事件
			let timer = setTimeout(function () {
				const boxes = document.getElementsByClassName('file-choose-box');
				document.onclick = function (event) {
					event = window.event || event;
					let targetNode = event.target || event.srcElement;
					if (!domUtil.isParent(targetNode, boxes[0])) {
						dispatch(changeFileChooseFlag(index, false));
						document.onclick = null;
						clearTimeout(timer);
					}
				};
			}, 500);
		}
	}
};
//编辑成员 更新store
export const updateEditingMembers = (index, member) => {
	return {
		type: types.PROJECT_UPDATE_EDITING_MEMBERS,
		payload: {index: index, member: member}
	}
};
//编辑成员 保存
export const saveMembers = () => {
	return (dispatch, getState) => {
		const projectState = getState().get('projectState').toJS();
		const pId = projectState.currentProject.id;
		const url = baseFilesInterface.PROJECT_SAVE_MEMBERS.replace(':projectId', pId);
		const reqData = projectState.editingProjectMembers.map((item) => {
			return {staffItem: item.id, status: item.status};
		});

		NetWork.put(url, reqData,
			(returnData) => {
				Toast.success('保存成功');

				dispatch(getProjectMembersById(pId, projectState.projectMemberSearchType));
				dispatch({
					type: types.PROJECT_SAVE_MEMBERS,
					payload: returnData
				});
				dispatch(changeEditMembersFlag(false));
			},
			(error) => {
				Toast.error(error.msg);
			});
	}

};
//添加成员
export const addProjectMembers = (memberIds) => {//{"staffs":["31840"]}
	return (dispatch, getState) => {
		const projectState = getProjectState(getState);
		const pId = projectState.currentProject.id;
		let url = baseFilesInterface.PROJECT_SAVE_MEMBERS.replace(':projectId', pId);
		NetWork.post(url, {staffs: memberIds},
			() => {
				Toast.success('新增成功');
				dispatch({
					type: types.PROJECT_CHANGE_ADD_MEMBERS_FLAG,
					payload: false
				});
				dispatch(changeAddMembersFlag(false));
				dispatch(getProjectMembersById(pId, projectState.projectMemberSearchType));
			},
			(error) => {
				Toast.error(error.msg);
			});
	}

};
//sync 更新正在编辑的字段值
export const updateAddingProject = (filedData) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.PROJECT_UPDATE_ADDING_PROJECT,
			payload: filedData
		})
	}
};

//执行批量修改
export const doBatchEdit = (reqData) => {
	return (dispatch, getState) => {
		const url = baseFilesInterface.PROJECT_DO_BATCH_EDIT;
		NetWork.put(url, reqData,
			() => {
				dispatch({
					type: types.PROJECT_RELOAD_TREE,
					payload: null
				});
				dispatch(changeBatchEditProjectFlag(false));
				Toast.success('编辑成功!');
			},
			(error) => {
				Toast.error(error.msg);
			});
	}
};

//重新加载tree
export const reloadProjectTree = (reqData) => {
	return (dispatch, getState) => {
		// dispatch({
		// 	type: 'PROJECT_TREE_ClEAR',
		// 	whichPage: 'projectPage',
		// 	whichData: 'projectData'
		// });
		// dispatch({
		// 	type: 'PROJECT_TREE_SET_PAGE',
		// 	payload:{},
		// 	whichPage: 'projectPage',
		// 	whichData: 'projectData'
		// });
		// dispatch({
		// 	type: 'PROJECT_TREE_SET_PROJECT_DATA',
		// 	payload:{},
		// 	whichPage: 'projectPage',
		// 	whichData: 'projectData'
		// });
	}
};

//新增或者编辑项目
export const addProject = () => {
	return (dispatch, getState) => {
		let projectState = getProjectState(getState);
		let editingProject = projectState.editingProject;

		editingProject = getReqProjectData(editingProject);

		if (projectState.editType === 'add') {
			editingProject.parent = null;
		} else if (projectState.editType === 'addChild') {
			editingProject.parent = projectState.currentProject.id;
		} else if (projectState.editType === 'edit') {
			dispatch(editProject(editingProject));
			return;
		}

		let url = baseFilesInterface.PROJECT_ADD_PROJECT;
		NetWork.post(url, editingProject,
			(returnData) => {
				Toast.success('新增项目成功...');
				dispatch(endEditProject());
				dispatch({
					type: types.PROJECT_ADD_PROJECT,
					payload: returnData
				});
				dispatch(getProjectMembersById(projectState.currentProject.id, projectState.projectMemberSearchType));
				try {
					const li = document.getElementById('click' + returnData.id);
					li.click();
					document.querySelector('.tree-container').scrollTop = document.querySelector('.tree-container').scrollHeight;
				} catch (e) {

				}


			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};

//停用启用
export const onOrOffProject = (checked) => {
	return (dispatch, getState) => {
		let projectState = getProjectState(getState);
		let editingProject = projectState.currentProject;
		editingProject = getReqProjectData(editingProject);
		editingProject.status = checked ? '正常' : '停用';
		dispatch(editProject(editingProject, checked));
	}
};

//编辑项目
export const editProject = (projectData, onOrOff) => {
	return (dispatch, getState) => {
		if (projectData.id == null) {
			projectData.id = getProjectState(getState).currentProject.id;
		}
		let url = baseFilesInterface.PROJECT_UPDATE_PROJECT.replace(':projectId', projectData.id);
		NetWork.put(url, projectData,
			(returnData) => {
				if (onOrOff !== undefined) {
					if (onOrOff) {
						Toast.success('项目' + projectData.name + '已启用');
					} else {
						Toast.success('项目' + projectData.name + '已停用');
					}
				} else {
					Toast.success('保存成功');
				}
				dispatch(endEditProject());
				dispatch({
					type: types.PROJECT_UPDATE_PROJECT,
					payload: returnData
				})
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};
//批量编辑
export const batchEditProject = (projectData) => {
	return (dispatch, getState) => {
		let url = baseFilesInterface.PROJECT_BATCH_UPDATE_PROJECT;
		NetWork.put(url, projectData,
			(returnData) => {
				Toast.success('保存成功...');
				dispatch({
					type: types.PROJECT_BATCH_UPDATE_PROJECT,
					payload: returnData
				})
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
};

//tree
