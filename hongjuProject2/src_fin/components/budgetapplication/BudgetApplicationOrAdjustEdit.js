/**
 * Created by uncle on 2017/5/22.
 */

import React from 'react';
import {Popover, Button, Row, Col, Table} from 'antd';
import {connect} from 'react-redux';
import {SearchConditions, EditTable, Toast} from '../../components/common'
import * as actions from '../../actions/index'
import uuid from 'uuid';
import domUtil from '../../global/utils/domutil';
import {changeSchemaToTableColumns, generateEditForms} from '../../global/utils/billdetail';

import {hashHistory} from 'react-router';


//我的预算申请列表 表头字段
const applicationListTableColumn = [
	{
		title: '单据类型',
		dataIndex: 'name',
		width: '10%',
	},
	{
		title: '申请编号',
		dataIndex: 'age',
		width: '10%',

	},
	{
		title: '编制日期',
		dataIndex: 'address',
		width: '10%',
	},
	{
		title: '编制人',
		dataIndex: 'test2',
		width: '10%',
	},
	{
		title: '预算金额',
		dataIndex: 'test1',
		width: '10%',
	},
	{
		title: '审批状态',
		dataIndex: 'test3',
		width: '10%',
	},
	{
		title: '最后审批人',
		dataIndex: 'test4',
		width: '10%',
	},
	{
		title: '备注',
		dataIndex: 'test5',
		width: '10%',
	}
];
//我的申请单列表 查询条件
const applicationListSearchConditionRows = [
	[
		{label: '单据编码', code: 'billCode', type: 'input', disabled: true},
		{label: '编制时间', code: 'billCode', type: 'input', disabled: true},
		{label: '编制人', code: 'billCode', type: 'input', disabled: true},
	],
	[
		{
			label: '动态字段', code: '动态code', type: 'commonChoose', fileType: 'staff',
		},
		[
			{label: '预算时间', colNum: 2, haveHr: true, code1: 'createTimeBegin', code2: 'createTimeEnd', type: 'date',},
		],
	],
	[{label: '备注', code: 'remark', type: 'input'}]
];

class BudgetApplicationEdit extends React.Component {

	constructor() {
		super();
	}

	componentDidMount() {
		// 表格 左侧固定列的长度和宽度问题
		const id = this.props.params.id;
		console.log(id);


		let firstTh = document.querySelector('.ant-table-fixed-left .ant-table-thead th');
		let firstTdBody = document.querySelector('.ant-table-fixed-left .ant-table-body-outer td');
		console.log(firstTh, firstTdBody);

		let bodyTd = document.querySelectorAll('body');
		// for(let i = 0,l = bodyTd.length;i<l;i++){
		// 	bodyTd[i].style['width'] = '150px';
		// }
		console.log(bodyTd);
	}

	componentWillReceiveProps() {
	}

	goBack = () => {
		hashHistory.push('budget_application');//路由跳转
	};

	doCopy = (model) => {
		if (!model.objectClass.isUsed) {
			Toast.error('当前单据类型已经停用,无法复制!');
			return false;
		}
		// 请求接口 然后跳转到edit界面

	};

	doSave = () => {

	};
	doSubmit = () => {
		// 保存成功之后 跳转到detail界面
	};

	getApplicationById = () => {
		// 成功回调里判断 isEditable 如果false 跳转到detail界面
	};

	doDelete = (model) => {
		let canDelete = (model.approver === null || model.approver === undefined) && model.isEditable;
	};

	onTableDataChange = () =>{

	};
	onRowDataChange = () =>{

	};

	render() {

		const {budgetAppOrAdjustEditState} = this.props;
		const {schemaDefine, detailData} = budgetAppOrAdjustEditState;
		const {columns, addDataTemp, leafColumns} = changeSchemaToTableColumns(schemaDefine, 2017, false);

		return (
			<div className="page budget-application-page">
				<div className="content-right">
					<div className="content-right-head">
						<div className="head-left">
							<span className="billName">
								<a className="" onClick={this.goBack}>返回</a>
							</span>
						</div>
						<div className="head-right">
							<Button className="ant-btn ant-btn-primary">复制申请</Button>
							<Button className="ant-btn ant-btn-primary">调整申请</Button>
							<Button className="ant-btn ant-btn-primary">删除</Button>
							<Button className="ant-btn ant-btn-primary">保存</Button>
							<Button className="ant-btn ant-btn-primary">新增</Button>
						</div>
					</div>
					<div>
						<SearchConditions
							conditions={budgetAppOrAdjustEditState.detailData}
							conditionsRows={applicationListSearchConditionRows}
						/>

						<EditTable
							columns={columns}
							onRowDataChange={(index, data) => {
								console.log(index, data);
							}}
							onTableDataChange={(newTableData) => {
								console.log(newTableData)
							}}
							dataSource={detailData.budgetdatas}
							isEditing={1}
							scrollX={'100%'}
							onRowClick={(record, index) => {
								console.log(record, index)
							}}
						/>
					</div>
				</div>
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {
		clientHeight: state.get('baseState').toJS().clientHeight,
		budgetAppOrAdjustEditState: state.get('budgetAppOrAdjustEditState').toJS(),
	}
}

export default connect(mapStateToProps)(BudgetApplicationEdit);
