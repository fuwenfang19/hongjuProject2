/**
 * Created by chezhanluo on 2017/3/13.
 */
import React from 'react';
import {Icon, Button, Input, Checkbox, Spin} from 'antd';
import {connect} from 'react-redux';
import {
	getDisburseById, addDisburse,
	beginEditDisburse, endEditDisburse, changeDisburseStatus, changeDisableDisburseStatus,
	showSearchDisburse, beginEditDisburseOther, canSave, onFilesChange, changeKeyValueOfDisburseState

} from '../../../actions';
import {CommonTree, Confirm, Toast, NoInfo} from '../../common';
import DisburseInfo from './DisburseInfo';
import EditDisburseForm from './EditDisburseForm';
import NetWork from '../../../global/utils/network';
import * as actionTypes from  '../../../actions/actionTypes';
import Searchbar from '../../common/Searchbar';

const Search = Input.Search;

class Project extends React.Component {
	constructor() {
		super();
		this.state = {
			SearchValue: null,
			SearchKey: null
		}
		this.getDisburseById = this.getDisburseById.bind(this);
		this.onDisburseEditBegin = this.onDisburseEditBegin.bind(this);
		this.onDisburseEditBeginOther = this.onDisburseEditBeginOther.bind(this);
		this.canSave = this.canSave.bind(this);
		this.onFilesChange = this.onFilesChange.bind(this);
		this.onEditOver = this.onEditOver.bind(this);
		this.updateCurrentDisburse = this.updateCurrentDisburse.bind(this);
		this.changeDisburseStatus = this.changeDisburseStatus.bind(this);
		this.onSelect = this.onSelect.bind(this);
	}

	componentDidMount() {
		const maxTimes = 10;
		let times = 1;
		const s = setInterval(() => {
			if (times >= maxTimes) {
				clearInterval(s);
			} else {
				if (document.querySelector('.lazy-tree-node:first-child span')) {
					document.querySelector('.lazy-tree-node:first-child span').click();
					clearInterval(s);
				} else {
					times++;
				}
			}
		}, 500)
	}

	componentWillUnmount() {
		const {dispatch} = this.props;
		dispatch(changeKeyValueOfDisburseState('showRightPage', false));
	};

	getDisburseById(DisburseById, disburse, treeInstance) {
		const {dispatch} = this.props;
		dispatch(getDisburseById(DisburseById));
		dispatch(beginEditDisburseOther('edit', false));
	}

	onDisburseEditBegin(editType) {
		this.props.dispatch(beginEditDisburse(editType));
	}

	onFilesChange(Data) {
		this.props.dispatch(onFilesChange(Data));
	}

	onDisburseEditBeginOther(editType, value) {
		this.props.dispatch(beginEditDisburseOther(editType, value));
	}

	changeDisburseStatus(value) {
		this.props.dispatch(changeDisburseStatus(value));
	}

	onEditOver() {
		this.props.dispatch(endEditDisburse());
	}

	onSelect(id) {
		this.props.dispatch(getDisburseById(id));
		this.props.dispatch(beginEditDisburseOther('edit', false));
	}

	updateCurrentDisburse(Data) {
		this.props.dispatch(addDisburse(Data));
	}


	downloadTemplate = () => {
		NetWork.download('/static/exceltemplate/disburse_import_template.xlsx');
	};

	canSave(Data) {
		this.props.dispatch(canSave(Data));
	}

