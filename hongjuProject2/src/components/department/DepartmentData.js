/**
 * Created by yangyfe on 2017/2/24.
 * 带有数据的列表页面组件
 */
import React from 'react';
import {Table, Row, Col, Icon, Button, Input, Menu, Dropdown, Checkbox, Switch,Pagination} from 'antd';
import {connect} from 'react-redux';
import {
	getDepartmentById,
	getDepartmentMembersDetailById,
	getDepartmentQuitStaff,
	getDepartmentInvite,
	staffSearch,
	getDepartmentReset,
    nextDepartmentMembersDetail,
    prevDepartmentMembersDetail
} from '../../actions';
import {is} from 'immutable';
import {Toast, Confirm, DropdownList,renderLabelAndValues} from '../../components/common';
import DepartmentSlide from './departmentSlide'
import domUtil from '../../global/utils/domutil';
import * as departmentConstants from '../../constants/department/department';
import {EditTable} from '../common/index';
import Searchbar from '../common/Searchbar';
import edit from '../../images/basefiles/edit.png';
import * as types from '../../actions/actionTypes';
import * as actionTypes from  '../../actions/actionTypes';
import NetWork from '../../global/utils/network';

const Search = Input.Search;
const {MEMBER_IN_DEPARTMENT, MEMBER_OUT_DEPARTMENT} = departmentConstants;
class DepartmentData extends React.Component {
	constructor() {
		super();
		this.state = {
			selectedRowKeys: [],  // Check here to configure the default column
			loading: false,
			visible: false,
            focus:true
		};

		this.start = this.start.bind(this);
		this.onSelectChange = this.onSelectChange.bind(this);
		this.handleSlide = this.handleSlide.bind(this);
		this.testConfirm = this.testConfirm.bind(this);
		// this.getDepartmentById = this.getDepartmentById.bind(this);
		this.onRowClick = this.onRowClick.bind(this);
		this.onCloseSlider = this.onCloseSlider.bind(this);
		this.getDepartmentMembersDetailById = this.getDepartmentMembersDetailById.bind(this);
		this.editDepartment = this.editDepartment.bind(this);
		this.handDropDownBtnClick = this.handDropDownBtnClick.bind(this);
		this.getDepartmentQuitStaff = this.getDepartmentQuitStaff.bind(this);
		this.getDepartmentInvite = this.getDepartmentInvite.bind(this);
		this.handllSearch = this.handllSearch.bind(this);
		this.staffSearch = this.staffSearch.bind(this);
	}

	handDropDownBtnClick(type) {
		if (type === 'batchEdit') {//批量编辑

		}
	}
    //编辑部门
	editDepartment() {
		if (this.props.currentDepartment.id) {
			this.props.onEditBegin('edit');
		} else {
			Toast.info('请先选择一个部门');
		}
	}
	componentDidMount() {
		this.start;
        // this.textInput.focus();
	}

	//点击侧滑
	getDepartmentMembersDetailById(keyword,code, status, pagenum, department) {
		const {dispatch} = this.props;
		dispatch(getDepartmentMembersDetailById(keyword,code, status, pagenum, department))
	}

	handleSlide = (e, pagenum) => {
		this.getDepartmentMembersDetailById(this.state.value,e.code, e.status, pagenum + 1, this.props.$$departmentState.toJS().currentDepartment.id);
		this.refs.departmentSlide.show();

	}
	onCloseSlider = (e) => {
		this.refs.departmentSlide.hide()
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !(this.props === nextProps || is(this.props, nextProps)) || !(this.state === nextState || is(this.state, nextState));
	}


	start() {
		this.setState({loading: false});
		setTimeout(() => {
			this.setState({
				selectedRowKeys: [],
				loading: false,
			});
		}, 100);
	}

	//人员列表的选择
	onSelectChange(selectedRowKeys) {
		this.props.dispatch({
			type: types.CHANGE_STAFFID,
			payload:selectedRowKeys
		})
		this.setState({selectedRowKeys});
	}

	//人员列表的行的点击
	onRowClick(staffcode) {
		this.setState({staffcode});
	}

	//开关
	onChange(e) {
		this.setState({})
	}

