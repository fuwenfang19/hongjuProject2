/**
 * Created by uncle on 2017/5/18.
 */

import React from 'react';
import {Popover, Button, Row, Col, Input, Pagination} from 'antd';
import {connect} from 'react-redux';
import {SearchConditions, EditTable, BillTypeChoose, CommonChoose} from '../../components/common'
import * as actions from '../../actions/index'
import uuid from 'uuid';
import domUtil from '../../global/utils/domutil';
import {changeSchemaToTableColumns, generateEditForms} from '../../global/utils/billdetail';
import {hashHistory} from 'react-router';


//我的预算申请列表 表头字段
const applicationListTableColumn = [
	{
		title: '单据类型',
		dataIndex: 'objectclassname',
		width: '10%',
	},
	{
		title: '申请编号',
		dataIndex: 'code',
		width: '10%',

	},
	{
		title: '编制日期',
		dataIndex: 'braidDate',
		width: '10%',
	},
	{
		title: '编制人',
		dataIndex: 'creatername',
		width: '10%',
	},
	{
		title: '预算金额',
		dataIndex: 'amount',
		width: '10%',
	},
	{
		title: '审批状态',
		dataIndex: 'status',
		width: '10%',
	},
	{
		title: '最后审批人',
		dataIndex: 'approvername',
		width: '10%',
	},
	{
		title: '备注',
		dataIndex: 'remark',
		width: '10%',
	}
];
//我的申请单列表 查询条件
const applicationListSearchConditionRows = [
	[
		{
			label: '单据类型',
			code: 'objectclassids',
			type: 'commonChoose',
			fileType: 'billType',
			showGroup: false,
			isRadio: false,
			billTypes: []
		},
		{label: '单据编号', code: 'codes', type: 'input',},
		{label: '预算总额', colNum: 2, haveHr: true, code1: 'amountBegin', code2: 'amountEnd', type: 'inputNumber', step: 0.01}
	],
	[
		{label: '录入日期', colNum: 2, haveHr: true, code1: 'braidDateBegin', code2: 'braidDateEnd', type: 'date',},
		{
			label: '审批状态', code: 'statuses', type: 'checkboxGroup', options: [
			{label: '未提交', value: '0'},
			{label: '审批中', value: '1'},
			{label: '已通过', value: '2'},
			{label: '已驳回', value: '3'},
		]
		},
		{
			label: null, type: 'btns',
			btns: [
				{btnType: 'clear',},
				{btnType: 'search',},
				{btnType: 'collapse',}
			]
		}
	],
	[{label: '备注', code: 'remarks', type: 'input'}]
];

class BudgetApplication extends React.Component {

	constructor() {
		super();
	}

	componentDidMount() {
		this.props.dispatch(actions.getMyBudgetApplicationList());
		this.props.dispatch(actions.getBudgetApplicationTypeList());
	}

	componentWillReceiveProps() {
	}


	onSearchConditionsChange = (conditions) => {
		const {dispatch} = this.props;
		dispatch(actions.changeBudgetApplicationKeyValue('myBudgetApplicationSearchConditions', conditions));
	};
	onDoSearch = (btnType) => {
		const {dispatch} = this.props;
		// 比如点击搜索按钮之后的处理
		if (btnType === 'search') {
			dispatch(actions.getMyBudgetApplicationList());
		}
	};

	goDetailOrEdit = (record) => {
		if ([0, 3].indexOf(record.status) !== -1) {//未提交和驳回的可以编辑
			hashHistory.push('budget_application_edit/' + record.id);
		} else {
			hashHistory.push('budget_application_detail/' + record.id);
		}
	};

	render() {

		const {budgetApplicationState} = this.props;
		let {myBudgetApplicationSearchConditions, budgetApplicationList, budgetBillTypes} = budgetApplicationState;

		return (
			<div className="page budget-application-page">
				<div className="content-right">
					<div className="content-right-head">
						<div className="head-left">
							<span className="billName">预算申请</span>
						</div>
						<div className="head-right">
							<Popover overlayClassName="bill-name-pop" content={
								<div>
									<ul className="popover-bill-type-name-container">
										{budgetBillTypes.map((item, index) => {
											return <li className="popover-bill-type-name" key={index}
											           onClick={() => {
												           console.log(item);
											           }
											           }>{item.name}</li>
										})}
									</ul>
								</div>
							} title="预算申请类型" trigger="click" placement="bottomRight">
								<Button className="ant-btn ant-btn-primary">新增</Button>
							</Popover>
						</div>
					</div>
					<div>
						<SearchConditions
							conditions={myBudgetApplicationSearchConditions}
							conditionsRows={applicationListSearchConditionRows}
							onChange={this.onSearchConditionsChange}
							onBtnClick={this.onDoSearch}
						/>

						<EditTable
							columns={applicationListTableColumn}
							dataSource={budgetApplicationList.rows}
							isEditing={false}
							onRowClick={(record, index) => {
								this.goDetailOrEdit(record, index)
							}}
						/>
						<div className="page-container">
							<Pagination onChange={(page, pageSize) => {
								myBudgetApplicationSearchConditions.pagenum = page;
								this.onSearchConditionsChange(myBudgetApplicationSearchConditions);
							}} pageSize={myBudgetApplicationSearchConditions.countperpage} total={budgetApplicationList.total}
							            showTotal={(total, range) => (`共 ${total} 条`)}/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {
		clientHeight: state.get('baseState').toJS().clientHeight,
		budgetApplicationState: state.get('budgetApplicationState').toJS(),
	}
}

export default connect(mapStateToProps)(BudgetApplication);
