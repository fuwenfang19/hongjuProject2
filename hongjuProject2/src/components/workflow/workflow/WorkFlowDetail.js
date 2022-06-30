/**
 * Created by uncle on 2017/3/14.
 */
import React from 'react';
import {Icon, Button, Collapse, Input, Timeline} from 'antd';
import {Confirm, Toast} from '../../common';
import update from 'react/lib/update';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import StepsSortItem  from './StepsSortItem'
import * as workFlowConstants from '../../../constants/workflow/workflow';
import _ from 'lodash';
import * as actions from '../../../actions';
const Panel = Collapse.Panel;

@DragDropContext(HTML5Backend)
class WorkFlowDetail extends React.Component {
	constructor() {
		super();
		this.moveCard = this.moveCard.bind(this);
		this.state = {
			closeConditions: false,
			closeSteps: false,
		}
	}

	moveCard(dragIndex, hoverIndex) {
		const {currentDesignInfo} = this.props;
		const steps = currentDesignInfo.activities;

		const dragCard = steps[dragIndex];
		const newSteps = update({data: steps}, {
			data: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragCard],
				],
			},
		});

		//按index排序
		newSteps.data.map((item, i) => {
			return item
		});
		this.props.editWorkFlowStepOrder(newSteps.data);
	}

	closeConditions = () => {
		this.setState({
			closeConditions: !this.state.closeConditions
		})
	};
	closeSteps = () => {
		this.setState({
			closeSteps: !this.state.closeSteps
		})
	};


	render() {
		const {clientHeight, currentDesign, currentDesignInfo} = this.props;
		const {closeConditions, closeSteps} = this.state;
		let process = null;
		if (currentDesignInfo.id) {
			process = currentDesignInfo;
		}


		return (
			<div>
				<div className="workflow-detail-container" style={{height: clientHeight - 100}}>

					{process ?
						<Timeline>
							<Timeline.Item
								key={'addConditions'}
								dot={<Button className="add-btn" size={'default'} onClick={() => {
									this.props.showEditCondition(true);
								}}>
									<span className="close-btn" onClick={(e) => {
										e.stopPropagation();
										this.closeConditions()
									}}>
										{
											closeConditions ?
												<Icon type="down"/>
												:
												<Icon type="up"/>
										}</span>
									<span>发起条件</span>
									<Icon type="plus-circle"/>
								</Button>}
							>
							</Timeline.Item>


							{(() => {
								if (process.beginConditions.length > 0) {
									return process.beginConditions.map((card, i) => (
										<StepsSortItem
											key={i}
											index={i}
											isStep={false}
											closed={closeConditions}

											showEditCondition={this.props.showEditCondition}

											condition={card}
											getConditionExprShowMessage={this.props.getConditionExprShowMessage}
											removeWorkFlowCondition={this.props.removeWorkFlowCondition}
										>
										</StepsSortItem>
									))
								} else {
									return <StepsSortItem
										key={0}
										index={0}
										isStep={false}
										closed={closeConditions}

										showEditCondition={this.props.showEditCondition}

										condition={actions.noCondition}
										getConditionExprShowMessage={this.props.getConditionExprShowMessage}
										removeWorkFlowCondition={this.props.removeWorkFlowCondition}
									>
									</StepsSortItem>
								}
							})()}


							<Timeline.Item
								key={'addSteps'}
								dot={
									<Button className="add-btn" size={'default'} onClick={() => {
										this.props.showSideSlip(workFlowConstants.DATATYPE.BASE_STEPS);
									}}>
										<span className="close-btn" onClick={(e) => {
											e.stopPropagation();
											this.closeSteps()
										}}>
												{
													closeSteps ?
														<Icon type="down"/>
														:
														<Icon type="up"/>
												}
											</span>
										<span>审批步骤</span>
										<Icon type="plus-circle"/>
									</Button>
								}
							>
							</Timeline.Item>


							{process.activities.map((card, i) => (
								<StepsSortItem
									key={i}
									index={i}
									closed={closeSteps}
									showEditStep={this.props.showEditStep}

									performer={card.performer}
									startConditions={card.startConditions}
									actions={card.actions}
									getOrgExprShowMessage={this.props.getOrgExprShowMessage}
									getConditionExprShowMessage={this.props.getConditionExprShowMessage}
									removeWorkFlowStep={this.props.removeWorkFlowStep}
									moveCard={this.moveCard}
								>
								</StepsSortItem>
							))}


							<Timeline.Item
								style={{display: 'none'}}
							>
							</Timeline.Item>

						</Timeline>
						:
						''
					}

					<div className="tips">
						<div>拖拽步骤可上下调整顺序</div>
					</div>

				</div>
			</div>
		);
	}
}


export default WorkFlowDetail;
