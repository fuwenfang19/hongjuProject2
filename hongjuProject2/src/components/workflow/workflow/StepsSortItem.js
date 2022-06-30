/**
 * Created by uncle on 2017/3/15.
 */
import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {Icon, Button, Collapse, Input, Timeline} from 'antd';
import {DragSource, DropTarget} from 'react-dnd';
import editImg from '../../../images/billSetting/edit.png';
const ItemTypes = {CARD: 'card'};


const handleStyle = {
	backgroundColor: 'green',
	width: '1rem',
	height: '1rem',
	display: 'inline-block',
	marginRight: '0.75rem',
	cursor: 'move',
};


const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		};
	},
	endDrag(props){
		// props.test( props.id, props.index);
		// return {
		// 	id: props.id,
		// 	index: props.index,
		// };
	}
};

const cardTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

		// Determine mouse position
		const clientOffset = monitor.getClientOffset();

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return;
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return;
		}

		// Time to actually perform the action
		props.moveCard(dragIndex, hoverIndex);

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex;
	},
};

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	connectDragPreview: connect.dragPreview(),
	isDragging: monitor.isDragging(),
}))
export default class Card extends Component {

	render() {
		const {isDragging, connectDragPreview, connectDragSource, connectDropTarget, closed} = this.props;
		let {isStep = true, performer, startConditions, actions, key, index, condition} = this.props;

		const opacity = isDragging ? 0.2 : 1;
		const display = closed ? 'none' : '';
		if (isStep) {
			return connectDragSource(connectDropTarget(
				<div style={{opacity, display}}>
					<Timeline.Item
						key={index}
						dot={<Icon type="user" style={{fontSize: '12px'}}/>}
					>
						<div className="steps" onClick={() => {
							this.props.showEditStep(true, index);
						}}>
							<div className="name">{this.props.getOrgExprShowMessage(performer)}</div>
							<div className="trigger-conditions">
								{startConditions.length === 0 ? null :
									<div>
										触发条件：{startConditions.map((item, i) => {
										return <span key={i} className="step-item">{this.props.getConditionExprShowMessage(item)}</span>
									})}
									</div>
								}
								<span className="delete-item"><img className="edit-img" style={{height: 12, width: 12}} src={editImg}/> </span>
								{/*<span className="delete-item" onClick={(e) => {*/}
								{/*e.stopPropagation();*/}
								{/*this.props.removeWorkFlowStep(index);*/}
								{/*}}>x</span>*/}
							</div>
						</div>
					</Timeline.Item>
				</div>,
			));
		} else {//如果不是步骤 那么不支持排序
			return (
				<div style={{opacity, display}}>
					<Timeline.Item
						dot={<Icon type="user" style={{fontSize: '12px'}}/>}
					>
						<div className="conditions" onClick={() => {
							this.props.showEditCondition(true);
						}}>
							<span className="condition-item">{this.props.getConditionExprShowMessage(condition)}</span>
							<span className="delete-item"><img className="edit-img" style={{height: 12, width: 12}}
							                                   src={editImg}/> </span>
							{/*<span className="delete-item" onClick={(e) => {*/}
							{/*e.stopPropagation();*/}
							{/*this.props.removeWorkFlowCondition(index);*/}
							{/*}}>x</span>*/}
						</div>
					</Timeline.Item>
				</div>
			);
		}

		// handle
		// return connectDragPreview(
		// 	<div style={{...style, opacity}}>
		//
		// 		{connectDragSource(connectDropTarget(
		// 			<div style={handleStyle}/>,
		// 		))}
		//
		// 		{text}
		// 	</div>,
		// )
	}
}