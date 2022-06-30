import React from 'react';
import {
	Row,
	Tooltip,
	Button,
	Checkbox,
	Icon,
	CheckboxGroup,
	Modal,
	Collapse,
	Tag,
	Tabs
} from 'antd';
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
import domUtil from '../../../global/utils/domutil';
import _ from 'lodash';
import {Confirm} from '../../common'
import * as workFlowConstants from '../../../constants/workflow/workflow';

class EditCondition extends React.Component {
	constructor() {
		super();
		this.state = {
			origin_step: null,
			showTriggerDropDown: false,
			showNotifyDropDown: false,
			stepIndex: 0,
			visible: false,
			modalBodyHeight: 400,
			dataType_trigger_con: workFlowConstants.DATATYPE.BASE_TRIGGER_CONDITIONS,
			dataType_notify: workFlowConstants.DATATYPE.BASE_NOTIFY,
		}
	}

	handleOk = () => {
		this.setState({
			visible: false
		})
	};
	handleCancel = () => {
		const {origin_step, stepIndex} = this.state;
		this.props.resetWorkFlowStep(stepIndex, origin_step);
		this.setState({
			visible: false
		})
	};

	getOffSetOfModal() {
		const modal = document.querySelector('.edit-workflow-condition.step .ant-modal-body');
		if (modal) {
			const offset = domUtil.getElementOffSet(modal);
			const modalBodyHeight = offset ? offset.height : 400;
			this.setState({
				modalBodyHeight: modalBodyHeight
			})
		}
	}

	componentDidMount() {
		this.getOffSetOfModal();
	}

	componentWillReceiveProps() {
		this.getOffSetOfModal();
	}

	show = (flag, stepIndex) => {
		const {currentDesignInfo} = this.props;
		this.setState({
			visible: flag,
			origin_step: currentDesignInfo.id ? Object.assign({}, currentDesignInfo.activities[stepIndex]) : null,
			stepIndex: stepIndex,
			dataType_trigger_con: workFlowConstants.DATATYPE.BASE_TRIGGER_CONDITIONS,
			dataType_notify: workFlowConstants.DATATYPE.BASE_NOTIFY,
		}, () => {
			this.render();
			this.getOffSetOfModal();
		})
	};

	dropDownVisible = (flag) => {
		this.setState({
			showTriggerDropDown: flag,
		})
	};
	notifyDropDownVisible = (flag) => {
		this.setState({
			showNotifyDropDown: flag,
		})
	};
	//增加触发条件
	addTriggerCondition = (item) => {
		const currentStep = this.getCurrentStep();
		const index = currentStep.startConditions.length;
		if (item.operates) {
			item.operate = item.operates.slice(0, 1)[0];
		}
		this.props.editWorkFlowStep(this.state.stepIndex, 'startConditions', index, item);
	};

	//增加知会人
	addNotify = (item) => {
		const currentStep = this.getCurrentStep();
		const index = currentStep.notify.length;
		this.props.editWorkFlowStep(this.state.stepIndex, 'notify', index, item);
	};

	getCurrentStep = () => {
		const {currentDesignInfo} = this.props;
		const {stepIndex} = this.state;
		return currentDesignInfo.id ? Object.assign({}, currentDesignInfo.activities[stepIndex]) : null;
	};


	isInArray = (obj, arr, key = 'id') => {
		return !!_.find(arr, {[key]: obj[key]});
	};
	//判断审批打印是否勾选
	isPrintChecked = (print) => {
		const actions = this.getCurrentStep().actions;
		return !!actions.filter((item) => (item.id === print.id)).length;
	};

	changePrintFlag = (flag, print) => {
		const actions = this.getCurrentStep().actions;

		if (flag) {//从无到有
			actions.push(print);
		} else {//剔除
			let index = null;
			for (let i = 0, len = actions.length; i < len; i++) {
				if (actions[i].id === print.id) {
					index = i;
					break;
				}
			}
			actions.splice(index, 1);
		}
		this.props.editWorkFlowStep(this.state.stepIndex, 'actions', null, actions);
	};

