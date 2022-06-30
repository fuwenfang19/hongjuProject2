/**
 * Created by fuwenfang on 2/22/17.
 * 单据类型高级设置
 */

import React from 'react';
import { Checkbox, Select } from 'antd';
import { Toast } from '../../common';

const Option = Select.Option;


export default class billingSlideHigh extends React.Component {
  constructor() {
    super();
    this.state = {
      isChangeFirtParams:false
    }

  }

  componentDidMount() {
    //this.handleSelectAll()

  }

  handleClickLevel = (e) => {
    e.stopPropagation()
    this.props.handleClickLevel()
  }
  CloseSlide = () => {
    this.props.CloseSlide()
  }
  handleChangeFirstSelect = (value) => {
    const newhightBillSettingData = this.props.highData.concat()
    const valueArry = value.split('&')
    const highSettingDataId = newhightBillSettingData[valueArry[1]].id
    const typeid = valueArry[0]
    this.setState({
        isChangeFirtParams:true
    })
    //修改高级设置项
    this.props.changeFirstSelect(highSettingDataId * 1, typeid * 1)

  }
  //选择关联档案
  changeRelateFile = (value) => {
    const valueArry = value.split('&')
    const RelationTypes = this.props.highSettingEnums.RelationTypes
    const newhightBillSettingData = this.props.highData.concat()
    let code, relation_col, current_fields_template
    RelationTypes.map((item, i) => {
      if (item.value === valueArry[0] * 1) {
        code = item.code
      }
      return RelationTypes
    })
    switch (code) {
      case 'StaffItem':
        current_fields_template = this.props.highSettingEnums.fields_template_StaffItem
        break;
      case 'Department':
        current_fields_template = this.props.highSettingEnums.fields_template_Department
        break;
      case 'ExpenseItem':
        current_fields_template = this.props.highSettingEnums.fields_template_ExpenseItem
        break;
      case 'City':
        current_fields_template = this.props.highSettingEnums.fields_template_City
        break;
      case 'Transport':
        current_fields_template = this.props.highSettingEnums.fields_template_Transport
        break;
      case 'Country':
        current_fields_template = this.props.highSettingEnums.fields_template_Country
        break;
      case 'DisburseClass':
        current_fields_template = this.props.highSettingEnums.fields_template_DisburseClass
        break;
      case 'Supplier':
        current_fields_template = this.props.highSettingEnums.fields_template_Supplier
        break;
      default:
        current_fields_template = []
        break;
    }
    current_fields_template.map((item, i) => {
      if (item.code === 'name') {
        relation_col = item.defid
      }
      return item
    })

    //console.log(current_fields_template)
    const highSettingDataId = newhightBillSettingData[valueArry[1]].id
    const relation_type = valueArry[0]
    //修改高级设置项
    this.props.changeSecondSelect(highSettingDataId * 1, relation_type * 1, relation_col * 1)

  }
  //
  changeRelationsSelectThird = (value) => {
    const valueArry = value.split('&')
    const newhightBillSettingData = this.props.highData.concat()
    const highSettingDataId = newhightBillSettingData[valueArry[1]].id
    const relation_col = valueArry[0]
    //修改高级设置项
    this.props.changeRelationsSelectThird(highSettingDataId * 1, relation_col * 1)
  }
  //数值金额
  changeSelfDefinedNUMFirst = (value) => {
    const valueArry = value.split('&')
    const newhightBillSettingData = this.props.highData.concat()
    const highSettingDataId = newhightBillSettingData[valueArry[1]].id
    const decimal_format = valueArry[0]
    //默认decimal_digits值
    const decimal_digits = 2
    //修改高级设置项
    this.props.changeSelfDefinedNUMFirst(highSettingDataId * 1, decimal_format * 1, decimal_digits * 1)

  }
  //数值小数点
  changeSelfDefinedNUMSecond = (value) => {
    const valueArry = value.split('&')
    const newhightBillSettingData = this.props.highData.concat()
    const highSettingDataId = newhightBillSettingData[valueArry[1]].id * 1
    const decimal_digits = valueArry[0] * 1
    //修改高级设置项
    this.props.changeSelfDefinedNUMSecond(highSettingDataId, decimal_digits)

  }
  //自定义档案change
  changeSelfDefinedFIle = (value) => {
    const valueArry = value.split('&')
    const newhightBillSettingData = this.props.highData.concat()
    const highSettingDataId = newhightBillSettingData[valueArry[2]].id * 1
    const custom_objectid = valueArry[0] * 1
    const relation_col = valueArry[1] * 1
    this.props.changeSelfDefinedFIle(highSettingDataId, custom_objectid, relation_col)
  }
  //单选高级设置
  changeSettinghighCheckbox = (e, i) => {
    const newHighSettingData = this.props.highData.concat()
    newHighSettingData.sort(function (b, a) {
        return b.name.substr(4) - a.name.substr(4);
    });
    const highSettingDataId = newHighSettingData[i].id
    const isChangeFirtParams = this.state.isChangeFirtParams

    const status = newHighSettingData[i].isChecked
    //console.log(newHighSettingData[i])
    //如果选中  则给一个提示
    // if (!status && !isChangeFirtParams) {
    //   Toast.warning('请先设置字段参数，再点击选择哟！');
    // }
    newHighSettingData[i].isChecked = !status
    this.props.hanldeChangehighCheck(!status, highSettingDataId)
  }