	//判断搜索框的显示与隐藏
	handdlechange(e) {
		this.refs.departmentSearch1.className = "DepartmentData-page-head2-marg1 DepartmentData-page-head2-marg-show";
		this.refs.departmentSearch2.className = "DepartmentData-page-head2-marg-hide";
		this.handleClick();
	}
    //关闭搜索框
	closeSearch = () =>{
		this.refs.departmentSearch1.className = "DepartmentData-page-head2-marg-hide";
		this.refs.departmentSearch2.className = "DepartmentData-page-head2-marg1 DepartmentData-page-head2-marg-show";
	}
	//在职人员和离职人员的切换
	switchItemStaffsShow = (e) => {
		this.props.switchItemStaffsShow(e.target.checked == true ? MEMBER_OUT_DEPARTMENT : MEMBER_IN_DEPARTMENT);
	};
	//离职人员,重新入职人员
	getDepartmentQuitStaff = (staffids, entryquit) => {
		this.start();
		const {dispatch} = this.props;
		dispatch(getDepartmentQuitStaff(staffids, entryquit))

	}
	//邀请人员
	getDepartmentInvite = (staffids) => {
		const {dispatch} = this.props;
		dispatch(getDepartmentInvite(staffids))
	}
	//重置密码
	getDepartmentReset = () =>{
		this.props.dispatch(getDepartmentReset())
	}
	//查询人员
	staffSearch = (value, status,department) => {
		const {dispatch} = this.props;
		dispatch(staffSearch(value, status,department))

	}
	handllSearch = (e) => {
		this.staffSearch(e.target.value, this.props.$$departmentState.toJS().status,this.props.$$departmentState.toJS().currentDepartment.id);
		this.setState({value: e.target.value});

	}
	//下载模板
	downloadTemplate = () => {
		this.props.downloadTemplate();
	}

