/**
 * Created by uncle on 2017/3/16.
 */
import React, {Component} from 'react';
import {Icon, Tabs, Modal, Tooltip} from 'antd';
import Animate from 'rc-animate';
import * as workFlowConstants from '../../../constants/workflow/workflow';
const TabPane = Tabs.TabPane;
export default class SideSlip extends Component {

	constructor() {
		super();

		this.state = {
			visible: false,
			imgVisible: false,
			dataType: workFlowConstants.DATATYPE.BASE_CONDITIONS,
			inHigh: false,
			title: '发起条件',
		};
	}

	componentDidMount() {
	}


	isCondition = () => {
		return this.state.dataType.indexOf('condition') !== -1
	};
	isStep = () => {
		return this.state.dataType.indexOf('step') !== -1
	};

	switchBaseAndHigh = () => {
		if (this.isCondition()) {
			if (this.state.inHigh) {
				this.showSlipWithType(workFlowConstants.DATATYPE.BASE_CONDITIONS)
			} else {
				this.showSlipWithType(workFlowConstants.DATATYPE.HIGH_CONDITIONS)
			}

		} else if (this.isStep()) {
			if (this.state.inHigh) {
				this.showSlipWithType(workFlowConstants.DATATYPE.BASE_STEPS)
			} else {
				this.showSlipWithType(workFlowConstants.DATATYPE.HIGH_STEPS)
			}

		}
	};

	getTitle = () => {
		if (this.isCondition()) {
			this.setState({
				title: '发起条件',
			})
		} else if (this.isStep()) {
			this.setState({
				title: '审批步骤新增',
			})
		}
	};


	showSlipWithType = (type) => {
		if (type.indexOf('high') !== -1) {//高级
			this.setState({
				visible: true,
				dataType: type,
				inHigh: true,
			}, () => {
				this.getTitle();
			});
		} else {
			this.setState({
				visible: true,
				dataType: type,
				inHigh: false,
			}, () => {
				this.getTitle();
			});
		}
	};

	showSlip = (type) => {
		this.showSlipWithType(type);
	};

	closeSlip = () => {
		this.setState({
			visible: false
		})
	};

	render() {
		const getLiHtml = (item, i) => {
			return (
				<li className="list-item" key={i} onClick={() => {
					if (this.isCondition()) {
						this.props.addWorkFlowCondition(item);
					} else {
						this.props.addWorkFlowStep(item);
					}
					setTimeout(() => {
						document.querySelector('.workflow-detail-container').scrollTop = document.querySelector('.workflow-detail-container').scrollHeight;
					}, 100)
				}}>
          <span className="item-checkbox">
              {/*<Icon type="plus-circle" style={{cursor: 'pointer'}} >*/}
	          {/*</Icon>*/}
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
				<Animate transitionName="move-right">
					{this.state.visible ? (
						<div className="choose-side-slip steps-add-container">
							<div className="hide-event-wrap" onClick={this.closeSlip}></div>

							<div className="slip-real-container" style={{height: this.props.clientHeight - 60}}>

								<div className="normal-slip-head">
									<span> </span>
									<span className='title'>{this.state.title}</span>
									<span className="close-icon" onClick={this.closeSlip}> <Icon type="cross"/></span>
								</div>

								<Tabs defaultActiveKey="1">
									<TabPane tab="基础" key="1">
										<ul className="list-container" style={{height: this.props.clientHeight - 160}}>
											<li className="list-choose-all">
                            <span className="check-all">
                                {/*<Icon type="plus-circle"></Icon>*/}
                            </span>
												<span className="spec">点击新增至详情区域</span>
											</li>


											{//目前侧滑只有步骤 没有条件 点击编辑或者新增条件是弹出框
												this.props.org_expr.step_arr.map((item, i) => {
													return (
														getLiHtml(item, i)
													)
												})
											}

										</ul>
									</TabPane>
									<TabPane tab="高级" key="2">
										<ul className="list-container" style={{height: this.props.clientHeight - 160}}>
											<li className="list-choose-all">
                            <span className="check-all">
                                {/*<Icon type="plus-circle"></Icon>*/}
                            </span>
												<span className="spec">点击新增至详情区域</span>
											</li>


											{//目前侧滑只有步骤 没有条件 点击编辑或者新增条件是弹出框
												this.props.org_expr.step_high_arr.map((item, i) => {
													return (
														getLiHtml(item, i)
													)
												})
											}

										</ul>
									</TabPane>
								</Tabs>
							</div>
						</div>
					) :
						null
					}
				</Animate>
				<Modal title=""
				       visible={this.state.imgVisible}
				       onCancel={() => {
					       this.setState({
						       imgVisible: false
					       })
				       }}
				       wrapClassName='img-view-modal'
				       max-width='520'
				>
					<div>
						<img src={require('../../../images/billSetting/basicImg.jpg')}/>
					</div>
				</Modal>
			</div>
		);
	}
}