	//触发条件的符号发生改变时
	onOperateChange = (index, operateId, item) => {
		const stepIndex = this.state.stepIndex;
		item.operate = item.operates.filter(function (item) {
			return item.id.toString() === operateId;
		})[0];
		this.props.editWorkFlowStep(stepIndex, 'startConditions', index, item);
	};
	//触发条件的值发生改变时
	onValueChange = (index, value, item) => {
		const stepIndex = this.state.stepIndex;
		item.value = value;
		this.props.editWorkFlowStep(stepIndex, 'startConditions', index, item);
	};
	//步骤或者知会人的值发生改变时
	onStepOrNotifyValueChange = (index, value, item, isNotify) => {
		const stepIndex = this.state.stepIndex;
		//需要判断oType 来传不同的字段名 	//staffid  positions  positioncode
		const oType = item.otype;
		if (oType === workFlowConstants.OTYPE.STAFF) {
			if (isNotify) {
				item.staffs = value;
			} else {
				item.staff = value[0] || null;
			}
		} else if (oType === workFlowConstants.OTYPE.POSITIONS) {
			item.positions = value;
		} else if (oType === workFlowConstants.OTYPE.POSITION) {
			item.position = value[0] || null;
		}

		this.props.editWorkFlowStep(stepIndex, isNotify ? 'notify' : 'performer', index, item);
	};
	getConditionEditHtml = (item, i) => {
		// actions 1.onOperateChange 2 onValueChange
		const actions = {
			onOperateChange: this.onOperateChange,
			onValueChange: this.onValueChange,
		};
		//item, i, actions, isTriggerCondition, stepIndex
		return this.props.getConditionHtmlV2(item, i, actions, true, this.state.stepIndex);
	};
	getStepEditHtml = (item, i, isNotify, delFunc) => {
		// actions 1.onOperateChange 2 onValueChange
		const actions = {
			onValueChange: this.onStepOrNotifyValueChange,
		};
		//item, i, actions, isNotify, stepIndex
		return this.props.getOrgEditHtmlV2(item, i, actions, isNotify, this.state.stepIndex, delFunc);
	};

	getOrgEditHtml = (item, i, isNotify) => {
		// actions 1.onOperateChange 2 onValueChange
		const actions = {
			onValueChange: this.onStepOrNotifyValueChange,
		};
		//item, i, actions, isNotify, stepIndex
		return this.props.getOrgEditHtmlV2(item, i, actions, isNotify, this.state.stepIndex);
	};


