/**
 * Created by fuwenfang on 3/16/17.
 * 费用类型左侧菜单
 */

import React from 'react';
import { Collapse, Icon, Modal, Button, Spin } from 'antd';
import { DropdownList, Toast, Confirm } from '../../common'
import edit from '../../../images/billSetting/edit1.png';
import add from '../../../images/billSetting/add.png';
const Panel = Collapse.Panel;

const customPanelStyle = {
    borderRadius: 4,
    marginBottom: 10,
    border: 0,
};

export default class expenseLeftMenu extends React.Component {
    constructor() {
        super();
        this.state = {
            chargeBillModalVisible: false,
            isEditChargeBill: false,
            isEditStyle:false
        }
    }
    callback = (key) => {

    }
    clickChargeBillStyle = () => {
        this.setState({
            chargeBillModalVisible: true
        })
        this.props.getTicketExpenseList()
    }
    handleCancel = () => {
        this.setState({
            chargeBillModalVisible: false,
            isEditChargeBill: false
        })
    }
    clickModalEdit = () => {
        const isEditChargeBill = this.state.isEditChargeBill
        if (isEditChargeBill) {
            return
        }
        this.setState({
            isEditChargeBill: true
        })
    }
    //选择对应的费用类型
    clickAddItem = (key, i) => {
        this.props.choseChargeStyleSelect(key, i)
        this.setState({
            isEditStyle:true
        })
    }
    saveTicketExpenseList = () => {
        this.props.saveTicketExpenseList()
    }
    //点击+号增加费用类型模板列表
    addChargestyleList = (e) => {
        e.stopPropagation();
        this.props.addChargestyleList()
    }
    //点击新增下拉条目
    clickTitleAddItem = (key) => {
        const { charstyleList, expenseList, saveId, currentModel, currentId, localexpenseList } = this.props
        let currentSelectedItem = {}
        charstyleList.map((item, i) => {
            if (item.id * 1 === key * 1) {
                currentSelectedItem = item
            }
            return item
        })
        if (saveId === '') {
            //如果有修改
            Confirm({
                title: '确认',
                content: {
                    message: '当前数据将全部丢失，确认？',
                    explain: ''
                },
                onOk: () => {
                    if (currentModel === 'add') {
                        //TODO 如果当前是add模式，先从左侧列表中把当前右侧详情对应的左侧菜单移除
                        let newexpenseList = expenseList.concat()
                        newexpenseList = newexpenseList.filter((item, i) => {
                            return item.id * 1 !== currentId * 1
                        })
                        //新增菜单的时候 需要判断现有的左侧列表是否有重名的
                        let isRepeatedName = newexpenseList.some((item, i) => {
                            return item.name === currentSelectedItem.name
                        })
                        let nowExpenseList = localexpenseList.concat([currentSelectedItem])
                        this.props.changeLeftExpenseListData(nowExpenseList)
                        this.props.getexpensetemplate(key)
                        this.props.getDefaultTemplateViewdifine(key)
                        this.props.recover()
                        //新增后滚动条滚动到底部
                        setTimeout(()=>{
                            const div = document.getElementsByClassName('leftCollapseListWrap')[0]
                            div.scrollTop = div.scrollHeight;
                        },300)
                    } else if (currentModel === 'edit') {
                        //TODO 如果当前是edit模式 直接判断是否重名
                        let newexpenseList = expenseList.concat()
                        let nowExpenseList = localexpenseList.concat([currentSelectedItem])
                        this.props.changeLeftExpenseListData(nowExpenseList)
                        this.props.getexpensetemplate(key)
                        this.props.getDefaultTemplateViewdifine(key)
                        this.props.recover()
                        //新增后滚动条滚动到底部
                        setTimeout(()=>{
                            const div = document.getElementsByClassName('leftCollapseListWrap')[0]
                            div.scrollTop = div.scrollHeight;
                        },300)
                    }
                },
                onCancel: () => {
                }
            })
        } else if (saveId === '-2') {
            //当前是刚刚获取模板设置项 并且没有做过修改  则直接移除 不用提示
            let newexpenseList = expenseList.concat()
            newexpenseList = newexpenseList.filter((item, i) => {
                return item.id * 1 !== currentId * 1
            })
            //新增菜单的时候 需要判断现有的左侧列表是否有重名的
            let isRepeatedName = newexpenseList.some((item, i) => {
                return item.name === currentSelectedItem.name
            })
            let nowExpenseList = newexpenseList.concat([currentSelectedItem])
            this.props.changeLeftExpenseListData(nowExpenseList)
            this.props.getexpensetemplate(key)
            this.props.getDefaultTemplateViewdifine(key)
            this.props.recover()
            //新增后滚动条滚动到底部
            setTimeout(()=>{
                const div = document.getElementsByClassName('leftCollapseListWrap')[0]
                div.scrollTop = div.scrollHeight;
            },300)
        } else {
            //当前是刚刚获取已经设置过的单据 并且没有做过修改 则直接判断是否重名
            //新增菜单的时候 需要判断现有的左侧列表是否有重名的
            let newexpenseList = expenseList.concat()
            let nowExpenseList = newexpenseList.concat([currentSelectedItem])
            this.props.changeLeftExpenseListData(nowExpenseList)
            this.props.getexpensetemplate(key)
            this.props.getDefaultTemplateViewdifine(key)
            this.props.recover()
            //新增后滚动条滚动到底部
            setTimeout(()=>{
                const div = document.getElementsByClassName('leftCollapseListWrap')[0]
                div.scrollTop = div.scrollHeight;
            },300)
        }

    }
    //点击左侧菜单条目
    clickExpenseListItem = (e, id) => {
        const { expenseList, localexpenseList, saveId, currentModel, currentId } = this.props
        //新增的单据 还没点保存的时候 不可点击左侧菜单的当前单据
        if(currentModel === 'add' && currentId*1 === id*1){
            return 
        }
        if (saveId === '') {
            //如果有修改
            Confirm({
                title: '确认',
                content: {
                    message: '当前数据将全部丢失，确认？',
                    explain: ''
                },
                onOk: () => {
                    if (currentModel === 'add') {
                        //TODO 如果当前是add模式，先从左侧列表中把当前右侧详情对应的左侧菜单移除
                        let newexpenseList = expenseList.concat()
                        let nowexpenseList = newexpenseList.filter((item, i) => {
                            return item.id * 1 !== currentId * 1
                        })
                        //获取请求数据
                        this.props.getexpenseviewdefine(id)
                        this.props.changeLeftExpenseListData(nowexpenseList)
                        this.props.recover()
                    } else if (currentModel === 'edit') {
                        //TODO 如果当前是edit模式 直接获取请求数据
                        this.props.getexpenseviewdefine(id)
                        this.props.changeLeftExpenseListData(localexpenseList)
                        this.props.recover()
                    }
                },
                onCancel: () => {
                }
            })
        } else if (saveId === '-2') {
            //TODO 先从左侧列表中把当前右侧详情对应的左侧菜单移除
            let newexpenseList = expenseList.concat()
            let nowexpenseList = newexpenseList.filter((item, i) => {
                return item.id * 1 !== currentId * 1
            })
            //获取请求数据
            this.props.getexpenseviewdefine(id)
            this.props.changeLeftExpenseListData(nowexpenseList)
            this.props.recover()
        } else {
            this.props.getexpenseviewdefine(id)
            this.props.recover()
        }
    }
    render() {
        const isEditStyle = this.state.isEditStyle
        const modalFooter = (
            <div className="ant-modal-footer-div">
                <Button className="ant-btn ant-btn-lg" onClick={this.handleCancel}><span>关 闭 </span></Button>
                <Button className="ant-btn ant-btn-primary ant-btn-lg" disabled = {!isEditStyle}
                    onClick={this.saveTicketExpenseList}><span>保 存</span>
                </Button>
            </div>
        )
        const isEditChargeBill = this.state.isEditChargeBill
        const { expenseChargeModalList, charstyleList, expenseList, clientHeight, currentName, ticketListLoading } = this.props
        let DropdownListData = {}
        DropdownListData.trigger = 'click'
        DropdownListData.data = charstyleList
        return (
            <div>
                <div className='chargeBillStyleBtn'
                    onClick={this.clickChargeBillStyle}>
                    <div className = 'chargeBillStyleBtnInside'><i className='arrow'></i>交易订单费用类型</div>
                </div>
                <div className = 'leftCollapse'>
                    <Collapse
                    bordered={false}
                    defaultActiveKey={'1'}
                    accordion
                    onChange={this.callback}>
                        <Panel
                            header={<span><span className='leftCollapseTitle'>费用类型</span>
                                <DropdownList
                                    {...DropdownListData}
                                    clickAddItem={(key) => { this.clickTitleAddItem(key) }}
                                >
                                    <span className='leftCollapseAdd' onClick={this.addChargestyleList}>
                                        <img src={add} style={{width:'14px',height:'14px'}}/>
                                    </span>
                                </DropdownList>
                            </span>}
                            key="1"
                            style={customPanelStyle} >
                            <div className='leftCollapseListWrap'
                                style={{ height: clientHeight - 185 }}>
                                {
                                    expenseList.length === 0 ? (<div className="ant-table-placeholder">
                                        <i className=" anticon anticon-frown-o"></i><span>暂无数据</span></div>) : (
                                            expenseList.map((item, i) => {
                                                return (
                                                    <div className={item.name === currentName ? 'current leftCollapseListItem' : 'leftCollapseListItem'}
                                                        onClick={(e) => { this.clickExpenseListItem(e, item.id) }}
                                                        key={i}
                                                    >
                                                        <Icon type="file-text" />
                                                        <span style={{ marginLeft: 18 }}>{item.name}</span>
                                                    </div>
                                                )
                                            }))
                                }
                            </div>
                            <div className='leftCollapseHr'></div>
                        </Panel>
                    </Collapse>
                </div>
                <Modal title={<span>
                    <span className='ModalTitle'>交易订单费用类型</span>
                    <span className={isEditChargeBill ? 'ModalTitleEdit ModalTitleEditStatus' : 'ModalTitleEdit'} onClick={this.clickModalEdit}>
                        <img src={edit} style={{width:'14px',height:'14px',marginRight: 10}}/>编辑</span></span>}
                    visible={this.state.chargeBillModalVisible}
                    onCancel={this.handleCancel}
                    wrapClassName='chargeBillModal'
                    width={665}
                    okText='保存'
                    footer={isEditChargeBill ? modalFooter : (<div className="ant-modal-footer-div"></div>)}
                >
                    <div className='chargeBillModalContent'>
                        <div className='chargeBillModalContentHead'>
                            <div className='chargeBillModalContentHeadLeft'>交易类型</div>
                            <div className='chargeBillModalContentHeadRight'>对应的费用类型</div>
                        </div>
                        {
                            ticketListLoading ? (<div><Spin /></div>) : (
                                <div className='chargeBillModalContentBody'>
                                    <ul>
                                        {
                                            expenseChargeModalList.length === 0 ?
                                                (<div className="ant-table-placeholder">
                                                    <i className=" anticon anticon-frown-o"></i>
                                                    <span>暂无数据</span></div>) :
                                                expenseChargeModalList.map((item, i) => {
                                                    return (<li key={i}>
                                                        <div
                                                            className='chargeBillModalContentBodyLeft'>                                                                 {item.ticketname}
                                                        </div>
                                                        {
                                                            isEditChargeBill ? (
                                                                <div
                                                                    className='chargeBillModalContentBodyRight'
                                                                    style={{ cursor: isEditChargeBill ? 'pointer' : 'default' }}
                                                                >
                                                                    <DropdownList
                                                                        trigger='click'
                                                                        data={item.expense_class_list}
                                                                        clickAddItem={(key) =>
                                                                        { this.clickAddItem(key, i) }}
                                                                    >
                                                                        <span>
                                                                            <span
                                                                                className='chargeBillItemDown' title={item.expenseClass?item.expenseClass.name:'无'}>
                                                                                {item.expenseClass?item.expenseClass.name:'无'}
                                                                            </span>
                                                                            <Icon type="caret-down"
                                                                                style={{color: '#999' }}
                                                                            />
                                                                        </span>
                                                                    </DropdownList>
                                                                </div>
                                                            ) : (
                                                                    <div
                                                                        className='chargeBillModalContentBodyRight' title={item.expenseClass?item.expenseClass.name:'无'}>
                                                                        {item.expenseClass?item.expenseClass.name:'无'}
                                                                    </div>
                                                                )
                                                        }
                                                    </li>)
                                                })
                                        }
                                    </ul>
                                </div>
                            )
                        }
                    </div>
                </Modal>
            </div>
        )
    }
}
