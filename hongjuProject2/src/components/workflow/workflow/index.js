/**
 * Created by uncle on 2017/3/14.
 */
import React from 'react';
import {Select, Modal, Input, Button, Switch, InputNumber, Col, Row, Icon, Tooltip} from 'antd';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import {is} from 'immutable';
import {Confirm, Toast, CommonChoose} from '../../common';
import {NewUserIntroduce} from '../../common'
import NetWork from '../../../global/utils/network';
import getQueryString from '../../../global/utils/getQueryString';

import * as workFlowConstants from '../../../constants/workflow/workflow';
import LeftTypeList from './LeftTypeList';
import WorkFlowDetail from './WorkFlowDetail';
import SideSlip from './sideSlip';
import EditCondition from './EditCondition';
import EditStep from './EditStep';
import AddWorkFlow from './AddWorkFlow';
import {changeLeftMenuSelected} from '../../../actions';
import editImg from '../../../images/billSetting/edit.png';
import uuid from 'uuid';


const Option = Select.Option;

class WorkFlow extends React.Component {
	constructor() {
		super();
	}

	componentDidMount() {
		this.getWorkFlowBillTypes();
		this.getAllOrgExpr();
		this.getAllConditionsExpr();
		this.getWorkFlowAllActions();
		//加新手引导 判断是否引导过
		this.handleIsUserIntroduced()
		//this.userIntroduce()
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !(this.props === nextProps || is(this.props, nextProps)) || !(this.state === nextState || is(this.state, nextState));
	}

