import React from 'react';
import {
	Tabs,
	Button,
	Form,
	Row,
	Col,
	Tooltip,
	Checkbox,
	Icon,
	Popover,
	Modal,
	Collapse,
	Select,
	Tag
} from 'antd';
import {CommonChoose} from '../../common';
import _ from 'lodash';
import * as workFlowConstants from '../../../constants/workflow/workflow';
import domUtil from '../../../global/utils/domutil';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;


class EditCondition extends React.Component {
	constructor() {
		super();
		this.state = {
			originConditions: [],//取消的时候重置使用
			imgVisible: false,
			showDropDown: false,
			visible: false,
			dataType: workFlowConstants.DATATYPE.BASE_CONDITIONS,
			modalBodyHeight: 400,
		}
	}

	getOffSetOfModal() {
		const modal = document.querySelector('.ant-modal-body');
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

	handleOk = () => {
		this.setState({
			visible: false,
		})
	};
	handleCancel = () => {
		this.props.changeWorkFlowKeyValue('beginConditions', this.state.originConditions);
		this.setState({
			visible: false,
		})
	};
	show = (flag) => {
		this.setState({
			visible: flag,
			originConditions: this.props.currentDesignInfo.beginConditions,
			dataType: workFlowConstants.DATATYPE.BASE_CONDITIONS
		}, () => {
			this.render();
			this.getOffSetOfModal();
		})
	};

	dropDownVisible = (flag) => {
		this.setState({
			showDropDown: flag,
		})
	};

	isInArray = (obj, arr, key = 'id') => {
		return !!_.find(arr, {[key]: obj[key]});
	};

	//当条件的符号发生变化时
	onOperateChange = (index, operateId, item) => {
		item.operate = item.operates.filter(function (item) {
			return item.id.toString() === operateId;
		})[0];
		this.props.editWorkFlowCondition(index, item);
	};
	onValueChange = (index, value, item) => {
		item.value = value;
		this.props.editWorkFlowCondition(index, item);
	};

	getConditionHtml = (item, i) => {
		// actions 1.onOperateChange 2 onValueChange
		const actions = {
			onOperateChange: this.onOperateChange,
			onValueChange: this.onValueChange,
		};
		return this.props.getConditionHtmlV2(item, i, actions);
	};


	render() {
		const {currentDesignInfo, condition_expr} = this.props;
		const {modalBodyHeight} = this.state;
		const getLiHtml = (item, i) => {
			return (
				<li className="list-item" key={i} onClick={() => {
					this.props.addWorkFlowCondition(item);
					this.dropDownVisible(false);
				}}>
          <span className="item-checkbox">
              {/*<Icon type="plus-circle" style={{cursor: 'pointer'}} onClick={() => {*/}
              {/*this.props.addWorkFlowCondition(item);*/}
              {/*}}>*/}
	          {/*</Icon>*/}
          </span>
					<div className="item-content">
						<div className="item-title">{item.name}</div>
					</div>
					<span className="item-icon">
						  <Tooltip placement="leftBottom" title={<div className="item-remark">{item.caption}</div>}>
					     <Icon type="exclamation-circle-o"
					           onClick={(e) => {
						           e.stopPropagation();
					           }}/>
					    </Tooltip>
					</span>
				</li>
			)
		};


		return (
			<div>
				<Modal title={'发起条件设置'}
				       visible={this.state.visible}
				       onOk={this.handleOk}
				       onCancel={this.handleCancel}
				       maskClosable={false}
				       wrapClassName="edit-workflow-condition">
					<div>
						{this.state.visible ?
							<Collapse bordered={false} activeKey={['1']}>
								<Panel header={
									<div className="condition-modal-header condition-show">
										<span className="title-label">流程发起条件</span>
										<ul className="condition-ul">

											{
												currentDesignInfo.id && false ?

													currentDesignInfo.beginConditions.map((item, i) => (
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
										<div></div>
									</div>} key="1">

									<div style={{height: modalBodyHeight - 100, overflowY: 'auto', overflowX: 'hidden'}}>
										<Row gutter={16}>
											{
												currentDesignInfo.id ?
													currentDesignInfo.beginConditions.map((item, i) => (
														<div key={i}>{this.getConditionHtml(item, i)}</div>
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
									</div>
									<Modal
										wrapClassName="edit-workflow-condition-modal"
										title={"选择条件"}
										visible={this.state.showDropDown}
										onOk={() => {
											this.dropDownVisible(false);
										}}
										onCancel={() => {
											this.dropDownVisible(false);
										}}
									>
										<div className="page edit-workflow-condition">

											<Tabs defaultActiveKey="1">
												<TabPane tab="基础" key="1">
													<div className="add-condition-dropdown-container">
														<div className="add-condition-dropdown-list">
															<div className="slip-real-container" style={{height: modalBodyHeight - 80}}>
																<ul className="list-container" style={{}}>
																	{
																		condition_expr.con_arr.map((item, i) => {
																			return getLiHtml(item, i);
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
																		condition_expr.con_high_arr.map((item, i) => {
																			return getLiHtml(item, i);
																		})
																	}
																</ul>
															</div>
														</div>
													</div>
												</TabPane>
											</Tabs>

										</div>
									</Modal>


								</Panel>
							</Collapse> : null
						}
					</div>
				</Modal>
			</div>
		)
	}
}


export default EditCondition;