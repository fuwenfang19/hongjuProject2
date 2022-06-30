/**
 * Created by lpy on 17/3/2.
 * 树形控件使用
 * @类CommonTree 使用LazyObject
 *   @defaultProps
 *       @handleSelect
 *
 *   @defaultStates
 */
import React, { Component } from 'react';
import { TreeNode } from './LazyTree';
import { getTreeData } from '../../global/utils/tree';
import { Spin } from 'antd';

class CommonTree extends Component {
	constructor(props) {
		super(props);
		this.state = {
			childInfo: '',
			data: null,
			parentPage: 2,
			whichData: '',
			whichPage: ''
		};

		this.genHtml = this.genHtml.bind(this);
		this.getMore = this.getMore.bind(this);
		this.switchCb = this.switchCb.bind(this);
		this.companySelected = this.companySelected.bind(this);
	}

	static defaultProps = {
		countperpage: 300
	};

	componentWillMount() {

		let whichData = '';
		let whichPage = '';
		switch (this.props.type) {
			case 'project':
				whichData = 'projectData';
				whichPage = 'projectPage';
				break;
			case 'disburse':
				whichData = 'disburseData';
				whichPage = 'disbursePage';
				break;
			case 'department':
				whichData = 'departmentData';
				whichPage = 'departmentPage';
				break;
			default:
				break;
		}

		// 获得根项目的节点
		//清除数据的action type
		// this.props.dispatch({
		//     type:'TREE_ClEAR',
		//     whichData,
		//     whichPage
		// });
		this.props.dispatch({
			type: this.props.clearActionType,
			whichData,
			whichPage
		});

		let baseState = this.props.baseState;
		let treeState = this.props.treeState;

		let reqParam = {
			company: baseState.userInfo.company,
			status: '正常',
			page: 1,
			parentid: 0,
			countperpage: this.props.countperpage,
			searchtype: 'treeclick'
		};

		this.setState({
			data: treeState[whichData],
			projectPage: treeState[whichPage],
			whichData,
			whichPage
		});

		this.props.dispatch(getTreeData(reqParam, this.props.type, this.props.reducerState, this.props.treeDataActionType, this.props.treePageActionType));
	}

	componentWillReceiveProps(newProps) {
		let baseState = newProps.baseState;
		let treeState = newProps.treeState;
		let whichData = '';
		let whichPage = '';
		switch (this.props.type) {
			case 'project':
				whichData = 'projectData';
				whichPage = 'projectPage';
				break;
			case 'disburse':
				whichData = 'disburseData';
				whichPage = 'disbursePage';
				break;
			case 'department':
				whichData = 'departmentData';
				whichPage = 'departmentPage';
				break;
			default:
				break;
		}
		this.setState({
			data: treeState[whichData],
			projectPage: treeState[whichPage]
		});
	}

	componentDidMount() {
	}

	switchCb(info, t) {
		//需要处理网络请求和获取渲染该节点下面的子节点
		let reqParam = {
			company: this.props.baseState.userInfo.company,
			status: '正常',
			page: 1,
			parentid: info,
			countperpage: this.props.countperpage,
			searchtype: 'treeclick'
		};
		if (t.state.switchOnce) {
			window.loading.add();
			this.props.dispatch(getTreeData(reqParam, this.props.type, this.props.reducerState, this.props.treeDataActionType, this.props.treePageActionType));
			t.setState({
				switchOnce: false
			});
		}
	}

	getMore(pInfo) {
		window.loading.add();
		let page;
		try {
			page = this.state.projectPage[pInfo]['page'];
		} catch (e) {

		}
		if (!pInfo) {
			page = this.state.parentPage;
			this.setState({
				parentPage: page + 1
			});
		}
		let reqParam = {
			company: this.props.baseState.userInfo.company,
			status: '正常',
			page: page,
			parentid: pInfo,
			countperpage: this.props.countperpage,
			searchtype: 'treeclick'
		};
		this.props.dispatch(getTreeData(reqParam, this.props.type, this.props.reducerState, this.props.treeDataActionType, this.props.treePageActionType));
	}
	companySelected(e) {
		// alert('ffff');
		
		// brother.className = brother.className.indexOf('fn-hide')>-1?'company-content':'company-content fn-hide';
		e.target.className = 'company-name company-name-active';
		if (this.props.companyCallback) {
			this.props.companyCallback();
		}
	}
	genHtml(data) {
		//console.log('data'+JSON.stringify(data))
		let childInfo = this.state.childInfo;
		let _self = this;

		let c1 = 'tree-title tree-selected';
		let c2 = 'tree-title';

		if (!data) {
			return (
				<div>
					<Spin tip="数据加载中...">
					</Spin>
				</div>
			);
		} else {
			let fnHide = 'fn-hide';
			let pageObj = {};
			try {
				pageObj = this.state.projectPage[0];
			} catch (e) {

			}
			try {
				if (this.state.parentPage > pageObj['pageSum']) {
					fnHide = 'fn-hide';
				} else {
					fnHide = "";
				}
			} catch (e) {

			}

			return (
				<ul>
					{arrToHtml(data, _self)}
					<TreeNode key='p-p' isLastChild={true} parentLink={this} getMore={this.getMore} parentInfo={0}
						toHide={fnHide} />
				</ul>
			);
		}

		function arrToHtml(arr, _self) {

			if (!arr) {
				return;
			}
			let len = arr.length;

			let html = [];
			for (let i = 0; i < len; i++) {
				let children = arr[i]['children'];
				//console.log('childre>'+JSON.stringify(children))
				let item = arr[i];
				let tem;
				let projectPage = _self.state.projectPage;
				let fnHide = 'fn-hide';
				let pageObj = {};
				try {
					pageObj = projectPage[item['id']];
				} catch (e) {

				}
				if (pageObj && (pageObj['page'] > pageObj['pageSum'])) {
					fnHide = 'fn-hide';
				} else {
					fnHide = '';
				}

				if (!arr[i]['isLeaf']) {
					tem = (
						<TreeNode
							item={item}
							key={i}
							title={'[' + item['code'] + ']' + item['name']}
							clickId={item['id']}
							info={item['id']}
							hasChildren={true}
							parentLink={_self}
							className={item['id'] === childInfo ? c1 : c2}
							switchCb={_self.switchCb}
							onSelect={_self.props.handleSelect}>

							{arrToHtml(children, _self)}

							{
								(() => {
									if (children) {
										if (children.length > 0) {
											return (
												<TreeNode
													toHide={fnHide}
													key={children ? children.length : 0}
													isLastChild={true}
													parentLink={_self}
													getMore={_self.getMore}
													parentInfo={item['id']} />
											);
										} else {
											return null;
										}
									} else {
										return null;
									}
								})()
							}
						</TreeNode>
					);
				} else {
					tem = (
						<TreeNode
							item={item}
							onSelect={_self.props.handleSelect}
							key={i}
							title={'[' + item['code'] + ']' + item['name']}
							clickId={item['id']}
							info={item['id']}
							parentLink={_self}
							className={item['id'] === childInfo ? c1 : c2} />
					);
				}
				html.push(tem);
			}

			return html;
		}


	}

	render() {
		return (
			<div className="company-root" >
				<div className="company-name" onClick={this.companySelected}>{this.props.baseState.userInfo.companyname}</div>
				<div className="company-content" >
					{this.genHtml(this.state.data)}
				</div>
			</div>
		);
	}
}

export default CommonTree;
