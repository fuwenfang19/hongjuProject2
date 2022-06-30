/**
 * Created by fuwenfang on 2/22/17.
 * 单据类型高级设置
 */

import React from 'react';
import { Checkbox, Icon, Modal } from 'antd';

export default class billingSlideBasic extends React.Component {
    constructor() {
        super();
        this.state = {
            selectHighAll: false,
            selectBasicAll: false,
        }

    }

    componentDidMount() {

    }

    //单选基础设置
    changeSettingCheckbox = (e, i) => {
        e.stopPropagation()
        const newBasicSettingData = this.props.basicSettingData.concat()
        const basicSettingDataId = newBasicSettingData[i].id
        const status = e.target.checked
        newBasicSettingData[i].isChosed = status

        this.props.hanldeChangebasicCheck(status, basicSettingDataId)
    }

    //全选基础设置
    handleBasciSeletAll = (e) => {
        e.stopPropagation()
        const newBasicSettingData = this.props.basicSettingData.concat()
        const selectBasicAll = this.props.selectBasicAll
        const billSettingInfor = this.props.billSettingInfor
        if (!selectBasicAll) {
            //全选
            newBasicSettingData.map((item, i) => {
                item.isChosed = true
                return item

            })
            let newBasicDataID = newBasicSettingData.map(p => p.id + '')
            let billSettingInforID = billSettingInfor.map(p => p.id + '')
            //点击全选时 要过滤掉已选择区域内的人员
            let t = billSettingInforID.some((citem) => {
                return newBasicDataID.indexOf(citem) > -1
            })
            let chosedShowData = []
            if (!t) {
                //已选与右侧没有重复  把右侧数据全部添加进已选区域
                chosedShowData = billSettingInfor.concat(newBasicSettingData)
            } else {
                //从右侧数据中把已选区域的过滤掉  再添加
                let filterData = newBasicSettingData.filter((item) => {
                    return billSettingInforID.indexOf(item.id + '') < 0
                })
                chosedShowData = billSettingInfor.concat(filterData)
            }
            this.props.hanldeChangebasicCheckAll(chosedShowData)

        } else {
            //全不选
            newBasicSettingData.map((item, i) => {
                item.isChosed = false
                return item
            })

            let newBasicDataID = newBasicSettingData.map(p => p.id + '')
            let chosedShowData = billSettingInfor.filter((item) => {
                return newBasicDataID.indexOf(item.id + '') < 0
            })
            this.props.hanldeChangebasicCheckAll(chosedShowData)
        }
    }

    //弹出截图
    ShowBillStyleImg = () => {
        // this.setState({
        //     imgVisible: true
        // })
    }
    //关闭截图
    handleCancel = () => {
        this.setState({
            imgVisible: false
        })
    }
    handleClickLevel = (e) => {
        e.stopPropagation()
        this.props.handleClickLevel()
    }
    //关闭侧滑
    CloseSlide = () => {
        this.props.CloseSlide()
    }
    render() {
        const clientHeight = this.props.clientHeight
        const selectBasicAll = this.props.selectBasicAll
        const basicSettingData = this.props.basicSettingData
        return (
            <div className='basicArea'>
                <div className='billingConWrap' style={{ height: clientHeight - 180 }}>
                    <span className = 'choose-remark'>勾选至详情区域</span>
                    <ul className='list-container'>
                        <li className='list-choose-all'>
                            <span className='check-all'>
                                <Checkbox checked={selectBasicAll}
                                    onChange={this.handleBasciSeletAll}>
                                </Checkbox>
                            </span>
                            <span >全选</span>
                        </li>
                        {
                            basicSettingData.map((item, i) => {
                                return (
                                    <li key={i} className='list-item'>
                                        <span className='item-checkbox'>
                                            <Checkbox
                                                checked={item.isChosed}
                                                onChange={(e) => { this.changeSettingCheckbox(e, i) }}>
                                            </Checkbox>
                                        </span>
                                        <div className='item-content'>
                                            <div className='item-title'>{item.name}</div>
                                            <div className='item-remark'>{item.description}</div>
                                        </div>
                                        {/*
                                            item.name === '支出类型' || item.name === '出差人' ?
                                                (<span className='item-icon'>
                                                    <Icon type="exclamation-circle-o"
                                                        onClick={this.ShowBillStyleImg} />
                                                </span>) : null
                                        */}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <Modal title=""
                    visible={this.state.imgVisible}
                    onCancel={this.handleCancel}
                    wrapClassName='basicShowImgModal'
                    max-width='520'
                >
                    <div>
                        <img src={require('../../../images/billSetting/basicImg.jpg')} />
                    </div>
                </Modal>
            </div>
        )
    }
}

