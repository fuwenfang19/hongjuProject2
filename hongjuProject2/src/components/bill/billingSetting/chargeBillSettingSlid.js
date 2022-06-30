/**
 * Created by fuwenfang on 2/22/17.
 * 单据类型
 */

import React from 'react';
import { Tabs, Checkbox, Icon } from 'antd';
import Animate from 'rc-animate'

import * as actions from '../../../actions';

export default class chargeStyleBillBtningSlide extends React.Component {
  clientHeight = document.body.clientHeight;
  constructor() {
    super();
    this.state = {
      visible: false,
      //selectBasicAll:this.props?this.props.selectBasicAll:false
    };
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {

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
    e.stopPropagation()
    const { dispatch, $$mapState } = this.props
    let chargeStyleList = this.props.chargeStyleList
    let expenseClasses = $$mapState.toJS().defaultBillingSetting.expenseClasses === undefined ? [] : $$mapState.toJS().defaultBillingSetting.expenseClasses

    const choseItem = chargeStyleList[i]
    let newdata = [choseItem]
    let newexpenseClasses = []

    const status = e.target.checked
    chargeStyleList[i].isChecked = status

    let r = chargeStyleList.every((item) => {
      return item.isChecked === true
    })

    if (r) {
      this.props.changeChargeBillSlidSelectAll(true)
    } else {
      this.props.changeChargeBillSlidSelectAll(false)
    }
    if (status) {
      newexpenseClasses = expenseClasses.concat(newdata)
    } else {
      newexpenseClasses = expenseClasses.filter((item, index) => {
        return item.id * 1 !== choseItem.id * 1
      })
    }
    dispatch(actions.changeChargeStyleCheckbox(newexpenseClasses))
  }

  //全选
  handleSeletAll = (e) => {
    e.stopPropagation()
    const { dispatch, $$mapState } = this.props
    let chargeStyleList = this.props.chargeStyleList
    let expenseClasses = $$mapState.toJS().defaultBillingSetting.expenseClasses === undefined ? [] : $$mapState.toJS().defaultBillingSetting.expenseClasses
    const selectBasicAll = this.props.selectBasicAll
    if (!selectBasicAll) {
      //全选
      chargeStyleList.map((item, i) => {
        item.isChecked = true
        return item

      })
      let chargeStyleListID = chargeStyleList.map(p => p.id + '')
      let expenseClassesID = expenseClasses.map(p => p.id + '')
      //点击全选时 要过滤掉已选择区域内的人员
      let t = expenseClassesID.some((citem) => {
        return chargeStyleListID.indexOf(citem) > -1
      })
      let chosedShowData = []
      if (!t) {
        //已选与右侧没有重复  把右侧数据全部添加进已选区域
        chosedShowData = expenseClasses.concat(chargeStyleList)
      } else {
        //从右侧数据中把已选区域的过滤掉  再添加
        let filterData = chargeStyleList.filter((item) => {
          return expenseClassesID.indexOf(item.id + '') < 0
        })
        chosedShowData = expenseClasses.concat(filterData)

      }
      dispatch(actions.changeChargeStyleCheckbox(chosedShowData))
      //this.props.changeChargeBillSlidSelectAll(true)
    } else {
      //全不选
      chargeStyleList.map((item, i) => {
        item.isChecked = false
        return item
      })
      let chargeStyleListID = chargeStyleList.map(p => p.id + '')
      let chosedShowData = expenseClasses.filter((item) => {
        return chargeStyleListID.indexOf(item.id + '') < 0
      })
      dispatch(actions.changeChargeStyleCheckbox(chosedShowData))
      //this.props.changeChargeBillSlidSelectAll(false)
    }
  }
  render() {
    const { chargeStyleList } = this.props
    let clientHeight = 516;
    if (document.body.clientHeight) {
      clientHeight = this.props.clientHeight - 50;
    };
      const clientWidth = this.props.clientWidth;
      const pageRightWidth = clientWidth -270-194-30;
    return (
      <div>
        <Animate transitionName="move-right">
          {this.state.visible ? (
            <div className="choose-side-slip" style={{width:0,height:0}}>
              {/*<div className="hide-event-wrap" onClick={this.CloseSlide}></div>*/}
              <div className="slip-real-container" style={{ minWidth:400,width:pageRightWidth*0.4,  height: clientHeight-50,top:'119px' }} >
                <div className="normal-slip-head">
                  <span className='level-text'></span>
                  <span className='title'>费用类型显示内容</span>
                  <span className="close-icon" onClick={this.CloseSlide}>
                    <Icon type="cross" />
                  </span>
                </div>
                <div className='basicArea chargeTypeSlide'>
                  <div className='billingConWrap' style={{ height: clientHeight - 150 }}>
                    <span className = 'choose-remark'>勾选至详情区域</span>
                    {
                      chargeStyleList.length === 0 ? (
                        <span className='billingSettingDataNull'>+请先添加费用类型</span>
                      ) : (
                          <ul className='list-container'>
                            <li className='list-choose-all'>
                              <span className='check-all'>
                                <Checkbox
                                  checked={this.props.selectBasicAll}
                                  onChange={this.handleSeletAll}
                                >
                                </Checkbox>
                              </span>
                              <span >全选</span>
                            </li>
                            {
                              chargeStyleList.map((item, i) => {
                                return (
                                  <li key={i} className='list-item highBillSlide-item'>
                                    <span className='item-checkbox'>
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

