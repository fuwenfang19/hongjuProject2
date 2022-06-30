/**
 * Created by fuwenfang on 2/21/17.
 * 单据类型
 */

import React, {Component} from 'react';
import {Button, Switch, Icon, Tooltip, Input, Select, Radio} from 'antd';
import {connect} from 'react-redux';
import update from 'react/lib/update';
import uuid from 'uuid';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {DropdownList, Toast, Confirm} from '../../common'
import NetWork from '../../../global/utils/network';
import domUtil from '../../../global/utils/domutil';
import getQueryString from '../../../global/utils/getQueryString';

import Card from './dragItem';
import ChargeStyleCard from './chargeStyleDragItem';
import HighSettingCard from './highSettingDragItem';
import BillingSlide from './billingSlide'
import HighBillSettingBtnSlid from './highBillSettingBtnSlid'
import ChargeBillSettingSlid from './chargeBillSettingSlid'
import BillingSettingLeftMenu from './billingSettingLeftMenu'
import {test} from '../../common'
import {NewUserIntroduce} from '../../common'

import * as actions from '../../../actions';
import {changeLeftMenuSelected} from '../../../actions';

import edit from '../../../images/billSetting/edit.png';
const Option = Select.Option;
const RadioGroup = Radio.Group;

@DragDropContext(HTML5Backend)

class billingSetting extends Component {

	constructor() {
		super();
		this.state = {
			isEdit: false,
			isHoverBillingName: true,
			isMouseEnterInforCard: true,
			isSettedHighSetting: false,
			isClickHighBillBtn: false,
			isHighDataEdit: false,
			isEditBillingList: false,
			isHoverHighSettingPageList: false,
			isChargeStyleEdit: false,
			isReportBillEdit: false,
			chargeBillSlidSelectAll: false,
			isMouseEnterHeadCard: false,
			isMouseClickReportType: false,
			EditCardscrollbarWidth: 0
		}
	}

	recover = () => {
		this.setState({
			isEdit: false,
			isHoverBillingName: true,
			isMouseEnterInforCard: true,
			isSettedHighSetting: false,
			isClickHighBillBtn: false,
			isHighDataEdit: false,
			isEditBillingList: false,
			isHoverHighSettingPageList: false,
			isChargeStyleEdit: false,
			isReportBillEdit: false,
			chargeBillSlidSelectAll: false,
			isMouseEnterHeadCard: false,
			isMouseClickReportType: false,
			EditCardscrollbarWidth: 0
		})
		//收起侧滑
		this.refs.billingSlide.CloseSlide()
		this.refs.ChargeBillSettingSlid.CloseSlide()
	}

	componentDidMount() {
		const {dispatch} = this.props;
		let paramData = {"grouprange": false}
		dispatch(actions.getLeftBillingStyleList(paramData))

		//页面加载时判断鼠标是否在详情卡片内部
		const card = document.getElementsByClassName('billingSettingInfo')[0]
		const cardX = card.getBoundingClientRect().left
		const cardY = card.getBoundingClientRect().top
		const that = this
		card.onmousemove = function (e) {
			let isInCard = false
			e = e || window.event;
			if (e.clientX > cardX && e.clientX < (cardX + 375) && e.clientY > cardY) {
				isInCard = true
			}
			//判断鼠标是否在所属范围内
			if (isInCard) {
				that.setState({
					isMouseEnterInforCard: true
				})
			}
		}
		//加新手引导 判断是否引导过
		setTimeout(() => {
			that.handleIsUserIntroduced()
			//this.userIntroduce()
		}, 500)
	}

	handleIsUserIntroduced = () => {
		const that = this
		let uid = window.getUserInfo().uid
		let url = '/organization/getguidemessage/' + uid + '/'
		NetWork.get(url,
			(returnData) => {
				//记录在window.userIntroduceData全局里
				window.instroduceData = returnData
				const billData = returnData.bill ? returnData.bill.dataInstroduce : 0
				if (!billData) {
					//alert('没有引导过')
					that.userIntroduce()
				}
			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
	userIntroduce = () => {
		//TODO 判断没有进行过引导 创建cover
		const that = this
		const target1 = document.getElementsByClassName('billingStyleHeadSwitch')[1]
		const target2 = document.getElementsByClassName('billSettingInfo')[0]
		const target3 = document.getElementsByClassName('billSettingInfo')[0]
		const target4 = document.getElementsByClassName('anticon-plus-circle')[0]
		const target5 = document.getElementsByClassName('billSettingInfo')[0]
		const target6 = document.getElementsByClassName('higherBtn')[0]
		const userIntro = [{
			element: target1,
			info: {titlePic: '', remark: ''}, picUrl: 'auto_geberate_bill', arrow: 0
		},
			{element: target2, info: {titlePic: '', remark: ''}, picUrl: 'bill_infor', arrow: 0},
			{element: target3, info: {titlePic: '', remark: ''}, picUrl: 'bill_infor_setting', arrow: 0},
			{element: target4, info: {titlePic: '', remark: ''}, picUrl: 'add_bill', arrow: 0},
			{element: target5, info: {titlePic: '', remark: ''}, picUrl: 'reportBill', arrow: 0},
			{
				element: target6,
				info: {titlePic: '_high_setting', remark: '点击启动按钮，手机APP启动该单据 在高级配置里有遇到配置相关问题，请联系我们4000277970'},
				picUrl: '',
				arrow: 2
			}]
		setTimeout(() => {
			NewUserIntroduce.userIntroduce(that.userIntroduceOver, userIntro)
		}, 1000)
	}
	userIntroduceOver = () => {
		//请求接口  写入已引导结束的标志
		let instroduceData = window.instroduceData
		instroduceData.bill = {'nodataInstroduce': 0, 'dataInstroduce': 1}
		let uid = window.getUserInfo().uid
		NetWork.put('/organization/addguidemessage/' + uid + '/', instroduceData,
			(returnData) => {

			},
			(returnData) => {
				Toast.error(returnData.msg);
			});
	}
	handleSlide = (e) => {
		//e.stopPropagation()
		if (e.target.className === 'ant-checkbox-input') {
			return
		}
		this.handleHighDataslip()
	}
	handleHighDataslip = () => {
		//每次弹出侧滑的时候 去判断高级设置里面是否有勾选 （如果此种不行的话 就只能再初次加载页面请求数据之后 去判断 然后存在redux中）
		const {$$mapState} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		let billSettingInfor = defaultBillingSetting.billSettingInfor
		const currentModel = $$mapState.toJS().currentModel
		let billingStyleData = currentModel === 'add' ? defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template : defaultBillingSetting.viewdefines[0].templatedefine.fields_template
		let basicSettingData = [], hightBillSettingData = []

		billingStyleData.map((item, i) => {
			item.issys ? basicSettingData.push(item) : hightBillSettingData.push(item)
			return item
		})

		//取两个数组中相同的元素 并且打上标签
		//const nowbasicSettingData = this.func(billingStyleDataShow, basicSettingData)
		const nowhighSettingData = this.func(billSettingInfor, hightBillSettingData)
		let isSettedHighSetting = nowhighSettingData.some((item) => {
			return item.isChosed === true
		})
		this.refs.billingSlide.show(isSettedHighSetting)
	}
	//侧滑费用类型
	handleChargeStyleSlide = () => {
		this.refs.ChargeBillSettingSlid.show()
	}

	func(arry1, arry2) {
		arry2.map((item, i) => {
			if (this.isContained(arry1, item.id)) {
				item.isChosed = true
			} else {
				item.isChosed = false
			}
			return item
		})
		return arry2
	}

	isContained(a, b) {
		if (!(a instanceof Array) || (typeof b === 'undefined')) return false;
		for (var i = 0; i < a.length; i++) {
			if (a[i].id * 1 === b * 1) {
				return true;
			}
		}
		return false;
	}

	funcCompare(arry1, arry2) {
		if (arry1 === undefined) {
			return arry2
		}
		const arry1ID = arry1.map(p => p.id * 1)
		let arry3 = []
		for (var i = 0; i < arry2.length; i++) {
			if (arry1ID.indexOf(arry2[i].id * 1) > -1) {
				arry3.push(true)
			} else {
				arry3.push(false)
			}
		}
		for (var j = 0; j < arry2.length; j++) {
			arry2[j].isChecked = arry3[j]
		}

		return arry2
	}

	//点击+ 新增单据类型
	addBillingStyle = (type) => {
		const {dispatch} = this.props;
		dispatch(actions.addBillingStyle(type))
	}
	//点击dropDownList 的 item 请求模板设置
	getDefaultBillingStyle = (key, type) => {
		const {dispatch} = this.props;
		//获取默认设置MenuData
		dispatch(actions.getDefaultBillingStyle(key, type))
		this.recover()

	}
	changeLeftMenuData = (changeLeftMenuData) => {
		const {dispatch} = this.props;
		dispatch(actions.changeBillLeftMenuData(changeLeftMenuData))
	}
	//点击单据类型获取已设置的设置项数据
	getApplicationSetting = (id, type) => {
		const {dispatch} = this.props
		dispatch(actions.getApplicationSettingData(id, type))
		//把页面状态置为初始状态
		this.recover()
	}

	handleHoverBillingName = () => {
		this.setState({
			isHoverBillingName: true
		})
	}
	handleHoverOutBillingName = () => {
		if (this.state.isBillNameFocus) {
			this.setState({
				isHoverBillingName: true,
				isClickEditBillingName: true
			})
		} else {
			this.setState({
				isHoverBillingName: true,
				isClickEditBillingName: false
			})
		}
	}
	clickEditBillNameBtn = () => {
		this.setState({
			isClickEditBillingName: true
		})
	}
	//改变单据名称
	changeBillingName = (e) => {
		this.setState({
			isBillNameChange: true
		})
		const {value} = e.target;
		const {dispatch, $$mapState} = this.props
		dispatch(actions.changeBillingNameInput(value))
	}
	//获取焦点
	changeBillingNameFocus = () => {

		this.setState({
			isBillNameFocus: true
		})
	}
	//失去焦点保存改变
	changeBillingNameBlur = () => {
		this.setState({
			isHoverBillingName: true,
			isClickEditBillingName: false,
			isBillNameFocus: false
		})
		//TODO
		const {dispatch, $$mapState} = this.props
		const currentBillStyle = $$mapState.toJS().currentBillStyle
		const defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		const billId = defaultBillingSetting.id
		let newleftMenuData = $$mapState.toJS().leftMenuData
		const leftMenuData = $$mapState.toJS().leftMenuData[currentBillStyle]
		let billName = $$mapState.toJS().billName
		//先判断左侧菜单中是否有重名的单据名称
		let isRepeatName = leftMenuData.some((item, i) => {
			return item.name === billName
		})
		//改变左侧菜单名  改变右侧显示名
		leftMenuData.map((item, i) => {
			if (item.id === billId) {
				item.name = billName
			}
			return item
		})
		newleftMenuData[currentBillStyle] = leftMenuData
		dispatch(actions.changeBillingNameBlur(newleftMenuData))
		dispatch(actions.changeBillingNameBlurDone(billName))
	}
	clickEditBtn = (e) => {
		e.stopPropagation()
		this.setState({
			isEdit: true
		}, () => {
			//滚动条宽度
			const oP = document.getElementsByClassName('billingSettingInfoEditListUlWrap')[0]
			const scrollbarWidth = oP.offsetWidth - oP.clientWidth;
			this.setState({
				EditCardscrollbarWidth: scrollbarWidth
			})
		})
		this.handleHighDataslip()
	}
	//点击添加申请单/还款单按钮
	clickAddBill = (e) => {
		this.clickEditBtn(e)
	}
	//删除单据
	clikcDeletBilling = () => {
		const {$$mapState, dispatch} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		let leftMenuData = $$mapState.toJS().leftMenuData
		let currentBillStyle = $$mapState.toJS().currentBillStyle
		const currentModel = $$mapState.toJS().currentModel
		const billingName = defaultBillingSetting.name
		Confirm({
			title: '删除单据',
			content: {
				message: '确定要删除 ' + billingName + ' 吗？',
				explain: '',
				highLightText: billingName,
			},
			onOk: () => {
				dispatch(actions.deleteBillingStyle(leftMenuData, currentBillStyle, defaultBillingSetting.id, currentModel))
			},
			onCancel: () => {
			}
		});
	}
	//勾选必填复选框
	changeChecked = (e, i) => {
		e.stopPropagation()
		const {$$mapState, dispatch} = this.props
		let billSettingInfor = $$mapState.toJS().defaultBillingSetting.billSettingInfor
		let newbillSettingInfor = billSettingInfor.concat()

		newbillSettingInfor[i].isnull = !newbillSettingInfor[i].isnull
		//console.log(e.target.checked)
		dispatch(actions.changeBillCheckedSettingItem(newbillSettingInfor))
	}
	//删除设置项
	handleDeleteSettingItem = (e, index) => {
		e.stopPropagation()
		const {$$mapState, dispatch} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		const currentModel = $$mapState.toJS().currentModel
		let newbillingStyleData = currentModel === 'add' ? defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template : defaultBillingSetting.viewdefines[0].templatedefine.fields_template
		let billSettingInfor = defaultBillingSetting.billSettingInfor
		const currentID = billSettingInfor[index].id

		let newbillSettingInfor = billSettingInfor.filter((item, i) => {
			return item.id * 1 !== currentID * 1
		})
		//把defaultBillingSetting中相应的数据项的visible置为false
		newbillingStyleData.map((item) => {
			if (item.id * 1 === currentID * 1) {
				item.visible = false
			}
			return item
		})
		if (currentModel === 'add') {
			defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template = newbillingStyleData
			defaultBillingSetting.billSettingInfor = newbillSettingInfor
		} else if (currentModel === 'edit') {
			defaultBillingSetting.viewdefines[0].templatedefine.fields_template = newbillingStyleData
			defaultBillingSetting.billSettingInfor = newbillSettingInfor
		}
		dispatch(actions.deleteBillSettingItem(defaultBillingSetting))
		//this.refs.billingSlide.handleDelteCheckbox(currentID)
	}

	//拖拽设置项
	applicationmoveCard = (dragIndex, hoverIndex) => {
		const {$$mapState, dispatch} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		let newdefaultBillingSetting = defaultBillingSetting
		let cards = defaultBillingSetting.billSettingInfor.concat()
		const dragCard = cards[dragIndex];
		let sortedBillingStyleData = update({data: cards}, {
			data: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragCard],
				],
			},
		})
		//console.log(sortedBillingStyleData)
		//按index排序
		sortedBillingStyleData.data.map((item, i) => {
			item.order = i + 1
			return item
		})
		newdefaultBillingSetting.billSettingInfor = sortedBillingStyleData.data.concat()
		dispatch(actions.sortedBillingStyleData(sortedBillingStyleData))
	}

