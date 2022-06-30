import api from './api';
import NetWork from './network';

//工具方法: 用来处理拼接树
export function constructTree(treeData, appendData, $$state, whichData) {

	if (treeData) {
		let data = appendData.data;
		let len = data.length;
		if (len > 0) {
			let parentId = data[0]['parentId'];
			if (!parentId) {

				let children = treeData;
				let childIds = [];

				for (let j = 0; j < children.length; j++) {
					childIds[j] = children[j]['id'];
				}

				if (data) {
					for (let f = 0; f < data.length; f++) {
						let ind = childIds.indexOf(data[f]['id']);
						if (ind > -1) {
							continue;
						} else {
							treeData.push(data[f])
						}
					}
				}
				return $$state.set(whichData, treeData.slice(0));
			} else {
				travelTree(treeData, parentId, data);
				return $$state.set(whichData, treeData.slice(0));
			}

		} else {
			return $$state;
		}

	} else {

		return $$state.set(whichData, appendData['data']);
	}
}

//工具方法: 遍历树
export function travelTree(treeData, parentId, data) {

	let len = treeData.length;
	for (let i = 0; i < len; i++) {
		let id = treeData[i]['id'];
		if (id === parentId) {

			if (treeData[i]['children']) {
				let children = treeData[i]['children'];
				let childIds = [];

				for (let j = 0; j < children.length; j++) {
					childIds[j] = children[j]['id'];
				}

				if (data) {
					for (let f = 0; f < data.length; f++) {
						let ind = childIds.indexOf(data[f]['id']);
						if (ind > -1) {
							continue;
						} else {
							treeData[i]['children'].push(data[f])
						}
					}
				}
				return;
			} else {
				treeData[i]['children'] = data;
				treeData[i]['isLeaf'] = false;
				return;
			}
		} else {
			if (treeData[i]['children']) {
				travelTree(treeData[i]['children'], parentId, data);
			}
		}
	}
}

//更新node节点数据
export function changeTreeNode($$state, stateKey, tree, node) {
	const nodeId = node.id;
	for (let i = 0; i < tree.length; i++) {
		if (tree[i].id == nodeId) {
			node.isLeaf = tree[i].isLeaf;
			tree[i] = node;
			break;
		} else {
			if (tree[i].children) {
				changeTreeNode($$state, stateKey, tree[i].children, node);
			}
		}
	}
	return $$state.set(stateKey, tree).set('currentProject', node);
}
export function changeTestTreeNode($$state, stateKey, tree, node) {
	const nodeId = node.id;
	for (let i = 0; i < tree.length; i++) {
		if (tree[i].id == nodeId) {
			tree[i] = node;
			break;
		} else {
			if (tree[i].children) {
				changeTestTreeNode($$state, stateKey, tree[i].children, node);
			}
		}
	}
	return $$state.set(stateKey, tree).set('currentDisburse', node);
}
// 获取公司项目列表数据
export function getTreeData(reqParam, treeType, reducerState, treeDataActionType, treePageActionType) {
	return (dispatch, getState) => {
		// console.log(treeType);

		let whichData = '';
		let whichPage = '';
		let url = '';

		switch (treeType) {
			case 'project':
				whichData = 'projectData';
				whichPage = 'projectPage';
				url = api.TREE_PROJECT;
				break;
			case 'disburse':
				whichData = 'disburseData';
				whichPage = 'disbursePage';
				url = api.TREE_DISBURSE;
				break;
			case 'department':
				whichData = 'departmentData';
				whichPage = 'departmentPage';
				url = api.TREE_DEPARTMENT;
				break;
			default:
				break;
		}

		NetWork.get(url, reqParam, (json) => {

			// reducerState  字符串:比如"treeReducerState"
			let testTreeState = getState().get(reducerState).toJS();
			let projectPage = testTreeState[whichPage];///-------根据类型获取页码对象
			// console.log(projectPage);
			let data = json.data;
			if (projectPage) {
				if (data.length > 0) {
					let pId = data[0]['parentId'];
					if (pId in projectPage) {
						projectPage[pId] = {page: json.page + 1, pageSum: json.pageSum};
					} else {
						projectPage[pId] = {page: json.page + 1, pageSum: json.pageSum};
					}
				}
			} else {
				projectPage = {};
				if (data.length > 0) {
					let pId = data[0]['parentId'];
					if (!pId) {
						projectPage[0] = {page: 2, pageSum: json.pageSum};
					}
				}
			}


			dispatch({
				type: treePageActionType,
				payload: projectPage,
				whichPage
			});

			dispatch({
				type: treeDataActionType,
				payload: json,
				whichData
			});

			window.loading.remove();

		});
	}
}