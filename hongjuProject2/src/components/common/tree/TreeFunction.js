/**
 * Created by lpy on 17/3/3
 */

import NetWork from '../../../global/utils/network';

//工具方法: 用来处理拼接树
export function constructTree(treeData, appendData) {

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

				let index = -1;
				if (data && data[0]) {
					index = childIds.indexOf(data[0]['id'])
				}
				if (index > -1) {
					return treeData;
				}

				// 这边的问题
				treeData = treeData.concat(data);
				return treeData;
			} else {
				travelTree(treeData, parentId, data);
				return treeData;
			}

		} else {
			return treeData;
		}

	} else {

		return appendData['data'];
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

				let index = -1;
				if (data && data[0]) {
					index = childIds.indexOf(data[0]['id'])
				}
				if (index > -1) {
					return;
				}
				treeData[i]['children'] = treeData[i]['children'].concat(data);
				return;
			} else {
				treeData[i]['children'] = data;
				return;
			}
		} else {
			if (treeData[i]['children']) {
				travelTree(treeData[i]['children'], parentId, data);
			}
		}
	}
}

// 获取公司项目列表数据
export function getTreeData(reqParam, type, that) {
	let urlMap = {
		disburse: '/organization/getdisburse/',
		department: '/organization/webdepartments/',
		project: '/organization/webexpenseitems/'
	};
	let url = urlMap[type];

	NetWork.get(url, reqParam, (json) => {

		let projectPage = that.state.$projectPage;
		let data = json.data;

		if (projectPage) {
			if (data.length > 0) {
				let pId = data[0]['parentId'];
				if (pId in projectPage) {
					projectPage[pId] = { page: json.page + 1, pageSum: json.pageSum };
				} else {
					projectPage[pId] = { page: json.page + 1, pageSum: json.pageSum };
				}
			}
		} else {
			projectPage = {};
			if (data.length > 0) {
				let pId = data[0]['parentId'];
				if (!pId) {
					projectPage[0] = { page: 2, pageSum: json.pageSum };
				}
			}
		}

		let treeData = that.state.$data;
		let appendData = json;
		let $data = constructTree(treeData, appendData);
		that.setState({
			$data,
			$projectPage: projectPage
		});
		window.loading.remove();
	});
}







