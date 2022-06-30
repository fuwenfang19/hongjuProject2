/**
 * Created by uncle on 2017/2/28.
 */
import React from 'react';
import {Tooltip, Row, Icon, Switch, Button, Input, Dropdown, Menu, Checkbox} from 'antd';
import {Toast, Confirm, renderLabelAndValues, DropdownList} from '../../../components/common';
import domUtil from '../../../global/utils/domutil';
import * as projectConstants from '../../../constants/basefiles/project'
import edit from '../../../images/basefiles/edit.png'
import {EditTable} from '../../common/index'
//import select from '../../../images/basefiles/select.png'
const {MEMBER_IN_PROJECT, MEMBER_OUT_PROJECT} = projectConstants;

class ProjectInfo extends React.Component {

	constructor() {
		super();
		this.state = {
			offset: null,
		};
		this.handDropDownBtnClick = this.handDropDownBtnClick.bind(this);
		this.downloadTemplate = this.downloadTemplate.bind(this);
		this.importDatas = this.importDatas.bind(this);
		this.editProject = this.editProject.bind(this);
	}

	componentDidMount() {
		this.resetTableOffset();
	}

	componentWillReceiveProps() {
		this.resetTableOffset();
	}

	resetTableOffset = () => {
		if (this.refs.membersTable) {
			this.setState({
				offset: domUtil.getElementOffSet(this.refs.membersTable)
			})
		}
	};

	handDropDownBtnClick(type) {
		console.log(type);
		if (type === 'batchEdit') {//批量编辑
			this.props.changeBatchEditProjectFlag(true);
		}
	}

	downloadTemplate() {
		this.props.downloadTemplate();
	}

	importDatas() {
		this.props.importDatas();
	}

	editProject() {
		if (this.props.currentProject.id) {
			this.props.onEditBegin('edit');
		} else {
			Toast.info('请先选择一个项目');
		}
	}

	changeAddMembersFlag = () => {
		this.props.changeAddMembersFlag(true);
	};
	editMembers = () => {
		this.props.changeEditMembersFlag(true);
	};
	editMembersOver = () => {
		this.props.changeEditMembersFlag(false);
	};
	saveMembersChange = () => {
		this.props.saveMembersChange();
	};
	onMemberStatusChange = (record, index) => {
		this.props.updateEditingMembers(index, record);
	};


	switchItemStaffsShow = (e) => {
		this.props.switchItemStaffsShow(e.target.checked ? MEMBER_OUT_PROJECT : MEMBER_IN_PROJECT);
	};


