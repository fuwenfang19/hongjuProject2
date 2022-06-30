import React, {Component} from 'react';
import FileChoose from './FileChoose';
import NetWork from '../../../global/utils/network';
import FileTree from '../tree/TreeContainer';
import GroupTree, {findDom, findSearchParent} from '../groupTree/GroupTree';
import {getCompanyGroup} from './fetchChooseItem';
import Toast from '../Toast';
import {connect} from 'react-redux';
import {Input, Tabs} from 'antd';
const TabPane = Tabs.TabPane;
const Search = Input.Search;

class FileChooseBox extends Component {
	constructor() {
		super();
		this.state = {
			department: undefined,
			company: undefined,
			searchCompany: '',
			departmentData: [],
			searchDepartment: '',
			departmentDomId: undefined,
			companyItem: {},
			searchFile: '',
			currentBillType: 2,
		};
	}

	static defaultProps = {};

	componentWillMount() {
		this.setState({
			currentBillType: (this.props.billTypes && this.props.billTypes[0]) || 2,
			companyItem: {
				name: window.getUserInfo().companyname,
				id: window.getUserInfo().company,
				code: ''
			}
		})
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.type === 'billType') {
			return true;
		} else {
			if (this.props['initialChoosed'] !== nextProps['initialChoosed']) {
				return false;
			} else {
				return true;
			}
		}
	}

	handleSelect = (id, item, p, companyId) => {
		let dom = findDom(p.target, 'group-root');
		let targetP = p.target.parentNode;
		let doms = dom.querySelectorAll('.tree-title');
		if (targetP) {

			targetP.className = 'tree-title tree-selected';

		}
		for (let i = 0; i < doms.length; i++) {
			if (doms[i] && doms[i] !== targetP) {
				doms[i].className = 'tree-title';
			}
		}

		if (!companyId) {
			this.setState({
				department: null,
				company: id,
				companyItem: item
			});
		} else {
			this.setState({
				department: id,
				company: companyId
			});
		}


		window.loading.add();

	}
	handleDepartmentSelect = (item) => {
		this.setState({
			department: item['id'],
			company: this.state.company || window.getUserInfo().company,
			departmentDomId: item['id']
		});
	}
	genDepartmentHtml = () => {
		return this.state.departmentData.map((item, i) => {
			let companyItem = this.state.companyItem;

			return (
				<div
					key={i}
					className={this.state.departmentDomId === item['id'] ? "search-department-item search-department-item-bg" : "search-department-item"}
					onClick={this.handleDepartmentSelect.bind(this, item)}>
					<p>{`${companyItem['name']}`}</p>
					<div>{`[${item['code']}]${item['name']}`}</div>
				</div>
			);
		});
	};
	changeBillType = (currentBillType) => {
		this.setState({
			currentBillType
		}, () => {
			// console.log(this.state.currentBillType);
		})
	}

	render() {
		const getBillTypeHtml = (
			<div>
				<div
					className="file-choose-right-box-search"
					onClick={(e) => {
						e.stopPropagation();
					}}>
					<Search
						value={this.state.searchFile}
						placeholder="搜索"
						onChange={e => {
							this.setState({
								searchFile: e.target.value.trim()
							});
						}}
					/>
				</div>
				<FileChoose
					searchKey={this.state.searchFile}
					initialChoosed={this.props.initialChoosed}
					okClick={this.props.okClick}
					cancelClick={this.props.cancelClick}
					objectId={this.props.objectId}
					currentBillType={this.state.currentBillType}
					type={this.props.type}
					company={this.state.company || window.getUserInfo().company}
					isRadio={this.props.isRadio}
					radioReturnObj={this.props.radioReturnObj}/>
			</div>
		)

		if (this.props.type === 'staff') {

			let c1 = this.props.showGroup ? "file-choose-left-box file-choose-left-box-group-staff" : "file-choose-left-box";
			return (
				<div className="file-choose-box  fn-clear">
					<div className={c1}>
						<div
							className="file-choose-left-box-search"
							onClick={(e) => {
								e.stopPropagation();
							}}>
							{this.props.showGroup ? (<Search
								className="search-company-bottom"
								placeholder="搜索公司"
								value={this.state.searchCompany}
								onChange={e => {
									if (e.target.value.trim() === '') {
										let dom = findSearchParent(e.target, 'file-choose-box');
										let doms = dom.querySelectorAll('.tree-title');
										for (let i = 0, len = doms.length; i < len; i++) {
											doms[i].className = 'tree-title';
										}
									}

									this.setState({
										searchCompany: e.target.value,
										searchDepartment: '',
										departmentDomId: undefined
									});
								}}
							/>) : null}
							<Search
								placeholder={this.props.showGroup ? "搜索所选公司下的部门" : "搜索部门"}
								value={this.state.searchDepartment}
								onChange={e => {

									this.setState({
										searchDepartment: e.target.value,
										searchCompany: '',
										departmentDomId: undefined
									});
									searchDepartmentFn(this.state.company || window.getUserInfo().company, e.target.value, this);
								}}
							/>
						</div>
						{
							this.state.searchDepartment.trim() === '' ? (
								<GroupTree
									searchCompany={this.state.searchCompany}
									type="department"
									onSelect={this.handleSelect}
									countperpage={this.props.countperpage}
									showGroup={this.props.showGroup}/>
							) : (
								<div className="search-department-box"> {this.genDepartmentHtml()}</div>
							)
						}

					</div>
					<div className="file-choose-middle-line"></div>
					<div className="file-choose-right-box">
						<div
							className="file-choose-right-box-search"
							onClick={(e) => {
								e.stopPropagation();
							}}>
							<Search
								placeholder="搜索人员"
								onChange={e => {
									console.log('f' + this.state.searchFile + 'f');
									console.log('f' + e.target.value + 'f');
									if (this.state.searchFile.trim() === e.target.value.trim()) {
										return;
									}
									this.setState({
										searchFile: e.target.value.trim()
									});
								}}
							/>
						</div>
						<FileChoose
							searchKey={this.state.searchFile}
							initialChoosed={this.props.initialChoosed}
							okClick={this.props.okClick}
							cancelClick={this.props.cancelClick}
							type="staff"
							department={this.state.department}
							company={this.state.company || window.getUserInfo().company}
							radioReturnObj={this.props.radioReturnObj}
							isRadio={this.props.isRadio}/>
					</div>
				</div>
			);
		} else if (this.props.type === 'department' || this.props.type === 'project') {
			return (
				<div className="file-choose-box  fn-clear">
					{this.props.showGroup ? (<div className="file-choose-left-box file-choose-left-box-not-staff">
						<div
							className="file-choose-left-box-search"
							onClick={(e) => {
								e.stopPropagation();
							}}>
							{this.props.showGroup ? (<Search
								placeholder="搜索公司"
								onChange={e => {
									if (e.target.value.trim() === '') {
										let dom = findSearchParent(e.target, 'file-choose-box');
										let doms = dom.querySelectorAll('.tree-title');
										for (let i = 0, len = doms.length; i < len; i++) {
											doms[i].className = 'tree-title';
										}
									}
									this.setState({
										searchCompany: e.target.value
									});
								}}
							/>) : null}
						</div>
						<GroupTree
							searchCompany={this.state.searchCompany}
							type="department"
							onSelect={this.handleSelect}
							countperpage={this.props.countperpage}
							showGroup={this.props.showGroup}/>
					</div>) : null}
					{this.props.showGroup ? <div className="file-choose-middle-line"></div> : null}
					<div className={this.props.showGroup ? "file-choose-right-box" : "file-choose-right-box-no-group"}>
						<div
							className="file-choose-right-box-search"
							onClick={(e) => {
								e.stopPropagation();
							}}>
							<Search
								placeholder={this.props.showGroup ?
									(this.props.type === 'department' ? "搜索所选公司下的部门" : "搜索所选公司下的项目")
									: this.props.type === 'department' ? "搜索部门" : "搜索项目"}
								onChange={e => {
									console.log('f' + this.state.searchFile + 'f');
									console.log('f' + e.target.value + 'f');
									this.setState({
										searchFile: e.target.value.trim()
									});
								}}
							/>
						</div>
						<FileChoose
							searchKey={this.state.searchFile}
							initialChoosed={this.props.initialChoosed}
							okClick={this.props.okClick}
							cancelClick={this.props.cancelClick}
							type={this.props.type}
							radioReturnObj={this.props.radioReturnObj}
							company={this.state.company || window.getUserInfo().company}
							isRadio={this.props.isRadio}/>
					</div>
				</div>
			);
		} else if (this.props.type === 'billType') {
			let billTypes = this.props.billTypes;
			const billTypesMap = {
				2: '申请单',
				3: '报销单',
				15: '还款单',
				8: '预算申请单'
			};

			if (billTypes === undefined || billTypes.length === 0) {
				billTypes = Object.keys(billTypesMap).map((item) => {
					return Number(item);
				});
			}

			if (billTypes.length === 1) {
				return (
					<div className="file-choose-box  fn-clear">
						<div className="file-choose-right-box-no-group bill-type">
							{getBillTypeHtml}
						</div>
					</div>
				);
			} else {
				return (
					<div className="file-choose-box  fn-clear">
						<div className="file-choose-right-box-no-group bill-type">
							<Tabs tabPosition={'left'} onChange={(key) => {
								this.changeBillType(key);
							}}>
								{billTypes.map((item) => {
									return <TabPane tab={billTypesMap[item]} key={item}>{getBillTypeHtml}</TabPane>
								})}
							</Tabs>
						</div>
					</div>
				);
			}

		} else {
			return (
				<div className="file-choose-box  fn-clear">
					<div className="file-choose-right-box-no-group">
						<div
							className="file-choose-right-box-search"
							onClick={(e) => {
								e.stopPropagation();
							}}>
							<Search
								placeholder="搜索"
								onChange={e => {
									console.log('f' + this.state.searchFile + 'f');
									console.log('f' + e.target.value + 'f');
									this.setState({
										searchFile: e.target.value.trim()
									});
								}}
							/>
						</div>
						<FileChoose
							searchKey={this.state.searchFile}
							initialChoosed={this.props.initialChoosed}
							okClick={this.props.okClick}
							cancelClick={this.props.cancelClick}
							objectId={this.props.objectId}
							type={this.props.type}
							radioReturnObj={this.props.radioReturnObj}
							company={this.state.company || window.getUserInfo().company}
							isRadio={this.props.isRadio}/>
					</div>
				</div>
			);
		}

	}
}


export default FileChooseBox;

// 获取集团所有公司列表
function getGroup(that) {
	let url = '/organization/loadcompanyingroup/';
	NetWork.get(url, {}, (json) => {

		that.setState({
			companies: json
		});
	});
}

function searchDepartmentFn(company, namelike, that) {
	if (namelike) {
		namelike = namelike.trim();
	}
	let url = '/organization/webdepartments/';
	let req = {"company": company, "status": "正常", "namelike": namelike};
	NetWork.get(url, req, (json) => {

		that.setState({
			departmentData: json
		});
	});

}