	importDatas = () => {
		Confirm({
			title: '导入支出类型数据',
			isUpload: true,
			uploadConfig: {
				url: NetWork.getUrl('/expense/importdisburseclass/'),//上传的url
				data: {importcontent: 'expenseitem'}
			},
			onFileUploadSuccess: (returnData) => {
				//返回的是上传结束后的response
				if (returnData.success) {
					Toast.error('上传成功');
				} else {
					console.log(returnData)
					// Toast.error(returnData.expenseInfo.error.join());
				}
			},
			onOk: () => {
				//显示左侧树 关闭窗口
			},
			onCancel: () => {
				//显示左侧树 关闭窗口
			}
		});
	};
	onChange = (e) => {
		if (this.state.SearchValue != null) {
			if (`${e.target.checked}` == 'true') {
				this.setState({
					SearchKey: true
				});
				this.props.dispatch(changeDisableDisburseStatus(true, this.state.SearchValue));
				const maxTimes = 10;
				let times = 1;
				const s = setInterval(() => {
					if (times >= maxTimes) {
						clearInterval(s);
					} else {
						if (document.querySelector('.disburse-item:first-child span')) {
							document.querySelector('.disburse-item:first-child span').click();
							clearInterval(s);
						} else {
							times++;
						}
					}
				}, 500)
			} else {
				this.setState({
					SearchKey: false
				});
				this.props.dispatch(changeDisableDisburseStatus(false, this.state.SearchValue));
				const maxTimes = 10;
				let times = 1;
				const s = setInterval(() => {
					if (times >= maxTimes) {
						clearInterval(s);
					} else {
						if (document.querySelector('.disburse-item:first-child span')) {
							document.querySelector('.disburse-item:first-child span').click();
							clearInterval(s);
						} else {
							times++;
						}
					}
				}, 500)
			}
		} else {

			if (`${e.target.checked}` == 'true') {
				this.setState({
					SearchKey: true
				});
				this.props.dispatch(changeDisableDisburseStatus(true, null));
				const maxTimes = 10;
				let times = 1;
				const s = setInterval(() => {
					if (times >= maxTimes) {
						clearInterval(s);
					} else {
						if (document.querySelector('.disburse-item:first-child span')) {
							document.querySelector('.disburse-item:first-child span').click();
							clearInterval(s);
						} else {
							times++;
						}
					}
				}, 500)
			} else {
				this.setState({
					SearchKey: false
				});
				this.props.dispatch(changeDisableDisburseStatus(false, null));
				const maxTimes = 10;
				let times = 1;
				const s = setInterval(() => {
					if (times >= maxTimes) {
						clearInterval(s);
					} else {
						if (document.querySelector('.lazy-tree-node:first-child span')) {
							document.querySelector('.lazy-tree-node:first-child span').click();
							clearInterval(s);
						} else {
							times++;
						}
					}
				}, 500)
			}


		}

	};
	onSearch = (text) => {
		if (text) {
			this.setState({
				SearchValue: text
			});
			this.props.dispatch(showSearchDisburse(text, this.state.SearchKey));
			const maxTimes = 10;
			let times = 1;
			const s = setInterval(() => {
				if (times >= maxTimes) {
					clearInterval(s);
				} else {
					if (document.querySelector('.disburse-item:first-child span')) {
						document.querySelector('.disburse-item:first-child span').click();
						clearInterval(s);
					} else {
						times++;
					}
				}
			}, 500)
		} else {
			this.setState({
				SearchValue: null
			});
			// this.props.dispatch(showSearchDisburse(false, value));
			const maxTimes = 10;
			let times = 1;
			const s = setInterval(() => {
				if (times >= maxTimes) {
					clearInterval(s);
				} else {
					if (document.querySelector('.lazy-tree-node:first-child span')) {
						document.querySelector('.lazy-tree-node:first-child span').click();
						clearInterval(s);
					} else {
						times++;
					}
				}
			}, 500)
		}
	};

