/**
 * Created by fuwenfang on 2/22/17.
 * 单据类型高级设置
 */

import React from 'react';
import { Checkbox,Icon, Modal } from 'antd';


export default class billingSlideBasic extends React.Component {
    constructor() {
        super();
        this.state = {

        }

    }

    componentDidMount() {
        //this.handleSelectAll()
    }
    // handleSelectAll = () => {
    //     //
    //     let newBasicSettingData = this.props.basicSettingData.concat()
    //     let newHighSettingData = this.props.hightSettingData.hightSettingData.concat()

    //     //根据rnewBasicSettingData的isChosed状态 来控制全选是否选中
    //     let rBasic = newBasicSettingData.every((item) => {
    //         return item.isChosed === true
    //     });

    //     let rHigh = newHighSettingData.every((item) => {
    //         return item.isChosed === true
    //     });

    //     if (rBasic) {
    //         this.setState({
    //             selectBasicAll: true,
    //         })
    //     } else if (!rBasic) {
    //         this.setState({
    //             selectBasicAll: false,
    //         })
    //     }
    //     if (rHigh && newHighSettingData.length > 0) {
    //         this.setState({
    //             selectHighAll: true,
    //         })
    //     } else {
    //         this.setState({
    //             selectHighAll: false,

    //         })
    //     }
    // }
    //单选基础设置
    changeSettingCheckbox = (e, i) => {
        e.stopPropagation()
        const newBasicData = this.props.basicData.concat()
        const basicDataId = newBasicData[i].id
        const status = e.target.checked
        newBasicData[i].isChecked = status

        this.props.hanldeChangebasicCheck(status, basicDataId)
    }

    //全选基础设置
    handleBasciSeletAll = (e) => {
        e.stopPropagation()
        const newBasicData = this.props.basicData.concat()
        const billSettingInfor = this.props.billSettingInfor.concat()
        const isBasicCheckAll = this.props.isBasicCheckAll

        if (!isBasicCheckAll) {
            //全选
            newBasicData.map((item, i) => {
                item.isChecked = true
                return item

            })
            let newBasicDataID = newBasicData.map(p => p.id + '')
            let billSettingInforID = billSettingInfor.map(p => p.id + '')
            //点击全选时 要过滤掉已选择区域内的人员
            let t = billSettingInforID.some((citem) => {
                return newBasicDataID.indexOf(citem) > -1
            })
            let chosedShowData = []
            if (!t) {
                //已选与右侧没有重复  把右侧数据全部添加进已选区域
                chosedShowData = billSettingInfor.concat(newBasicData)
            } else {
                //从右侧数据中把已选区域的过滤掉  再添加
                let filterData = newBasicData.filter((item) => {
                    return billSettingInforID.indexOf(item.id + '') < 0
                })
                chosedShowData = billSettingInfor.concat(filterData)
            }
            this.props.hanldeChangebasicCheckAll(chosedShowData)
        } else {
            //全不选
            newBasicData.map((item, i) => {
                item.isChecked = false
                return item
            })
            let newBasicDataID = newBasicData.map(p => p.id + '')
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
        const { basicData,clientHeight, isBasicCheckAll } = this.props
        return (
            <div className='basicArea'>
                <div className='billingConWrap'
                    style={{ height: clientHeight - 220 }}>
                    <span className = 'choose-remark'>勾选至详情区域</span>
                    <ul className='list-container'>
                        <li className='list-choose-all'>
                            <span className="check-all">
                                <Checkbox checked={isBasicCheckAll}
                                    onChange={this.handleBasciSeletAll}>
                                </Checkbox>
                            </span>
                            <span >全选</span>
                        </li>
                        {
                            basicData.map((item, i) => {
                                return (
                                    <li key={i} className='list-item'>
                                        <span className="item-checkbox">
                                            <Checkbox
                                                checked={item.isChecked}
                                                onChange={(e) => { this.changeSettingCheckbox(e, i) }}>
                                            </Checkbox>
                                        </span>
                                        <div className="item-content">
                                            <div className="item-title">{item.name}</div>
                                            <div className="item-remark">{item.description}</div>
                                        </div>
                                        {/*
                                            item.name === '支出类型' || item.name === '出差人' ?
                                                (<span className="item-icon">
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