	render() {
		const {currentDesignInfo, condition_expr, org_expr, action_expr, currentBigType} = this.props;
		const {stepIndex, modalBodyHeight} = this.state;
		const currentStep = this.getCurrentStep();
		//下拉选择
		const getChooseLiHtml = (item, i, isNotify) => {
			return (
				<li className="list-item" key={i} onClick={() => {
					if (isNotify) {
						this.addNotify(item);
						this.notifyDropDownVisible(false);
					} else {
						this.addTriggerCondition(item);
						this.dropDownVisible(false);
					}
				}}>
          <span className="item-checkbox">
          </span>
					<div className="item-content">
						<div className="item-title">{item.name}</div>
					</div>
					<div className="item-icon">
						<Tooltip placement="leftBottom" title={<div className="item-remark">{item.caption}</div>}>
							<Icon type="exclamation-circle-o"
							      onClick={(e) => {
								      e.stopPropagation();
							      }}/>
						</Tooltip>
					</div>
				</li>
			)
		};
		return (
			<div>
				<Modal title={'审批步骤'}
				       visible={this.state.visible}
				       onOk={this.handleOk}
				       onCancel={this.handleCancel}
				       maskClosable={false}
				       wrapClassName="edit-workflow-condition step">
					<div>

						{this.state.visible && currentDesignInfo.id && currentStep ?
							<div>

								<div className="ant-collapse-item mock">
									<div className="condition-modal-header">
										<ul className="condition-ul">
											<li>
												{this.getOrgEditHtml({"name": '当前步骤：', otype: 'justLabel'}, null)}
											</li>
											<li style={{flexGrow: 1}}>
												{this.getOrgEditHtml(currentStep.performer, null)}
											</li>
										</ul>
										<div className="step-del-btn">
											<Icon type="delete" onClick={() => {
												Confirm({
													title: '删除步骤',
													content: {
														message: '你确定要删除这个步骤吗？',
														explain: '确定删除后点击保存即可生效',
														highLightText: '',
													},
													okText: '确定',
													cancelText: '取消',
													onOk: () => {
														//关闭
														this.setState({
															visible: false
														}, () => {
															this.props.removeWorkFlowStep(stepIndex);
														})
													},
													onCancel: () => {
													}
												});
											}}/>
										</div>
									</div>
								</div>


								{
									currentStep.actions && currentBigType !== 7 ?
										<div className="ant-collapse-item mock">
											<div className="condition-modal-header">
												<ul className="condition-ul">
													<li>
														<span>
															<Icon type="printer" style={{fontSize: 14, marginRight: 6}}>

														  </Icon>
															打印邮件发出时机
														</span>
													</li>

													{action_expr[currentBigType].map((item, i) => {
														return (
															<li key={i}>
																<Checkbox checked={this.isPrintChecked(item)}
																          onChange={(e) => {
																	          this.changePrintFlag(e.target.checked, item);
																          }
																          }>{item.name}</Checkbox>
															</li>
														)

													})}
												</ul>
												<div></div>
											</div>
										</div>
										: null
								}

								<div className="ant-collapse-item mock">
									<div className="condition-modal-header">
										<ul className="condition-ul">

											<li>
												<Checkbox checked={currentStep.isSubmitterNeedApprove === true}
												          onChange={(e) => {
													          this.props.editWorkFlowStep(stepIndex, 'isSubmitterNeedApprove', null, e.target.checked);
												          }
												          }>提交人需要审批</Checkbox>
											</li>
										</ul>
										<div></div>
									</div>
								</div>

								<Collapse accordion bordered={false}>
									<Panel header={
										<div className="condition-modal-header">
											<span className="title-label">触发条件</span>
											<ul className="condition-ul">

												{
													currentDesignInfo.id && false ?

														currentStep.startConditions.map((item, i) => (
															<li key={i}>
																<Tag closable onClose={(e) => {
																	e.stopPropagation();
																}}>
																	{this.props.getConditionExprShowMessage(item)}
																</Tag>
															</li>
														))
														:
														''
												}
											</ul>
										</div>} key="1">
										<div style={{height: modalBodyHeight - 320, overflowY: 'auto', overflowX: 'hidden'}}>
											<Row gutter={16}>
												{
													currentDesignInfo && currentDesignInfo.id ?
														currentStep.startConditions.map((item, i) => (
															<div key={i}>{this.getConditionEditHtml(item, i)}</div>
														))
														:
														''
												}
											</Row>

											<Button className="ant-btn ant-btn-sm advance" onClick={() => {
												this.dropDownVisible(true);
											}}>
												新增 <Icon type="plus-circle"/>
											</Button>
											<Modal
												wrapClassName="edit-workflow-condition-modal"
												title={"触发条件选择"}
												visible={this.state.showTriggerDropDown}
												onOk={() => {
													this.dropDownVisible(false);
												}}
												onCancel={() => {
													this.dropDownVisible(false);
												}}
											>

												<Tabs defaultActiveKey="1">
													<TabPane tab="基础" key="1">
														<div className="add-condition-dropdown-container">
															<div className="add-condition-dropdown-list">
																<div className="slip-real-container" style={{height: modalBodyHeight - 80}}>
																	<ul className="list-container">
																		{
																			condition_expr.trigger_con_arr.map((item, i) => {
																				return getChooseLiHtml(item, i);
																			})
																		}
																	</ul>
																</div>
															</div>
														</div>
													</TabPane>
													<TabPane tab="高级" key="2">
														<div className="add-condition-dropdown-container">
															<div className="add-condition-dropdown-list">
																<div className="slip-real-container" style={{height: modalBodyHeight - 80}}>
																	<ul className="list-container">
																		{
																			condition_expr.trigger_high_arr.map((item, i) => {
																				return getChooseLiHtml(item, i);
																			})
																		}
																	</ul>
																</div>
															</div>
														</div>
													</TabPane>
												</Tabs>
											</Modal>
										</div>

									</Panel>
									<Panel header={
										<div className="condition-modal-header">
											<span className="title-label">知会人</span>
											<ul></ul>
										</div>} key="4">


										<div style={{height: modalBodyHeight - 320, overflowY: 'auto', overflowX: 'hidden'}}>
											<Row gutter={16}>
												{
													currentDesignInfo.id ?
														currentStep.notify && currentStep.notify.map((item, i) => {
															item.name = item.name.replace(/审批人/ig, '知会人');
															return (
																<div key={i}>{this.getOrgEditHtml(item, i, true)}</div>

															)
														})
														:
														''
												}
											</Row>

											<Button className="ant-btn ant-btn-sm advance" onClick={() => {
												this.notifyDropDownVisible(true);
											}}>
												新增 <Icon type="plus-circle"/>
											</Button>
											<Modal
												wrapClassName="edit-workflow-condition-modal"
												title={"知会人选择"}
												visible={this.state.showNotifyDropDown}
												onOk={() => {
													this.notifyDropDownVisible(false);
												}}
												onCancel={() => {
													this.notifyDropDownVisible(false);
												}}
											>
												<Tabs defaultActiveKey="1">
													<TabPane tab="基础" key="1">
														<div className="add-condition-dropdown-container">
															<div className="add-condition-dropdown-list">
																<div className="slip-real-container" style={{height: modalBodyHeight - 80}}>
																	<ul className="list-container" style={{}}>
																		{
																			org_expr.notify_arr.map((item, i) => {
																				item.name = item.name.replace(/审批人/ig, '知会人');
																				return getChooseLiHtml(item, i, true);
																			})
																		}
																	</ul>
																</div>
															</div>
														</div>
													</TabPane>
													<TabPane tab="高级" key="2">
														<div className="add-condition-dropdown-container">
															<div className="add-condition-dropdown-list">
																<div className="slip-real-container" style={{height: modalBodyHeight - 80}}>
																	<ul className="list-container" style={{}}>
																		{
																			org_expr.notify_high_arr.map((item, i) => {
																				return getChooseLiHtml(item, i, true);
																			})
																		}
																	</ul>
																</div>
															</div>
														</div>
													</TabPane>
												</Tabs>
											</Modal>
										</div>

									</Panel>
									<Panel header={
										<div className="condition-modal-header">
											<span className="title-label">高级</span>
										</div>}
									       key="6">
										<Row gutter={16}>
											<ul className="advance-ul">
												<li>
													<Checkbox checked={currentStep.typeid === 1}
													          onChange={(e) => {
														          if (e.target.checked) {
															          this.props.editWorkFlowStep(stepIndex, 'typeid', null, 1);
														          } else {
															          this.props.editWorkFlowStep(stepIndex, 'typeid', null, 0);
														          }

													          }
													          }>逐级审批</Checkbox>
												</li>
												<li>
													<Checkbox checked={currentStep.isIgnoreDuplication === true}
													          onChange={(e) => {
														          this.props.editWorkFlowStep(stepIndex, 'isIgnoreDuplication', null, e.target.checked);
													          }
													          }>去重审批</Checkbox>
												</li>
											</ul>
										</Row>
									</Panel>
								</Collapse>

							</div>
							:
							null
						}
					</div>
				</Modal>
			</div>
		)
	}
}


export default EditCondition;