/**
 * Created by fuwenfang on 2/22/17.
 * 单据类型
 */

import React, { Component } from 'react';
import { Tabs, Checkbox,Icon } from 'antd';
import { connect } from 'react-redux';
import Animate from 'rc-animate'
import BasicSettingArea from './basicSettingArea'
import HighSettingArea from './highSettingArea'

const TabPane = Tabs.TabPane;

export default class billingSlide extends React.Component {
	//clientHeight = document.body.clientHeight;
	constructor() {
		super();
		this.state = {
			visible: false,
			level: 'basic',
			isHigherSetting: 0,
		};

	}

	componentDidMount() {
	}
	show(isSettedHighSetting) {

		this.setState({
			visible: true,
			isSettedHighSetting:1,//默认显示成tabs
		}, () => {
			//console.log(this.state.isSettedHighSetting)
		})
	}
	hide() {
		this.setState({
			visible: false,
			level: 'basic',
		})
	}
	CloseSlide = () => {
		this.hide()
	}

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
	//联动设置详情的删除设置项
	handleDelteCheckbox = (currentID) => {
		// if (this.state.level === 'higher') {
		// 	if (this.refs.highSettingArea === undefined) {
		// 		return
		// 	}
		// 	this.refs.highSettingArea.handleDelteCheckbox(currentID)
		// } else if (this.state.level === 'basic') {
		// 	if (this.refs.basicSettingArea === undefined) {
		// 		return
		// 	}
		// 	this.refs.basicSettingArea.handleDelteCheckbox(currentID)
		//}
	}
	//单选基础设置
	changeSettingCheckbox = (status, basicSettingDataId) => {
		this.props.hanldeChangebasicCheck(status, basicSettingDataId)
	}

	//全选基础设置
	handleBasciSeletAll = (data) => {
		this.props.hanldeChangebasicCheckAll(data)
	}

	//高级设置全选
	hanldeChangehighCheckAll = (selectHighAll, newHighSettingData) => {
		this.props.hanldeChangehighCheckAll(selectHighAll, newHighSettingData)
	}
	//高级设置复选框
	hanldeChangehighCheck = (status, highSettingDataId) => {
		this.props.hanldeChangehighCheck(status, highSettingDataId)
	}
	// //关联档案
	// changeRelateFile = (value) => {
	// 	this.props.changeRelateFile(value)
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
		let clientHeight
		if (document.body.clientHeight) {
			clientHeight = this.props.clientHeight - 50;
		};
		const that = this
		const level = this.state.level
		let text = level === 'basic' ? '高级' : '基础'
		let tabText = level === 'basic' ? '基础' : '高级'
		const isHigherSetting = this.state.isHigherSetting
		const selectBasicAll = this.props.selectBasicAll
		const selectHighAll = this.props.selectHighAll
		const billingStyleData = this.props.billingStyleData
		const highSettingEnums = this.props.highSettingEnums
		const billSettingInfor = this.props.billSettingInfor
		const currentBillStyle = this.props.currentBillStyle

		const basicSettingData = this.props.basicSettingData.concat()
		let nowhightBillSettingData = this.props.hightBillSettingData
		nowhightBillSettingData.sort(function (b, a) {
				return b.name.substr(4) - a.name.substr(4);
		});
		let basicSettingDataAll = {}
		basicSettingDataAll.clientHeight = clientHeight
		basicSettingDataAll.text = text
		basicSettingDataAll.basicSettingData = basicSettingData
		basicSettingDataAll.selectBasicAll = selectBasicAll
		basicSettingDataAll.billSettingInfor = billSettingInfor


		let hightSettingData = {}
		hightSettingData.clientHeight = clientHeight
		hightSettingData.text = text
		hightSettingData.highSettingEnums = highSettingEnums
		hightSettingData.hightSettingData = nowhightBillSettingData
		hightSettingData.selectHighAll = selectHighAll
		hightSettingData.billSettingInfor = billSettingInfor

