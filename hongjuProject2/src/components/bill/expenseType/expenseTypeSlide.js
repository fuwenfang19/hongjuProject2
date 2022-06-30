/**
 * Created by fuwenfang on 2017/3/17.
 */
import React from 'react';
import { Icon, Tabs } from 'antd';
import Animate from 'rc-animate'
import BasicExpense from './basicExpense'
import HighExpense from './highExpense'
const TabPane = Tabs.TabPane;
export default class expenseTypeSlide extends React.Component {

  constructor() {
    super();
    this.state = {
      visible: false,
      level: 'basic',
      isHigherSetting: true
    };
  }

  componentDidMount() {
    
  }
  show = (isHigherSetting) => {
    this.setState({
      visible: true,
      isHigherSetting: true
    }, () => {
      //console.log(this.state.isHigherSetting)
    })
  }
  closeSlip = () => {
    this.setState({
      visible: false,
      level: 'basic',
    })
  };
  handleClickLevel = () => {
    const level = this.state.level
    this.setState({
      level: level === 'basic' ? 'higher' : 'basic'
    }, () => {
      //console.log(this.state.level)
    })
  }
  changeTab = (key)=>{
    this.setState({
      level:key
    })
  }
  //基础单选
  changeSettingCheckbox = (status, id) => {
    this.props.handleBacisCheck(status, id)
  }
  //基础设置全选
  hanldeChangebasicCheckAll = (data) => {
    this.props.hanldeChangebasicCheckAll(data)
  }
  //高级设置单选
  hanldeChangehighCheck = (status, id) => {
    this.props.hanldeChangehighCheck(status, id)
  }
  //高级设置全选
  hanldeChangehighCheckAll = (data) => {
    this.props.hanldeChangehighCheckAll(data)
  }
  //关联档案
  // changeRelateFile = (value) => {
  //   this.props.changeRelateFile(value)
  // }
  //获取自定义档案枚举值
  getCustomBaseDefine = () => {
    this.props.getCustomBaseDefine()
  }
  getBaseFileRelate = () => {
    this.props.getBaseFileRelate()
  }
  //改变高级设置数据类型下拉
  changeFirstSelect = (highSettingDataId, typeid) => {
    this.props.changeFirstSelect(highSettingDataId, typeid)
  }
  changeSecondSelect = (highSettingDataId, relation_type, relation_col) => {
    this.props.changeSecondSelect(highSettingDataId, relation_type, relation_col)
  }
  changeRelationsSelectThird = (highSettingDataId, relation_col) => {
    this.props.changeRelationsSelectThird(highSettingDataId, relation_col)
  }
  changeSelfDefinedNUMFirst = (highSettingDataId, decimal_format, decimal_digits) => {
    this.props.changeSelfDefinedNUMFirst(highSettingDataId, decimal_format, decimal_digits)
  }
  changeSelfDefinedNUMSecond = (highSettingDataId, decimal_digits) => {
    this.props.changeSelfDefinedNUMSecond(highSettingDataId, decimal_digits)
  }
  changeSelfDefinedFIle = (highSettingDataId, custom_objectid, relation_col) => {
    this.props.changeSelfDefinedFIle(highSettingDataId, custom_objectid, relation_col)
  }
  render() {
    const { basicData, highData, clientHeight, isBasicCheckAll, isHighCheckAll, billSettingInfor, highSettingEnums } = this.props
    const that = this
    const level = this.state.level
    let text = level === 'basic' ? '高级' : '基础'
    let tabText = level === 'basic' ? '基础' : '高级'
    let basicDataAll = {}
    basicDataAll.basicData = basicData
    basicDataAll.text = text
    basicDataAll.clientHeight = clientHeight
    basicDataAll.isBasicCheckAll = isBasicCheckAll
    basicDataAll.billSettingInfor = billSettingInfor
    let highDataAll = {}
    highDataAll.highData = highData
    highDataAll.text = text
    highDataAll.clientHeight = clientHeight
    highDataAll.isHighCheckAll = isHighCheckAll
    highDataAll.billSettingInfor = billSettingInfor
    highDataAll.highSettingEnums = highSettingEnums

    const clientWidth = this.props.clientWidth
		const pageRightWidth = clientWidth -270-194-30
    return (
      <div>
        <Animate transitionName="move-right">
          {this.state.visible ? (
            <div className="choose-side-slip" style={{width:0,height:0}}>
              {/*<div className="hide-event-wrap" onClick={this.closeSlip}></div>*/}
              {this.state.isHigherSetting ? (
                <div className="slip-real-container"
                  style={{ minWidth:400,width:pageRightWidth*0.4, height: clientHeight - 100,top:'119px' }}>
                  <div className="normal-slip-head">
                    <span className="level-text"></span>
                    <span className='title'>费用类型显示内容{tabText==='高级'?'（高级）':''}</span>
                    <span className="close-icon" onClick={this.closeSlip}>
                      <Icon type="cross" />
                    </span>
                  </div>
                  <Tabs defaultActiveKey="basic" onChange={this.changeTab}>
                    <TabPane tab="基础" key="basic">
                      <BasicExpense
                        ref='basicExpense'
                        {...basicDataAll}
                        hanldeChangebasicCheck={this.changeSettingCheckbox}
                        hanldeChangebasicCheckAll={this.hanldeChangebasicCheckAll}
                      />
                    </TabPane>
                    <TabPane tab="高级" key="higher">
                      <HighExpense
                        ref='highExpense'
                        {...highDataAll}
                        hanldeChangehighCheck={this.hanldeChangehighCheck}
                        hanldeChangehighCheckAll={this.hanldeChangehighCheckAll}
                        changeRelateFile={this.changeRelateFile}
                        changeFirstSelect={this.changeFirstSelect}
                        changeSecondSelect={this.changeSecondSelect}
                        changeRelationsSelectThird={this.changeRelationsSelectThird}
                        changeSelfDefinedNUMFirst={this.changeSelfDefinedNUMFirst}
                        changeSelfDefinedNUMSecond={this.changeSelfDefinedNUMSecond}
                        changeSelfDefinedFIle={this.changeSelfDefinedFIle}
                      />
                    </TabPane>
                  </Tabs>
                </div>
              ) : (
                  level === 'basic' ? (
                    <div className="slip-real-container"
                      style={{minWidth:400,width:pageRightWidth*0.4,  height: clientHeight - 100 ,top:'119px'}}
                    >
                      <div className="normal-slip-head">
                        <span className="level-text" onClick={this.handleClickLevel}>{text}</span>
                        <span className='title'>费用类型显示内容</span>
                        <span className="close-icon" onClick={this.closeSlip}>
                          <Icon type="cross" />
                        </span>
                      </div>
                      <BasicExpense
                        ref='basicExpense'
                        {...basicDataAll}
                        hanldeChangebasicCheck={this.changeSettingCheckbox}
                        hanldeChangebasicCheckAll={this.hanldeChangebasicCheckAll}
                      />
                    </div>
                  ) : (
                      <div className="slip-real-container"
                        style={{minWidth:400,width:pageRightWidth*0.4,  height: this.props.clientHeight - 100,top:'119px' }}>
                        <div className="normal-slip-head">
                          <span className='level-text' onClick={this.handleClickLevel}>{text}</span>
                          <span className='title'>费用类型显示内容（高级）</span>
                          <span className="close-icon" onClick={this.closeSlip}>
                            <Icon type="cross" />
                          </span>
                        </div>
                        <HighExpense
                          ref='highExpense'
                          {...highDataAll}
                          hanldeChangehighCheck={this.hanldeChangehighCheck}
                          hanldeChangehighCheckAll={this.hanldeChangehighCheckAll}
                          changeRelateFile={this.changeRelateFile}
                          changeFirstSelect={this.changeFirstSelect}
                          changeSecondSelect={this.changeSecondSelect}
                          changeRelationsSelectThird={this.changeRelationsSelectThird}
                          changeSelfDefinedNUMFirst={this.changeSelfDefinedNUMFirst}
                          changeSelfDefinedNUMSecond={this.changeSelfDefinedNUMSecond}
                          changeSelfDefinedFIle={this.changeSelfDefinedFIle}
                        />
                      </div>
                    )
                )
              }
            </div>
          ) :
            null
          }
        </Animate>
      </div>
    );
  }
}