	render() {
		const disburseState = this.props.$$disburseState.toJS();
		const {currentDisburse, editingDisburse, showDisableDisburse, disableDisburseList, showEdit, canSaveValue} = disburseState;
		const isDummy = this.props.baseState.userInfo.isDummy;
		return (
			<div className="page disburse-page">
				<div className="content-left" style={{width: 'initial', overflow: 'auto'}}>

					{/*<Search*/}
					{/*size={'large'}*/}
					{/*placeholder="搜索"*/}
					{/*style={{width: '100%'}}*/}
					{/*onSearch={value=>{this.onSearch(value)}}*/}
					{/*/>*/}
					<Searchbar
						size={'large'}
						placeholder="搜索支出类型"
						style={{width: '100%', marginTop: '6px'}}
						onChange={e => this.onSearch(e.target.value)}
					/>

					<div className="disburse-left-btns" style={{visibility : !isDummy?'hidden':'visible',height: !isDummy?'0px':'28px'}}>
						<Button className="add-btn" size={'default'}

						        onClick={this.onDisburseEditBegin.bind(this, 'add')}>
							<Icon type="plus-circle"/>
							新增支出类型
						</Button>
						<Button className="add-btn" size={'default'}
						        disabled={currentDisburse.id == null || currentDisburse.status == "停用" }
						        style={{marginLeft: '20px'}}
						        onClick={this.onDisburseEditBegin.bind(this, 'addChild')}>
							<Icon type="plus-circle"/>
							新增子类型
						</Button>
					</div>
					<div style={{margin: '10px 0 0 2%'}}>
						<Checkbox checked={showDisableDisburse}
						          onChange={this.onChange}>停用的支出类型</Checkbox>
					</div>
					<br/>
					<div className="tree-container"
					     style={{overflow: 'auto', height: this.props.baseState.clientHeight - 200}}>
						{/*<p style={{backgroundColor: 'red', color: '#fff'}}>搜索暂未实现</p>*/}
						{/*<p style={{backgroundColor: 'red', color: '#fff'}}>只显示停用项目暂未实现</p>*/}
						{showDisableDisburse == true || this.state.SearchValue != null ?

							<ul className="disburse-wraper">

								{disableDisburseList.length > 0 ?
									'' : <Spin style={{marginLeft: '13px'}} tip="数据加载中...">

									</Spin>}
								{disableDisburseList != 'null' ?
									disableDisburseList.map(function (item, key) {
										return (
											<li className={item.id == currentDisburse.id ? 'disburse-item currentDisburse' : 'disburse-item'}
											    key={key}
											    onClick={() => this.onSelect(item.id)}>
												<Icon type="file"/>
												<span style={{marginLeft: '5px'}}>
                                                                     [{item.code}]
                                                                        </span>
												<span style={{marginLeft: '5px'}}>
                                                                         {item.name}
                                                                        </span>
											</li>
										)
									}, this) : <span style={{marginLeft: '13px', color: '#999'}}>没有找到支出类型</span>
								}
							</ul>
							:
							<CommonTree
								clearActionType={actionTypes.DISBURSE_TREE_ClEAR}
								treeDataActionType={actionTypes.DISBURSE_TREE_SET_PROJECT_DATA}
								treePageActionType={actionTypes.DISBURSE_TREE_SET_PAGE}
								countperpage={10}
								type='disburse'
								handleSelect={this.getDisburseById}
								reducerState="disburseState"
								baseState={this.props.baseState}
								treeState={disburseState}
								dispatch={this.props.dispatch}/>
						}

					</div>
				</div>
				{disburseState.showRightPage && (disburseState.disburseData == null || disburseState.disburseData.length === 0) && (disburseState.disableDisburseList == null || disburseState.disableDisburseList.length === 0) ?

					<NoInfo
						title="支出类型"
						downloadTemplate={this.downloadTemplate}
						importDatas={this.importDatas}>
					</NoInfo>
					:
					<DisburseInfo currentDisburse={currentDisburse}
								  isDummy={isDummy}
					              downloadTemplate={this.downloadTemplate}
					              importDatas={this.importDatas}
					              onDisburseEditBegin={this.onDisburseEditBegin}
					              onDisburseEditBeginOther={this.onDisburseEditBeginOther}
					              changeDisburseStatus={this.changeDisburseStatus}
					              editingDisburse={editingDisburse}
					              canSaveValue={canSaveValue}
					              canSave={this.canSave}
					              onFilesChange={this.onFilesChange}
					              showEdit={showEdit}
					              editType={disburseState.editType}
					              editFields={disburseState.editFields}
					              editNoParentFields={disburseState.editNoParentFields}
					              showEditModal={disburseState.showEditModal}
					              updateCurrentDisburse={this.updateCurrentDisburse}
					              onEditOver={this.onEditOver}
					>
					</DisburseInfo>
				}
				<EditDisburseForm
					currentDisburse={currentDisburse}
					editingDisburse={editingDisburse}
					editType={disburseState.editType}
					editFields={disburseState.editFields}
					editNoParentFields={disburseState.editNoParentFields}
					showEditModal={disburseState.showEditModal}
					updateCurrentDisburse={this.updateCurrentDisburse}
					onEditOver={this.onEditOver}>
				</EditDisburseForm>


			</div>
		);
	}
}


function mapStateToProps(state) {
	return {
		$$disburseState: state.get('disburseState'),
		clientHeight: state.get('baseState').toJS().clientHeight,
		baseState: state.get('baseState').toJS()
	}
}

export default connect(mapStateToProps)(Project);
