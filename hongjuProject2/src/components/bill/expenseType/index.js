/**
 * Created by fuwenfang on 3/16/17.
 * 费用类型
 */

import React, { Component } from 'react';
import { Button, Switch, Icon, Tooltip, Input, Select } from 'antd';
import { connect } from 'react-redux';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DropdownList, Toast, Confirm } from '../../common'
import uuid from 'uuid';

import * as actions from '../../../actions';
import ExpenseLeftMenu from './expenseLeftMenu'
import ExpenseTypeSlide from './expenseTypeSlide'
import Card from './expenseTypeDragItem'
import edit from '../../../images/billSetting/edit.png';
@DragDropContext(HTML5Backend)

class ExpenseType extends Component {
  constructor() {
    super();
    this.state = {
      isHoverBillingName: true,
      isClickEditBillingName: false,
      isBillNameFocus: false,
      isEdit: false,
      isMouseEnterInforCard: true,
      isHighDataEdit: false,
      isClickHighBillBtn: false,
      isHoverHighSettingPage: false,
      EditCardscrollbarWidth:0,
      isHoverDragItem:false
    }
  }
  recover = () => {
    this.setState({
      isHoverBillingName: true,
      isClickEditBillingName: false,
      isBillNameFocus: false,
      isEdit: false,
      isMouseEnterInforCard: true,
      isHighDataEdit: false,
      isClickHighBillBtn: false,
      isHoverHighSettingPage: false,
      EditCardscrollbarWidth:0,
      isHoverDragItem:false
    })
    this.refs.expenseTypeSlide.closeSlip()
  }
  funcCompare(arry1, arry2) {
    if (arry1 === undefined) {
      return arry2
    }
    const arry1ID = arry1.map(p => p.id * 1)
    const arry2ID = arry2.map(p => p.id * 1)
    let arry3 = []
    for (var i = 0; i < arry2.length; i++) {
      if (arry1ID.indexOf(arry2[i].id * 1) > -1) {
        arry3.push(true)
      } else {
        arry3.push(false)
      }
    }
    for (var i = 0; i < arry2.length; i++) {
      arry2[i].isChecked = arry3[i]
    }

    return arry2
  }
  componentDidMount() {
    //TODO 获取左侧列表
    const { dispatch } = this.props
    dispatch(actions.getLeftExpenseList())
    //页面加载时判断鼠标是否在详情卡片内部 
    const card = document.getElementsByClassName('billingSettingInfo')[0] 
    const cardX = card.getBoundingClientRect().left
    const cardY = card.getBoundingClientRect().top
    const that = this
    card.onmousemove  = function(e){
        let isInCard = false
        e = e || window.event;
        if(e.clientX > cardX && e.clientX < (cardX+375) && e.clientY>cardY){
          isInCard = true
        }
        //判断鼠标是否在所属范围内
        if(isInCard){
          that.setState({
            isMouseEnterInforCard:true
          })
        }
    }
  }
  //改变费用类型名称
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
    const { value } = e.target;
    const { dispatch, $$expenseTypeState } = this.props
    dispatch(actions.changeBillingNameInput_expenseType(value))
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
    const { dispatch, $$expenseTypeState } = this.props
    const billId = $$expenseTypeState.toJS().defaultBillingSetting.id
    let expenseList = $$expenseTypeState.toJS().expenseList
    let newexpenseList = expenseList.concat()
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    let expenseName = $$expenseTypeState.toJS().expenseName
      //改变左侧菜单名  改变右侧显示名
      newexpenseList.map((item, i) => {
        if (item.id === billId) {
          item.name = expenseName
        }
        return item
      })
      dispatch(actions.changeBillingNameBlur_expenseType(newexpenseList))
      dispatch(actions.changeBillingNameBlurDone_expenseType(expenseName))
  }
  //获取交易订单费用类型
  getTicketExpenseList = () => {
    const { dispatch } = this.props
    dispatch(actions.getTicketExpenseList())
  }
  //获取模板预制详情信息
  getDefaultTemplateViewdifine = (key) => {
    const { dispatch } = this.props
    dispatch(actions.getDefaultTemplateViewdifine(key))
  }
  //改变对应的费用类型下拉框
  choseChargeStyleSelect = (key, i) => {
    const { dispatch, $$expenseTypeState } = this.props
    const expenseChargeModalList = $$expenseTypeState.toJS().expenseChargeModalList
    let currentItem_expenstList = expenseChargeModalList[i].expense_class_list
    let currentItem = {}
    currentItem_expenstList.map((item, i) => {
      if (item.id * 1 === key * 1) {
        currentItem = item
      }
    })
    let choseItem = {}
    choseItem.id = key * 1
    choseItem.code = currentItem.code
    choseItem.name = currentItem.name
    dispatch(actions.choseChargeStyleSelect(choseItem, i))
  }
  //保存更改的交易类型
  saveTicketExpenseList = () => {
    const { dispatch, $$expenseTypeState } = this.props
    const expenseChargeModalList = $$expenseTypeState.toJS().expenseChargeModalList
    dispatch(actions.saveTicketExpenseList(expenseChargeModalList))
  }
  //点击+号
  addChargestyleList = () => {
    const { dispatch } = this.props
    dispatch(actions.addChargestyleList())
  }
  //更新左侧菜单
  changeLeftExpenseListData = (data) => {
    const { dispatch } = this.props
    dispatch(actions.changeLeftExpenseListData(data))
  }
  //获取已经定义的费用详情
  getexpenseviewdefine = (id) => {
    const { dispatch } = this.props
    dispatch(actions.getexpenseviewdefine(id))
  }
  //改变是否启用
  changeIsused = (checked) => {
    const { dispatch, $$expenseTypeState } = this.props
    const name = $$expenseTypeState.toJS().defaultBillingSetting.name
    let message = ''
    if (checked) {
      message = '使用' + name + '成功！'
    } else {
      message = '不使用' + name + '啦！'
    }
    //Toast.success(message)
    dispatch(actions.changeExpenseTypeIsUsed(checked))
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
  //点击编辑
  clickEditBtn = (e) => {
    e.stopPropagation()
    this.setState({
      isEdit: true
    },()=>{
      //滚动条宽度
			const oP = document.getElementsByClassName('billingSettingInfoEditListUlWrap')[0]
			const scrollbarWidth = oP.offsetWidth - oP.clientWidth;
			this.setState({
				EditCardscrollbarWidth:scrollbarWidth
			})
    })
    this.handleHighDataslip()
  }
  //点击添加费用类型按钮
  clickAddChargeStyleCon = (e)=>{
    this.clickEditBtn(e)
  }
  //编辑状态下点击卡片
  handleSlide = (e) => {
    if (e.target.className === 'ant-checkbox-input') {
      return
    }
    this.handleHighDataslip()
  }
  handleHighDataslip = () => {
    const { $$expenseTypeState } = this.props
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    let billSettingInfor = defaultBillingSetting.billSettingInfor
    let billingStyleData = defaultBillingSetting.viewdefines[0].templatedefine.fields_template
    let basicSettingData = [], hightBillSettingData = []

    billingStyleData.map((item, i) => {
      item.issys ? basicSettingData.push(item) : hightBillSettingData.push(item)
      return item
    })
    //取两个数组中相同的元素 并且打上标签
    //const nowbasicSettingData = this.func(billingStyleDataShow, basicSettingData)
    const nowhighSettingData = this.funcCompare(billSettingInfor, hightBillSettingData)
    let isSettedHighSetting = nowhighSettingData.some((item) => {
      return item.isChecked === true
    })
    this.refs.expenseTypeSlide.show(isSettedHighSetting)
  }
  //拖拽上下调整顺序
  applicationmoveCard = (dragIndex, hoverIndex) => {
    const { $$expenseTypeState, dispatch } = this.props
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    let cards = defaultBillingSetting.billSettingInfor.concat()
    const dragCard = cards[dragIndex];
    let sortedBillingStyleData = update({ data: cards }, {
      data: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      },
    })
    //按index排序
    sortedBillingStyleData.data.map((item, i) => {
      item.order = i + 1
      return item
    })
    //newdefaultBillingSetting.billSettingInfor = sortedBillingStyleData.data.concat()
    dispatch(actions.drageExpenseStyleInforData(sortedBillingStyleData))
  }
  //勾选必填复选框
  changeChecked = (e, i) => {
    e.stopPropagation()
    const { $$expenseTypeState, dispatch } = this.props
    let billSettingInfor = $$expenseTypeState.toJS().defaultBillingSetting.billSettingInfor
    let newbillSettingInfor = billSettingInfor.concat()
    newbillSettingInfor[i].isnull = !e.target.checked
    dispatch(actions.changeCheckedSettingItem_expenseType(newbillSettingInfor))
  }
  //删除设置项
  handleDeleteSettingItem = (e, index) => {
    e.stopPropagation()
    const { $$expenseTypeState, dispatch } = this.props
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    let newbillingStyleData = defaultBillingSetting.viewdefines[0].templatedefine.fields_template
    let billSettingInfor = defaultBillingSetting.billSettingInfor
    const currentID = billSettingInfor[index].id
    let newbillSettingInfor = billSettingInfor.filter((item, i) => {
      return item.id * 1 !== currentID * 1
    })
    //把defaultBillingSetting中相应的数据项的visible置为false
    newbillingStyleData.map((item)=>{
      if(item.id*1 === currentID*1){
        item.visible = false
      }
      return item
    })
    defaultBillingSetting.viewdefines[0].templatedefine.fields_template = newbillingStyleData
    defaultBillingSetting.billSettingInfor = newbillSettingInfor
    dispatch(actions.deleteSettingItem_expenseType(defaultBillingSetting))
  }
  //修改设置项的内容
  changeCheckedSettingItem = (data) => {
    const { dispatch } = this.props
    dispatch(actions.changeExpenseCheckedSettingItem(data))
  }
  hoverDargItem  = ()=>{
    this.setState({
			isHoverDragItem:true
		})
  }
  outDargItem  = ()=>{
    this.setState({
			isHoverDragItem:false
		})
  }
  //删除当前费用类型
  deleteExpenseType = () => {
    const { dispatch, $$expenseTypeState } = this.props
    const currentId = $$expenseTypeState.toJS().defaultBillingSetting.id
    const currentName = $$expenseTypeState.toJS().defaultBillingSetting.name
    const currentModel = $$expenseTypeState.toJS().currentModel
    Confirm({
      title: '删除单据',
      content: {
        message: '确定要删除 ' + currentName + ' 吗？',
        explain: '',
        highLightText: currentName,
      },
      onOk: () => {
        dispatch(actions.delete_expenseType(currentId,currentModel))
      },
      onCancel: () => {
      }
    });
  }
  //点击头部高级按钮
  handleHigherExpenseType = () => {
    this.setState({
      isClickHighBillBtn: true
    },()=>{
        this.refs.expenseTypeSlide.closeSlip()
    })
  }
  //关闭头部高级按钮
  clickCloseHighSetting = () => {
    this.setState({
      isClickHighBillBtn: false
    })

  }
  //点击高级按钮界面设置参数的编辑按钮
  clickEditHighSettingPage = () => {
    this.setState({
      isHighDataEdit: true
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
  //基础设置单选
  handleBacisCheck = (status, id) => {
    const { $$expenseTypeState, dispatch } = this.props
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    let billSettingInfor = defaultBillingSetting.billSettingInfor
    let newbillSettingInfor = billSettingInfor.concat(), currentbiiSettingInofor = []
    let billingStyleData = defaultBillingSetting.viewdefines[0].templatedefine.fields_template
    if (status) {
      let checkedItem
      billingStyleData.map((item, i) => {
        if (item.id === id) {
          item.visible = true
          checkedItem = item
        }
        return item
      })
      currentbiiSettingInofor = newbillSettingInfor.concat([checkedItem])
    } else {
      currentbiiSettingInofor = newbillSettingInfor.filter((item) => {
        return item.id * 1 !== id * 1
      })
    }

    dispatch(actions.changebasichighCheck(currentbiiSettingInofor))
  }
  //基础设置全选
  hanldeChangebasicCheckAll = (data) => {
    const { dispatch } = this.props
    dispatch(actions.changebasichighCheck(data))
  }
  //高级设置单选
  hanldeChangehighCheck = (status, id) => {
    const { $$expenseTypeState, dispatch } = this.props
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    let billSettingInfor = defaultBillingSetting.billSettingInfor
    let newbillSettingInfor = billSettingInfor.concat(), currentbiiSettingInofor = []
    let billingStyleData = defaultBillingSetting.viewdefines[0].templatedefine.fields_template
    if (status) {
      let checkedItem
      billingStyleData.map((item, i) => {
        if (item.id === id) {
          item.visible = true
          checkedItem = item
        }
        return item
      })
      currentbiiSettingInofor = newbillSettingInfor.concat([checkedItem])
    } else {
      currentbiiSettingInofor = newbillSettingInfor.filter((item) => {
        return item.id * 1 !== id * 1
      })
    }

    dispatch(actions.changebasichighCheck(currentbiiSettingInofor))
  }
  //高级设置全选
  hanldeChangehighCheckAll = (data) => {
    const { dispatch } = this.props
    dispatch(actions.changebasichighCheck(data))
  }
  //改变档案关联
  changeRelateFile = (value) => {
    const { dispatch } = this.props
    dispatch(actions.changeRelateFile(value))
  }
  //改变高级设置数据类型第一个下拉
  changeFirstSelect = (highSettingDataId, typeid) => {

    const { $$expenseTypeState, dispatch } = this.props
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting

    const fields_template_StaffItem = $$expenseTypeState.toJS().highSettingEnums.fields_template_StaffItem
    const fakeSelfDefineData = $$expenseTypeState.toJS().highSettingEnums.fakeSelfDefineData
    let billingStyleData = defaultBillingSetting.viewdefines[0].templatedefine.fields_template
    let attrs

    switch (typeid) {
      case 1:
        attrs = { "char_length": 64, "char_wrap": false }
        break;
      case 2:
        attrs = { "datetime_format": 3 }
        break;
      case 3:
        attrs = { "decimal_digits": 2, "decimal_format": 7 };
        break;
      case 7:
        let relation_col
        fields_template_StaffItem.map((item, i) => {
          if (item.code === 'name') {
            relation_col = item.defid
          }
          return item
        })
        attrs = { "relation_type": 1, "relation_col": relation_col };
        break;
      case 11:
        attrs = fakeSelfDefineData.length === 0?{}:{ "custom_objectid": fakeSelfDefineData[0].id, "relation_type": 9, "relation_col": fakeSelfDefineData[0].field_data.defid }
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

    defaultBillingSetting.viewdefines[0].templatedefine.fields_template = billingStyleData
    dispatch(actions.changeExpenseBySelelct(defaultBillingSetting))
  }
  //高级设置数值金额下拉
  changeSelfDefinedNUMFirst = (highSettingDataId, decimal_format, decimal_digits) => {
    const { $$expenseTypeState, dispatch } = this.props
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    let billingStyleData = defaultBillingSetting.viewdefines[0].templatedefine.fields_template

    billingStyleData.map((item, i) => {
      if (item.id === highSettingDataId) {
        item.attrs = {}
        item.attrs.decimal_format = decimal_format
        item.attrs.decimal_digits = decimal_digits
      }
      return item
    })

    defaultBillingSetting.viewdefines[0].templatedefine.fields_template = billingStyleData
    dispatch(actions.changeExpenseBySelelct(defaultBillingSetting))
  }

  //修改小数点
  changeSelfDefinedNUMSecond = (highSettingDataId, decimal_digits) => {
    const { $$expenseTypeState, dispatch } = this.props
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    let billingStyleData = defaultBillingSetting.viewdefines[0].templatedefine.fields_template

    billingStyleData.map((item, i) => {
      if (item.id === highSettingDataId) {
        item.attrs.decimal_digits = decimal_digits
      }
      return item
    })

    defaultBillingSetting.viewdefines[0].templatedefine.fields_template = billingStyleData
    dispatch(actions.changeExpenseBySelelct(defaultBillingSetting))
  }
  //高级设置关联档案的第二个下拉
  changeSecondSelect = (highSettingDataId, relation_type, relation_col) => {
    const { $$expenseTypeState, dispatch } = this.props
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    let billingStyleData = defaultBillingSetting.viewdefines[0].templatedefine.fields_template

    billingStyleData.map((item, i) => {
      if (item.id === highSettingDataId) {
        item.attrs = {}
        item.attrs.relation_type = relation_type
        item.attrs.relation_col = relation_col
      }
      return item
    })

    defaultBillingSetting.viewdefines[0].templatedefine.fields_template = billingStyleData
    dispatch(actions.changeExpenseBySelelct(defaultBillingSetting))
  }
  //高级设置管理档案第三个下拉框
  changeRelationsSelectThird = (highSettingDataId, relation_col) => {
    const { $$expenseTypeState, dispatch } = this.props
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    let billingStyleData = defaultBillingSetting.viewdefines[0].templatedefine.fields_template

    billingStyleData.map((item, i) => {
      if (item.id === highSettingDataId) {
        item.attrs.relation_col = relation_col
      }
      return item
    })

    defaultBillingSetting.viewdefines[0].templatedefine.fields_template = billingStyleData
    dispatch(actions.changeExpenseBySelelct(defaultBillingSetting))

  }
  //改变自定义档案的下拉
  changeSelfDefinedFIle = (highSettingDataId, custom_objectid, relation_col) => {
    const { $$expenseTypeState, dispatch } = this.props
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    let billingStyleData = defaultBillingSetting.viewdefines[0].templatedefine.fields_template

    billingStyleData.map((item, i) => {
      if (item.id === highSettingDataId) {
        item.attrs.relation_col = relation_col
        item.attrs.custom_objectid = custom_objectid
        item.attrs.relation_type = 9
      }
      return item
    })

    defaultBillingSetting.viewdefines[0].templatedefine.fields_template = billingStyleData
    dispatch(actions.changeExpenseBySelelct(defaultBillingSetting))
  }
  //高级按钮改变进项税允许抵扣
  changeCanVatDeduct = (checked) => {
    const { dispatch } = this.props
    dispatch(actions.changeCanVatDeduct(checked))
  }
  //高级按钮改变员工常用
  changeIsPopular = (checked) => {
    const { dispatch } = this.props
    dispatch(actions.changeIsPopular(checked))
  }
  //点击返回按钮
	clickGoBackBtn = (e)=>{
		e.stopPropagation()
		this.setState({
			isEdit: false,
		})
		//点击返回 收起侧滑
		this.refs.expenseTypeSlide.closeSlip()
	}
  //取消设置
  clikCancleExpense = ()=>{
    const { dispatch, $$expenseTypeState } = this.props
		const recoverSetting = $$expenseTypeState.toJS().recoverSetting
		const localexpenseList = $$expenseTypeState.toJS().localexpenseList
    Confirm({
			title: '提示',
			content: {
				message: '当前数据将全部丢失，确认？',
				explain: '',
				highLightText: '',
			},
			onOk: () => {
		    dispatch(actions.cancleExpenseSettingData(recoverSetting,localexpenseList))
			},
			onCancel: () => {
			}
		});
  }
  //保存费用类型
  clikcSaveExpense = () => {
    const { dispatch, $$expenseTypeState } = this.props
    let defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    let currentModel = $$expenseTypeState.toJS().currentModel
    let expenseList = $$expenseTypeState.toJS().expenseList
    let expenseName = $$expenseTypeState.toJS().expenseName
    let dbName = $$expenseTypeState.toJS().dbName
    let url = $$expenseTypeState.toJS().url
    let expenseClassCode = $$expenseTypeState.toJS().expenseClassCode
    let billSettingInfor = defaultBillingSetting.billSettingInfor
    let billSettingInforID = billSettingInfor.map(p => p.id * 1)
    let num = 0
		for(let i = 0;i<expenseList.length;i++){
			if(expenseList[i].name===expenseName){
				num++
			}
		}
		//console.log(num-1)
		//保存的时候判断当前单据名称不能重名(与leftMenuData对比 除去自身之外没有一样的 才是不重名)
		
		if (num>=2) {
				Toast.error(`${expenseName}已经存在，费用名称不可重名！`)
				return 
		}

    if (currentModel === 'add') {
      defaultBillingSetting.code = defaultBillingSetting.code + '_' + `${uuid.v4()}`
      defaultBillingSetting.expenseClassCode = expenseClassCode
      delete defaultBillingSetting.viewdefines[0].templatedefine.id
    }
    //过滤数据
    let filterData, newfields_template
    let fields_template = defaultBillingSetting.viewdefines[0].templatedefine.fields_template
    let fields_templateID = fields_template.map(p => p.id * 1)

    filterData = fields_template.filter((item) => {
      return billSettingInforID.indexOf(item.id * 1) < 0
    })
      //基础设置项不修改enable   自定义项 选上visible全为true enable也全为true
			billSettingInfor.map((item,i)=>{
        if(item.issys){
          item.visible = true
        }else{
          item.visible = true
          item.enable = true
        }
			})
			//未选上的visible全为false enable也全为false
			filterData.map((item,i)=>{
        if(item.issys){
          item.visible = false
        }else{
          item.visible = false
          item.enable = false
        }
			})

    billSettingInfor.map((item, i) => {
      if (fields_templateID.indexOf(item.id * 1) > -1) {
        //高级设置复制给billSettingInfor
        item.attrs = fields_template[fields_templateID.indexOf(item.id * 1)].attrs
        item.typeid = fields_template[fields_templateID.indexOf(item.id * 1)].typeid
      }
      item.order = i + 1
      return item
    })
    newfields_template = filterData.concat(billSettingInfor)
    defaultBillingSetting.viewdefines[0].templatedefine.fields_template = newfields_template
    defaultBillingSetting.dbName = dbName
    defaultBillingSetting.url = url
    delete defaultBillingSetting.billSettingInfor
    dispatch(actions.saveExpenseSettingData(defaultBillingSetting))
    this.recover()
  }
  clickBackToBasicView = (e)=>{
		e.stopPropagation()
		this.setState({
			isClickHighBillBtn:false
		})
    if(this.state.isEdit){
      this.handleHighDataslip()
    }
	}
  clickHighDataGoBackBtn = (e)=>{
    e.stopPropagation()
		this.setState({
			isHighDataEdit:false
		})
  } 
  getexpensetemplate = (key)=>{
    const {dispatch} = this.props
    dispatch(actions.getexpensetemplate(key))
  }
  render() {
    const { $$expenseTypeState, clientHeight,clientWidth } = this.props
    const expenseChargeModalList = $$expenseTypeState.toJS().expenseChargeModalList
    const ticketListLoading = $$expenseTypeState.toJS().ticketListLoading
    const defaultBillingSetting = $$expenseTypeState.toJS().defaultBillingSetting
    const billSettingInfor = defaultBillingSetting.billSettingInfor
    const charstyleList = $$expenseTypeState.toJS().charstyleList
    const expenseList = $$expenseTypeState.toJS().expenseList
    const localexpenseList = $$expenseTypeState.toJS().localexpenseList
    const currentId = $$expenseTypeState.toJS().defaultBillingSetting.id
    const currentName = $$expenseTypeState.toJS().defaultBillingSetting.name
    const highSettingEnums = $$expenseTypeState.toJS().highSettingEnums
    const currentModel = $$expenseTypeState.toJS().currentModel
    const saveId = $$expenseTypeState.toJS().saveId
    const expenseName = $$expenseTypeState.toJS().expenseName
    const isEdit = this.state.isEdit
    let expenseChargeModalData = {}
    expenseChargeModalData.expenseChargeModalList = expenseChargeModalList
    expenseChargeModalData.charstyleList = charstyleList
    expenseChargeModalData.expenseList = expenseList
    expenseChargeModalData.localexpenseList = localexpenseList
    expenseChargeModalData.clientHeight = clientHeight
    expenseChargeModalData.currentId = currentId
    expenseChargeModalData.currentName = currentName
    expenseChargeModalData.saveId = saveId
    expenseChargeModalData.currentModel = currentModel
    expenseChargeModalData.ticketListLoading = ticketListLoading
    let basicData = [], highData = []
    defaultBillingSetting.viewdefines[0].templatedefine.fields_template.map((item) => {
      if (item.issys) {
        basicData.push(item)
      } else {
        highData.push(item)
      }
    })
    //取两个数组中相同的元素 并且打上标签
    const nowbasicData = this.funcCompare(billSettingInfor, basicData)
    let nowhighData = this.funcCompare(billSettingInfor, highData)
    //是否全选判断
    let isBasicCheckAll = nowbasicData.every((p, i) => {
      return p.isChecked === true
    })
    let isHighCheckAll = nowhighData.every((p, i) => {
      return p.isChecked === true
    })
    nowhighData.sort(function (b, a) {
        return b.name.substr(4) - a.name.substr(4);
    });
    let expenseTypeSlid = {}
    expenseTypeSlid.clientHeight = clientHeight
    expenseTypeSlid.clientWidth = clientWidth
    expenseTypeSlid.basicData = nowbasicData
    expenseTypeSlid.highData = nowhighData
    expenseTypeSlid.isBasicCheckAll = isBasicCheckAll
    expenseTypeSlid.isHighCheckAll = isHighCheckAll
    expenseTypeSlid.billSettingInfor = billSettingInfor
    expenseTypeSlid.highSettingEnums = highSettingEnums
    //const clientWidth = document.body.clientWidth
		const pageRightWidth = clientWidth -270-194-30
		const EditCardscrollbarWidth = this.state.EditCardscrollbarWidth
    const isHoverDragItem = this.state.isHoverDragItem
    return (
      <div className="expenseType-page page">
        <div className='content-left'>
          <ExpenseLeftMenu
            getTicketExpenseList={this.getTicketExpenseList}
            getDefaultTemplateViewdifine={this.getDefaultTemplateViewdifine}
            choseChargeStyleSelect={this.choseChargeStyleSelect}
            saveTicketExpenseList={this.saveTicketExpenseList}
            changeLeftExpenseListData={this.changeLeftExpenseListData}
            getexpenseviewdefine={this.getexpenseviewdefine}
            addChargestyleList={this.addChargestyleList}
            getexpensetemplate = {this.getexpensetemplate}
            recover={this.recover}
            {...expenseChargeModalData}
          />
        </div>
        <div className='content-right'>
          <div className='content-right-head expensePage-right-head'>
            <div className='billingName head-left'
              onMouseEnter={this.handleHoverBillingName}
              onMouseLeave={this.handleHoverOutBillingName}
            >
              <span>
                {this.state.isHoverBillingName ? (
                  this.state.isClickEditBillingName ?
                    (<Input value={expenseName}
                      onChange={this.changeBillingName}
                      onBlur={this.changeBillingNameBlur}
                      onFocus={this.changeBillingNameFocus}
                      style={{ marginTop: -5 }}
                    />) : (<span>
                      <span className='billName'  title={defaultBillingSetting.name}>{defaultBillingSetting.name}</span>
                      <Tooltip placement="top" overlayStyle={{width:76}} title={<span style={{ width: 30 }}>编辑</span>}>
                        <span className='billingNameEdit' onClick={this.clickEditBillNameBtn}>
                          <a className="edit-btn" href="javascript:;">编辑</a>
                        </span>
                      </Tooltip>
                    </span>)
                ) : (<span className='billName' title={defaultBillingSetting.name}>{defaultBillingSetting.name}</span>)
                }
              </span>
            </div>
            <div className='head-right'>
              启用
            <Switch className='switch'
                onChange={this.changeIsused}
                checked={defaultBillingSetting.isUsed}></Switch>
              <Button type='primary' onClick={this.handleHigherExpenseType}>高级</Button>
              <Button type='primary' onClick={this.deleteExpenseType}>删除</Button>
              {
                (saveId * 1 === -2 || saveId * 1 === -3)?null:(
                  <Button type="default" onClick={this.clikCancleExpense}>取消</Button>
                )
              }
              <Button type='primary' disabled={saveId * 1 === -3} onClick={this.clikcSaveExpense}>保存</Button>
            </div>
          </div>
          {
            this.state.isClickHighBillBtn ? (
              <div>
                <div className='highSettingPageHead'>
										<div className = 'billingNameHighSettingBack' onClick={this.clickBackToBasicView}>
											返回
										</div>
										{/*<span className = 'billingNameHighSetting'>{defaultBillingSetting.name}高级设置</span>*/}
									</div>
                <div>
                  {
                    this.state.isHighDataEdit ? (
                      <div className='highSettingPageData highSettingPageDataHover'>
                        <div>
                          <span className='highSettingPageDataHead'>费用类型相关参数</span>
                          <span className='highSettingPageDataHeadView' style={{ cursor: 'pointer' }}
                          onClick={this.clickHighDataGoBackBtn}
                          >
                            完成</span>
                        </div>
                        <div className='highSettingSwitch'>
                          <ul>
                            <li className='highSettingPageDataLi'>
                              <span className='highSetting-label'>进项税允许抵扣</span>
                                <span className='checkSwitch'>
                                <Switch
                                  checked={defaultBillingSetting.canVatDeduct}
                                  onChange={this.changeCanVatDeduct}
                                />
                              </span>
                            </li>
                            {/*
                              currentModel + '' === 'add' ? null : (
                                <li className='highSettingPageDataLi'>
                                  <span className='highSetting-label'>员工常用</span>
                                  <span className='checkSwitch'>
                                    <Switch
                                      checked={defaultBillingSetting.isPopular}
                                      onChange={this.changeIsPopular}
                                    />
                                  </span>
                                </li>
                              )
                             */}
                          </ul>
                        </div>
                      </div>
                    ) : (
                        <div className={this.state.isHoverHighSettingPage ? 'highSettingPageData  highSettingPageDataHover' : 'highSettingPageData'}
                          onMouseEnter={this.handleHoverHighSettingPage}
                          onMouseLeave={this.handleOutHighSettingPage}
                        >
                          <div>
                            <span className='highSettingPageDataHead'>费用类型相关参数</span>
                            <span className='highSettingPageDataHeadIcon'>
                              {this.state.isHoverHighSettingPage ? (
                                <Tooltip placement="top" overlayStyle={{width:76}} title={<span style={{ width: 30 }}>编辑</span>}>
                                  <span className='billingSettingInfoHeadSpanEdit'
                                    onClick={this.clickEditHighSettingPage}
                                    style={{ cursor: 'pointer', marginLeft: 0 }}>
                                    <a className="edit-btn" href="javascript:;">编辑</a>
                                  </span>
                                </Tooltip>
                              ) : null}
                            </span>
                          </div>
                          <div className='highSettingSwitch'>
                            <ul>
                              <li className='highSettingPageDataLi'>
                                <span className='highSetting-label'>进项税允许抵扣</span>
                                <span className='checkSwitch'>{defaultBillingSetting.canVatDeduct ? '是' : '否'}</span>
                              </li>
                              {/*
                                currentModel + '' === 'add' ? null : (
                                  <li className='highSettingPageDataLi'>
                                    <span className='highSetting-label'>员工常用</span>
                                    <span className='checkSwitch'>
                                      {defaultBillingSetting.isPopular ? '是' : '否'}
                                    </span>
                                  </li>
                                )
                              */}
                            </ul>
                          </div>
                        </div>
                      )
                  }
                </div>
              </div>
            ) :
              (
                <div>
                  <div className='billSettingInfo' style={{minWidth:375,width:pageRightWidth*0.4}}>
                    <div>
                      {!isEdit ?
                        (
                          <div className={this.state.isMouseEnterInforCard ? 'billingSettingInfo billingSettingInfoHover' : 'billingSettingInfo'}
                            onMouseEnter={this.hoverBillingSettingInfo}
                            onMouseLeave={this.outBillingSettingInfo}
                            style={{height:(clientHeight-160)}}
                          >
                            <div className='billingSettingInfoHead'>
                              <span className='billingSettingInfoHeadSpan'
                              title={defaultBillingSetting.name+'详情'}>
                                {defaultBillingSetting.name}详情
                              </span>
                              {this.state.isMouseEnterInforCard ?
                                (
                                  <Tooltip placement="top" overlayStyle={{width:76}} title={<span style={{ width: 30 }}>编辑</span>}>
                                    <span className='billingSettingInfoHeadSpanEdit'
                                      onClick={this.clickEditBtn}><a className="edit-btn" href="javascript:;">编辑</a></span>
                                  </Tooltip>
                                ) : <span className='billingSettingInfoHeadSpanEdit'></span>
                              }
                            </div>
                            <div className='billingSettingInfoListUlWrap'
                            style={{height:(clientHeight-250)}}
                            >
                              {
                                billSettingInfor.length === 0 ? (
                                    <span className="billingSettingDataNullWrap">
                                  <span className='billingSettingDataNull'
                                  onClick = {this.clickAddChargeStyleCon}
                                  >+添加费用类型显示内容</span></span>
                                ) : (
                                    <ul className='billingSettingInfoListUl'>
                                      {
                                        billSettingInfor.map((item, i) => {
                                          return !item.isnull ? (
                                            <li key={i}><span className='itemCon'>{item.disp}
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
                          <div className='billingSettingInfo billingSettingInfoHover'
                            onClick={this.handleSlide}
                            style={{height:(clientHeight-160)}}
                            >
                            <div className='billingSettingInfoHead'>
                              <span className='billingSettingInfoHeadSpan' 
                              title={defaultBillingSetting.name+'详情'}>
                                {defaultBillingSetting.name}详情
                              </span>
                              <span className='billingSettingInfoHeadSpanEdit'
                                style={{ float: 'right', fontSize: 12,marginRight:7 }}
                                onClick={this.clickGoBackBtn}>完成</span>
                            </div>
                            <div>
                              <div className = 'eidtBillingSettingInfo' style={{paddingRight:28+EditCardscrollbarWidth}}>
                                <div className = 'eidtBillingSettingInfoIn'>
                                  <span style={{ minWidth: 110,width:'35%',paddingLeft:8 }}>单据内容</span>
                                  <span style={{ minWidth: 137 ,width:'45%'}}>显示单据内容</span>
                                  <span style={{ minWidth: 70 ,width:'25%'}}>必填项</span>
                                </div>
                                </div>
                              <div className='billingSettingInfoEditListUlWrap'
                              style={{height:(clientHeight-290)}}
                              >
                                {
                                  billSettingInfor.length === 0 ? (
                                      <span className="billingSettingDataNullWrap">
                                    <span className='billingSettingDataNull'
                                    onClick = {this.clickAddChargeStyleCon}
                                    >+添加费用类型显示内容</span></span>
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
                                                defaultBillingSetting={defaultBillingSetting}
                                                moveCard={this.applicationmoveCard}
                                                handleChangeCheckbox={this.changeChecked}
                                                deletSettingItem={this.handleDeleteSettingItem}
                                                changeCheckedSettingItem={this.changeCheckedSettingItem}
                                                hoverDargItem = {this.hoverDargItem} 
																								outDargItem = {this.outDargItem} 
                                              />
                                            )
                                          })
                                        }
                                      </ul>
                                    )
                                }
                              </div>
                            </div>
                            <div className={isHoverDragItem?'dragRemark dragRemarkColro':'dragRemark'}>拖拽上下调整顺序</div>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              )
          }

        </div>
        <ExpenseTypeSlide
          ref='expenseTypeSlide'
          {...expenseTypeSlid}
          handleBacisCheck={this.handleBacisCheck}
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
      </div>
    )
  }
}
function expenseTypeStateToProps(state) {
  return {
    clientHeight: state.get('baseState').toJS().clientHeight,
    clientWidth: state.get('baseState').toJS().clientWidth,
    $$expenseTypeState: state.get('expenseTypeState')
  }
}

export default connect(expenseTypeStateToProps)(ExpenseType);
