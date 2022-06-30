/**
 * Created by fuwenfang on 2/22/17.
 * 单据类型
 */

import React, { Component } from 'react';
import { Tabs, Checkbox,Icon } from 'antd';
import { connect } from 'react-redux';
import Animate from 'rc-animate'
import uuid from 'uuid';

import { Toast } from '../../common';

import * as actions from '../../../actions';
const TabPane = Tabs.TabPane;

export default class highBillBtningSlide extends React.Component {
  clientHeight = document.body.clientHeight;
  constructor() {
    super();
    this.state = {
      visible: false,
    };
  }
  componentDidMount() {
  }
  show() {
    this.setState({
      visible: true,
    }, () => {
      //console.log(this.state.hightBillSettingData)
    })
  }
  hide() {
    this.setState({
      visible: false
    })
  }
  CloseSlide = () => {
    this.hide()
  }
  changeCheckbox = (e, i) => {
    const { dispatch } = this.props
    const checked = e.target.checked
    let digestDesign = this.props.digestDesign
    const choseItem = this.props.billingStyleData[i]
    let newdata = [choseItem]
    let newDigestDesign = []
    let isNotNullNum = 0
    digestDesign.map((item, index) => {
      if (item.title != "") {
        isNotNullNum++
        return item
      }
    })
    if (checked) {
      if (isNotNullNum === 5) {
        Toast.error('已选区域已满，不可再添加！')
        return
      }
      //补空
      let nullIndex = -1
      let titleArr = digestDesign.map(p => p.title)
      nullIndex = titleArr.indexOf('')
      if (nullIndex === -1) {
        //没有空位
        newDigestDesign = digestDesign.concat(newdata)
      } else {
        //有空位 从前开始补空位
        newDigestDesign = digestDesign.map((item, index) => {
          if (index === nullIndex) {
            item = choseItem
          }
          return item
        })
      }
    } else {
      newDigestDesign = digestDesign.map((item, index) => {
        if (item.id * 1 === choseItem.id * 1) {
          item.id = uuid.v4()
          item.format = ''
          item.col = ''
          item.title = ''
        }
        return item
      })
    }
    dispatch(actions.closeBIllLIst(newDigestDesign))
  }

  render() {
    let clientHeight = 516;
    if (document.body.clientHeight) {
      clientHeight = this.props.clientHeight - 50;
    };
    const clientWidth = this.props.clientWidth;
    const pageRightWidth = clientWidth -270-194-30
    const { billingStyleData, currentBillingSettingCode,currentBillStyle } = this.props
    return (
      <div>
        <Animate transitionName="move-right">
          {this.state.visible ? (
            <div className="choose-side-slip" style={{width:0,height:0}}>
              {/*<div className="hide-event-wrap" onClick={this.CloseSlide}></div>*/}
              <span className = 'choose-remark'>勾选至详情区域</span>
              <div className="slip-real-container" style={{minWidth:400,width:pageRightWidth*0.4,  height: clientHeight-50 ,top:'119px' }} >
                <div className="normal-slip-head">
                  <span className='level-text'></span>
                  <span className='title'>{
																currentBillStyle + '' === '2'?'申请单':
																currentBillStyle + '' === '3'?'报销单':
																currentBillStyle + '' === '15'?'还款单':''
															}列表显示内容</span>
                  <span className="close-icon" onClick={this.CloseSlide}> <Icon type="cross"/></span>
                </div>
                <div className='basicArea appReportSlide' >
                  <div className='billingConWrap' style={{ height: clientHeight - 130 }}>
                    {
                      billingStyleData.length === 0 ? (
                        <span className='billingSettingDataNull'>暂无{
																currentBillStyle + '' === '2'?'申请单':
																currentBillStyle + '' === '3'?'报销单':
																currentBillStyle + '' === '15'?'还款单':''
															}APP摘要可选项</span>
                      ) : (
                          <ul className='list-container'>
                            <li className='list-choose-all'>
                              <span className='check-all'>
                                <Checkbox disabled></Checkbox>
                              </span>
                              <span >全选</span>
                            </li>
                            {
                              billingStyleData.map((item, i) => {
                                return (
                                  <li key={i} className="list-item highBillSlide-item">
                                    <span className='item-checkbox' 
                                    style={{marginTop:0}}>
                                      <Checkbox
                                        checked={item.isChecked}
                                        onChange={(e) => { this.changeCheckbox(e, i) }}
                                      >
                                      </Checkbox>
                                    </span>
                                    <div className='item-content'>
                                      <span>{item.name}</span>
                                    </div>
                                  </li>
                                )
                              })
                            }
                          </ul>
                        )
                    }
                  </div>
                </div>
              </div>
            </div>
          ) : null
          }
        </Animate>
      </div>
    );
  }
}

