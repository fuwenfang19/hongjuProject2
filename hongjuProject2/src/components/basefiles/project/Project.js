import React from 'react';
import {Icon, Button, Input, Checkbox} from 'antd';
import {connect} from 'react-redux';
import {
	getProjectById,
	beginEditProject, endEditProject, changeEditMembersFlag, changeBatchEditProjectFlag,
	addProject, editProject, batchEditProject, doBatchEdit,
	updateAddingProject, beginEditProjectMembers, changeAddMembersFlag,
	updateEditingMembers, getProjectMembersById, saveMembers, addProjectMembers, changeFileChooseFlag,
	getSearchProjectList, changeKeyValueOfProjectState,
	onOrOffProject, reloadProjectTree

} from '../../../actions';
import {is} from 'immutable';
import {CommonTree, Confirm, Toast, NoInfo} from '../../common';
import ProjectInfo from './ProjectInfo';
import EditProjectForm from './EditProjectForm';
import BatchEditProject from './BatchEditProject';
import AddMembers from './AddMembers';
import NetWork from '../../../global/utils/network';
import * as actionTypes from  '../../../actions/actionTypes';
import Searchbar from '../../common/Searchbar.js'
import '../../department/department.scss'
const Search = Input.Search;

class Project extends React.Component {
	constructor() {
		super();
		this.getProjectById = this.getProjectById.bind(this);
		this.onEditBegin = this.onEditBegin.bind(this);
		this.onEditOver = this.onEditOver.bind(this);
		this.changeEditMembersFlag = this.changeEditMembersFlag.bind(this);
		this.updateCurrentProject = this.updateCurrentProject.bind(this);
		this.onAddingProjectChange = this.onAddingProjectChange.bind(this);
		this.updateEditingMembers = this.updateEditingMembers.bind(this);
		this.switchItemStaffsShow = this.switchItemStaffsShow.bind(this);
		this.state = {
			showTree: true,
		}
	}

