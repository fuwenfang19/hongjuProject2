import React from 'react';
import {Icon, Button, Menu, Tabs} from 'antd';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import {is} from 'immutable';

import {Toast, EditTable, EditTableButtons, Confirm} from '../../common/index';
const TabPane = Tabs.TabPane;

const bankAddData = {
	code: '',
	name: '',
	enable: true
};
const bankAccountAddData = {
	bank: [],
	name: '',
	shortname: '',
	account: 0,
	expensepay: false,
	enable: true
};
const payMethodAddData = {
	code: '',
	name: '',
	payMethod: 'cashpayment',
	enable: true
};

const getRequireTitle = (title) => {
	return <div><span>{title}</span><span className="require-star">*</span></div>;
};
const bankColumns = [
	{
		title: getRequireTitle('银行编码'),
		dataIndex: 'code',
		width: '25%',

		dataType: {
			type: 'text',
		},
	},
	{
		title: getRequireTitle('银行名称'),
		dataIndex: 'name',
		width: '25%',

		dataType: {
			type: 'text',
		},

	},
	{
		title: '启用',
		dataIndex: 'enable',
		width: '40%',

		dataType: {
			type: 'switch',
			switchLabel: '启用状态',
			trueShowText: '启用',
			falseShowText: '停用'
		}
	}
];

const bankAccountColumns = [
	{
		title: getRequireTitle('银行总行'),
		dataIndex: 'bank',
		width: '20%',

		dataType: {
			type: 'file',
			fileType: 'bank'
		},
	},
	{
		title: getRequireTitle('支行全称'),
		dataIndex: 'name',
		width: '20%',

		dataType: {
			type: 'text',
		},

	},
	{
		title: getRequireTitle('支行简称'),
		dataIndex: 'shortname',
		width: '15%',

		dataType: {
			type: 'text',
		},
	},
	{
		title: getRequireTitle('账号'),
		dataIndex: 'account',
		width: '20%',

		dataType: {
			type: 'number',
		},
	},
	{
		title: '是否报销支付账户',
		dataIndex: 'expensepay',
		width: '15%',

		dataType: {
			type: 'switch',
			trueShowText: '是',
			falseShowText: '否'
		},
	},
	{
		title: '账号启用',
		dataIndex: 'enable',
		width: '10%',

		dataType: {
			type: 'switch',
			trueShowText: '是',
			falseShowText: '否'
		},
	}
];

const payMethodColumns = [
	{
		title: getRequireTitle('编码'),
		dataIndex: 'code',
		width: '15%',

		dataType: {
			type: 'text',
		},
	},
	{
		title: getRequireTitle('名称'),
		dataIndex: 'name',
		width: '25%',

		dataType: {
			type: 'text',
		},

	},
	{
		title: '支付方式',
		dataIndex: 'payMethod',
		width: '30%',

		dataType: {
			type: 'radio',
			radioList: [
				{
					name: '现金支付',
					value: 'cashpayment'
				}, {
					name: '银行支付',
					value: 'bankpayment'
				}, {
					name: '票据支付',
					value: 'notepayment'
				},
			]
		}
	},
	{
		title: '启用',
		dataIndex: 'enable',
		width: '30%',

		dataType: {
			type: 'switch',
			switchLabel: '启用状态',
			trueShowText: '启用',
			falseShowText: '停用'
		}
	}
];

class BankAccountPay extends React.Component {
	constructor() {
		super();
	}

	componentDidMount() {
		this.initData();
	}

	initData = () => {
		const {dispatch} = this.props;
		dispatch(actions.getAllBankList());
		dispatch(actions.getBankAccountList());
		dispatch(actions.getPayMethodList());
	};

	shouldComponentUpdate(nextProps, nextState) {
		return !(this.props === nextProps || is(this.props, nextProps)) || !(this.state === nextState || is(this.state, nextState));
	}

