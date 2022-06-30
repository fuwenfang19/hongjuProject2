import React, { Component } from 'react';
import { Popover } from 'antd';

class PopoverX extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    }

  }
  hide = () => {
    this.setState({
      visible: false,
    });
  }
  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }
  render() {
    return (
      <Popover
        overlayClassName="choose-bill-type-pop"
        content={<div onClick={this.hide}>{this.props.cont}</div>}
        trigger='click'
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        {this.props.inp}
      </Popover>
    )
  }
}

export default PopoverX