	render() {
		const {currentProject, editingProject, currentProjectMembers, editingProjectMembers} = this.props;
		const buttons = [
			{
				key: 'btn1',
				size: 'small',
				type: 'primary',
				text: '下载模板',
				onClick: this.downloadTemplate
			},
			{
				key: 'btn2',
				size: 'small',
				type: 'primary',
				text: '导入数据',
				onClick: this.importDatas
			},
			{
				key: 'btn3',
				size: 'small',
				type: 'primary',
				text: '编辑项目',
				disabled: currentProject.id == null,
				onClick: this.editProject
			},
			{
				key: 'btn4',
				size: 'small',
				type: 'primary',
				text: '批量修改',
				onClick: () => {
					this.props.changeBatchEditProjectFlag(true);
				},
			}
		];
		const projectStaffBtns = [

			{
				key: 'projectStaffBtns2',
				size: 'small',
				src: edit,
				type: '',
				text: '编辑',
				onClick: this.editMembers,
				disabled: currentProject.id == null || currentProjectMembers.length === 0,
			}, {
				key: 'projectStaffBtns5',
				size: 'small',
				type: 'primary',
				text: '新增成员',
				onClick: this.changeAddMembersFlag,
				disabled: currentProject.id == null,
			},
		];
		const projectStaffEditLeftBtns = [
			{
				key: 'projectStaffBtns6',
				size: 'small',
				type: 'primary',
				text: '取消编辑',
				onClick: this.editMembersOver
			}
		];
		const projectStaffEditRightBtns = [
			{
				key: 'projectStaffBtns7',
				size: 'small',
				icon: 'save',
				type: 'primary',
				text: '保存',
				onClick: this.saveMembersChange
			}
		];

		const columns = [
			{
				width: 100,
				title: '项目成员 ',
				dataIndex: 'name',
			}, {
				width: 100,

				title: '所属公司 ',
				dataIndex: 'company',
			}, {
				width: 100,
				title: '所属部门 ',
				dataIndex: 'department',
			}, {
				width: 100,
				title: this.props.isEditingMembers ? '状态(可编辑) ' : '状态',
				dataIndex: 'status',

				dataType: {
					type: 'switch',
					switchLabel: '在项目',
					trueShowText: projectConstants.MEMBER_IN_PROJECT,//非编辑态显示的文字
					falseShowText: projectConstants.MEMBER_OUT_PROJECT,//非编辑态显示的文字
					trueText: projectConstants.MEMBER_IN_PROJECT,//勾选时候的字段对应的值
					falseText: projectConstants.MEMBER_OUT_PROJECT
				}
			}
		];

		const dropDownList = {trigger: 'click', data: [{id: 'batchEdit', type: 'edit', name: '批量编辑'}]};

		// const dropDownListmenu = (
		// 	<Menu>
		// 		<Menu.Item key="0">
		// 			<img src={select} alt=""/>批量修改
		// 		</Menu.Item>
		// 		<Menu.Item key="1">
		// 			<Icon type="close" tyle={{color:'red'}}/>删除项目
		// 		</Menu.Item>
		// 	</Menu>
		// );

		const menu = (
			<Menu>
				<Menu.Item>
					<a href="javascript:;"><Checkbox onChange={(e) => {
						this.switchItemStaffsShow(e)
					}}>只显示已退出成员</Checkbox></a>
				</Menu.Item>
			</Menu>
		);
		return (
			<div className="content-right">
				<div className="content-right-head">
					<div className="head-left">
							 <Tooltip title={currentProject.code ? '[' + currentProject.code + '] ' + currentProject.name : ''}>
						     <span className="billName">{currentProject.code ? '[' + currentProject.code + '] ' + currentProject.name : ''}</span>
						  </Tooltip>
					</div>
					<div className="head-right">
						启用<Switch checked={currentProject.status === '正常'} onChange={(checked) => {
						this.props.onOrOffProject(checked);
					}}/>
						{renderToolButton(buttons)}
						{/*<DropdownList {...dropDownList} clickAddItem={(key) => {*/}
						{/*this.handDropDownBtnClick(key);*/}
						{/*}}>*/}
						{/*<Button>更多...</Button>*/}
						{/*</DropdownList>*/}
					</div>
				</div>
				<div>
					<Row gutter={2}>
						{renderLabelAndValues('项目编码', currentProject.code, true)}
						{renderLabelAndValues('项目名称', currentProject.name, true)}
						{renderLabelAndValues('项目别名', currentProject.searchName)}
						{renderLabelAndValues('所属部门', currentProject.department && currentProject.department.name)}
						{renderLabelAndValues('项目总监', currentProject.director && currentProject.director.name)}
						{renderLabelAndValues('公共项目', currentProject.isCommon === true ? '是' : (currentProject.id ? '否' : ''))}

						{renderLabelAndValues('项目经理', currentProject.manager && currentProject.manager.name)}
						{renderLabelAndValues('财务主管', currentProject.finManager && currentProject.finManager.name)}
						{renderLabelAndValues('项目状态', currentProject.status)}
						{renderLabelAndValues('开始时间', currentProject.startDate)}
						{renderLabelAndValues('结束时间', currentProject.endDate)}
					</Row>
					<div className="single-line"></div>
				</div>


				{this.props.isEditingMembers ?
					<div style={{display: currentProject.isCommon === false ? 'flex' : 'none'}}
					     className="content-right-head editing">
						<div className="head-left">
							{renderToolButton(projectStaffEditLeftBtns)}
						</div>
						<div className="head-right">
							{renderToolButton(projectStaffEditRightBtns)}
						</div>
					</div>
					:
					<div style={{display: currentProject.isCommon === false ? 'flex' : 'none'}}
					     className="content-right-head item-staffs">
						<div
							className="head-left">项目成员<span
							style={{marginLeft: 6, marginRight: 6}}>{editingProjectMembers.length}人</span>
							<Dropdown overlay={menu} trigger={['click']} overlayStyle={{maxWidth: 180}}>
								<Icon type="caret-down"></Icon>
							</Dropdown>
						</div>
						<div className="head-right" style={{display: 'flex', flexDirection: 'row'}}>
							{renderToolIcon(projectStaffBtns)}
						</div>
					</div>
				}

				<div ref="membersTable" style={{display: currentProject.isCommon === false ? 'block' : 'none'}}>
					{/*<Table*/}
					{/*{...tableConfig}*/}
					{/*columns={columns}*/}
					{/*dataSource={editingProjectMembers}*/}
					{/*rowKey={(record) => {*/}
					{/*return record.id;*/}
					{/*}}/>*/}

					<EditTable
						clientHeight={this.props.clientHeight}
						columns={columns}
						dataSource={editingProjectMembers}
						isEditing={this.props.isEditingMembers}
						rowKey={(record) => {
							return record.id;
						}}
						onTableDataChange={(newTableDatas) => {
							console.log(newTableDatas);
						}}
						onRowDataChange={(index, record) => {
							this.onMemberStatusChange(record, index);
						}}
					>

					</EditTable>
				</div>
			</div>
		)
	}
}

//右侧功能按钮
function renderToolButton(buttons) {
	return buttons.map((button) => {
		return (
			<Button key={button.key} size={button.size} type={button.type} disabled={button.disabled}
			        onClick={button.onClick}>
				{button.icon ?
					<Icon style={{fontSize: '16px'}} type={button.icon}/> :
					null
				}
				<span>{button.text}</span>
			</Button>
		)
	})
}
//右侧图标功能按钮
function renderToolIcon(Icontexts) {
	return Icontexts.map((Icontext) => {
		return (
			<div key={Icontext.key} size={Icontext.size} type={Icontext.type}
			     disabled={Icontext.disabled}
			     onClick={Icontext.onClick}
			     style={{
				     display: Icontext.disabled ? 'none' : 'flex',
				     flexDirection: 'row',
				     marginRight: '20px',
				     cursor: 'pointer',
				     alignItems: 'center'
			     }}

			>
				{Icontext.type ? <Icon type="user-add" style={{marginTop: '2px', marginRight: '2px'}}/> :
					<img src={Icontext.src} style={{width: '15px', height: '15px', marginTop: '2px', marginRight: '2px'}}/>}
				{Icontext.text}
			</div>
		)
	})
}

export default ProjectInfo;