	onTabChange = (key) => {
		const bankAccountState = this.props.bankAccountState;
		let confirmTitle = '', tag = '', isEditing = false;
		if (bankAccountState.isEditingBank) {
			isEditing = true;
			confirmTitle = '银行档案';
			tag = 'isEditingBank';
		} else if (bankAccountState.isEditingBankAccount) {
			isEditing = true;
			confirmTitle = '企业银行账号';
			tag = 'isEditingBankAccount';
		} else if (bankAccountState.isEditingPayMethod) {
			isEditing = true;
			confirmTitle = '支付方式';
			tag = 'isEditingPayMethod';
		}
		if (isEditing) {
			Confirm({
				title: confirmTitle,
				content: {
					message: `您确定放弃编辑${confirmTitle}吗？`,
					explain: '确认放弃编辑，您编辑的数据将会丢失，直接切换到其他页签;取消将停留在当前页签。',
					highLightText: confirmTitle,
				},
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.props.dispatch(actions.changebEditingFlag(tag, false));
					this.props.dispatch(actions.changebToOriginData());
					this.props.dispatch(actions.changeFileTab(key));
				},
				onCancel: () => {

				}
			});

		} else {
			this.props.dispatch(actions.changeFileTab(key))
		}
	};

	onTableDataChange = (newTableData) => {
		this.props.dispatch(actions.updateBapTableData(newTableData));

	};

	onBankEditClick = () => {
		this.props.dispatch(actions.changebEditingFlag('isEditingBank', true));
	};
	onBankAddClick = () => {
		this.props.dispatch(actions.changebEditingFlag('isEditingBank', true));
		this.props.dispatch(actions.addBapTableData(bankAddData));
	};
	onBankCancelClick = () => {
		this.props.dispatch(actions.changebEditingFlag('isEditingBank', false));
		this.props.dispatch(actions.changebToOriginData());
	};
	onBankSaveClick = () => {
		this.props.dispatch(actions.saveBapTableData());
	};


	onBankAccountEditClick = () => {
		this.props.dispatch(actions.changebEditingFlag('isEditingBankAccount', true));
	};
	onBankAccountAddClick = () => {
		this.props.dispatch(actions.changebEditingFlag('isEditingBankAccount', true));
		this.props.dispatch(actions.addBapTableData(bankAccountAddData));
	};
	onBankAccountCancelClick = () => {
		this.props.dispatch(actions.changebEditingFlag('isEditingBankAccount', false));
		this.props.dispatch(actions.changebToOriginData());
	};
	onBankAccountSaveClick = () => {
		this.props.dispatch(actions.saveBapTableData());
	};

	onPayMethodEditClick = () => {
		this.props.dispatch(actions.changebEditingFlag('isEditingPayMethod', true));
	};
	onPayMethodAddClick = () => {
		this.props.dispatch(actions.changebEditingFlag('isEditingPayMethod', true));
		this.props.dispatch(actions.addBapTableData(payMethodAddData));
	};
	onPayMethodCancelClick = () => {
		this.props.dispatch(actions.changebEditingFlag('isEditingPayMethod', false));
		this.props.dispatch(actions.changebToOriginData());
	};
	onPayMethodSaveClick = () => {
		this.props.dispatch(actions.saveBapTableData());
	};

	changeKeyValue = (k, v) => {
		this.props.dispatch(actions.changebEditingFlag(k, v));
	};
	deleteWithIndex = () => {
		this.props.dispatch(actions.deleteBAMTableData());
	};


	render() {
		const {bankAccountState} = this.props;
		const {
			bankList, bankAccountList, payMethodList,
			isEditingBank, isEditingBankAccount, isEditingPayMethod,
			selectBanks, selectBankAccounts, selectPayMethods,
		} = bankAccountState;
		const isDummy = 1 || window.getUserInfo().isDummy;


		const BankRowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.changeKeyValue('selectBanks', selectedRowKeys);
			},
			selectedRowKeys: selectBanks
		};


		const BankAccountRowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.changeKeyValue('selectBankAccounts', selectedRowKeys);
			},
			selectedRowKeys: selectBankAccounts
		};


		const PayMethodRowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.changeKeyValue('selectPayMethods', selectedRowKeys);
			},
			selectedRowKeys: selectPayMethods
		};

		return (
			<div className="page bank-account-page">
				<div className="content-right">
					<Tabs defaultActiveKey="1"
					      activeKey={bankAccountState.currentTab}
					      onTabClick={this.onTabChange}>
						<TabPane tab="银行档案" key="1">
							{selectBanks.length > 0 ?
								<div className="content-right-head editing">
									<div className="head-left">
										<Button type="primary" onClick={() => {
											this.changeKeyValue('selectBanks', []);
										}}>取消</Button>
									</div>
									<div className="head-right">
										<Button type="primary" onClick={() => {
											this.deleteWithIndex();
										}}><Icon type="close"/> 删除</Button>
									</div>
								</div>
								:
								<div>
									{EditTableButtons(isEditingBank, {
										onEditClick: this.onBankEditClick,
										onAddClick: this.onBankAddClick,
										onCancelClick: this.onBankCancelClick,
										onSaveClick: this.onBankSaveClick
									})}
								</div>
							}


							<EditTable
								dataSource={bankList}
								isEditing={isEditingBank}
								columns={bankColumns}
								rowKey={(record, index) => {
									return index;
								}}
								rowSelection={isEditingBank ? BankRowSelection : null}
								onTableDataChange={this.onTableDataChange}
							>

							</EditTable>

						</TabPane>
						<TabPane tab="企业银行账户" key="2">
							{selectBankAccounts.length > 0 ?
								<div className="content-right-head editing">
									<div className="head-left">
										<Button type="primary" onClick={() => {
											this.changeKeyValue('selectBankAccounts', []);
										}}>取消</Button>
									</div>
									<div className="head-right">
										<Button type="primary" onClick={() => {
											this.deleteWithIndex();
										}}>删除</Button>
									</div>
								</div>
								:
								<div>
									{EditTableButtons(isEditingBankAccount, {
										onEditClick: this.onBankAccountEditClick,
										onAddClick: this.onBankAccountAddClick,
										onCancelClick: this.onBankAccountCancelClick,
										onSaveClick: this.onBankAccountSaveClick
									})}
								</div>
							}

							<EditTable
								dataSource={bankAccountList}
								isEditing={isEditingBankAccount}
								columns={bankAccountColumns}
								rowKey={(record, index) => {
									return index;
								}}
								rowSelection={isEditingBankAccount ? BankAccountRowSelection : null}
								onTableDataChange={this.onTableDataChange}
							>
							</EditTable>

						</TabPane>
						<TabPane tab="支付方式" key="3">
							{isDummy ?
								<div>
									{selectPayMethods.length > 0 ?
										<div className="content-right-head editing">
											<div className="head-left">
												<Button type="primary" onClick={() => {
													this.changeKeyValue('selectPayMethods', []);
												}}>取消</Button>
											</div>
											<div className="head-right">
												<Button type="primary" onClick={() => {
													this.deleteWithIndex();
												}}>删除</Button>
											</div>
										</div>
										:
										<div>
											{EditTableButtons(isEditingPayMethod, {
												onEditClick: this.onPayMethodEditClick,
												onAddClick: this.onPayMethodAddClick,
												onCancelClick: this.onPayMethodCancelClick,
												onSaveClick: this.onPayMethodSaveClick
											})}
										</div>
									}
								</div>
								:
								<p style={{color: '#ccc'}}>支付方式由集团管理员维护，如有疑问，请联系集团管理员或红橘客服。</p>
							}

							<EditTable
								dataSource={payMethodList}
								isEditing={isEditingPayMethod}
								columns={payMethodColumns}
								rowKey={(record, index) => {
									return index;
								}}
								rowSelection={isEditingPayMethod ? PayMethodRowSelection : null}
								onTableDataChange={this.onTableDataChange}
							>
							</EditTable>

						</TabPane>
					</Tabs>
				</div>
			</div>
		)
	}
}


function mapStateToProps(state) {
	return {
		bankAccountState: state.get('bankAccountState').toJS(),
		clientHeight: state.get('baseState').toJS().clientHeight,
		baseState: state.get('baseState').toJS()
	}
}

export default connect(mapStateToProps)(BankAccountPay);
