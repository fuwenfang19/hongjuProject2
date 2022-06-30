/**
 * Created by fuwenfang on 2/25/17.
 * 单据类型左侧菜单
 */

import React from 'react';
import { Collapse, Icon } from 'antd';
import { DropdownList, Confirm, Toast } from '../../common'
import * as actions from '../../../actions';
import add from '../../../images/billSetting/add.png';


const Panel = Collapse.Panel;

const customPanelStyle = {
    borderRadius: 4,
    marginBottom: 10,
    border: 0,
};

export default class billingSettingLeftMenu extends React.Component {
    constructor() {
        super();
        this.state = {

        }

    }
    clickAdd = (e, type) => {
        e.stopPropagation();
        //TODO 请求新增模板类型列表
        this.props.addBillingStyle(type)
    }

    clickAddItem(key, id) {
        //TODO 根据id获取获取模板
        let { leftMenuData, billingStyleList, currentBillingSettingID,
            saveId, currentModel } = this.props
        const { $$mapState, dispatch } = this.props

        //判断当前后侧设置详情区域的内容是否保存了
        if (saveId === '') {
            //说明右侧的详情内容被修改 此时需要提示
            Confirm({
                title: '确认',
                content: {
                    message: '当前数据将全部丢失，确认？',
                    explain: ''
                },
                onOk: () => {
                    //TODO 如果当前是add模式，先从左侧列表中把当前右侧详情对应的左侧菜单移除
                    if (currentModel === 'add') {
                        let newleftMenuData = leftMenuData
                        newleftMenuData['2'] = leftMenuData['2'].filter((item, i) => {
                            return item.id * 1 !== currentBillingSettingID * 1
                        })
                        newleftMenuData['3'] = leftMenuData['3'].filter((item, i) => {
                            return item.id * 1 !== currentBillingSettingID * 1
                        })
                        newleftMenuData['15'] = leftMenuData['15'].filter((item, i) => {
                            return item.id * 1 !== currentBillingSettingID * 1
                        })
                        leftMenuData = newleftMenuData
                        let currentSelectedItem = {}
                        billingStyleList.map((item, i) => {
                            if (item.id * 1 === id * 1) {
                                currentSelectedItem = item
                            }
                            return item
                        })
                        let localLeftMenuData = $$mapState.toJS().localLeftMenuData
                        let newLeftMenuData = localLeftMenuData
                        newLeftMenuData[key] = localLeftMenuData[key].concat([currentSelectedItem])
                        dispatch(actions.changeBillLeftMenuData(newLeftMenuData))
                        this.props.getDefaultBillingStyle(id, key)
                        this.props.recover()
                        //新增后滚动条滚动到底部
                        setTimeout(()=>{
                            if(key*1 === 2){
                                const div = document.getElementsByClassName('leftCollapseListWrap')[0]
                                div.scrollTop = div.scrollHeight;
                            }else if(key*1 === 3){
                                const div = document.getElementsByClassName('leftCollapseListWrap')[1]
                                div.scrollTop = div.scrollHeight;
                            }else if(key*1 === 15){
                                const div = document.getElementsByClassName('leftCollapseListWrap')[2]
                                div.scrollTop = div.scrollHeight;
                            }
                        },300)
                    } else if (currentModel === 'edit') {
                        //TODO 如果当前是edit模式 直接判断是否重名
                        let currentSelectedItem = {}
                        billingStyleList.map((item, i) => {
                            if (item.id * 1 === id * 1) {
                                currentSelectedItem = item
                            }
                            return item
                        })                        
                        let localLeftMenuData = $$mapState.toJS().localLeftMenuData
                        let newLeftMenuData = localLeftMenuData
                        newLeftMenuData[key] = localLeftMenuData[key].concat([currentSelectedItem])
                        dispatch(actions.changeBillLeftMenuData(newLeftMenuData))
                        this.props.getDefaultBillingStyle(id, key)
                        this.props.recover()
                        //新增后滚动条滚动到底部
                        setTimeout(()=>{
                            if(key*1 === 2){
                                const div = document.getElementsByClassName('leftCollapseListWrap')[0]
                                div.scrollTop = div.scrollHeight;
                            }else if(key*1 === 3){
                                const div = document.getElementsByClassName('leftCollapseListWrap')[1]
                                div.scrollTop = div.scrollHeight;
                            }else if(key*1 === 15){
                                const div = document.getElementsByClassName('leftCollapseListWrap')[2]
                                div.scrollTop = div.scrollHeight;
                            }
                        },300)
                    }
                },
                onCancel: () => {
                }
            });
        } else if (saveId === '-2') {
            //当前是刚刚获取模板设置项 并且没有做过修改  则直接移除 不用提示            
            let newleftMenuData = leftMenuData
            newleftMenuData['2'] = leftMenuData['2'].filter((item, i) => {
                return item.id * 1 !== currentBillingSettingID * 1
            })
            newleftMenuData['3'] = leftMenuData['3'].filter((item, i) => {
                return item.id * 1 !== currentBillingSettingID * 1
            })
            newleftMenuData['15'] = leftMenuData['15'].filter((item, i) => {
                return item.id * 1 !== currentBillingSettingID * 1
            })
            leftMenuData = newleftMenuData
            let currentSelectedItem = {}
            billingStyleList.map((item, i) => {
                if (item.id * 1 === id * 1) {
                    currentSelectedItem = item
                }
                return item 
            })
            let newLeftMenuData = leftMenuData
            newLeftMenuData[key] = leftMenuData[key].concat([currentSelectedItem])
            dispatch(actions.changeBillLeftMenuData(newLeftMenuData))
            this.props.getDefaultBillingStyle(id, key)
            this.props.recover()
            //新增后滚动条滚动到底部
            setTimeout(()=>{
                if(key*1 === 2){
                    const div = document.getElementsByClassName('leftCollapseListWrap')[0]
                    div.scrollTop = div.scrollHeight;
                }else if(key*1 === 3){
                    const div = document.getElementsByClassName('leftCollapseListWrap')[1]
                    div.scrollTop = div.scrollHeight;
                }else if(key*1 === 15){
                    const div = document.getElementsByClassName('leftCollapseListWrap')[2]
                    div.scrollTop = div.scrollHeight;
                }
            },300)
        } else {
            //当前是刚刚获取已经设置过的单据 并且没有做过修改 则直接判断是否重名
            let currentSelectedItem = {}
            billingStyleList.map((item, i) => {
                if (item.id * 1 === id * 1) {
                    currentSelectedItem = item
                }
                return item
            })
            //新增菜单的时候 需要判断现有的左侧列表是否有重名的
            let isRepeatedName = leftMenuData[key].some((item, i) => {
                return item.name === currentSelectedItem.name
            })
            let newLeftMenuData = leftMenuData
            newLeftMenuData[key] = leftMenuData[key].concat([currentSelectedItem])
            dispatch(actions.changeBillLeftMenuData(newLeftMenuData))
            this.props.getDefaultBillingStyle(id, key)
            this.props.recover()
            //新增后滚动条滚动到底部
            setTimeout(()=>{
                if(key*1 === 2){
                    const div = document.getElementsByClassName('leftCollapseListWrap')[0]
                    div.scrollTop = div.scrollHeight;
                }else if(key*1 === 3){
                    const div = document.getElementsByClassName('leftCollapseListWrap')[1]
                    div.scrollTop = div.scrollHeight;
                }else if(key*1 === 15){
                    const div = document.getElementsByClassName('leftCollapseListWrap')[2]
                    div.scrollTop = div.scrollHeight;
                }
            },300)
        }
    }
    clickMenuItem = (e, id, type) => {
        //TODO 根据id获取已经设置的单据类型设置项
        let { leftMenuData, currentBillingSettingID, saveId, currentModel } = this.props
        //新增的单据 还没点保存的时候 不可点击左侧菜单的当前单据
        if(currentModel === 'add' && currentBillingSettingID*1 === id*1){
            return 
        }
        //判断当前后侧设置详情区域的内容是否保存了
        if (saveId === '') {
            //未保存
            Confirm({
                title: '确认',
                content: {
                    message: '当前数据将全部丢失，确认？',
                    explain: ''
                },
                onOk: () => {
                    //TODO 如果当前是add模式，先从左侧列表中把当前右侧详情对应的左侧菜单移除
                    if (currentModel === 'add') {
                        let newleftMenuData = leftMenuData
                        newleftMenuData['2'] = leftMenuData['2'].filter((item, i) => {
                            return item.id * 1 !== currentBillingSettingID * 1
                        })
                        newleftMenuData['3'] = leftMenuData['3'].filter((item, i) => {
                            return item.id * 1 !== currentBillingSettingID * 1
                        })
                        newleftMenuData['15'] = leftMenuData['15'].filter((item, i) => {
                            return item.id * 1 !== currentBillingSettingID * 1
                        })
                        leftMenuData = newleftMenuData

                        this.props.changeLeftMenuData(leftMenuData)
                        this.props.getApplicationSetting(id, type)
                        this.props.recover()

                    } else if (currentModel === 'edit') {
                        const { $$mapState, dispatch } = this.props
                        const localLeftMenuData = $$mapState.toJS().localLeftMenuData
                        dispatch(actions.changeBillLeftMenuData(localLeftMenuData))
                        this.props.getApplicationSetting(id, type)
                        this.props.recover()
                    }
                },
                onCancel: () => {
                }
            });
        } else if (saveId === '-2') {
            //只加载了模板设置数据并没有修改 不用提示 直接删除
            let newleftMenuData = leftMenuData
            newleftMenuData['2'] = leftMenuData['2'].filter((item, i) => {
                return item.id * 1 !== currentBillingSettingID * 1
            })
            newleftMenuData['3'] = leftMenuData['3'].filter((item, i) => {
                return item.id * 1 !== currentBillingSettingID * 1
            })
            newleftMenuData['15'] = leftMenuData['15'].filter((item, i) => {
                return item.id * 1 !== currentBillingSettingID * 1
            })
            leftMenuData = newleftMenuData

            this.props.changeLeftMenuData(leftMenuData)
            this.props.getApplicationSetting(id, type)
            this.props.recover()
        } else {
            this.props.getApplicationSetting(id, type)
            this.props.recover()
        }
    }
    callback = (key) => {

    }
    render() {
        const { leftMenuData, isLeftMenuOverflow, billingStyleList,
            clientHeight, currentBillStyle,currentName } = this.props
        const DropdownListData = {}
        DropdownListData.trigger = 'click'
        DropdownListData.data = billingStyleList
        //console.log(currentBillStyle)
        return (
            <div className = 'leftCollapse'>
                <Collapse
                bordered={false}
                defaultActiveKey={isLeftMenuOverflow ? [currentBillStyle + ''] : ['2', '3', '15']}
                accordion={isLeftMenuOverflow}
                onChange={this.callback}>
                <Panel
                    header={
                        <span>
                            <span className='leftCollapseTitle'>申请单</span>
                            <DropdownList {...DropdownListData} clickAddItem={(key) => { this.clickAddItem('2', key) }}>
                                <span className='leftCollapseAdd' onClick={(e, type) => { this.clickAdd(e, 2) }} >
                                    <img src={add} style={{width:'14px',height:'14px'}}/>
                                </span>
                            </DropdownList>
                        </span>
                    }
                    key="2"
                    style={customPanelStyle}
                >
                    <div className='leftCollapseListWrap' style={{ height: clientHeight - 245}}>
                        {
                            leftMenuData['2'].length === 0?(<div className="ant-table-placeholder">
                                            <i className=" anticon anticon-frown-o"></i><span>暂无数据</span></div>):(
                            leftMenuData['2'].map((item, i) => {
                                return (
                                    <div
                                        className={item.name === currentName ? 'current leftCollapseListItem' : 'leftCollapseListItem'}
                                        key={i}
                                        onClick={(e) => { this.clickMenuItem(e, item.id, '2') }}
                                    >
                                        <Icon type="file-text" />
                                        <span style={{ marginLeft: 18 }}>{item.name}</span>
                                    </div>
                                )
                            })
                            )
                        }
                    </div>
                <div className='leftCollapseHr'></div>
                </Panel>
                <Panel header={<span><span  className='leftCollapseTitle'>报销单</span>
                    <DropdownList {...DropdownListData} clickAddItem={(key) => { this.clickAddItem('3', key) }}>
                        <span className='leftCollapseAdd' onClick={(e, type) => { this.clickAdd(e, 3) }} >
                            <img src={add} style={{width:'14px',height:'14px'}}/>
                        </span>
                    </DropdownList>
                </span>}
                    key="3" style={customPanelStyle}>
                    <div className='leftCollapseListWrap' style={{ height: clientHeight - 245 }}>
                        {
                            leftMenuData['3'].length === 0?(<div className="ant-table-placeholder">
                                            <i className=" anticon anticon-frown-o"></i><span>暂无数据</span></div>):(
                            leftMenuData['3'].map((item, i) => {
                                return (
                                    <div className={item.name === currentName ? 'current leftCollapseListItem' : 'leftCollapseListItem'}
                                        key={i}
                                        onClick={(e) => { this.clickMenuItem(e, item.id, '3') }}>
                                        <Icon type="file-text" />
                                        <span style={{ marginLeft: 18 }}>{item.name}</span>
                                    </div>
                                )
                            })
                            )
                        }
                    </div>
                <div className='leftCollapseHr'></div>
                </Panel>
                <Panel header={<span><span  className='leftCollapseTitle'>还款单</span>
                    <DropdownList {...DropdownListData} clickAddItem={(key) => { this.clickAddItem('15', key) }}>
                        <span className='leftCollapseAdd' onClick={(e, type) => { this.clickAdd(e, 15) }} >
                            <img src={add} style={{width:'14px',height:'14px'}}/>
                        </span>
                    </DropdownList>
                </span>}
                    key="15" style={customPanelStyle}>
                    <div className='leftCollapseListWrap' style={{ height: clientHeight - 245 }}>
                        {
                            leftMenuData['15'].length === 0?(<div className="ant-table-placeholder">
                                            <i className=" anticon anticon-frown-o"></i><span>暂无数据</span></div>):(
                            leftMenuData['15'].map((item, i) => {
                                return (
                                    <div className={item.name === currentName ? 'current leftCollapseListItem' : 'leftCollapseListItem'}
                                        key={i}
                                        onClick={(e) => { this.clickMenuItem(e, item.id, '15') }}
                                    >
                                        <Icon type="file-text" />
                                        <span style={{ marginLeft: 18 }}>{item.name}</span>
                                    </div>
                                )
                            })
                            )
                        }
                    </div>
                <div className='leftCollapseHr'></div>
                </Panel>
            </Collapse>
            </div>
        )
    }
}