		let isSettedHighSetting = this.state.isSettedHighSetting
		const clientWidth = this.props.clientWidth
		const pageRightWidth = clientWidth -270-194-30
		
		return (
			<div>
				<Animate transitionName="move-right">
					{this.state.visible ? (
						<div className="choose-side-slip" style={{width:0,height:0}}>
							{/*<div className="hide-event-wrap" onClick={this.CloseSlide}></div>*/}
							{
								isSettedHighSetting ? (
									<div className="slip-real-container" style={{minWidth:400,width:pageRightWidth*0.4, height: clientHeight-50,top:'119px' }}>
										<div className="normal-slip-head">
											<span className="level-text"></span>
											<span className='title'>{
																								currentBillStyle + '' === '2'?'申请单':
																								currentBillStyle + '' === '3'?'报销单':
																								currentBillStyle + '' === '15'?'还款单':''
																							}显示内容{tabText==='高级'?'（高级）':''}</span>
											<span className="close-icon" onClick={this.CloseSlide}>
												<Icon type="cross" />
											</span>
										</div>
										<Tabs defaultActiveKey="basic" onChange = {this.changeTab}>
											<TabPane tab="基础" key="basic">
												<BasicSettingArea
													ref='basicSettingArea'
													{...basicSettingDataAll}
													hightSettingData={hightSettingData}
													handleClickLevel={this.handleClickLevel}
													CloseSlide={this.CloseSlide}
													hanldeChangebasicCheckAll={this.handleBasciSeletAll}
													hanldeChangebasicCheck={this.changeSettingCheckbox}
												/>
											</TabPane>
											<TabPane tab="高级" key="higher">
												<HighSettingArea
													ref='highSettingArea'
													{...basicSettingDataAll}
													{...hightSettingData}
													handleClickLevel={this.handleClickLevel}
													CloseSlide={this.CloseSlide}
													hanldeChangehighCheckAll={this.hanldeChangehighCheckAll}
													hanldeChangehighCheck={this.hanldeChangehighCheck}

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
											<div className="slip-real-container" style={{ minWidth:400,width:'40%',height: clientHeight-50,top:'119px' }} >
												<div className="normal-slip-head">
													<span className='level-text' onClick={this.handleClickLevel}>{text}</span>
													<span className='title'>{
																								currentBillStyle + '' === '2'?'申请单':
																								currentBillStyle + '' === '3'?'报销单':
																								currentBillStyle + '' === '15'?'还款单':''
																							}显示内容</span>
													<span className="close-icon" onClick={this.CloseSlide}>
														<Icon type="cross" />
													</span>
												</div>
												<BasicSettingArea
													ref='basicSettingArea'
													{...basicSettingDataAll}
													hightSettingData={hightSettingData}
													handleClickLevel={this.handleClickLevel}
													CloseSlide={this.CloseSlide}
													hanldeChangebasicCheckAll={this.handleBasciSeletAll}
													hanldeChangebasicCheck={this.changeSettingCheckbox}
												/>
											</div>
										) : (
												<div className="slip-real-container" style={{ minWidth:400,width:'40%',height: clientHeight-100,top:'119px' }} >
													<div className="normal-slip-head">
														<span className='level-text' onClick={this.handleClickLevel}>{text}</span>
														<span className='title'>{
																								currentBillStyle + '' === '2'?'申请单':
																								currentBillStyle + '' === '3'?'报销单':
																								currentBillStyle + '' === '15'?'还款单':''
																							}显示内容（高级）</span>
														<span className="close-icon" onClick={this.CloseSlide}>
															<Icon type="cross" />
														</span>
													</div>
													<HighSettingArea
														ref='highSettingArea'
														{...basicSettingDataAll}
														{...hightSettingData}
														handleClickLevel={this.handleClickLevel}
														CloseSlide={this.CloseSlide}
														hanldeChangehighCheckAll={this.hanldeChangehighCheckAll}
														hanldeChangehighCheck={this.hanldeChangehighCheck}
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
					) : null
					}
				</Animate>
			</div>
		);
	}
}

