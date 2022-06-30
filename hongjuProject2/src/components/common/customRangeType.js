/**
 * 使用示例
 *
 *
 <CustomRangeType
  value={value}
  onSelect={(value) => {
    onChange(value);
  }}
/>
 *
 *
 *
 *
 */

import React, { Component } from 'react';
import { Icon, Popover,Input ,Tabs,DatePicker,Button} from 'antd';
import domUtil from './../../global/utils/domutil';
import Toast from './Toast'
import uuid from 'uuid';
import moment from 'moment';
import {is} from 'immutable';
const TabPane = Tabs.TabPane;

function getCurrentDay(){
  let newEDayMonth  = (new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1)
  let newEDayDay  = (new Date().getDate())<10?0+(new Date().getDate()):(new Date().getDate())
  let currentDay = new Date().getFullYear() + '-' + newEDayMonth + '-' + newEDayDay
  return currentDay
}

class customRangeType extends Component {
	constructor() {
		super();
		this.state = {
			visible:false 
		}
	}

	componentWillMount() {
    this.setState({
      value:this.props.value,
      startTime:[0,1,2,3].indexOf(this.props.value)>-1?getCurrentDay():this.props.value.split('~')[0],
      endTime:[0,1,2,3].indexOf(this.props.value)>-1?getCurrentDay():this.props.value.split('~')[1],
      key :this.props.value===0?'0':this.props.value===1?'1':this.props.value===2?'2':this.props.value===3?'3':this.props.value.substring(0,2)==='20'?'5':'0'
    })
	}

  componentWillUnmount() {
		//this.removeWindowClick();
	}

	removeWindowClick = () => {
		window.removeEventListener('click', this.windowClick, true);
	};
  componentWillReceiveProps(nextProps){
    this.setState({
      value:nextProps.value,
      startTime:[0,1,2,3].indexOf(nextProps.value)>-1?getCurrentDay():nextProps.value.split('~')[0],
      endTime:[0,1,2,3].indexOf(nextProps.value)>-1?getCurrentDay():nextProps.value.split('~')[1],
      key :nextProps.value===0?'0':nextProps.value===1?'1':nextProps.value===2?'2':nextProps.value===3?'3':nextProps.value.substring(0,2)==='20'?'5':'0'
    })
  }
	shouldComponentUpdate(nextProps, nextState) {
		return !(this.props === nextProps || is(this.props, nextProps)) || !(this.state === nextState || is(this.state, nextState));
	}
  clickInput = ()=>{
    let key  = this.state.value===0?'0':this.state.value===1?'1':this.state.value===2?'2':this.state.value===3?'3':this.state.value.substring(0,2)==='20'?'5':'0'
    this.setState({ key:key },()=>{
      setTimeout(()=>{
        if(key !== '5'){
          const arr = document.getElementsByClassName('ant-tabs-content')
          for(var i = 0;i<arr.length;i++){
            arr[i].style.display = 'none'
          }
        }else{
          //document.getElementsByClassName('ant-tabs-content')[0].style.display = 'block'
          const arr = document.getElementsByClassName('ant-tabs-content')
          for(var i = 0;i<arr.length;i++){
            arr[i].style.display = 'block'
          }
        }
      },0)
    })    
  }
  onChange = (key)=>{
    this.setState({key:key},()=>{
        if(this.state.key !== '5'){
          //document.getElementsByClassName('ant-tabs-content')[0].style.display = 'none'
          const arr = document.getElementsByClassName('ant-tabs-content')
          for(var i = 0;i<arr.length;i++){
            arr[i].style.display = 'none'
          }
          let value  = key*1 
          this.setState({ visible:false,value:value},()=>{
          });
          this.props.onSelect(value)
        }else{
          //document.getElementsByClassName('ant-tabs-content')[0].style.display = 'block'
          const arr = document.getElementsByClassName('ant-tabs-content')
          for(var i = 0;i<arr.length;i++){
            arr[i].style.display = 'block'
          }
        }
    });
  }
  handleVisibleChange = (visible) => {
    let calendarPickerPWrapper = document.getElementsByClassName('ant-calendar-picker-container')[0]
    if(calendarPickerPWrapper!==undefined){
      return 
    }
    this.setState({ visible });
  }
  onChangeStartTime = (date, dateString)=>{
    this.setState({
      startTime:dateString,
    })
  }
  onChangeEndTime = (date, dateString)=>{
    this.setState({
      endTime:dateString,
    })
  }
  clickCancle = ()=>{
    this.setState({ visible:false });
  }
  clickOk = ()=>{
    const startTime = this.state.startTime===''?getCurrentDay():this.state.startTime
    const endTime = this.state.endTime===undefined?getCurrentDay():this.state.endTime
    const value = startTime +'~'+endTime
    if(startTime > endTime){
      Toast.error('开始时间不能大于结束时间！')
      return
    }
    this.setState({
      visible:false,
      value:value
    })
    this.props.onSelect(value)
  }
	render() {
		let config = {
      value:this.state.value===0?'年':this.state.value===1?'半年':this.state.value===2?'季度':this.state.value===3?'月份':this.state.value.substring(0,2)==='20'?this.state.value:'年',
      key :this.state.key
		};
    const startTime = this.state.startTime===''?getCurrentDay():this.state.startTime
    const endTime = this.state.endTime===undefined?getCurrentDay():this.state.endTime
    const dateFormat = 'YYYY-MM-DD';
    const customRangeWrapper = (
      <div>
        <div>开始时间</div>
        <DatePicker onChange={this.onChangeStartTime} defaultValue={moment(startTime, dateFormat)}/>
        <div>结束时间</div>
        <DatePicker onChange={this.onChangeEndTime} defaultValue={moment(endTime, dateFormat)}/>
        <div className = 'calendarBtn'><Button onClick={this.clickCancle} type = 'default'>取消</Button><Button onClick={this.clickOk}  type = 'primary'>确定</Button></div>
      </div>
    )
    const content = (
      <div className = 'customRangeTypeTab'>
        <Tabs tabPosition={'left'} onChange={this.onChange} activeKey = {config.key}>
          <TabPane tab="年" key='0'></TabPane>
          <TabPane tab="半年" key='1'></TabPane>
          <TabPane tab="季度" key='2'></TabPane>
          <TabPane tab="月份" key='3'></TabPane>
          <TabPane tab="自定义期间" key='5'>{customRangeWrapper}</TabPane>
        </Tabs>
      </div>
    );
    const visible = this.state.visible
		return (
			<div className = 'customRangeType'>
        <Popover
          content={content}
          trigger="click"
          visible = {visible}
          onVisibleChange={this.handleVisibleChange}
        >
        <div className="common-choose-input-box" onClick={this.clickInput}>{config.value}
          <input  type="text" value="" className="common-choose-input"/>
        </div>
        </Popover>
      </div>
		);
	}
}

export default customRangeType;