	//导入数据
	testConfirm() {
		this.props.testConfirm();
	}
	// 新增成员
	changeAddMembersFlagDepartment = (editMembersType) => {
		this.props.onEditBeginMembers(editMembersType);
	}
	//是否启用部门
	change=(checked)=>{
		this.props.changeDepartmentStatus(checked)
	};
	//next
    next=()=>{
        this.props.dispatch(nextDepartmentMembersDetail())
    	let departmentState = this.props.$$departmentState.toJS();
    	let num = departmentState.pagenum;
    	let num1 = num + 1;
		let code = departmentState.currentDepartmentMembers.rows[departmentState.pagenum].code;
		let status = departmentState.currentDepartmentMembers.rows[departmentState.pagenum].status;
		let department = departmentState.currentDepartment.id;
        this.getDepartmentMembersDetailById(this.state.value,code,status, num1, department);
    };
    //prev
    prev=()=>{
        this.props.dispatch(prevDepartmentMembersDetail());
        let departmentState = this.props.$$departmentState.toJS();
        let num = departmentState.pagenum;
        let num2 = num - 1;
        let code = departmentState.currentDepartmentMembers.rows[num2].code;
        let status = departmentState.currentDepartmentMembers.rows[num2].status;
        let department = departmentState.currentDepartment.id;
        this.getDepartmentMembersDetailById(this.state.value,code,status, num2, department);
    };
    //自动获取焦点
    handleClick = () => {
        const input = this.refs.myInput.refs.input;
        input.focus();
        input.setSelectionRange(0, input.value.length);
    };
    //批量编辑
	batchDepartment = () =>{
        this.props.changeBatchEditDepartmentFlag(true);
	}
	render() {
		const departmentState = this.props.$$departmentState.toJS();
		const {currentDepartmentMemberDetails, visible,currentDepartmentMembers} = departmentState;
		const {editingDepartment,currentDepartment,editingDepartmentMembers,status,changeBatchEditDepartmentFlag} = this.props;
		const buttons = [
			{
				key: 'btn1',
				size: 'small',
				type: 'primary',
				text: '下载模板',
				onClick: this.downloadTemplate,
			},
			{
				key: 'btn2',
				size: 'small',
				type: 'primary',
				text: '导入数据',
				onClick: this.testConfirm
			}, {
				key: 'btn3',
				size: 'small',
				type: 'primary',
				text: '编辑部门',
				onClick: this.editDepartment,
				disabled: currentDepartment.id == null,
			}
		];
		//让table自适应高度
		let offset = null;
		const tableHeaderHeight = 20;
		if (this.refs.membersTable) {
			offset = domUtil.getElementOffSet(this.refs.membersTable);
		}
		const tableConfigs = {
			pagination: false,
			scroll: {
				x: false,
				y: this.props.clientHeight - (offset ? offset.top + tableHeaderHeight + tableHeaderHeight + 8  : 400)
			},
			expandedRowRender: false
		};
		const columns = [
			{
				title: '成员编码',
				dataIndex: 'code',
				width: 100
			}, {
				title: '成员姓名',
				dataIndex: 'name',
				width: 100
			}, {
				title: '岗位',
				dataIndex: 'positionname',
				width: 100
			}, {
				title: '上级主管',
				dataIndex: 'parentname',
				width: 100
			}, {
				title: '部门',
				dataIndex: 'departmentname',
				width: 100
			}, {
				title: '账号状态',
				dataIndex: 'useraccountstatus',
				width: 100

			}
		];
		const {loading, selectedRowKeys} = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		//复选框选中的交互随复选框是否选中的交互
		let currentClassName = '';
		const hasSelected = selectedRowKeys.length > 0;
		if (hasSelected > 0) {
			currentClassName = "DepartmentData-righter";
		} else {
			currentClassName = "DepartmentData-righter-bit";
		}
		const menu = (
			<Menu>
				<Menu.Item>
					<a href="javascript:;" style={{}}>
						{
							status == '正常' ? <Checkbox onChange={(e) => {
                                this.switchItemStaffsShow(e)
                            }} defaultChecked={false}>只显示离职人员</Checkbox>
								:
							<Checkbox onChange={(e) => {
								this.switchItemStaffsShow(e)
							}} defaultChecked={true}>只显示离职人员</Checkbox>
						}
					</a>
				</Menu.Item>
			</Menu>
		);
		let shide;
		if (departmentState.status === "正常") {
			shide = <div className="DepartmentData-page-head-hide" ref={"DepartmentData-page-head-hide"}>
				<div className="DepartmentData-page-head-hide1">
					<Button type="primary" onClick={this.start}
					        disabled={!hasSelected} loading={loading}
					>取消选择</Button>
					<span style={{marginLeft: 8}}>{hasSelected ? `选择了 ${selectedRowKeys.length} 个成员` : ''}</span>
				</div>
				<div className="DepartmentData-page-head-hide2">
                                    <span className="DepartmentData-page-head2-marg" onClick={this.batchDepartment}>
                                        <Icon type="edit" />
                                        批量修改
                                    </span>
					<span className="DepartmentData-page-head2-marg" onClick={this.getDepartmentQuitStaff.bind(this, selectedRowKeys, "quit")}>
                                       <Icon type="user-delete" />
                                         离职
                                     </span>
					<span className="DepartmentData-page-head2-marg" onClick={this.getDepartmentReset}>
                                        <Icon type="lock" />
                                        重置密码
                                    </span>
					<span className="DepartmentData-page-head2-marg" onClick={this.getDepartmentInvite.bind(this, selectedRowKeys)}>
                                        <Icon type="user" />
                                        邀请
                                    </span>
				</div>
			</div>;
		} else if (departmentState.status === "离职") {
			shide = <div className="DepartmentData-page-head-hide" ref={"DepartmentData-page-head-hide"}>
				<div className="DepartmentData-page-head-hide1">
					<Button type="primary" onClick={this.start}
					        disabled={!hasSelected} loading={loading}
					>取消选择</Button>
					<span style={{marginLeft: 8}}>{hasSelected ? `选择了 ${selectedRowKeys.length} 个成员` : ''}</span>
				</div>
				<div className="DepartmentData-page-head-hide2">
                                    <span className="DepartmentData-page-head2-marg" onClick={this.getDepartmentQuitStaff.bind(this, selectedRowKeys, "entry")}>
                                        <Icon type="user-add" />
                                        重新入职
                                    </span>
				</div>
			</div>;
		}
		const switchflag = currentDepartment.status;
		return (
			<div className="DepartmentData-page page">
				<div className="gutter-box DepartmentData-right" style={{width:'100%'}}>
					<div className={currentClassName}>
						<div className="content-right-head">
                            <span
	                            className="head-left">{currentDepartment.code ? '[' + currentDepartment.code + '] ' + currentDepartment.name : ''} </span>
							<span className="head-right">
								{currentDepartment.status === '正常' ? '启用':'停用'}<Switch checked={switchflag === '正常' ? true : false} onChange={this.change}
										className="switch"
									   disabled={currentDepartment.id==null?true:false}
							/>
								{renderToolButton(buttons)}
                        </span>
						</div>
						<div>
							<Row gutter={16}>
								{renderLabelAndValues('部门编码', currentDepartment.code, true)}
								{renderLabelAndValues('部门名称', currentDepartment.name, true)}
								{renderLabelAndValues('部门主管', currentDepartment.manager && currentDepartment.manager.name, false)}
								{renderLabelAndValues('财务主管', currentDepartment.finManager && currentDepartment.finManager.name, false)}
								{renderLabelAndValues('业务序列', currentDepartment.busiSeqName, false)}
								{renderLabelAndValues('成立时间', currentDepartment.startDate, false)}
								{renderLabelAndValues('撤销时间', currentDepartment.endDate, false)}
								{renderLabelAndValues('末级部门', !!currentDepartment.isCommon ? '是' : '否', false)}
							</Row>
							<div className="single-line"></div>
						</div>
						<div className="DepartmentData-page-head" ref={"DepartmentData-page-head"}>
							<div className="DepartmentData-page-head1">
								{departmentState.status === "离职"?<span>部门<span style={{color: "red"}}>离职</span>成员</span>:'部门成员'} {currentDepartmentMembers.total}人
								<Dropdown overlay={menu} trigger={['click']}>
									<Icon type="caret-down"></Icon>
								</Dropdown>
							</div>
							<div className="DepartmentData-page-head-center" onClick={this.closeSearch}></div>
							<div className="DepartmentData-page-head2">
								<div className="DepartmentData-page-head2-marg" onClick={this.changeAddMembersFlagDepartment.bind(this,'addMembers')}>
									<Icon type="user-add"></Icon>
									新增成员
								</div>
								<div className="DepartmentData-page-head2-marg" ref={"departmentSearch2"}
								     onClick={this.handdlechange.bind(this)}>
									<Icon type="search"></Icon>
									搜索
								</div>
								<div className="DepartmentData-page-head2-marg1" ref={"departmentSearch1"}>
									<Input
										size={'large'}
										style={{width: '100%',marginTop:'5px'}}
										onChange={this.handllSearch}
										prefix={<Icon type="search" style={{marginLeft:'-8px'}}/>}
										suffix={<Icon type="" />}
										value={this.state.value}
										className="DepartmentData-page-head2-search DepartmentData-page-head2-marg"
										onFocus={this.inputOnFocus }
										ref="myInput"
									/>
								</div>
							</div>
						</div>
						{
							shide
						}
						<div ref="membersTable" className="DepartmentData-table">
							<EditTable
								{...tableConfigs}
								clientHeight={this.props.clientHeight}
								dataSource={this.props.currentDepartmentMembers.rows}
								isEditing={false}
								offsetBottom={40}
								columns={columns}
								rowKey={(record) => {
									return record.id;
								}}
								rowSelection={rowSelection}
								onRowClick={this.handleSlide}
							>

							</EditTable>
						</div>
						{/*<div className="page-container" style={{marginTop:'10px'}}>*/}
							{/*<Pagination*/}
                                {/*// onChange={}*/}
							{/*/>*/}
						{/*</div>*/}
					</div>
				</div>
				<DepartmentSlide
					ref="departmentSlide"
					currentDepartmentMemberDetails={currentDepartmentMemberDetails}
					currentDepartmentMembers={currentDepartmentMembers}
					currentDepartment={currentDepartment}
					visible={visible}
					pagenum={departmentState.pagenum}
					onEditBeginMembers={this.onEditBeginMembers}
					onEditOverMembers={this.onEditOverMembers}
					showMembersEditModal={departmentState.showMembersEditModal}
				    editMembersType={departmentState.editMembersType}
					editingDepartmentMembers={departmentState.editingDepartmentMembers}
					changeAddMembersFlagDepartment={this.changeAddMembersFlagDepartment}
					next={this.next}
					prev={this.prev}
				/>
			</div>
		);
	}
}
//右侧功能按钮
function renderToolButton(buttons) {
	return buttons.map((button) => {
		return (
			<Button key={button.key} size={button.size} type={button.type} onClick={button.onClick} disabled={button.disabled}>
				{button.text}
			</Button>
		)
	})
}
function mapStateToProps(state) {
	return {
		keyword: state.get('departmentState').keyword,
		$$departmentState: state.get('departmentState'),
		clientHeight: state.get('baseState').toJS().clientHeight,
		currentDepartmentMembers: state.get('departmentState').toJS().currentDepartmentMembers,
	}
}
export default connect(mapStateToProps)(DepartmentData);