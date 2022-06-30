/**
 * Created by fuwenfang on 2/25/17.
 * 单据类型编辑拖拽
 */
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { Checkbox, Input } from 'antd';
import * as actions from '../../../actions';


const ItemTypes = {
  CARD: 'card',
}
const cardSource = {
  beginDrag(props) {
    console.log(props)
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
  constructor() {
    super();
    this.state = {
      isShowInput: false,
      disp: ''
    };
  }
  clickDisp = (e) => {
    e.stopPropagation()
    this.setState({
      isShowInput: true
    })
  }
  leaveShowCon = (e)=>{
    e.stopPropagation()
    this.setState({
      isShowInput: false
    })
  }
  changeDisp = (e, index) => {
    e.stopPropagation()
    const { value } = e.target;
    const { $$mapState, dispatch } = this.props
    let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
    let billSettingInfor = defaultBillingSetting.billSettingInfor
    let newbillSettingInfor = billSettingInfor.concat()
    const currentModel = $$mapState.toJS().currentModel

    newbillSettingInfor[index].disp = value

    dispatch(actions.changeBillCheckedSettingItem(newbillSettingInfor))
  }
  queryChangeDisp = (e, index) => {
    e.stopPropagation()
    this.setState({
      isShowInput: false
    })
  }
  hoverDargItem  = ()=>{
    this.props.hoverDargItem()
  }
  outDargItem  = ()=>{
    this.props.outDargItem()
  }
  render() {
    const { item, index, id, isDragging, connectDragSource, connectDropTarget, handleChangeCheckbox, deletSettingItem } = this.props

    return connectDragSource(connectDropTarget(
      <li id={item.id}  onMouseEnter={this.hoverDargItem}
				onMouseLeave={this.outDargItem}>
        <span className='billingSettingInfoEditListUlSpan' style={{ minWidth: 110,width:'35%',paddingLeft:8 }}>{item.name}</span>
        <span className='billingSettingInfoEditListUlSpan editSpan'
          style={{ minWidth: 137,width:'45%' }}
          onClick={this.clickDisp}
          onMouseLeave={this.leaveShowCon}
          title={item.disp}
        >
          {
            this.state.isShowInput ? (
              <Input value={item.disp}
                onChange={(e) => { this.changeDisp(e, index) }}
                onBlur={(e) => { this.queryChangeDisp(e, index) }}
              />) :
              (<span>{item.disp}</span>)
          }
        </span>
        <span className='billingSettingInfoEditListUlSpan' style={{ minWidth: 70,width:'25%' }}>
          <Checkbox checked = {!item.isnull} onChange={(e)=>{handleChangeCheckbox(e,index)}}></Checkbox>
        </span>
        <span className="anticon anticon-cross" onClick={(e) => { deletSettingItem(e, index) }}></span>
      </li>,
    ));
  }
}