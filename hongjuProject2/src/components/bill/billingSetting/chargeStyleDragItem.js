/**
 * Created by fuwenfang on 2/25/17.
 * 单据类型编辑拖拽
 */
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { Checkbox, Input, Icon } from 'antd';
import { DropdownList } from '../../common'

import * as actions from '../../../actions';


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


export default class ChargeStyleCard extends Component {
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
    };
  }
  clickAdd = (e) => {
    e.stopPropagation()
  }
  clickAddItem = (key, index) => {
    const { dispatch, $$mapState } = this.props
    let expenseClasses = $$mapState.toJS().defaultBillingSetting.expenseClasses
    let disburseClasses = $$mapState.toJS().disburseClasses
    let newexpenseClasses = expenseClasses.concat()
    if(key*1 === 111111111){
      newexpenseClasses[index].defaultDisburseClass = null
    }else{
      newexpenseClasses[index].defaultDisburseClass = key * 1
    }
    dispatch(actions.ChangeChargeStyle(newexpenseClasses))
  }
  deleteSettingItem = (e, index) => {
    e.stopPropagation()
    const { $$mapState, dispatch } = this.props
    let expenseClasses = $$mapState.toJS().defaultBillingSetting.expenseClasses
    const currentId = expenseClasses[index].id
    let newexpenseClasses = expenseClasses.filter((p, i) => {
      return i !== index
    })
    dispatch(actions.ChangeChargeStyle(newexpenseClasses))

  }
  hoverDargItem  = ()=>{
    this.props.hoverDargItem()
  }
  outDargItem  = ()=>{
    this.props.outDargItem()
  }
  render() {
    const { item, index, isDragging, connectDragSource, connectDropTarget, handleChangeCheckbox, dispatch, $$mapState } = this.props
    const DropdownListData = {}
    DropdownListData.trigger = 'click'
    DropdownListData.data = $$mapState.toJS().disburseClasses
    DropdownListData.hasNullItem = true
    DropdownListData.hasNullItemName = '默认支出类型'
    let disburseClassesName = ''
    DropdownListData.data.map((p, i) => {
      if (item.defaultDisburseClass * 1 === p.id * 1) {
        disburseClassesName = p.name
      }
      return p
    })
    return connectDragSource(connectDropTarget(
      <li id={item.id}  onMouseEnter={this.hoverDargItem}
				onMouseLeave={this.outDargItem}>
        <span className='billingSettingInfoEditListUlSpan' style={{ minWidth: '110px',width:'34%',paddingLeft:'10px'}}>{item.name}</span>
        <span style={{ minWidth: '185px',width:'64%', cursor: 'pointer',color:'#999' }}
          className='billingSettingInfoEditListUlSpan'
          onClick={this.clickAdd}
        >
          <DropdownList {...DropdownListData}
            clickAddItem={(key) => { this.clickAddItem(key, index) }}
          >
            <span>
              <span className='chargeDragItemDown'>
                {item.defaultDisburseClass ? disburseClassesName : '默认支出类型'}
              </span>
              <Icon type="caret-down" style={{ color: '#666',fontSize:'12px' }} />
            </span>
          </DropdownList>
        </span>
        <span className="anticon anticon-cross" onClick={(e) => { this.deleteSettingItem(e, index) }}></span>
      </li>,
    ));
  }
}