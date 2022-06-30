/**
 * Created by fuwenfang on 2/25/17.
 * 单据类型编辑拖拽
 */
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { Icon } from 'antd';
import * as actions from '../../../actions';
import uuid from 'uuid';


const ItemTypes = {
  CARD: 'card',
}
const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
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
}

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))

@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))


export default class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    moveCard: PropTypes.func.isRequired,
  };
  //删除高级配置列表
  closeBIllLIst = (e, i) => {
    e.stopPropagation()
    const { dispatch, $$mapState } = this.props
    const defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
    let digestDesign = defaultBillingSetting.digestDesign
    let newdigestDesign = digestDesign.concat()
    newdigestDesign[i].id = uuid.v4()
    newdigestDesign[i].format = ''
    newdigestDesign[i].col = ''
    newdigestDesign[i].title = ''
    dispatch(actions.closeBIllLIst(newdigestDesign))
  }

  render() {
    const { item, key, index, connectDragSource, connectDropTarget, isEditBillingList } = this.props

    return connectDragSource(connectDropTarget(
      <div key={key}
        className={isEditBillingList ? 'border pageListBodyRightDiv pageListBodyRightDiv' + index
          : 'pageListBodyRightDiv pageListBodyRightDiv' + index}>{item.code === 'tocityInput' ?
            <input style={{ width: 95, height: 30 }} placeholder={unescape(item.title.replace(/\\/g,'%'))} /> :(<span>{unescape(item.title.replace(/\\/g,'%'))}</span>)}
        {isEditBillingList ? (<span className='closeIcon'
          onClick={(e) => { this.closeBIllLIst(e, index) }}>
          <Icon type="close" /></span>) : null}
      </div>,
    ));
  }
}