	componentDidMount() {
		const maxTimes = 20;
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
		}, 1000)
	}

	componentWillUnmount() {
		const {dispatch} = this.props;
		dispatch(changeKeyValueOfProjectState('showRightPage', false));
	};

	shouldComponentUpdate(nextProps, nextState) {
		return !(this.props === nextProps || is(this.props, nextProps)) || !(this.state === nextState || is(this.state, nextState));
	}


	getProjectById(projectId, project, treeInstance) {
		// console.log(projectId, project);
		const {dispatch} = this.props;
		dispatch(getProjectById(projectId))
	}

	onEditBegin(editType) {
		this.props.dispatch(beginEditProject(editType));
	}

	onEditOver() {
		this.props.dispatch(endEditProject());
	}

	changeEditMembersFlag(flag) {
		this.props.dispatch(changeEditMembersFlag(flag));
	}

	changeBatchEditProjectFlag = (flag) => {
		this.props.dispatch(changeBatchEditProjectFlag(flag));
	};

	changeAddMembersFlag = (flag) => {
		this.props.dispatch(changeAddMembersFlag(flag));
	};

	changeFileChooseFlag = (index, flag) => {
		this.props.dispatch(changeFileChooseFlag(index, flag));
	};

	//????????????????????????
	saveMembersChange = () => {
		this.props.dispatch(saveMembers());
	};

	addMembers = (memberIds) => {
		this.props.dispatch(addProjectMembers(memberIds));
	};

	//?????????????????????member
	updateEditingMembers(index, member) {
		this.props.dispatch(updateEditingMembers(index, member))
	}

	//???????????????????????????????????????
	updateCurrentProject(projectData) {
		this.props.dispatch(addProject(projectData));
	}


	doBatchEdit = (reqData) => {
		this.props.dispatch(doBatchEdit(reqData));
	};

	switchItemStaffsShow(status) {
		this.props.dispatch(getProjectMembersById(this.props.$$projectState.get('currentProject').get('id'), status))
	}

	onAddingProjectChange(fieldData) {
		this.props.dispatch(updateAddingProject(fieldData));
	}

	downloadTemplate = () => {
		NetWork.download('/static/exceltemplate/project_template.xlsx');
	};

	reloadTree = () => {
		this.setState({
			showTree: false,
		}, () => {
			setTimeout(() => {
				this.setState({
					showTree: true
				})
			}, 100)
		});

	};

	importDatas = () => {
		Confirm({
			title: '??????????????????',
			isUpload: true,
			fileDataFormName: 'fileToUpload',
			uploadConfig: {
				url: NetWork.getUrl('/organization/importfromexcel/'),//?????????url
				data: {importcontent: 'expenseitem,expensestaffitem'}
			},
			onFileUploadSuccess: (returnData) => {
				//??????????????????????????????response
				if (returnData.expenseInfo.isOk) {
					Toast.success('?????????????????????');
					this.reloadTree();
				} else {
					Toast.error('??????????????????????????????' + returnData.expenseInfo.error.join());
				}
				if (returnData.expensestaffitemInfo.isOk) {
					Toast.success('???????????????????????????');
					this.reloadTree();
				} else {
					Toast.error('????????????????????????????????????' + returnData.expensestaffitemInfo.error.join());
				}
			},
			onOk: () => {
				//??????????????? ????????????
			},
			onCancel: () => {
				//??????????????? ????????????
			}
		});
	};

	getProjectData = () => {
		const {dispatch} = this.props;
		dispatch(getSearchProjectList());
	};
	changeKeyValueOfProjectState = (key, value) => {
		const {dispatch} = this.props;
		dispatch(changeKeyValueOfProjectState(key, value));
		this.getProjectData();
	};

	onOrOffProject = (checked) => {
		this.props.dispatch(onOrOffProject(checked));
	};


	render() {
		const {showTree} = this.state;
		const projectState = this.props.$$projectState.toJS();
		const {
			currentProject, editingProject, currentProjectMembers,
			searchKey, projectList, showingDisableList
		} = projectState;

		return (
			<div className="page project-page">
				<div className="content-left" style={{overflow: 'hidden'}}>
					{/*<Button onClick={this.reloadTree}>reload</Button>*/}
					{/*<Search*/}
					{/*size={'large'}*/}
					{/*placeholder="??????"*/}
					{/*style={{width: '100%'}}*/}
					{/*onSearch={value => console.log(value)}*/}
					{/*/>*/}
					<Searchbar
						size={'large'}
						placeholder="????????????"
						style={{width: '100%', marginTop: '6px'}}
						onChange={e => this.changeKeyValueOfProjectState('searchKey', e.target.value)}
						onSearch={value => this.getProjectData()}
					/>

					<div className="project-left-btns">
						<Button className="add-btn" size={'default'} style={{width: '48%'}}
						        onClick={this.onEditBegin.bind(this, 'add')}>
							<Icon type="plus-circle"/>
							????????????
						</Button>
						<Button className="add-btn" size={'default'} style={{width: '48%'}}
						        disabled={currentProject.id === null || currentProject.id === undefined}
						        onClick={this.onEditBegin.bind(this, 'addChild')}>
							<Icon type="plus-circle"/>
							???????????????
						</Button>
					</div>

					<div style={{margin: '10px 0 0 2%'}}>
						<Checkbox checked={showingDisableList}
						          onChange={(e) => {
							          this.changeKeyValueOfProjectState('showingDisableList', e.target.checked);
						          }}>???????????????</Checkbox>
					</div>
					<br/>
					<div className="tree-container" style={{overflow: 'auto', height: this.props.baseState.clientHeight - 194}}>
						{/*<p style={{backgroundColor: 'red', color: '#fff'}}>??????????????????</p>*/}
						{/*<p style={{backgroundColor: 'red', color: '#fff'}}>?????????????????????????????????</p>*/}

						{
							(showingDisableList || searchKey !== '' ) ?
								(<ul className="project-disable-list">
									{projectList.length > 0 ?
										projectList.map(function (item, key) {
											return (
												<li
													className={item.id === currentProject.id ? 'project-item active' : 'project-item'}
													key={key}
													onClick={() => this.getProjectById(item.id)}>
													<Icon type="file"/>
													<span style={{marginLeft: '5px'}}>[{item.code}]</span>
													<span style={{marginLeft: '5px'}}>{item.name}</span>
												</li>
											)
										}, this) : <span style={{marginLeft: '13px', color: '#999'}}>???????????????</span>
									}
								</ul>)
								:
								<div>
									{ showTree ?
										<CommonTree
											ref="tree"
											clearActionType={actionTypes.PROJECT_TREE_ClEAR}
											treeDataActionType={actionTypes.PROJECT_TREE_SET_PROJECT_DATA}
											treePageActionType={actionTypes.PROJECT_TREE_SET_PAGE}
											countperpage={300}
											type='project'
											handleSelect={this.getProjectById}
											reducerState="projectState"
											baseState={this.props.baseState}
											treeState={projectState}
											dispatch={this.props.dispatch}/>
										:
										null
									}
								</div>

						}

					</div>
				</div>
				{projectState.showRightPage && (projectState.projectData == null || projectState.projectData.length === 0) ?

					<NoInfo
						title="??????"
						downloadTemplate={this.downloadTemplate}
						importDatas={this.importDatas}>
					</NoInfo>
					:
					<ProjectInfo currentProject={currentProject}
					             editingProjectMembers={projectState.editingProjectMembers}
					             clientHeight={this.props.clientHeight}
					             editType={projectState.editType}
					             isEditingMembers={projectState.isEditingMembers}
					             editingProject={editingProject}
					             currentProjectMembers={currentProjectMembers}
					             changeBatchEditProjectFlag={this.changeBatchEditProjectFlag}
					             changeEditMembersFlag={this.changeEditMembersFlag}
					             changeAddMembersFlag={this.changeAddMembersFlag}
					             updateEditingMembers={this.updateEditingMembers}
					             switchItemStaffsShow={this.switchItemStaffsShow}
					             saveMembersChange={this.saveMembersChange}
					             onEditBegin={this.onEditBegin}
					             downloadTemplate={this.downloadTemplate}
					             importDatas={this.importDatas}
					             onOrOffProject={this.onOrOffProject}
					             showEditModal={projectState.showEditModal}
					             showBatchEditModal={projectState.showBatchEditModal}>
					</ProjectInfo>
				}
				<EditProjectForm
					currentProject={currentProject}
					editingProject={editingProject}
					editType={projectState.editType}
					editFields={projectState.editFields}
					showEditModal={projectState.showEditModal}
					updateCurrentProject={this.updateCurrentProject}
					onEditOver={this.onEditOver}
					changeFileChooseFlag={this.changeFileChooseFlag}
					onFilesChange={this.onAddingProjectChange}>
				</EditProjectForm>


				<BatchEditProject
					showBatchEditModal={projectState.showBatchEditModal}
					changeBatchEditProjectFlag={this.changeBatchEditProjectFlag}
					doBatchEdit={this.doBatchEdit}>
				</BatchEditProject>

				<AddMembers
					isAddingMembers={projectState.isAddingMembers}
					changeAddMembersFlag={this.changeAddMembersFlag}
					addMembers={this.addMembers}
				>
				</AddMembers>


			</div>
		);
	}
}


function mapStateToProps(state) {
	return {
		$$projectState: state.get('projectState'),
		clientHeight: state.get('baseState').toJS().clientHeight,
		baseState: state.get('baseState').toJS()
	}
}

export default connect(mapStateToProps)(Project);
