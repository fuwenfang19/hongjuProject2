import React, { Component　, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import { Checkbox, Icon, Tooltip, Radio } from 'antd';
const RadioGroup = Radio.Group;
import CommonChoose from './../../../common/CommonChoose';


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
};

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Card extends Component {
  constructor() {
    super();
    this.state = {
      radioValue: 1,
      choosed: []
    }
  }
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    moveCard: PropTypes.func.isRequired,
  };
  handleChange = (e) => {
    // console.log(e.target.checked);
  }
  onRadioChange = (e) => {
    console.log(e.target.value);
    this.setState({
      radioValue: e.target.value,
    });
  }

  render() {
    const { item, isDragging, connectDragSource, connectDropTarget, editHtmlType } = this.props;
    const opacity = isDragging ? 0 : 1;
    if (editHtmlType === 1) {
      return connectDragSource(connectDropTarget(
        <div style={{ opacity }} className="card-box">
          <Tooltip title={item['dimensionRef']['dimension']['name']} arrowPointAtCenter>
            <span className="card-title">{item['dimensionRef']['dimension']['name']}</span>
          </Tooltip>
          <Checkbox className="card-checkbox" onChange={this.handleChange} ></Checkbox>
          <div className="card-dele"><Icon type="close" /></div>
        </div>,
      ));
    } else {
      return connectDragSource(connectDropTarget(
        <div style={{ opacity }} className="card-box">
          <Tooltip title={item['dimensionRef']['dimension']['name']} arrowPointAtCenter>
            <span className="card-title">{item['dimensionRef']['dimension']['name']}</span>
          </Tooltip>
          <Checkbox className="card-checkbox" onChange={this.handleChange} ></Checkbox>
          <RadioGroup onChange={this.onRadioChange} value={this.state.radioValue}>
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
          </RadioGroup>
          <CommonChoose
            initialChoosed={this.state.choosed}
            showGroup={false}
            type="staff"
            objectId=""
            isRadio={false}
            radioReturnObj={true} //单选的时候如果radioReturnObj是true 那么传入的initialChoosed应该是对象，onSelect返回也是对象
            onSelect={(data) => {
              //你的处理函数---
              console.log('helo');
              console.log(data);
              this.setState({
                choosed: data
              })
            }}
          />
          <div className="card-dele"><Icon type="close" /></div>
        </div>,
      ));
    }
  }
}