  //全选高级设置
  handleHighSeletAll = (e) => {
    e.stopPropagation()
    const newHighSettingData = this.props.highData.concat()
    newHighSettingData.sort(function (b, a) {
        return b.name.substr(4) - a.name.substr(4);
    });
    const selectHighAll = this.props.isHighCheckAll
    const billSettingInfor = this.props.billSettingInfor
    if (!selectHighAll) {
      //全选
      newHighSettingData.map((item, i) => {
        item.isChecked = true
        return item

      })
      let newBasicDataID = newHighSettingData.map(p => p.id + '')
      let billSettingInforID = billSettingInfor.map(p => p.id + '')
      //点击全选时 要过滤掉已选择区域内的人员
      let t = billSettingInforID.some((citem) => {
        return newBasicDataID.indexOf(citem) > -1
      })
      let chosedShowData = []
      if (!t) {
        //已选与右侧没有重复  把右侧数据全部添加进已选区域
        chosedShowData = billSettingInfor.concat(newHighSettingData)
      } else {
        //从右侧数据中把已选区域的过滤掉  再添加
        let filterData = newHighSettingData.filter((item) => {
          return billSettingInforID.indexOf(item.id + '') < 0
        })
        chosedShowData = billSettingInfor.concat(filterData)
      }
      chosedShowData.map((item,i)=>{
          if(item.secondSelfDefined!=='undefined'){
              delete item.secondSelfDefined
          }
          if(item.secondSelfDefinedNUM!=='undefined'){
              delete item.secondSelfDefinedNUM
          }
          if(item.secondSelfDefinedFILE!=='undefined'){
              delete item.secondSelfDefinedFILE
          }
          if(item.secondSelfDefinedSelfFILE!=='undefined'){
              delete item.secondSelfDefinedSelfFILE
          }
      })
      this.props.hanldeChangehighCheckAll(chosedShowData)

    } else {
      //全不选
      newHighSettingData.map((item, i) => {
        item.isChosed = false
        return item
      })

      let newBasicDataID = newHighSettingData.map(p => p.id + '')
      let chosedShowData = billSettingInfor.filter((item) => {
        return newBasicDataID.indexOf(item.id + '') < 0
      })
      this.props.hanldeChangehighCheckAll(chosedShowData)
    }
  }