	handleIsUserIntroduced = () => {
		const that = this
		let uid = window.getUserInfo().uid
		let url = '/organization/getguidemessage/' + uid + '/'
		NetWork.get(url,
			(returnData) => {
				//记录在window.userIntroduceData全局里
				window.instroduceData = returnData
				const workflowData = returnData.workflow ? returnData.workflow.dataInstroduce : 0
				if (!workflowData) {
					//alert('没有引导过')
					that.userIntroduce()
				}
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
	userIntroduce = () => {
		//TODO 判断没有进行过引导 创建cover
		const target1 = document.getElementsByClassName('conditions')[0]
		const target2 = document.getElementsByClassName('add-btn')[0]
		const userIntro = [{
			element: target1,
			info: {titlePic: '', remark: ''}, picUrl: 'workflow_setting', arrow: 0
		},
			{element: target2, info: {titlePic: '', remark: ''}, picUrl: 'workflow_modal', arrow: 0}]
		setTimeout(() => {
			NewUserIntroduce.userIntroduce(this.userIntroduceOver, userIntro)
		}, 1000)
	}
	userIntroduceOver = () => {
		//请求接口  写入已引导结束的标志
		let instroduceData = window.instroduceData
		instroduceData.workflow = {'nodataInstroduce': 0, 'dataInstroduce': 1}
		let uid = window.getUserInfo().uid
		NetWork.put('/organization/addguidemessage/' + uid + '/', instroduceData,
			(returnData) => {

			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}

	/**
	 * //获取条件表达式展示区html
	 NOT_SHOW: -1,//不显示
	 CUSTOM: 0,//自定义条件 文本框
	 YES_OR_NO: 1,//是或者否 下拉
	 ONE_DIGITS_NUMBER: 2,//一位小数
	 TWO_DIGITS_NUMBER: 3,//两位小数
	 DEPARTMENTS: 4,//部门档案参照
	 POSITION: 5,//岗位参照
	 ADVICE_CONDITION: 6,//提交人是否需要审批
	 PROJECT: 7,//项目档案参照
	 STAFF: 8,//人员档案参照
	 COMPANY: 9,//公司档案参照
	 FUND_SOURCE: 10,//资金来源档案参照
	 */
	getConditionExprShowMessageV2 = (item) => {
		const dType = item.dType;
		let types = workFlowConstants.DTYPE;
		let baseMessage = <span>{item.name}</span>;
		const operate = item.operate;
		if (operate && Object.keys(operate).length > 0) {
			baseMessage = <span>{item.name} <span className="operate-highlight">{operate.name}</span> </span>;
		}

		const wrapMessage = (message) => {
			return <span>
				<span>{baseMessage}</span>
				<span className="name-highlight">{message ? message : ''}</span>
			;</span>
		};

		if ([types.DEPARTMENTS, types.POSITION, types.PROJECT, types.STAFF, types.COMPANY, types.FUND_SOURCE].indexOf(dType) !== -1) {
			return wrapMessage(this.getValueInArrWithKey(item.value, 'name'));
		} else if (dType === types.NOT_SHOW) {// dType === types.ADVICE_CONDITION
			return '';
		} else if ([types.CUSTOM, types.YES_OR_NO, types.ONE_DIGITS_NUMBER, types.TWO_DIGITS_NUMBER].indexOf(dType) !== -1) {
			let value = item.value;
			if (dType === types.ONE_DIGITS_NUMBER) {
				value = isNaN(Number(value)) ? '0.0' : Number(value).toFixed(1);
			} else if (dType === types.TWO_DIGITS_NUMBER) {
				value = isNaN(Number(value)) ? '0.00' : Number(value).toFixed(2);
			}
			return wrapMessage(value);
		} else if (dType === -2) {//无条件
			return wrapMessage();
		} else if (dType === types.EXPENSE_RULE) {
			return wrapMessage(item.value && item.value.name);
		} else {
			return wrapMessage();
		}
	};

	//获取条件表达式编辑区html
	getConditionHtmlV2 = (item, i, actions, isTriggerCondition, stepIndex) => {
		if (item === undefined) {
			return null;
		}
		if (!item.key) {
			item.key = uuid.v1();
		}
		const dTypes = workFlowConstants.DTYPE;
		const witchFileChoose = workFlowConstants.DTYPE_WHICH_FILE;
		const dType = item.dType;
		const isDummy = window.getUserInfo().isDummy;
		let conditionHtml = null;
		let operateHtml = null;
		let operateId = null;
		return (
			<div>
				{[dTypes.NOT_SHOW, dTypes.ADVICE_CONDITION].indexOf(dType) !== -1 ?
					null
					:
					<Col className="item-container" span={24} key={i}>
						<Row gutter={2}>
							<Col span={6} className="col-label">
								<span className="condition-name">
									{item.name.length >= 10 ?
										<Tooltip placement="leftBottom" title={<div className="item-remark">{item.name}</div>}>
											{item.name}
										</Tooltip> :
										<span>{item.name}</span>
									}
								</span>
							</Col>
							<Col span={18} className="col-value">
								{(() => {
									if (item.operates && item.operates.length > 0) {
										if (item.operate) {
											operateId = item.operate.id.toString();
										} else {
											operateId = item.operates[0].id.toString();
										}
										operateHtml =
											<Select value={operateId}
											        style={{width: 80}}
											        onChange={(value) => {
												        actions.onOperateChange(i, value, item);
											        }}>
												{item.operates.map((operate, j) => {
													return <Option key={j} value={operate.id.toString()}>{operate.name}</Option>
												})}
											</Select>
									}

									if (dType === dTypes.CUSTOM) {
										conditionHtml = <Input value={item.value}
										                       onChange={(e) => {
											                       actions.onValueChange(i, e.target.value, item)
										                       }}
										                       className="condition-input"/>
									} else if (dType === dTypes.YES_OR_NO) {
										conditionHtml = null;
									} else if (dType === dTypes.EXPENSE_RULE) {
										conditionHtml =
											<div>
												<span className="expense-rule-name">费用类型：</span>
												<Select value={item.value && item.value.id.toString()}
												        className="expense-rule-select"
												        onChange={(value) => {
													        value = this.props.workFlowState.allExpenseStandards.filter((ex) => {
														        return ex.id.toString() === value;
													        })[0];
													        console.log(value);
													        actions.onValueChange(i, value, item)
												        }}>
													{this.props.workFlowState.allExpenseStandards.map((expense, j) => {
														return <Option key={j} value={expense.id.toString()}>{expense.name}</Option>
													})}
												</Select>
											</div>
									} else if (dType === dTypes.ONE_DIGITS_NUMBER) {
										conditionHtml = <InputNumber value={item.value}
										                             onChange={(e) => {
											                             actions.onValueChange(i, e, item)
										                             }}
										                             min={0} max={99999999999999} step={0.1}/>
									} else if (dType === dTypes.TWO_DIGITS_NUMBER) {
										conditionHtml = <InputNumber value={item.value}
										                             onChange={(e) => {
											                             actions.onValueChange(i, e, item)
										                             }}
										                             min={0} max={99999999999999} step={0.01}/>
									} else if ([dTypes.DEPARTMENTS, dTypes.POSITION, dTypes.PROJECT, dTypes.STAFF,
											dTypes.COMPANY, dTypes.FUND_SOURCE].indexOf(dType) !== -1) {
										const showGroup = !isDummy && [dTypes.DEPARTMENTS, dTypes.PROJECT, dTypes.STAFF].indexOf(dType) !== -1;
										conditionHtml = <CommonChoose key={item.key}
										                              initialChoosed={item.value || []}
										                              showGroup={showGroup}
										                              type={witchFileChoose[dType]}
										                              isRadio={false}
										                              onSelect={(value) => {
											                              actions.onValueChange(i, value, item);
										                              }}/>
									}
									return (
										<div className="condition-edit-items">
											{operateHtml}
											<div style={{flex: 1}}>
												{conditionHtml}
											</div>
											<div style={{minWidth: 20, paddingRight: 20}} onClick={() => {
												if (isTriggerCondition) {
													this.removeWorkFlowStepTriggerCondition(stepIndex, 'startConditions', i);
												} else {
													this.removeWorkFlowCondition(i);
												}
											}}><Icon className="condition-del-btn" type="delete"/></div>
										</div>
									);
								})()}
							</Col>
						</Row>
					</Col>
				}
			</div>
		)
	};


	/**
	 OTYPE = {
			NOT_SHOW: -1,//不显示
			FIXED: 0,//固定条件
			STAFF: 1,//人员参照 单选
			POSITIONS: 2,//岗位参照 多选
			POSITION: 3,//岗位参照 单选
	};
	 */
	getOrgExprShowMessage = (item, isNotify = false) => {
		const otype = item.otype;
		let types = workFlowConstants.OTYPE;

		const baseMessage = item.name;
		const wrapMessage = (message) => {
			return <span>{baseMessage}<span className="name-highlight">{message}</span></span>
		};

		switch (otype) {
			case types.STAFF:
				if (isNotify) {
					return wrapMessage(this.getValueInArrWithKey(item.staffs || [], 'name'));
				}
				return wrapMessage((item.staff && item.staff.name) || '');
			case types.POSITIONS:
				return wrapMessage(this.getValueInArrWithKey(item.positions || [], 'name'));
			case types.POSITION:
				return wrapMessage((item.position && item.position.name) || '');
			case types.NOT_SHOW:
				return '';
			default:
				return wrapMessage('');
		}
	};
	//获取组织表达式编辑区html
	getOrgEditHtmlV2 = (item, i, actions, isNotify, stepIndex, deleteCallBack) => {
		if (item === undefined) {
			return null;
		}
		if (!item.key) {
			item.key = uuid.v1();
		}
		const oTypes = workFlowConstants.OTYPE;
		const witchFileChoose = workFlowConstants.OTYPE_WHICH_FILE;
		const isFixedName = item.otype === 'justLabel';
		const isDummy = window.getUserInfo().isDummy;
		return (
			<Col className="item-container" span={24} key={i}>
				<Row gutter={2}>
					<Col span={isFixedName ? 24 : 6} className="col-label">
						<span className="condition-name">
								{item.name.length >= 10 ?
									<Tooltip placement="leftBottom" title={<div className="item-remark">{item.name}</div>}>
										{item.name}
									</Tooltip> :
									<span>{item.name}</span>
								}
						</span>
					</Col>
					<Col span={isFixedName ? 0 : 18} className="col-value">
						{(() => {
							const oType = item.otype;
							let orgHtml = null;

							if ([oTypes.STAFF, oTypes.POSITIONS].indexOf(oType) !== -1) {//知会人选人是多选
								let isRadio = oType === oTypes.STAFF && !isNotify;//只有步骤选人时是单选
								let value = item.value;
								if (oType === oTypes.STAFF) {
									if (isNotify) {
										value = item.staffs || [];
									} else {
										value = item.staff ? [item.staff] : [];
									}
								} else if (oType === oTypes.POSITIONS) {
									value = item.positions || [];
								}
								const showGroup = !isDummy && [oTypes.STAFF].indexOf(oType) !== -1;
								orgHtml = <CommonChoose key={item.key} initialChoosed={value || []}
								                        showGroup={showGroup}
								                        type={witchFileChoose[oType]}
								                        isRadio={isRadio}
								                        onSelect={(value) => {
									                        actions.onValueChange(i, value, item, isNotify);
								                        }}/>
							} else if ([oTypes.POSITION].indexOf(oType) !== -1) {
								orgHtml = <CommonChoose key={item.key} initialChoosed={item.position ? [item.position] : []}
								                        showGroup={false}
								                        type={witchFileChoose[oType]}
								                        isRadio={true}
								                        onSelect={(value) => {
									                        actions.onValueChange(i, value, item, isNotify);
								                        }}/>
							}
							return (
								<div className="condition-edit-items">
									<div style={{flex: 1}}>{orgHtml}</div>
									<div></div>
									{isNotify ?
										<div style={{minWidth: 20, paddingRight: 20}} onClick={() => {
											this.removeWorkFlowStepTriggerCondition(stepIndex, 'notify', i);
										}}>
											<Icon className="condition-del-btn" type="delete"/>
										</div>
										:
										<div>
											{
												deleteCallBack ?
													<div style={{minWidth: 20, paddingRight: 20}} onClick={() => {
														deleteCallBack();
													}}>
														<Icon className="condition-del-btn" type="delete"/>
													</div>
													:
													null
											}
										</div>
									}

								</div>
							);
						})()}
					</Col>
				</Row>
			</Col>
		)
	};

	getValueInArrWithKey = (arr, key, symbol = ',') => {
		let str = '';
		if (Object.prototype.toString.call(arr) === '[object Array]') {
			arr.forEach(function (item) {
				str += item[key] + symbol;
			});
			return str.substr(0, str.length - 1);
		} else {
			return str;
		}
	};

	getWorkFlowBillTypes = () => {
		this.props.dispatch(actions.getWorkFlowBillTypes());
	};

	getWorkFlowAllActions = () => {
		this.props.dispatch(actions.getWorkFlowActionsExpr());
	};

	getWorkFlowById = (process) => {
		this.props.dispatch(actions.getWorkFlowById(process));
	};

	getAllOrgExpr = () => {
		this.props.dispatch(actions.getWorkFlowOrgExpr());
	};
	getAllConditionsExpr = () => {
		this.props.dispatch(actions.getWorkFlowConditionsExpr());
	};

	editWorkFlowStepOrder = (newSteps) => {
		this.props.dispatch(actions.editWorkFlowStepOrder(newSteps));
	};

	addWorkFlowCondition = (condition) => {
		//增加的时候操作符号默认第一个
		condition.operate = condition.operates.slice()[0];
		this.props.dispatch(actions.addWorkFlowCondition(condition));
	};
	addWorkFlowStep = (step) => {
		this.props.dispatch(actions.addWorkFlowStep(step));
	};
	removeWorkFlowCondition = (index) => {
		this.props.dispatch(actions.removeWorkFlowCondition(index));
	};
	removeWorkFlowStep = (index) => {
		this.props.dispatch(actions.removeWorkFlowStep(index));
	};
	removeWorkFlowStepTriggerCondition = (stepIndex, key, index) => {
		this.props.dispatch(actions.removeWorkFlowStepTriggerCondition(stepIndex, key, index));
	};
	editWorkFlowCondition = (index, condition) => {
		this.props.dispatch(actions.editWorkFlowCondition(index, condition));
	};
	editWorkFlowStep = (stepIndex, editItemKey, editItemIndex, item) => {
		// console.log(stepIndex, editItemKey, editItemIndex, item);
		this.props.dispatch(actions.editWorkFlowStep(stepIndex, editItemKey, editItemIndex, item));
	};
	resetWorkFlowStep = (stepIndex, item) => {
		this.props.dispatch(actions.resetWorkFlowStep(stepIndex, item));
	};
	startOrStopWorkFlow = (flag) => {
		this.props.dispatch(actions.startOrStopWorkFlow(flag, this.props.workFlowState.currentDesign.id));
	};
	deleteWorkFLow = () => {
		Confirm({
			title: '提示',
			content: {
				message: '您确认要删除该流程吗？',
				explain: '如果流程未被使用可以删除，如果已经有发起流程则不允许删除',
			},
			okText: '确定',
			cancelText: '取消',
			onOk: () => {
				this.props.dispatch(actions.deleteWorkFlow(this.props.workFlowState.currentDesign.id));
			},
			onCancel: () => {
			}
		});
	};
	saveWorkFlow = () => {
		this.props.dispatch(actions.saveWorkFlow());
	};


	showSideSlip = (type) => {
		this.refs.SideSlip.showSlip(type);
	};
	showEditCondition = (flag) => {
		this.refs.editCondition.show(flag);
	};
	showEditStep = (flag, index) => {
		this.refs.editStep.show(flag, index);
	};
	showAddWorkFlowModal = (flag, type, billTypeId, billName) => {
		this.props.dispatch(actions.getWorkFlowAddList());
		this.refs.addWorkFlow.show(flag, type, billTypeId, billName);
	};
	doAddWorkFlow = (type, billTypeId, addedList) => {
		this.props.dispatch(actions.addWorkFlow(billTypeId, addedList, type));
	};
	//返回首页
	goBackHomepage = () => {
		try {
			window.location.hash = '#/homePage?guide=true'
			this.props.dispatch(changeLeftMenuSelected('homePage'))
		} catch (e) {

		}
	};

	changeWorkFlowKeyValue = (key, value) => {
		this.props.dispatch(actions.changeWorkFlowKeyValue(key, value))
	};
	changeWorkFlowRootKeyValue = (key, value) => {
		this.props.dispatch(actions.changeWorkFlowRootKeyValue(key, value))
	};

	changeWorkFlowName = () => {
		const name = this.refs.changeNameInput.refs.input.value;
		if (name.trim() === '') {
			Toast.info('流程名称不能为空！');
			return false;
		}
		this.props.dispatch(actions.changeWorkFlowName(name));
	};

	render() {
		const {workFlowState} = this.props;
		const clientHeight = this.props.baseState.clientHeight;
		const {currentDesign, currentDesignInfo} = workFlowState;
		const isFromHomepage = getQueryString('isFromHomepage')
		// console.log(currentDesign.isused);
		const buttons = [
			{
				key: 'btn1',
				size: 'small',
				type: 'primary',
				text: '删除',
				onClick: this.deleteWorkFLow
			},
			{
				key: 'btn2',
				size: 'small',
				type: 'primary',
				text: '保存',
				onClick: this.saveWorkFlow
			}
		];

		return (
			<div className="page workflow-page">
				<div className="content-left">
					<LeftTypeList
						getWorkFlowById={this.getWorkFlowById}
						typeList={workFlowState.allDesigns}
						showAddWorkFlowModal={this.showAddWorkFlowModal}
						changeWorkFlowRootKeyValue={this.changeWorkFlowRootKeyValue}
						currentDesign={workFlowState.currentDesign}
						activeBigTypeKey={workFlowState.activeBigTypeKey}
						activeBillTypeKey={workFlowState.activeBillTypeKey}
						clientHeight={this.props.baseState.clientHeight}
					>

					</LeftTypeList>
				</div>
				<div className="content-right">
					<div className="content-right-head">
						<div className="head-left design-name-edit">{currentDesign.id ? (
							<div>
								{currentDesign.name.length > 9 ?
									<Tooltip title={currentDesign.name}>
										<span className="billName">{currentDesign.name}</span>
									</Tooltip>
									:
									<span className="billName">{currentDesign.name}</span>
								}
								<img onClick={() => {
									this.changeWorkFlowRootKeyValue('showChangeNameModal', true)
								}} className="edit-name-img" src={editImg}/>
							</div>) : ''}
						</div>
						<div className="head-right">
							启用
							<Switch
								checked={currentDesign.isused}
								onChange={(checked) => {
									this.startOrStopWorkFlow(checked);
								}}
								className="switch"
							/>
							{renderToolButton(buttons)}
						</div>
					</div>
					<WorkFlowDetail
						clientHeight={clientHeight}
						currentDesign={currentDesign}
						currentDesignInfo={currentDesignInfo}
						showSideSlip={this.showSideSlip}
						removeWorkFlowCondition={this.removeWorkFlowCondition}
						removeWorkFlowStep={this.removeWorkFlowStep}
						showEditCondition={this.showEditCondition}
						showEditStep={this.showEditStep}
						getConditionExprShowMessage={this.getConditionExprShowMessageV2}
						getOrgExprShowMessage={this.getOrgExprShowMessage}
						editWorkFlowStepOrder={this.editWorkFlowStepOrder}
					>

					</WorkFlowDetail>

					<SideSlip
						ref="SideSlip"
						clientHeight={clientHeight}
						org_expr={workFlowState.org_expr}
						condition_expr={workFlowState.condition_expr}
						addWorkFlowStep={this.addWorkFlowStep}
					/>

					<EditCondition
						ref="editCondition"
						condition_expr={workFlowState.condition_expr}
						currentDesignInfo={currentDesignInfo}
						currentDesign={currentDesign}
						addWorkFlowCondition={this.addWorkFlowCondition}
						getConditionExprShowMessage={this.getConditionExprShowMessageV2}
						editWorkFlowCondition={this.editWorkFlowCondition}
						getConditionHtmlV2={this.getConditionHtmlV2}
						changeWorkFlowKeyValue={this.changeWorkFlowKeyValue}
					>
					</EditCondition>

					<EditStep
						ref="editStep"
						currentDesignInfo={currentDesignInfo}
						condition_expr={workFlowState.condition_expr}
						org_expr={workFlowState.org_expr}
						action_expr={workFlowState.action_expr}
						currentBigType={workFlowState.currentBigType}
						currentDesign={currentDesign}
						getConditionExprShowMessage={this.getConditionExprShowMessageV2}
						getOrgExprShowMessage={this.getOrgExprShowMessage}
						getConditionHtmlV2={this.getConditionHtmlV2}
						getOrgEditHtmlV2={this.getOrgEditHtmlV2}
						editWorkFlowStep={this.editWorkFlowStep}
						resetWorkFlowStep={this.resetWorkFlowStep}
						removeWorkFlowStep={this.removeWorkFlowStep}
					>
					</EditStep>

					<AddWorkFlow
						addList={workFlowState.allCanAddList}
						doAddWorkFlow={this.doAddWorkFlow}
						ref="addWorkFlow">

					</AddWorkFlow>
					{
						isFromHomepage ? (
							<div className='backToHomepage' onClick={this.goBackHomepage}>返回新手引导</div>
						) : null
					}

					<Modal title="修改审批流名称" visible={workFlowState.showChangeNameModal}
					       onOk={this.changeWorkFlowName}
					       onCancel={() => {
						       this.changeWorkFlowRootKeyValue('showChangeNameModal', false);
					       }}
					>
						<div>
							{workFlowState.showChangeNameModal ?
								<Input defaultValue={currentDesign.name} ref="changeNameInput" placeholder="输入新名称"
								       onChange={(e) => {
								       }}/>
								: null
							}
						</div>

					</Modal>

				</div>
			</div>
		);
	}
}

//右侧功能按钮
function renderToolButton(buttons) {
	return buttons.map((button) => {
		return (
			<Button key={button.key} size={button.size} type={button.type} disabled={button.disabled}
			        onClick={button.onClick}>
				{button.text}
			</Button>
		)
	})
}

function mapStateToProps(state) {
	return {
		workFlowState: state.get('workFlowState').toJS(),
		baseState: state.get('baseState').toJS()
	}
}

export default connect(mapStateToProps)(WorkFlow);