	//拖拽设置项
	chargeStylemoveCard = (dragIndex, hoverIndex) => {
		const {$$mapState, dispatch} = this.props
		let expenseClasses = $$mapState.toJS().defaultBillingSetting.expenseClasses
		const dragCard = expenseClasses[dragIndex];
		let sortedExpenseClasses = update({data: expenseClasses}, {
			data: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragCard],
				],
			},
		})
		//按index排序
		sortedExpenseClasses.data.map((item, i) => {
			item.no = i + 1
			return item
		})

		dispatch(actions.dragChargeStyleItem(sortedExpenseClasses))
		//console.log(sortedBillingStyleData)
	}
	hoverDargItem = () => {
		this.setState({
			isHoverDragItem: true
		})
	}
	outDargItem = () => {
		this.setState({
			isHoverDragItem: false
		})
	}
	//基础设置单选
	hanldeChangebasicCheck = (status, basicSettingDataId) => {
		const {$$mapState, dispatch} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		let billSettingInfor = defaultBillingSetting.billSettingInfor
		let newbillSettingInfor = billSettingInfor.concat()
		let newBillSettingInfor = []
		const currentModel = $$mapState.toJS().currentModel
		let billingStyleData = currentModel === 'add' ? defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template : defaultBillingSetting.viewdefines[0].templatedefine.fields_template

		if (status) {
			let checkedItem
			billingStyleData.map((item, i) => {
				if (item.id === basicSettingDataId) {
					item.visible = true
					checkedItem = item
				}
				return item
			})
			newBillSettingInfor = newbillSettingInfor.concat([checkedItem])
		} else {
			newBillSettingInfor = newbillSettingInfor.filter((item) => {
				return item.id * 1 !== basicSettingDataId * 1
			})
		}

		dispatch(actions.changeBillbasichighCheckAll(newBillSettingInfor))
	}
	//基础设置全选
	hanldeChangebasicCheckAll = (data) => {
		const {dispatch} = this.props
		// data.map((item,i)=>{
		// 	item.visible = true
		// 	return item
		// })
		dispatch(actions.changeBillbasichighCheckAll(data))
	}

	//高级设置单选
	hanldeChangehighCheck = (status, highSettingDataId) => {
		const {$$mapState, dispatch} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		let billSettingInfor = defaultBillingSetting.billSettingInfor
		let newbillSettingInfor = billSettingInfor.concat()
		let newBillSettingInfor = []
		const currentModel = $$mapState.toJS().currentModel
		let billingStyleData = currentModel === 'add' ? defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template : defaultBillingSetting.viewdefines[0].templatedefine.fields_template

		if (status) {
			let checkedItem
			billingStyleData.map((item, i) => {
				if (item.id === highSettingDataId) {
					item.visible = true
					checkedItem = item
				}
				return item
			})
			newBillSettingInfor = newbillSettingInfor.concat([checkedItem])
		} else {
			newBillSettingInfor = newbillSettingInfor.filter((item) => {
				return item.id * 1 !== highSettingDataId * 1
			})
		}

		dispatch(actions.changeBillbasichighCheckAll(newBillSettingInfor))

	}
	//高级设置全选
	hanldeChangehighCheckAll = (data) => {
		const {dispatch} = this.props
		// data.map((item,i)=>{
		// 	item.visible = true
		// 	return item
		// })
		dispatch(actions.changeBillbasichighCheckAll(data))
	}
	//改变档案关联
	changeRelateFile = (value) => {
		const {dispatch} = this.props
		dispatch(actions.changeBillRelateFile(value))
	}
	//改变高级设置数据类型第一个下拉
	changeFirstSelect = (highSettingDataId, typeid) => {

		const {$$mapState, dispatch} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting

		const currentModel = $$mapState.toJS().currentModel
		const fields_template_StaffItem = $$mapState.toJS().highSettingEnums.fields_template_StaffItem
		const fakeSelfDefineData = $$mapState.toJS().highSettingEnums.fakeSelfDefineData
		let billingStyleData = currentModel === 'add' ? defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template : defaultBillingSetting.viewdefines[0].templatedefine.fields_template
		let attrs

		switch (typeid) {
			case 1:
				attrs = {"char_length": 64, "char_wrap": false}
				break;
			case 2:
				attrs = {"datetime_format": 3}
				break;
			case 3:
				attrs = {"decimal_digits": 2, "decimal_format": 7};
				break;
			case 7:
				let relation_col
				fields_template_StaffItem.map((item, i) => {
					if (item.code === 'name') {
						relation_col = item.defid
					}
					return item
				})
				attrs = {"relation_type": 1, "relation_col": relation_col};
				break;
			case 11:
				attrs = fakeSelfDefineData.length === 0 ? {} : {
					"custom_objectid": fakeSelfDefineData[0].id,
					"relation_type": 9,
					"relation_col": fakeSelfDefineData[0].field_data.defid
				}
				break;
			default:
				attrs = null
		}
		billingStyleData.map((item, i) => {
			if (item.id === highSettingDataId) {
				item.typeid = typeid
				item.attrs = attrs
			}
			return item
		})

		if (currentModel === 'add') {
			defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template = billingStyleData
		} else if (currentModel === 'edit') {
			defaultBillingSetting.viewdefines[0].templatedefine.fields_template = billingStyleData
		}
		dispatch(actions.changeBillingSettingBySelelct(defaultBillingSetting))
	}
	//高级设置数值金额下拉
	changeSelfDefinedNUMFirst = (highSettingDataId, decimal_format, decimal_digits) => {
		const {$$mapState, dispatch} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		const currentModel = $$mapState.toJS().currentModel
		let billingStyleData = currentModel === 'add' ? defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template : defaultBillingSetting.viewdefines[0].templatedefine.fields_template

		billingStyleData.map((item, i) => {
			if (item.id === highSettingDataId) {
				item.attrs = {}
				item.attrs.decimal_format = decimal_format
				item.attrs.decimal_digits = decimal_digits
			}
			return item
		})

		if (currentModel === 'add') {
			defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template = billingStyleData
		} else if (currentModel === 'edit') {
			defaultBillingSetting.viewdefines[0].templatedefine.fields_template = billingStyleData
		}
		dispatch(actions.changeBillingSettingBySelelct(defaultBillingSetting))
	}

	//修改小数点
	changeSelfDefinedNUMSecond = (highSettingDataId, decimal_digits) => {
		const {$$mapState, dispatch} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		const currentModel = $$mapState.toJS().currentModel
		let billingStyleData = currentModel === 'add' ? defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template : defaultBillingSetting.viewdefines[0].templatedefine.fields_template

		billingStyleData.map((item, i) => {
			if (item.id === highSettingDataId) {
				item.attrs.decimal_digits = decimal_digits
			}
			return item
		})

		if (currentModel === 'add') {
			defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template = billingStyleData
		} else if (currentModel === 'edit') {
			defaultBillingSetting.viewdefines[0].templatedefine.fields_template = billingStyleData
		}
		dispatch(actions.changeBillingSettingBySelelct(defaultBillingSetting))
	}
	//高级设置关联档案的第二个下拉
	changeSecondSelect = (highSettingDataId, relation_type, relation_col) => {
		const {$$mapState, dispatch} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		const currentModel = $$mapState.toJS().currentModel
		let billingStyleData = currentModel === 'add' ? defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template : defaultBillingSetting.viewdefines[0].templatedefine.fields_template

		billingStyleData.map((item, i) => {
			if (item.id === highSettingDataId) {
				item.attrs = {}
				item.attrs.relation_type = relation_type
				item.attrs.relation_col = relation_col
			}
			return item
		})

		if (currentModel === 'add') {
			defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template = billingStyleData
		} else if (currentModel === 'edit') {
			defaultBillingSetting.viewdefines[0].templatedefine.fields_template = billingStyleData
		}
		dispatch(actions.changeBillingSettingBySelelct(defaultBillingSetting))
	}
	//高级设置管理档案第三个下拉框
	changeRelationsSelectThird = (highSettingDataId, relation_col) => {
		const {$$mapState, dispatch} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		const currentModel = $$mapState.toJS().currentModel
		let billingStyleData = currentModel === 'add' ? defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template : defaultBillingSetting.viewdefines[0].templatedefine.fields_template

		billingStyleData.map((item, i) => {
			if (item.id === highSettingDataId) {
				item.attrs.relation_col = relation_col
			}
			return item
		})

		if (currentModel === 'add') {
			defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template = billingStyleData
		} else if (currentModel === 'edit') {
			defaultBillingSetting.viewdefines[0].templatedefine.fields_template = billingStyleData
		}
		dispatch(actions.changeBillingSettingBySelelct(defaultBillingSetting))

	}
	//改变自定义档案的下拉
	changeSelfDefinedFIle = (highSettingDataId, custom_objectid, relation_col) => {
		const {$$mapState, dispatch} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		const currentModel = $$mapState.toJS().currentModel
		let billingStyleData = currentModel === 'add' ? defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template : defaultBillingSetting.viewdefines[0].templatedefine.fields_template

		billingStyleData.map((item, i) => {
			if (item.id === highSettingDataId) {
				item.attrs.relation_col = relation_col
				item.attrs.custom_objectid = custom_objectid
				item.attrs.relation_type = 9
			}
			return item
		})

		if (currentModel === 'add') {
			defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template = billingStyleData
		} else if (currentModel === 'edit') {
			defaultBillingSetting.viewdefines[0].templatedefine.fields_template = billingStyleData
		}
		dispatch(actions.changeBillingSettingBySelelct(defaultBillingSetting))

	}
	//改变申请单关联报销单
	clickAddBaoxiaoItem = (key) => {
		const {$$mapState, dispatch} = this.props
		const shenqindanRelatebaoxiaodan = $$mapState.toJS().shenqindanRelatebaoxiaodan
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		let chosenReletItem
		shenqindanRelatebaoxiaodan.map((item, i) => {
			if (item.id * 1 === key * 1) {
				chosenReletItem = shenqindanRelatebaoxiaodan[i]
			}
			return item
		})
		defaultBillingSetting.defaultReportType = chosenReletItem
		dispatch(actions.choseRelateBaoxiaobill(defaultBillingSetting))
		this.setState({
			isMouseClickReportType: false
		})
	}
	//改变是否自动生成
	changeAutoTrans = (checked) => {
		const {dispatch} = this.props
		dispatch(actions.changeBillAutoTransCheck(checked))
	}
	//改变是否启用
	changeBillIsused = (checked) => {
		const {dispatch, $$mapState} = this.props
		let defaultBillingSettingName = $$mapState.toJS().defaultBillingSetting.name
		let message = ''
		if (checked) {
			message = '使用' + defaultBillingSettingName + '成功！'
		} else {
			message = '不使用' + defaultBillingSettingName + '啦！'
		}
		//Toast.success(message)
		dispatch(actions.changeBillIsused(checked))
	}
	//鼠标滑过详情卡片
	hoverBillingSettingInfo = () => {
		this.setState({
			isMouseEnterInforCard: true
		})
	}
	//鼠标滑出详情卡片
	outBillingSettingInfo = () => {
		this.setState({
			isMouseEnterInforCard: true
		})
	}
	//鼠标滑过单据类型头部卡片
	hoverBillingStyleHead = () => {
		this.setState({
			isMouseEnterHeadCard: true
		})
	}
	//鼠标滑出单据类型头部卡片
	outBillingStyleHead = () => {
		this.setState({
			isMouseEnterHeadCard: false,
		})
	}
	//点击报销类型
	clickReportType = () => {
		this.setState({
			isMouseClickReportType: true
		})
	}
	//删除报销类型
	clickDeleteDefaultReportType = () => {
		const {dispatch, $$mapState} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		defaultBillingSetting.defaultReportType = null
		dispatch(actions.choseRelateBaoxiaobill(defaultBillingSetting))
		this.setState({
			isMouseClickReportType: false
		})
	}
	clickBlankPage = (e) => {
		e.preventDefault()
		e.stopPropagation()
		const parentNode = document.getElementsByClassName('billingStyleHeadLeft')[0]
		if (domUtil.isParent(e.target, parentNode)) {
			return
		} else {
			this.setState({
				isMouseClickReportType: false
			})
		}
	}
	//点击费用类型编辑
	clickEditChargeStyleBtn = () => {
		this.setState({
			isChargeStyleEdit: true,
			isReportBillEdit: false
		})
		this.refs.ChargeBillSettingSlid.show()

	}
	//点击添加费用类型
	clickAddchargeStyle = () => {
		this.clickEditChargeStyleBtn()
	}
	//点击报销单编辑页面的返回按钮
	clickBackBtn = (e) => {
		e.stopPropagation()
		this.setState({
			isChargeStyleEdit: false,
			isReportBillEdit: false
		})
		//点击返回 收起侧滑
		this.refs.billingSlide.CloseSlide()
		this.refs.ChargeBillSettingSlid.CloseSlide()
	}
	//点击返回按钮
	clickGoBackBtn = (e) => {
		e.stopPropagation()
		this.setState({
			isEdit: false,
		})
		//点击返回 收起侧滑
		this.refs.billingSlide.CloseSlide()
	}
	//点击报销单头部编辑
	clickEditReportBtn = () => {
		this.setState({
			isReportBillEdit: true,
			isChargeStyleEdit: false
		}, () => {
			//滚动条宽度
			const oP = document.getElementsByClassName('billingSettingInfoEditListUlWrap')[0]
			const scrollbarWidth = oP.offsetWidth - oP.clientWidth;
			this.setState({
				EditCardscrollbarWidth: scrollbarWidth
			})
		})
		this.handleHighDataslip()
	}
	//点击添加报销单据详情
	clickAddreportbill = () => {
		this.clickEditReportBtn()
	}
	//取消设置
	clikCancleBilling = () => {
		const {dispatch, $$mapState} = this.props
		const recoverBillingSetting = $$mapState.toJS().recoverBillingSetting
		const localLeftMenuData = $$mapState.toJS().localLeftMenuData
		Confirm({
			title: '提示',
			content: {
				message: '当前数据将全部丢失，确认？',
				explain: '',
				highLightText: '',
			},
			onOk: () => {
				dispatch(actions.cancleBillSettingData(recoverBillingSetting, localLeftMenuData))
			},
			onCancel: () => {
			}
		});
	}
	//保存设置项
	clikcSaveBilling = () => {
		const {dispatch, $$mapState} = this.props
		let defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		let billSettingInfor = defaultBillingSetting.billSettingInfor
		let billSettingInforID = billSettingInfor.map(p => p.id * 1)
		let currentModel = $$mapState.toJS().currentModel
		let currentBillStyle = $$mapState.toJS().currentBillStyle
		let leftMenuData = $$mapState.toJS().leftMenuData
		let leftMenuDataName = leftMenuData[currentBillStyle].map((p => p.name))
		let billName = $$mapState.toJS().billName
		let digestDesign = defaultBillingSetting.digestDesign
		let filterDigestDesign = []
		let disburseClasses = []
		let num = 0

		for (let i = 0; i < leftMenuDataName.length; i++) {
			if (leftMenuDataName[i].trim() === billName.trim()) {
				num++
			}
		}
		//保存的时候判断当前单据名称不能重名(与leftMenuData对比 除去自身之外没有一样的 才是不重名)

		if (num >= 2) {
			Toast.error(`${billName}已经存在，单据名称不可重名！`)
			return
		}

		if(defaultBillingSetting.code.trim() === ''){
			Toast.error('请在高级设置里输入单据编码');
			return;
		}

		/*为防止digestDesign内有空元素 先过滤一次 如果摘要设置要暴露的话 这一段校验删掉*/
		if (digestDesign.length > 0) {
			digestDesign.map((item) => {
				if (item.title !== '') {
					filterDigestDesign.push()
				}
			})
		}
		defaultBillingSetting.digestDesign = filterDigestDesign

		/* 以下是APP端单据列表摘要设置的保存条件判断  这一版先注释*/
		// //TODO 处理APP摘要设置 添加position信息
		// if (digestDesign.length > 0) {
		// 	digestDesign.map((item, i) => {
		// 		item.option = i
		// 		return item
		// 	})
		// }

		// //TODO 处理APP摘要设置 第二行必填
		// let testFlag = false
		// if (digestDesign[2].title === '') {
		// 	testFlag = true
		// }
		// if (testFlag) {
		// 	Toast.error('高级按钮页面APP摘要设置第二行必填!')
		// 	return
		// }
		// //TODO 处理APP摘要设置 第一行至少有一个必填
		// let testFlagAgain = false
		// if (digestDesign[0].title === '' & digestDesign[1].title === '') {
		// 	testFlagAgain = true
		// }
		// if (testFlagAgain) {
		// 	Toast.error('高级按钮页面APP摘要设置第一行至少必填一个字段!')
		// 	return
		// }
		// //TODO 处理APP摘要设置 过滤掉title为空的
		// let filterDigestDesign = digestDesign.filter((item) => {
		// 	return item.title !== ''
		// })
		// //TODO 处理APP摘要设置 至少有两个不为空的字段
		// if (filterDigestDesign.length < 2) {
		// 	Toast.error('高级按钮页面APP摘要设置请至少添加两个字段!')
		// 	return
		// }
		//defaultBillingSetting.digestDesign = filterDigestDesign

		if (!defaultBillingSetting.defaultReportType) {
			defaultBillingSetting.defaultReportType = null
		}
		if (defaultBillingSetting.defaultExpenseType === undefined) {
			defaultBillingSetting.defaultExpenseType = null
		}
		if (currentBillStyle + '' === '3' && defaultBillingSetting.fromApplication === undefined) {
			defaultBillingSetting.fromApplication = false
		}
		if ((currentBillStyle + '' === '3'||currentBillStyle + '' === '2' )&& defaultBillingSetting.useBudget === null) {
			defaultBillingSetting.useBudget = false
		}
		if (currentModel === 'add') {
			//digestDefine 中 单据类型 应该显示成当前单据类型而不是模板单据类型 目前 digestDesign是没有作用的
			let templateName = defaultBillingSetting.originNameOfTemplate;
			defaultBillingSetting.digestDefine = defaultBillingSetting.digestDefine.replace(templateName,defaultBillingSetting.name);
			let templatedefine = {}, fields_template = []
			// defaultBillingSetting.objectModel = defaultBillingSetting.code
			// defaultBillingSetting.parent = defaultBillingSetting.code
			defaultBillingSetting.code = defaultBillingSetting.code

			fields_template = defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template
			let fields_templateID = fields_template.map(p => p.id * 1)

			//过滤数据
			let filterData, newfields_template
			filterData = fields_template.filter((item) => {
				return billSettingInforID.indexOf(item.id * 1) < 0
			})
			//基础设置项不修改enable   自定义项选上visible全为true enable也全为true
			billSettingInfor.map((item, i) => {
				if (item.issys) {
					item.visible = true
				} else {
					item.visible = true
					item.enable = true
				}
			})
			//基础设置项不修改enable   自定义项 未选上的visible全为false enable也全为false
			filterData.map((item, i) => {
				if (item.issys) {
					item.visible = false
				} else {
					item.visible = false
					item.enable = false
				}
			})

			billSettingInfor.map((item, i) => {
				item.order = i + 1
				if (fields_templateID.indexOf(item.id * 1) > -1) {
					item.attrs = fields_template[fields_templateID.indexOf(item.id * 1)].attrs
					item.typeid = fields_template[fields_templateID.indexOf(item.id * 1)].typeid
				}
				return item
			})
			newfields_template = filterData.concat(billSettingInfor)

			defaultBillingSetting.viewdefines[0].templatedefinetemplate.fields_template = newfields_template

			delete defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template

			templatedefine = defaultBillingSetting.viewdefines[0].templatedefinetemplate
			delete templatedefine.id

			defaultBillingSetting.viewdefines[0].templatedefine = templatedefine

			delete defaultBillingSetting.viewdefines[0].templatedefinetemplate
			delete defaultBillingSetting.billSettingInfor
			if (currentBillStyle === '3') {
				disburseClasses = $$mapState.toJS().disburseClasses
				defaultBillingSetting.disburseClasses = disburseClasses
				if (defaultBillingSetting.expenseClasses === undefined) {
					defaultBillingSetting.expenseClasses = []
				} else {
					defaultBillingSetting.expenseClasses.map((item, i) => {
						item.showOrder = i + 1
						return item
					})
				}
			}
			dispatch(actions.saveBillSettingData(defaultBillingSetting, currentBillStyle))
			this.recover()
			//console.log(defaultBillingSetting)
			return
		}
		if (currentBillStyle === '3') {
			disburseClasses = $$mapState.toJS().disburseClasses
			defaultBillingSetting.disburseClasses = disburseClasses
			if (defaultBillingSetting.expenseClasses === undefined) {
				defaultBillingSetting.expenseClasses = []
			} else {
				defaultBillingSetting.expenseClasses.map((item, i) => {
					item.showOrder = i + 1
					return item
				})
			}
		}
		//过滤数据
		let filterData, newfields_template
		let fields_template = defaultBillingSetting.viewdefines[0].templatedefine.fields_template
		let fields_templateID = fields_template.map(p => p.id * 1)
		filterData = fields_template.filter((item) => {
			return billSettingInforID.indexOf(item.id * 1) < 0
		})
		//基础设置项不修改enable   自定义项选上visible全为true enable也全为true
		billSettingInfor.map((item, i) => {
			if (item.issys) {
				item.visible = true
			} else {
				item.visible = true
				item.enable = true
			}
		})
		//基础设置项不修改enable   自定义项 未选上的visible全为false enable也全为false
		filterData.map((item, i) => {
			if (item.issys) {
				item.visible = false
			} else {
				item.visible = false
				item.enable = false
			}
		})

		billSettingInfor.map((item, i) => {
			item.order = i + 1
			if (fields_templateID.indexOf(item.id * 1) > -1) {
				item.attrs = fields_template[fields_templateID.indexOf(item.id * 1)].attrs
				item.typeid = fields_template[fields_templateID.indexOf(item.id * 1)].typeid
				//console.log(item)
			}
			return item
		})
		newfields_template = filterData.concat(billSettingInfor)
		defaultBillingSetting.viewdefines[0].templatedefine.fields_template = newfields_template
		delete defaultBillingSetting.billSettingInfor
		defaultBillingSetting.disburseClasses = disburseClasses

		dispatch(actions.saveBillSettingData(defaultBillingSetting, currentBillStyle))
		this.recover()
	}
	//点击高级按钮 换界面
	clikcHighBillingBtn = () => {
		this.setState({
			isClickHighBillBtn: true
		})
		const {dispatch, $$mapState} = this.props
		const currentBillStyle = $$mapState.toJS().currentBillStyle
		//TODO 获取获取摘要定义模板列表
		dispatch(actions.getDigesttemplates(currentBillStyle))
		//收起侧滑
		this.refs.billingSlide.CloseSlide()
		this.refs.ChargeBillSettingSlid.CloseSlide()
	}
	//点击叉 关闭高级按钮设置界面
	clickCloseHighSetting = () => {
		this.setState({
			isClickHighBillBtn: false
		})
	}
	//鼠标移入高级设置卡片
	handleHoverHighSettingPage = () => {
		this.setState({
			isHoverHighSettingPage: true
		})
	}
	//鼠标移出高级设置卡片
	handleOutHighSettingPage = () => {
		this.setState({
			isHoverHighSettingPage: false
		})
	}
	//点击高级按钮界面设置参数的编辑按钮
	clickEditHighSettingPage = () => {
		this.setState({
			isHighDataEdit: true
		})
	}
	//鼠标移入申请单列表卡片
	handleHoverHighSettingPageList = () => {
		this.setState({
			isHoverHighSettingPageList: true
		})
	}
	//鼠标移出申请单列表卡片
	handleOutHighSettingPageList = () => {
		this.setState({
			isHoverHighSettingPageList: false
		})
	}
	//点击申请单列表的编辑
	clickEditHighSettingPageList = (e) => {
		e.stopPropagation()
		this.setState({
			isEditBillingList: true
		})
		this.refs.HighBillSettingBtnSlid.show()
	}
	//点击申请单列表
	clickHighSettingPageList = () => {
		this.setState({
			//isEditBillingList: true
		})
		//只有在编辑状态下点击卡片才会侧滑
		if (this.state.isEditBillingList) {
			this.refs.HighBillSettingBtnSlid.show()
		}
	}
	//改变预算占用
	changeUseBudget = (checked) => {
		const {dispatch} = this.props
		dispatch(actions.changeBillUseBudget(checked))
	}
	//改变是否冲销
	changeIsreversal = (checked) => {
		const {dispatch} = this.props
		dispatch(actions.changeIsreversal(checked))
	}
	//改变自动生成凭证
	changeAutogenvoucher = (checked) => {
		const {dispatch} = this.props
		dispatch(actions.changeAutogenvoucher(checked))
	}
	//改变审批后删除
	changeCanDeleteAfterApproval = (checked) => {
		const {dispatch} = this.props
		dispatch(actions.changeCanDeleteAfterApproval(checked))
	}
	//改变审批流发起人
	changeApprovalDefineAuthor = (value) => {
		const {dispatch} = this.props
		dispatch(actions.changeApprovalDefineAuthor(value))
	}
	//改变是否先申请
	changeFromApplication = (checked) => {
		const {dispatch} = this.props
		dispatch(actions.changeFromApplication(checked))
	}
	//改变 允许冲借款金额大于报销金额 
	changeLimitLoanAmount = (checked) => {
		const {dispatch} = this.props
		dispatch(actions.changeLimitLoanAmount(!checked))
	}
	//改变查看方式
	changeDisplayByExpense = (e) => {
		const status = e.target.value
		const {dispatch} = this.props
		dispatch(actions.changeDisplayByExpense(status))
	}
	moveHighSettingCard = (dragIndex, hoverIndex) => {
		const {dispatch, $$mapState} = this.props
		const defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		let fakeHighSettingBtnListData = defaultBillingSetting.digestDesign
		const dragCard = fakeHighSettingBtnListData[dragIndex];
		let data = update({fakeHighSettingBtnListData: fakeHighSettingBtnListData}, {
			fakeHighSettingBtnListData: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragCard],
				],
			},
		})
		//console.log(sortedBillingStyleData)
		//按index排序
		data.fakeHighSettingBtnListData.map((item, i) => {
			item.torder = i
			return item
		})

		dispatch(actions.closeBIllLIst(data.fakeHighSettingBtnListData))
	}
	//支付类型右侧侧滑是否全选
	changeChargeBillSlidSelectAll = (flag) => {
		this.setState({
			chargeBillSlidSelectAll: flag
		})
	}
	//返回首页
	goBackHomepage = () => {
		try {
			window.location.hash = '#/homePage?guide=true'
			this.props.dispatch(changeLeftMenuSelected('homePage'))
		} catch (e) {

		}
	}
	clickSettingDataBtn = (e) => {
		e.stopPropagation()
		this.setState({
			isHighDataEdit: false
		})
	}
	clickSettingListBtn = (e) => {
		e.stopPropagation()
		this.setState({
			isEditBillingList: false
		})
	}
	clickBackToBasicView = (e) => {
		e.stopPropagation()
		this.setState({
			isClickHighBillBtn: false
		})
		if (this.state.isEdit || this.state.isReportBillEdit) {
			this.handleHighDataslip()
		}
		if (this.state.isChargeStyleEdit) {
			this.refs.ChargeBillSettingSlid.show()
		}
	}

	render() {
		const isEdit = this.state.isEdit
		const isHoverDragItem = this.state.isHoverDragItem
		const {$$mapState, clientHeight, clientWidth} = this.props
		const highSettingEnums = $$mapState.toJS().highSettingEnums
		const billingStyleList = $$mapState.toJS().billingStyleList
		const defaultBillingSetting = $$mapState.toJS().defaultBillingSetting
		const billSettingInfor = defaultBillingSetting.billSettingInfor
		//console.log(billSettingInfor)
		const expenseClasses = defaultBillingSetting.expenseClasses === undefined ? [] : defaultBillingSetting.expenseClasses
		const digestDesign = defaultBillingSetting.digestDesign
		const chargeStyleList = $$mapState.toJS().chargeStyleList
		const billName = $$mapState.toJS().billName
		const currentBillingSettingID = defaultBillingSetting.id
		const currentName = defaultBillingSetting.name
		const saveId = $$mapState.toJS().saveId
		const currentModel = $$mapState.toJS().currentModel
		const leftMenuData = $$mapState.toJS().leftMenuData
		const currentBillStyle = $$mapState.toJS().currentBillStyle
		const shenqindanRelatebaoxiaodan = $$mapState.toJS().shenqindanRelatebaoxiaodan[0] ? $$mapState.toJS().shenqindanRelatebaoxiaodan : [{
			'name': '',
			'id': '1'
		}]
		//state的设置项已经排过序 直接渲染
		let billingStyleData = currentModel === 'add' ? defaultBillingSetting.viewdefines[0].templatedefinetemplate.fieldtemplates_template : defaultBillingSetting.viewdefines[0].templatedefine.fields_template

		let currentBillingSettingCode

		if (currentBillStyle + '' === '2') {
			currentBillingSettingCode = defaultBillingSetting.objectModel
		} else if (currentBillStyle + '' === '3' || currentBillStyle + '' === '15') {
			currentBillingSettingCode = defaultBillingSetting.parent
		}
		//console.log(currentBillingSettingCode)
		// let visibaleBillingStyleData = billingStyleData.filter((item, i) => {
		// 	return item.visible === true
		// })
		let isLeftMenuOverflow
		//判断左侧菜单是否超出屏幕高度
		const leftMenuListLength = (leftMenuData['2'].length + leftMenuData['3'].length + leftMenuData['15'].length) * 53 + 60 * 3
		//const clientHeight = document.body.clientHeight
		if (clientHeight <= leftMenuListLength + 64) {
			isLeftMenuOverflow = true
		} else {
			isLeftMenuOverflow = false
		}

		let basicSettingData = []
		let hightBillSettingData = []

		billingStyleData.map((item, i) => {
			item.issys ? basicSettingData.push(item) : hightBillSettingData.push(item)
			return item
		})

		let leftMenuDataAll = {}
		leftMenuDataAll.leftMenuData = leftMenuData
		leftMenuDataAll.billingStyleList = billingStyleList
		leftMenuDataAll.isLeftMenuOverflow = isLeftMenuOverflow
		leftMenuDataAll.currentBillingSettingID = currentBillingSettingID
		leftMenuDataAll.saveId = saveId
		leftMenuDataAll.currentModel = currentModel
		leftMenuDataAll.currentBillStyle = currentBillStyle
		leftMenuDataAll.clientHeight = clientHeight
		leftMenuDataAll.currentName = currentName

		let DropdownListData = {}
		DropdownListData.trigger = 'click'
		DropdownListData.data = shenqindanRelatebaoxiaodan

		const highSettingBtnListData = $$mapState.toJS().highSettingBtnListData
		const tableTitleData = this.funcCompare(digestDesign, highSettingBtnListData)

		let highBillSettingBtnData = {}
		highBillSettingBtnData.billingStyleData = tableTitleData
		highBillSettingBtnData.currentBillingSettingCode = currentBillingSettingCode
		highBillSettingBtnData.digestDesign = digestDesign
		highBillSettingBtnData.clientHeight = clientHeight
		highBillSettingBtnData.clientWidth = clientWidth

		highBillSettingBtnData.currentBillStyle = currentBillStyle

		let chargeListDataComp = chargeStyleList
		let selectBasicAll = false
		if (currentBillStyle === '3') {
			chargeListDataComp = this.funcCompare(expenseClasses, chargeStyleList)
			selectBasicAll = chargeListDataComp.every((p, i) => {
				return p.isChecked === true
			})
		}
		let chargeListData = {}
		chargeListData.chargeStyleList = chargeListDataComp
		chargeListData.selectBasicAll = selectBasicAll
		chargeListData.clientHeight = clientHeight
		chargeListData.clientWidth = clientWidth

		//取两个数组中相同的元素 并且打上标签
		const nowbasicSettingData = this.func(billSettingInfor, basicSettingData)
		const nowhighSettingData = this.func(billSettingInfor, hightBillSettingData)
		//是否全选判断
		let checkBasicAll = nowbasicSettingData.every((p, i) => {
			return p.isChosed === true
		})
		let checkHighAll = nowhighSettingData.every((p, i) => {
			return p.isChosed === true
		})

		const isHoverBillingName = this.state.isHoverBillingName
		const isEditBillingList = this.state.isEditBillingList

		const isFromHomepage = getQueryString('isFromHomepage')
		//const clientWidth = document.body.clientWidth
		const pageRightWidth = clientWidth - 270 - 194 - 30
		const EditCardscrollbarWidth = this.state.EditCardscrollbarWidth
		return (
			<div className="billSetting-page page">
				<div className="gutter-box billing-project-left content-left">
					<BillingSettingLeftMenu
						{...leftMenuDataAll}
						addBillingStyle={this.addBillingStyle}
						dispatch={this.props.dispatch}
						$$mapState={this.props.$$mapState}
						getDefaultBillingStyle={this.getDefaultBillingStyle}
						getApplicationSetting={this.getApplicationSetting}
						changeLeftMenuData={this.changeLeftMenuData}
						recover={this.recover}
					/>
				</div>
				<div className="gutter-box billing-project-right content-right" onClick={this.clickBlankPage}>
					<div className='billing-project-right-head content-right-head'>
						<div className='billingName head-left'
						     onMouseEnter={this.handleHoverBillingName}
						     onMouseLeave={this.handleHoverOutBillingName}
						>
							<span>
								{isHoverBillingName ? (
									this.state.isClickEditBillingName ?
										(<Input value={billName}
										        onChange={this.changeBillingName}
										        onBlur={this.changeBillingNameBlur}
										        onFocus={this.changeBillingNameFocus}
										        style={{marginTop: -5}}
										/>) : (<span>
											<span className='billName' title={defaultBillingSetting.name}>{defaultBillingSetting.name}</span>
											<span className='billingSettingInfoHeadSpanEdit'
											      onClick={this.clickEditBillNameBtn}>
													<a className="edit-btn" href="javascript:;">编辑</a>
												{/*<img src={edit} style={{width: '14px', height: '14px'}}/>*/}
												</span>
										</span>)
								) : (<span className='billName' title={defaultBillingSetting.name}>{defaultBillingSetting.name}</span>)
								}
							</span>
						</div>
						<div className="billingSettingBtn head-right">
							<span className='higherBtn'>
								<span className='billingStyleHeadSwitch'>启用
								<Switch className='switch'
								        checked={defaultBillingSetting.isUsed}
								        onChange={this.changeBillIsused}/>
								</span>
								<Button type="primary" onClick={this.clikcHighBillingBtn}>高级</Button>
							</span>
							<Button type="primary" onClick={this.clikcDeletBilling}>删除</Button>
							{
								(saveId * 1 === -2 || saveId * 1 === -3) ? null : (
									<Button type="default" onClick={this.clikCancleBilling}>取消</Button>
								)
							}
							<Button type="primary"
							        disabled={saveId * 1 === -3}
							        onClick={this.clikcSaveBilling
							        }>保存</Button>
						</div>
					</div>
					{
						this.state.isClickHighBillBtn ?
							(
								<div>
									<div className='highSettingPageHead'>
										<div className='billingNameHighSettingBack' onClick={this.clickBackToBasicView}>
											返回
										</div>
										{/*<span className='billingNameHighSetting'>{defaultBillingSetting.name}高级设置</span>*/}
									</div>
									<div>
										{
											this.state.isHighDataEdit ? (
												<div className='highSettingPageData highSettingPageDataHover'>
													<div>
														<span className='highSettingPageDataHead'>
															{
																currentBillStyle + '' === '2' ? '申请单' :
																	currentBillStyle + '' === '3' ? '报销单' :
																		currentBillStyle + '' === '15' ? '还款单' : ''
															}相关参数</span>
														<span className='highSettingPageDataHeadIcon'
														      style={{fontSize: 12}}
														      onClick={this.clickSettingDataBtn}>完成</span>
													</div>
													<div className='highSettingSponsor'>
														<span className='highSetting-label'>单据编码：</span>
														<span style={{float: 'right'}}>
															<Input value={defaultBillingSetting.code} onChange={(e) => {
																	this.props.dispatch(actions.changeBillingNameInput(e.target.value.trim(), true))
															}}/>
														</span>
													</div>
													<div className='highSettingSponsor'>
														<span className='highSetting-label'>审批流发起人：</span>
														<span style={{float: 'right'}}>
															<Select
																style={{width: 200}}
																value={defaultBillingSetting.approvalDefine ? defaultBillingSetting.approvalDefine.author : ''}
																onChange={this.changeApprovalDefineAuthor}
															>
																<Option value=''>单据填写人</Option>
																<Option value='low'>最低岗位级别的实际申请人</Option>
																<Option value='top'>最高岗位级别的实际申请人</Option>
															</Select>
														</span>
													</div>
													<div className='highSettingSwitch'>
														<ul>
															{currentBillingSettingCode === 'AgendaApplication' || currentBillingSettingCode === 'PublicPaymentApplication' ||
															currentBillingSettingCode === 'Repayment'
																? null : (
																	<li className='highSettingPageDataLi'>
																		<span className='highSetting-label'>预算占用</span>
																		<span className='checkSwitch'>
																			<Switch
																				checked={defaultBillingSetting.useBudget}
																				onChange={this.changeUseBudget}
																			/>
																		</span>
																	</li>
																)}
															{currentBillingSettingCode === 'AgendaApplication' || currentBillingSettingCode === 'PublicPaymentApplication' ||
															currentBillingSettingCode === 'Repayment' ||
															currentBillStyle + '' === '3'
																? null : (
																	<li className='highSettingPageDataLi'>
																		<span className='highSetting-label'>借款金额参与所有冲销</span>
																		<span className='checkSwitch'>
																			<Switch
																				checked={defaultBillingSetting.isreversal}
																				onChange={this.changeIsreversal}
																			/>
																		</span>
																	</li>
																)}
															{currentBillingSettingCode === 'AgendaApplication' ? null : (
																<li className='highSettingPageDataLi'>
																	<span className='highSetting-label'>自动生成凭证</span>
																	<span className='checkSwitch'>
																		<Switch
																			checked={defaultBillingSetting.autogenvoucher}
																			onChange={this.changeAutogenvoucher}
																		/>
																	</span>
																</li>
															)}
															{
																currentBillingSettingCode === 'Repayment' ||
																currentBillStyle + '' === '3' ? null : (
																	<li className='highSettingPageDataLi'>
																		<span className='highSetting-label'>允许删除已审批的单据</span>
																		<span className='checkSwitch'>
																				<Switch
																					checked={defaultBillingSetting.canDeleteAfterApproval}
																					onChange={this.changeCanDeleteAfterApproval}
																				/>
																			</span>
																	</li>
																)
															}
															{
																currentBillStyle + '' === '3' ? (
																	<li className='highSettingPageDataLi'>
																		<span className='highSetting-label'>是否先申请</span>
																		<span className='checkSwitch'>
																			<Switch
																				checked={defaultBillingSetting.fromApplication}
																				onChange={this.changeFromApplication}
																			/>
																		</span>
																	</li>
																) : null
															}
															{
																currentBillStyle + '' === '3' && currentBillingSettingCode !== 'PublicPaymentReport' ? (
																	<li className='highSettingPageDataLi'>
																		<span className='highSetting-label'>允许冲借款金额大于报销金额 </span>
																		<span className='checkSwitch'>
																			<Switch
																				checked={!defaultBillingSetting.limitLoanAmount}
																				onChange={this.changeLimitLoanAmount}
																			/>
																		</span>
																	</li>
																) : null
															}
															{
																currentBillStyle + '' === '3' && currentBillingSettingCode === 'TravelReport' ? (
																	<li className='highSettingPageDataLi'>
																		<span className='highSetting-label'>查看方式：</span>
																		<RadioGroup onChange={this.changeDisplayByExpense}
																		            value={defaultBillingSetting.displayByExpense}>
																			<Radio value={true}>按费用明细查看</Radio>
																			<Radio value={false}>按行程明细查看</Radio>
																		</RadioGroup>
																	</li>
																) : null
															}
														</ul>
													</div>
												</div>
											) : (
												<div
													className={this.state.isHoverHighSettingPage || this.state.isHighDataEdit ? 'highSettingPageData  highSettingPageDataHover' : 'highSettingPageData'}
													onMouseEnter={this.handleHoverHighSettingPage}
													onMouseLeave={this.handleOutHighSettingPage}
												>
													<div>
															<span className='highSettingPageDataHead'>
																{
																	currentBillStyle + '' === '2' ? '申请单' :
																		currentBillStyle + '' === '3' ? '报销单' :
																			currentBillStyle + '' === '15' ? '还款单' : ''
																}
																相关参数</span>
														<span className='highSettingPageDataHeadIcon'>
																{this.state.isHoverHighSettingPage ? (
																	<span className='billingSettingInfoHeadSpanEdit'
																	      onClick={this.clickEditHighSettingPage}
																	      style={{cursor: 'pointer'}}>
																			<a className="edit-btn" href="javascript:;">编辑</a>
																		</span>
																) : null}
															</span>
													</div>
													<div className='highSettingSponsor' style={{marginBottom: '20px'}}>
														<span className='highSetting-label'>单据编码：</span>

														<span style={{float: 'right'}}>
																{defaultBillingSetting.code}
														</span>
													</div>
													<div className='highSettingSponsor' style={{marginBottom: '20px'}}>
														<span className='highSetting-label'>审批流发起人：</span>
														<span style={{marginLeft: '10px', float: 'right'}}>
																{
																	defaultBillingSetting.approvalDefine === null || defaultBillingSetting.approvalDefine.author === '' ?
																		'单据填写人' :
																		defaultBillingSetting.approvalDefine.author === 'low' ? '最低岗位级别的实际申请人' :
																			defaultBillingSetting.approvalDefine.author === 'top' ? '最高岗位级别的实际申请人' : ''
																}
															</span>
													</div>
													<div className='highSettingSwitch'>
														<ul>
															{currentBillingSettingCode === 'AgendaApplication' || currentBillingSettingCode === 'PublicPaymentApplication' ||
															currentBillingSettingCode === 'Repayment' ? null : (
																<li className='highSettingPageDataLi'>
																	<span className='highSetting-label'>预算占用</span>
																	<span className='checkSwitch'>{defaultBillingSetting.useBudget ? '是' : '否'}</span>
																</li>
															)}
															{currentBillingSettingCode === 'AgendaApplication' || currentBillingSettingCode === 'PublicPaymentApplication' ||
															currentBillingSettingCode === 'Repayment' ||
															currentBillStyle + '' === '3' ? null : (
																<li className='highSettingPageDataLi'>
																	<span className='highSetting-label'>借款金额参与所有冲销</span>
																	<span className='checkSwitch'>{defaultBillingSetting.isreversal ? '是' : '否'}</span>
																</li>
															)}
															{currentBillingSettingCode === 'AgendaApplication' ? null : (
																<li className='highSettingPageDataLi'>
																	<span className='highSetting-label'>自动生成凭证</span>
																	<span
																		className='checkSwitch'>{defaultBillingSetting.autogenvoucher ? '是' : '否'}</span>
																</li>
															)}
															{
																currentBillingSettingCode === 'Repayment' ||
																currentBillStyle + '' === '3' ? null : (
																	<li className='highSettingPageDataLi'>
																		<span className='highSetting-label'>允许删除已审批的单据</span>
																		<span
																			className='checkSwitch'>{defaultBillingSetting.canDeleteAfterApproval ? '是' : '否'}</span>
																	</li>
																)
															}
															{
																currentBillStyle + '' === '3' ? (
																	<li className='highSettingPageDataLi'>
																		<span className='highSetting-label'>是否先申请</span>
																		<span
																			className='checkSwitch'>{defaultBillingSetting.fromApplication ? '是' : '否'}</span>
																	</li>
																) : null
															}
															{
																currentBillStyle + '' === '3' && currentBillingSettingCode !== 'PublicPaymentReport' ? (
																	<li className='highSettingPageDataLi'>
																		<span className='highSetting-label'>允许冲借款金额大于报销金额 </span>
																		<span
																			className='checkSwitch'>{defaultBillingSetting.limitLoanAmount ? '否' : '是'}</span>
																	</li>
																) : null
															}
															{
																currentBillStyle + '' === '3' && currentBillingSettingCode === 'TravelReport' ? (
																	<li className='highSettingPageDataLi'>
																		<span className='highSetting-label'>查看方式： </span>
																		<span
																			className='checkSwitch'>{defaultBillingSetting.displayByExpense ? '按费用明细查看' : '按行程明细查看'}</span>
																	</li>
																) : null
															}
														</ul>
													</div>
												</div>
											)
										}
									</div>
									{
										/* APP端单据列表摘要设置*/
										/*
										 <div>
										 <div className={this.state.isHoverHighSettingPageList || this.state.isEditBillingList ? 'highSettingPageList  highSettingPageDataHover' : 'highSettingPageList'}
										 onMouseEnter={this.handleHoverHighSettingPageList}
										 onMouseLeave={this.handleOutHighSettingPageList}
										 onClick={this.clickHighSettingPageList}
										 >
										 <div className='highSettingPageListHead'>
										 <span className='highSettingPageDataHeadTitle'>
										 APP端
										 {
										 currentBillStyle + '' === '2' ? '申请单' :
										 currentBillStyle + '' === '3' ? '报销单' :
										 currentBillStyle + '' === '15' ? '还款单' : ''
										 }
										 列表摘要显示</span>
										 <span className='highSettingPageDataHeadIcon'>
										 {
										 this.state.isHoverHighSettingPageList && !isEditBillingList ? (
										 <Tooltip placement="top" overlayStyle={{width:76}} title={<span style={{ width: 30 }}>编辑</span>}>
										 <span className='billingSettingInfoHeadSpanEdit'
										 onClick={this.clickEditHighSettingPageList}
										 style={{ cursor: 'pointer' }}>
										 <img src={edit} style={{width:'14px',height:'14px'}}/>
										 </span>
										 </Tooltip>
										 ) : isEditBillingList?(<span className='highSettingPageDataHeadView'
										 style={{fontSize: 12 }}
										 onClick={this.clickSettingListBtn}>完成</span>):null
										 }
										 </span>
										 </div>
										 <div className='highSettingPageListBody fn-clear'>
										 <div className='highSettingPageListBodyLeft'>
										 <span>单据图</span>
										 </div>
										 <div className='highSettingPageListBodyRight'>
										 {
										 digestDesign.length === 0 ? (<div>未设置摘要</div>) : (
										 digestDesign.map((item, i) => {
										 return (
										 <HighSettingCard
										 key={item.id}
										 index={i}
										 id={item.id}
										 item={item}
										 isEditBillingList={isEditBillingList}
										 $$mapState={$$mapState}
										 dispatch={this.props.dispatch}
										 moveCard={this.moveHighSettingCard}
										 />
										 )
										 })
										 )
										 }
										 <span className='require-star rowOne'>*</span>
										 <span className='require-star rowTwo'>*</span>
										 {isEditBillingList?(<span className='hightSettingDrag'>可拖拽调整顺序</span>):null}
										 </div>
										 </div>
										 </div>
										 </div>
										 */
									}
								</div>
							)
							:
							(
								<div>
									{
										currentBillStyle === '3' ? (
											<div className='billSettingInfo' style={{minWidth: 375, width: pageRightWidth * 0.4}}>
												<div>
													{!this.state.isReportBillEdit & !this.state.isChargeStyleEdit ?
														(
															<div
																className={this.state.isMouseEnterInforCard ? 'reportBillInfoWrap billingSettingInfoHover' : 'reportBillInfoWrap'}
																onMouseEnter={this.hoverBillingSettingInfo}
																onMouseLeave={this.outBillingSettingInfo}
																style={{height: (clientHeight - 158)}}
															>
																<div className='billingSettingInfo' style={{
																	marginTop: 0,
																	height: (clientHeight - 140) / 2 - 10,
																	minWidth: 373,
																	width: pageRightWidth * 0.4 - 2
																}}
																>
																	<div className='billingSettingInfoHead'>
																		<span className='billingSettingInfoHeadSpan'
																		      title={defaultBillingSetting.name + '详情'}
																		>	{defaultBillingSetting.name}详情
																	</span>
																		{this.state.isMouseEnterInforCard ?
																			(
																				<span className='billingSettingInfoHeadSpanEdit'
																				      onClick={this.clickEditReportBtn}>
																					<a className="edit-btn" href="javascript:;">编辑</a>
																					</span>
																			) : <span className='billingSettingInfoHeadSpanEdit'></span>
																		}
																	</div>
																	<div className='billingSettingInfoListUlWrap reportBillWrap'
																	     style={{height: (clientHeight - 140) / 2 - 70}}
																	>
																		{
																			billSettingInfor.length === 0 ? (
																				<span className="billingSettingDataNullWrap">
																					<span className='billingSettingDataNull'
																					      onClick={this.clickAddreportbill}
																					>+ 添加报销单显示内容</span></span>
																			) : (
																				<ul className='billingSettingInfoListUl'>
																					{
																						billSettingInfor.map((item, i) => {
																							return !item.isnull ? (
																								<li key={i}>
																										<span className='itemCon'>{item.disp}
																											<span className='itemIsRequired'>*</span>
																										</span>
																								</li>
																							) : <li key={i}><span className='itemCon'>{item.disp}</span></li>
																						})
																					}
																				</ul>
																			)
																		}
																	</div>
																</div>
																<div className="billingSettingInfo" style={{
																	marginTop: 0,
																	height: (clientHeight - 140) / 2 - 10,
																	minWidth: 373,
																	width: pageRightWidth * 0.4 - 2
																}}
																>
																	<div className='billingSettingInfoHead chargeStyleWrapHead'>
																		<span className='billingSettingInfoHeadSpan'>费用类型</span>
																		{this.state.isMouseEnterInforCard ?
																			(
																				<span className='billingSettingInfoHeadSpanEdit'
																				      onClick={this.clickEditChargeStyleBtn}>
																					<a className="edit-btn" href="javascript:;">编辑</a>
																					</span>
																			) : <span className='billingSettingInfoHeadSpanEdit'></span>
																		}
																	</div>
																	<div className='billingSettingInfoListUlWrap chargeStyleWrap'
																	     style={{height: (clientHeight - 140) / 2 - 80}}
																	>
																		{
																			expenseClasses.length === 0 ? (
																				<span className="billingSettingDataNullWrap">
																				<span className='billingSettingDataNull'
																				      onClick={this.clickAddchargeStyle}
																				>+ 添加费用类型</span></span>
																			) : (
																				<ul className='billingSettingInfoListUl'>
																					{
																						expenseClasses.map((item, i) => {
																							return (
																								<li key={i}>{item.name}</li>
																							)
																						})
																					}
																				</ul>
																			)
																		}
																	</div>
																</div>
															</div>
														) :
														this.state.isChargeStyleEdit ? (
															<div className='billingSettingInfo billingSettingInfoHover chargeStyleInfor'
															     style={{height: (clientHeight - 170), minWidth: 375, width: pageRightWidth * 0.4}}
															     onClick={this.handleChargeStyleSlide}>
																<div className='billingSettingInfoHead'>
																	<span className='billingSettingInfoHeadSpan'
																	      title={defaultBillingSetting.name + '单-费用类型'}>
																		{defaultBillingSetting.name}单-费用类型
																</span>
																	<span className='billingSettingInfoHeadSpanEdit'
																	      style={{float: 'right', fontSize: 12}}
																	      onClick={this.clickBackBtn}>完成</span>
																</div>
																<div>
																	<div className='billingSettingInfoEditListUlWrap'
																	     style={{height: (clientHeight - 250)}}
																	>
																		{
																			expenseClasses.length === 0 ? (
																				<span className="billingSettingDataNullWrap">
																				<span className='billingSettingDataNull'
																				      onClick={this.clickAddchargeStyle}
																				>+ 添加费用类型</span></span>
																			) : (
																				<ul className='billingSettingInfoEditListUl'>
																					{
																						expenseClasses.map((item, i) => {
																							return (
																								<ChargeStyleCard
																									key={item.id}
																									index={i}
																									id={item.id}
																									item={item}
																									$$mapState={this.props.$$mapState}
																									dispatch={this.props.dispatch}
																									moveCard={this.chargeStylemoveCard}
																									hoverDargItem={this.hoverDargItem}
																									outDargItem={this.outDargItem}
																								/>
																							)
																						})
																					}
																				</ul>
																			)
																		}
																	</div>
																</div>
																<div className={isHoverDragItem ? 'dragRemark dragRemarkColro' : 'dragRemark'}>
																	拖拽上下调整顺序
																</div>
															</div>
														) :
															this.state.isReportBillEdit ?
																(
																	<div className='billingSettingInfo billingSettingInfoHover chargeStyleInfor'
																	     style={{
																		     height: (clientHeight - 160),
																		     minWidth: 375,
																		     width: pageRightWidth * 0.4
																	     }}
																	     onClick={this.handleSlide}>
																		<div className='billingSettingInfoHead'>
																			<span className='billingSettingInfoHeadSpan'
																			      title={defaultBillingSetting.name + '单-费用类型'}>
																				{defaultBillingSetting.name}详情
																			</span>
																			<span className='billingSettingInfoHeadSpanEdit'
																			      style={{float: 'right', fontSize: 12}}
																			      onClick={this.clickBackBtn}>完成</span>
																		</div>
																		<div className='eidtBillingSettingInfoWrap'>
																			<div className='eidtBillingSettingInfo'
																			     style={{paddingRight: 28 + EditCardscrollbarWidth}}>
																				<div className='eidtBillingSettingInfoIn'>
																					<span style={{minWidth: 110, width: '35%', paddingLeft: 8}}>单据内容</span>
																					<span style={{minWidth: 137, width: '45%'}}>显示单据内容</span>
																					<span style={{minWidth: 70, width: '25%'}}>必填项</span>
																				</div>
																			</div>
																			<div className='billingSettingInfoEditListUlWrap'
																			     style={{height: (clientHeight - 290)}}
																			>
																				{
																					billSettingInfor.length === 0 ? (
																						<span className="billingSettingDataNullWrap">
																							<span className='billingSettingDataNull'
																							      onClick={this.clickAddreportbill}
																							>+ 添加报销单显示内容</span></span>
																					) : (
																						<ul className='billingSettingInfoEditListUl'>
																							{
																								billSettingInfor.map((item, i) => {
																									return (
																										<Card
																											key={item.id}
																											index={i}
																											id={item.id}
																											item={item}
																											$$mapState={this.props.$$mapState}
																											dispatch={this.props.dispatch}
																											moveCard={this.applicationmoveCard}
																											handleChangeCheckbox={this.changeChecked}
																											deletSettingItem={this.handleDeleteSettingItem}
																											hoverDargItem={this.hoverDargItem}
																											outDargItem={this.outDargItem}
																										/>
																									)
																								})
																							}
																						</ul>
																					)
																				}
																			</div>
																		</div>
																		<div className={isHoverDragItem ? 'dragRemark dragRemarkColro' : 'dragRemark'}>
																			拖拽上下调整顺序
																		</div>
																	</div>
																) : null
													}
												</div>
											</div>
										) : (
											<div className='billSettingInfo' style={{minWidth: 375, width: pageRightWidth * 0.4}}>
												{
													currentBillStyle === '2' && currentBillingSettingCode !== 'AgendaApplication' ? (
														<div
															className={this.state.isMouseClickReportType ? 'billingStyleHead billingSettingInfoHover' : 'billingStyleHead'}
															onMouseEnter={this.hoverBillingStyleHead}
															onMouseLeave={this.outBillingStyleHead}
														>
																<span className='billingStyleHeadLeft'>对应的费用报销单：
																		<DropdownList {...DropdownListData} clickAddItem={(key) => {
																			this.clickAddBaoxiaoItem(key)
																		}}>
																		<span onClick={this.clickReportType}>
																			{
																				defaultBillingSetting.defaultReportType ?
																					(<span><span className='defaultReportType'
																					             title={defaultBillingSetting.defaultReportType.name}
																					>{defaultBillingSetting.defaultReportType.name}</span>
																				<span className="anticon anticon-cross"
																				      onClick={this.clickDeleteDefaultReportType}></span>
																				</span>) :
																					<span className='defaultReportType'
																					      title='默认报销类型'>默认报销类型</span>
																			}
																			{
																				this.state.isMouseEnterHeadCard || this.state.isMouseClickReportType ? (
																					<Icon type="caret-down" style={{marginLeft: 5, color: '#999'}}/>) : null
																			}
																		</span>
																	</DropdownList>
																</span>
															<span className='billingStyleHeadSwitch'>自动生成
																<Switch
																	checked={defaultBillingSetting.autoTrans}
																	onChange={this.changeAutoTrans}
																/>
																</span>
														</div>
													) : null
												}
												<div>
													{
														!isEdit ?
															(
																<div
																	className={this.state.isMouseEnterInforCard && currentBillStyle + '' === '15' ? 'billingSettingInfo billingSettingInfoHover repaymentInfor' : this.state.isMouseEnterInforCard && currentBillStyle + '' !== '15' ? 'billingSettingInfo billingSettingInfoHover' : !this.state.isMouseEnterInforCard && currentBillStyle + '' !== '15' ? 'billingSettingInfo' : 'billingSettingInfo repaymentInfor'}
																	onMouseEnter={this.hoverBillingSettingInfo}
																	onMouseLeave={this.outBillingSettingInfo}
																	style={{
																		height: currentBillStyle + '' === '2' && currentBillingSettingCode !== 'AgendaApplication' ? (clientHeight - 220) : (clientHeight - 160),
																		minWidth: 375,
																		width: pageRightWidth * 0.4
																	}}
																>
																	<div className='billingSettingInfoHead'>
																			<span className='billingSettingInfoHeadSpan'
																			      title={defaultBillingSetting.name + '单详情'}
																			>	{defaultBillingSetting.name}详情
																			</span>
																		{this.state.isMouseEnterInforCard ?
																			(
																				<span className='billingSettingInfoHeadSpanEdit'
																				      onClick={this.clickEditBtn}>
																						<a className="edit-btn" href="javascript:;">编辑</a>
																					</span>
																			) : <span className='billingSettingInfoHeadSpanEdit'></span>
																		}
																	</div>
																	<div className='billingSettingInfoListUlWrap'
																	     style={{height: currentBillStyle + '' === '2' && currentBillingSettingCode !== 'AgendaApplication' ? (clientHeight - 300) : (clientHeight - 250)}}
																	>
																		{
																			billSettingInfor.length === 0 ? (
																				<span className="billingSettingDataNullWrap">
																						<span className='billingSettingDataNull'
																						      onClick={this.clickAddBill}
																						>+ 添加{
																							currentBillStyle + '' === '2' ? '申请单' :
																								currentBillStyle + '' === '3' ? '报销单' :
																									currentBillStyle + '' === '15' ? '还款单' : ''
																						}显示内容</span>
																					</span>
																			) : (
																				<ul className='billingSettingInfoListUl'>
																					{
																						billSettingInfor.map((item, i) => {
																							return !item.isnull ? (
																								<li key={i}>
																											<span className='itemCon'>{item.disp}
																												<span className='itemIsRequired'>*</span>
																										</span>
																								</li>
																							) : <li key={i}>{item.disp}</li>
																						})
																					}
																				</ul>
																			)
																		}
																	</div>
																</div>
															) :
															(
																<div
																	className={this.state.isMouseEnterInforCard && currentBillStyle + '' === '15' ? 'billingSettingInfo billingSettingInfoHover repaymentInfor' : this.state.isMouseEnterInforCard && currentBillStyle + '' !== '15' ? 'billingSettingInfo billingSettingInfoHover' : !this.state.isMouseEnterInforCard && currentBillStyle + '' !== '15' ? 'billingSettingInfo' : 'billingSettingInfo repaymentInfor'}
																	style={{
																		height: currentBillStyle + '' === '2' && currentBillingSettingCode !== 'AgendaApplication' ? (clientHeight - 220) : (clientHeight - 160),
																		minWidth: 375,
																		width: pageRightWidth * 0.4
																	}}
																	onClick={this.handleSlide}>
																	<div className='billingSettingInfoHead'>
																			<span className='billingSettingInfoHeadSpan'
																			      title={defaultBillingSetting.name + '详情'}>
																				{defaultBillingSetting.name}详情
																			</span>
																		<span className='billingSettingInfoHeadSpanEdit'
																		      style={{float: 'right', fontSize: 12, marginRight: 7}}
																		      onClick={this.clickGoBackBtn}>完成</span>
																	</div>
																	<div className='eidtBillingSettingInfoWrap'>
																		<div className='eidtBillingSettingInfo'
																		     style={{paddingRight: 28 + EditCardscrollbarWidth}}>
																			<div className='eidtBillingSettingInfoIn'>
																				<span style={{minWidth: 110, width: '35%', paddingLeft: 8}}>单据内容</span>
																				<span style={{minWidth: 137, width: '45%'}}>显示单据内容</span>
																				<span style={{minWidth: 70, width: '25%'}}>必填项</span>
																			</div>
																		</div>
																		<div
																			className={currentBillStyle + '' === '2' ? 'billingSettingInfoEditListUlWrap applicationBillWrap' : 'billingSettingInfoEditListUlWrap'}
																			style={{height: currentBillStyle + '' === '2' && currentBillingSettingCode !== 'AgendaApplication' ? (clientHeight - 350) : (clientHeight - 270)}}
																		>
																			{
																				billSettingInfor.length === 0 ? (
																					<span className="billingSettingDataNullWrap">
																						<span className='billingSettingDataNull'
																						      onClick={this.clickAddBill}
																						>+ 添加{
																							currentBillStyle + '' === '2' ? '申请单' :
																								currentBillStyle + '' === '3' ? '报销单' :
																									currentBillStyle + '' === '15' ? '还款单' : ''
																						}显示内容</span>
																					</span>
																				) : (
																					<ul className='billingSettingInfoEditListUl'>
																						{
																							billSettingInfor.map((item, i) => {
																								return (
																									<Card
																										key={item.id}
																										index={i}
																										id={item.id}
																										item={item}
																										$$mapState={this.props.$$mapState}
																										dispatch={this.props.dispatch}
																										moveCard={this.applicationmoveCard}
																										handleChangeCheckbox={this.changeChecked}
																										deletSettingItem={this.handleDeleteSettingItem}
																										hoverDargItem={this.hoverDargItem}
																										outDargItem={this.outDargItem}
																									/>
																								)
																							})
																						}
																					</ul>
																				)
																			}
																		</div>
																	</div>
																	<div className={isHoverDragItem ? 'dragRemark dragRemarkColro' : 'dragRemark'}>
																		拖拽上下调整顺序
																	</div>
																</div>
															)
													}
												</div>
											</div>
										)
									}
								</div>
							)
					}
					{
						isFromHomepage ? (
							<div className='backToHomepage' onClick={this.goBackHomepage}>返回新手引导</div>
						) : null
					}
				</div>
				<BillingSlide
					ref='billingSlide'
					billingStyleData={billingStyleData}
					highSettingEnums={highSettingEnums}
					basicSettingData={nowbasicSettingData}
					hightBillSettingData={nowhighSettingData}
					selectBasicAll={checkBasicAll}
					selectHighAll={checkHighAll}
					billSettingInfor={billSettingInfor}
					clientHeight={clientHeight}
					clientWidth={clientWidth}
					currentBillStyle={currentBillStyle}
					hanldeChangebasicCheck={this.hanldeChangebasicCheck}
					hanldeChangebasicCheckAll={this.hanldeChangebasicCheckAll}
					hanldeChangehighCheck={this.hanldeChangehighCheck}
					hanldeChangehighCheckAll={this.hanldeChangehighCheckAll}
					changeRelateFile={this.changeRelateFile}
					getCustomBaseDefine={this.getCustomBaseDefine}
					getBaseFileRelate={this.getBaseFileRelate}
					changeSelfDefinedNUMFirst={this.changeSelfDefinedNUMFirst}
					changeSelfDefinedNUMSecond={this.changeSelfDefinedNUMSecond}
					changeFirstSelect={this.changeFirstSelect}
					changeSecondSelect={this.changeSecondSelect}
					changeRelationsSelectThird={this.changeRelationsSelectThird}
					changeSelfDefinedFIle={this.changeSelfDefinedFIle}
				/>
				{
					/*APP端单据列表摘要设置 */
					/*
					 <HighBillSettingBtnSlid
					 ref='HighBillSettingBtnSlid'
					 {...highBillSettingBtnData}
					 dispatch={this.props.dispatch}
					 />
					 */
				}
				<ChargeBillSettingSlid
					ref='ChargeBillSettingSlid'
					{...chargeListData}
					changeChargeBillSlidSelectAll={this.changeChargeBillSlidSelectAll}
					dispatch={this.props.dispatch}
					$$mapState={this.props.$$mapState}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		$$mapState: state.get('billSettingState'),
		clientHeight: state.get('baseState').toJS().clientHeight,
		clientWidth: state.get('baseState').toJS().clientWidth,
	}
}

export default connect(mapStateToProps)(billingSetting);