  render() {
    const clientHeight = this.props.clientHeight
    const FieldTypes = this.props.highSettingEnums.FieldTypes
    const RelationTypes = this.props.highSettingEnums.RelationTypes
    let hightBillSettingData = this.props.highData
    // hightBillSettingData.sort(function (b, a) {
    //     return b.name.substr(4) - a.name.substr(4);
    // });
    const fakeSelfDefineFileData = this.props.highSettingEnums.fakeSelfDefineData
    const fields_template_StaffItem = this.props.highSettingEnums.fields_template_StaffItem
    const fields_template_Department = this.props.highSettingEnums.fields_template_Department
    const fields_template_ExpenseItem = this.props.highSettingEnums.fields_template_ExpenseItem
    const fields_template_City = this.props.highSettingEnums.fields_template_City
    const fields_template_Transport = this.props.highSettingEnums.fields_template_Transport
    const fields_template_Country = this.props.highSettingEnums.fields_template_Country
    const fields_template_DisburseClass = this.props.highSettingEnums.fields_template_DisburseClass
    const fields_template_Supplier = this.props.highSettingEnums.fields_template_Supplier

    const selectHighAll = this.props.isHighCheckAll
    let fields_template_1_useful = [], fields_template_2_useful = [], fields_template_4_useful = [], fields_template_5_useful = [], fields_template_6_useful = [], fields_template_11_useful = [], fields_template_13_useful = [], fields_template_16_useful = []
    fields_template_StaffItem.map((item, i) => {
      if (item.code === 'name') {
        fields_template_1_useful.push(item)
      }
      return item
    })
    fields_template_Department.map((item, i) => {
      if (item.code === 'name') {
        fields_template_2_useful.push(item)
      }
      return item
    })
    fields_template_ExpenseItem.map((item, i) => {
      if (item.code === 'name') {
        fields_template_4_useful.push(item)
      }
      return item
    })
    fields_template_City.map((item, i) => {
      if (item.code === 'name') {
        fields_template_5_useful.push(item)
      }
      return item
    })
    fields_template_Transport.map((item, i) => {
      if (item.code === 'name') {
        fields_template_6_useful.push(item)
      }
      return item
    })
    fields_template_Country.map((item, i) => {
      if (item.code === 'name') {
        fields_template_11_useful.push(item)
      }
      return item
    })
    fields_template_DisburseClass.map((item, i) => {
      if (item.code === 'name') {
        fields_template_13_useful.push(item)
      }
      return item
    })
    fields_template_Supplier.map((item, i) => {
      if (item.code === 'name') {
        fields_template_16_useful.push(item)
      }
      return item
    })
    hightBillSettingData.map((item, index) => {
      let secondSelfDefined = null
      let secondSelfDefinedNUM = null
      let secondSelfDefinedFILE = null
      let secondSelfDefinedSelfFILE = null

      switch (item.typeid) {
        case 3:
          secondSelfDefinedNUM = (
            <div>
              <Select value={item.attrs.decimal_format + '&' + index}
                style={{ minWidth: 70 }}
                onChange={this.changeSelfDefinedNUMFirst}>
                <Option value={7 + '&' + index}>金额</Option>
                <Option value={8 + '&' + index}>普通数值</Option>
              </Select>
              <Select value={item.attrs.decimal_digits + '&' + index}
                style={{ minWidth: 70 }}
                onChange={this.changeSelfDefinedNUMSecond}
              >
                <Option value={0 + '&' + index}>0</Option>
                <Option value={1 + '&' + index}>1</Option>
                <Option value={2 + '&' + index}>2</Option>
                <Option value={3 + '&' + index}>3</Option>
                <Option value={4 + '&' + index}>4</Option>
                <Option value={5 + '&' + index}>5</Option>
              </Select>
              <span>位小数</span>
            </div>
          )
          break;
        case 7:
          secondSelfDefinedFILE = (
            <div>
              <Select
                value={item.attrs.relation_type + '&' + index}
                style={{ minWidth: 70 }} onChange={this.changeRelateFile}>
                {
                  RelationTypes.map((item, i) => {
                    return (
                      <Option value={item.value + '&' + index} key={i} title={item.name}>{item.name}</Option>
                    )
                  })
                }
              </Select>
              <Select
                value={
                  item.attrs.relation_col ?
                    item.attrs.relation_col + '&' + index :
                    item.attrs.relation_type === 1 ? fields_template_1_useful[0].defid + '&' + index :
                      item.attrs.relation_type === 2 ? fields_template_2_useful[0].defid + '&' + index :
                        item.attrs.relation_type === 4 ? fields_template_4_useful[0].defid + '&' + index :
                          item.attrs.relation_type === 5 ? fields_template_5_useful[0].defid + '&' + index :
                            item.attrs.relation_type === 6 ? fields_template_6_useful[0].defid + '&' + index :
                              item.attrs.relation_type === 11 ? fields_template_11_useful[0].defid + '&' + index :
                                item.attrs.relation_type === 13 ? fields_template_13_useful[0].defid + '&' + index :
                                  item.attrs.relation_type === 16 ? fields_template_16_useful[0].defid + '&' + index : ''
                }
                style={{ minWidth: 70 }}
                onChange={this.changeRelationsSelectThird}
              >
                {
                  item.attrs.relation_type === 1 ?
                    fields_template_1_useful.map((item, i) => {
                      return (
                        <Option value={item.defid + '&' + index} key={i} title={item.name}>{item.name}</Option>
                      )

                    }) : item.attrs.relation_type === 2 ?
                      fields_template_2_useful.map((item, i) => {
                        return (
                          <Option value={item.defid + '&' + index} key={i} title={item.name}>{item.name}</Option>
                        )

                      }) : item.attrs.relation_type === 4 ?
                        fields_template_4_useful.map((item, i) => {
                          return (
                            <Option value={item.defid + '&' + index} key={i} title={item.name}>{item.name}</Option>
                          )

                        }) : item.attrs.relation_type === 5 ?
                          fields_template_5_useful.map((item, i) => {
                            return (
                              <Option value={item.defid + '&' + index} key={i} title={item.name}>{item.name}</Option>
                            )

                          }) : item.attrs.relation_type === 6 ?
                            fields_template_6_useful.map((item, i) => {
                              return (
                                <Option value={item.defid + '&' + index} key={i} title={item.name}>{item.name}</Option>
                              )

                            }) : item.attrs.relation_type === 11 ?
                              fields_template_11_useful.map((item, i) => {
                                return (
                                  <Option value={item.defid + '&' + index} key={i} title={item.name}>{item.name}</Option>
                                )

                              }) : item.attrs.relation_type === 13 ?
                                fields_template_13_useful.map((item, i) => {
                                  return (
                                    <Option value={item.defid + '&' + index} key={i} title={item.name}>{item.name}</Option>
                                  )

                                }) : item.attrs.relation_type === 16 ?
                                  fields_template_16_useful.map((item, i) => {
                                    return (
                                      <Option value={item.defid + '&' + index} key={i} title={item.name}>{item.name}</Option>
                                    )
                                  }) : null
                }

              </Select>
            </div>
          )
          break;
        case 11:
          secondSelfDefinedSelfFILE = (
            <div>
              {
                fakeSelfDefineFileData.length === 0?(
                  <Select style={{ minWidth: 85  ,width:160}}
                    value='1'>
                    <Option title='暂无自定义档案可选' value='1'>暂无自定义档案可选</Option>
                  </Select>
                ):(
                  <Select style={{ minWidth: 85 ,width:160}}
                    onChange={this.changeSelfDefinedFIle}
                    value={item.attrs.custom_objectid === undefined && item.attrs.relation_col === undefined? fakeSelfDefineFileData[0].id + '&' + fakeSelfDefineFileData[0].field_data.defid + '&' + index:item.attrs.custom_objectid + '&' + item.attrs.relation_col + '&' + index}>
                    {
                      fakeSelfDefineFileData.map((item, i) => {
                        return (
                          <Option value={item.id + '&' + item.field_data.defid + '&' + index}
                            key={i} title={item.name}>{item.name}</Option>
                        )
                      })
                    }
                  </Select>
                )
              }
            </div>
          )
          break;
        default:
          secondSelfDefined = null
          break;
      }
      item.secondSelfDefinedNode = secondSelfDefined
      item.secondSelfDefinedNUM = secondSelfDefinedNUM
      item.secondSelfDefinedFILE = secondSelfDefinedFILE
      item.secondSelfDefinedSelfFILE = secondSelfDefinedSelfFILE
      return item
    })

    return (
      <div className='highBillingSettingArea' >
        {
          /*<div className='highBillingSettingInfo'>
            <span style={{ width: 80 }}>显示内容</span>
            <span style={{ width: 85 }}>数据类型</span>
            <span style={{ width: 150 }}>自定义档案</span>
          </div>*/
        }
        <div className='billingHighConWrap' style={{ height: clientHeight - 220 }}>
          <span className = 'choose-remark'>勾选至详情区域</span>
          <ul className='list-container'>
            <li className='list-choose-all'>
              <span className='check-all' style={{ marginRight: 10 }}>
                <Checkbox checked={selectHighAll}
                  onChange={this.handleHighSeletAll}>
                </Checkbox>
              </span>
              <span >全选</span>
            </li>
            {
              hightBillSettingData.map((item, index) => {
                return (
                  <li key={index} className='list-item'>
                    <span className='item-checkbox' style={{ marginRight: 10 }}>
                        <Checkbox
                            checked={item.isChecked}
                            onChange={(e) => { this.changeSettinghighCheckbox(e, index) }}>
                        </Checkbox>
                    </span>
                    <div className='item-content'>
                        <div className='billingHighSettingSpan'>{item.name}</div>
                        <div className='item-remark'>
                            <div>
                                <Select
                            style={{ minWidth: 80,width:100}}
                            onChange={this.handleChangeFirstSelect}
                            value={item.typeid + '&' + index}
                            >
                            {
                                FieldTypes.map((item, i) => {
                                    return (
                                        <Option value={item.value + '&' + index} key={i}>{item.name}</Option>
                                    )
                                })
                            }
                            </Select>
                            </div>
                        <div>
                            {item.secondSelfDefined}
                            {item.secondSelfDefinedNUM}
                            {item.secondSelfDefinedFILE}
                            {item.secondSelfDefinedSelfFILE}
                        </div>
                        </div>
                    </div>
                </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

