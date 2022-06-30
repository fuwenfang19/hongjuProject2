/**
 * Created by fuwenfang on 3/29/17.
 * 公司信息
 */

import React, { Component } from 'react';
import { Button, Row, Col, Input, DatePicker, Select, Icon, Tooltip, Progress } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import companyInforActions from '../../../actions';
import { changeLeftMenuSelected } from '../../../actions';
import NetWork from '../../../global/utils/network';
import getQueryString from '../../../global/utils/getQueryString';
import { Confirm, Toast } from '../../common'
import uuid from 'uuid';
import Lightbox from 'react-image-lightbox';
import { NewUserIntroduce } from '../../common'

const Option = Select.Option;
let islogoSrc = false
class CompanyInfo extends Component {
  constructor() {
    super();
    this.state = {
      photoIndex: 0,
      isOpen: false,
      logoSrc: '/organization/getlogo/'
    }
  }
  recover = () => {

  }
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(companyInforActions.getCompanyInfor())
    //加新手引导 判断是否引导过
    setTimeout(() => {
      this.handleIsUserIntroduced()
      //this.userIntroduce()
    }, 500)
    this.updateImgSrc()
  }
  updateImgSrc = () => {
    const logoSrc = this.state.logoSrc
    const onErrorSrc = require('../../../images/companyInfor/Logo.png')
    const img = new Image();
    img.src = '/organization/getlogo/' + `?${uuid.v4()}`;
    img.onload = () => {
      this.setState({
        logoSrc: '/organization/getlogo/'
      })
    }
    img.onerror = () => {
      this.setState({
        logoSrc: onErrorSrc
      }, () => {
        //console.log(this.state.logoSrc)
      })
    }
  }
  handleIsUserIntroduced = () => {
    const that = this
    let uid = window.getUserInfo().uid
    let url = '/organization/getguidemessage/' + uid + '/'
    NetWork.get(url,
      (returnData) => {
        //记录在window.userIntroduceData全局里
        window.instroduceData = returnData
        const companyInforData = returnData.companyInfor ? returnData.companyInfor.dataInstroduce : 0
        if (!companyInforData) {
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
    const target1 = document.getElementsByClassName('uploadLogoDiv')[0]
    const target2 = document.getElementsByClassName('ant-btn-primary')[1]
    const userIntro = [{
      element: target1,
      info: { titlePic: '', remark: '' }, picUrl: 'uoploadLogo', arrow: 0
    },
    { element: target2, info: { titlePic: '_commitCheck', remark: '' }, picUrl: '', arrow: 2 }]
    setTimeout(() => {
      NewUserIntroduce.userIntroduce(this.userIntroduceOver, userIntro)
    }, 1000)
  }
  userIntroduceOver = () => {
    //请求接口  写入已引导结束的标志
    let instroduceData = window.instroduceData
    instroduceData.companyInfor = { 'nodataInstroduce': 0, 'dataInstroduce': 1 }
    let uid = window.getUserInfo().uid
    NetWork.put('/organization/addguidemessage/' + uid + '/', instroduceData,
      (returnData) => {

      },
      (returnData) => {
        Toast.error(returnData.msg);
      });
  }
  clickEditBtn = () => {
    const { dispatch, $$companyInforState } = this.props
    const companyInfor = $$companyInforState.toJS().companyInfor
    const isComplete = companyInfor.isComplete
    if (!isComplete) {
      //
      return
    }
    dispatch(companyInforActions.clickEditBtn())
  }
  //上传logo
  uploadLogo = () => {
    const that = this
    const { dispatch } = that.props
    Confirm({
      title: '上传logo',
      isUpload: true,
      multiple: false,
      showUploadList: true,
      uploadConfig: {
        url: NetWork.getUrl('/organization/uploadcompanyimg/'),//上传的url
        data: { isLogo: true },//上传时需要的参数
        accept: '.png,.jpg',//接收的文件类型 
        warningText: '推荐尺寸：500*500'
      },
      onFileUploadSuccess: (response) => {//返回的是上传结束后的response
        //dispatch(companyInforActions.getCompanyLogo())
        Toast.success('上传成功！')
        this.updateImgSrc()
        this.forceUpdate();
        setTimeout(() => {
          //document.getElementsByClassName('ant-modal-close')[0].click();
        }, 300)
      },
      onOk: () => {
        this.updateImgSrc()
        setTimeout(() => {
          this.forceUpdate();
        }, 300)
      },
      onCancel: () => {
        this.updateImgSrc()
        setTimeout(() => {
          this.forceUpdate();
        }, 300)
      }
    });
  }
  //上传资质图片
  uploadPictures = () => {
    const that = this
    const { dispatch, $$companyInforState } = that.props
    const company_documents = $$companyInforState.toJS().companyInfor.company_documents
    if (company_documents.length >= 3) {
      Toast.error('您最多可上传3张资质图片！')
      return
    }
    Confirm({
      title: '上传税务登记证',
      isUpload: true,
      showUploadList: true,
      uploadConfig: {
        url: NetWork.getUrl('/organization/uploadcompanyimg/'),//上传的url
        data: {},//上传时需要的参数
        accept: '.png,.jpg',//接收的文件类型 
      },
      onFileUploadSuccess: (response) => {//返回的是上传结束后的response
        let company_documents_new = company_documents.concat([{ info: "", id: response }])
        console.log(response)
        dispatch(companyInforActions.addUploadPic(company_documents_new))
        Toast.success('上传成功！')
        this.forceUpdate();
        setTimeout(() => {
          //console.log(document.getElementsByClassName('ant-modal-close')[0])
          //document.getElementsByClassName('ant-modal-close')[0].click()
        }, 300)
      },
      onFileUploading: (percent) => {//参数是百分比 纯数字
        //console.log(percent)
      },
      onOk: () => {
        this.forceUpdate();
      },
      onCancel: () => {
        this.forceUpdate();
      }
    });
  }
  //删除资质图片
  deletetaxPic = (e, i) => {
    const { $$companyInforState, dispatch } = this.props
    let company_documents = $$companyInforState.toJS().companyInfor.company_documents.concat()
    let picID = company_documents[i].id
    Confirm({
      title: '删除图片',
      content: {
        message: '您确定要删除吗？',
        explain: '',
        highLightText: '',
      },
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        company_documents.splice(i, 1)
        //删除接口
        dispatch(companyInforActions.deletetaxPicInterface(picID, company_documents))
      },
      onCancel: () => {
      }
    });
  }
  //提交核验
  submitCheck = () => {
    const { $$companyInforState, dispatch } = this.props
    let companyInfor = $$companyInforState.toJS().companyInfor
    delete companyInfor.isComplete
    companyInfor.checkStatus = 1
    let parentId = companyInfor.parent?companyInfor.parent.id:null
    companyInfor.parent = parentId
    dispatch(companyInforActions.submitCheck(companyInfor))
  }
  //取消(已上传图片以及已删除图片无法恢复)
  clickCancle = () => {
    const { $$companyInforState, dispatch } = this.props
    const isComplete = $$companyInforState.toJS().companyInfor.isComplete
    let initCompanyInfor = $$companyInforState.toJS().initCompanyInfor
    initCompanyInfor.isComplete = true
    dispatch(companyInforActions.clickCancle(initCompanyInfor))
    //this.forceUpdate();
  }
  //修改公司名称
  changeCompanyInfor = (e, type) => {
    const { value } = e.target;
    const { dispatch } = this.props
    dispatch(companyInforActions.changeCompanyInfor(value, type))
  }
  //修改行业
  changeIndustry = (value) => {
    const { dispatch } = this.props
    dispatch(companyInforActions.changeCompanyInfor(value, 'Industry'))
  }
  //修改纳税人
  changeTaxPayerType = (value) => {
    const { dispatch } = this.props
    dispatch(companyInforActions.changeCompanyInfor(value * 1, 'taxPayerType'))
  }
  //修改创建时间
  changeCreateTime = (date, dateString) => {
    const { dispatch } = this.props
    dispatch(companyInforActions.changeCompanyInfor(dateString, 'createTime'))
  }
  //保存
  saveCompanyInfor = () => {
    const { dispatch, $$companyInforState } = this.props
    let companyInfor = $$companyInforState.toJS().companyInfor
    const companyName = companyInfor.name
    if (companyName === '') {
      Toast.error('请您填写公司全称！')
      return
    }
    let parentId = companyInfor.parent?companyInfor.parent.id:null
    companyInfor.parent = parentId
    delete companyInfor.isComplete
    dispatch(companyInforActions.saveCompanyInfor(companyInfor))
  }
  //返回首页
  goBackHomepage = () => {
    try {
      window.location.hash = '#/homePage?guide=true'
      this.props.dispatch(changeLeftMenuSelected('homePage'))
    } catch (e) {

    }
  }
  render() {
    const { $$companyInforState } = this.props
    const companyInfor = $$companyInforState.toJS().companyInfor
    const isComplete = companyInfor.isComplete
    const isEdit = $$companyInforState.toJS().isEdit
    let logoSrc = this.state.logoSrc
    //console.log(logoSrc)
    if (logoSrc === '/organization/getlogo/') {
      logoSrc = '/organization/getlogo/' + `?${uuid.v4()}`
    }
    const company_documents = companyInfor.company_documents
    const {
            photoIndex,
      isOpen,
        } = this.state;
    const images = []
    company_documents.map((item, i) => {
      images.push('/organization/companyimg/' + item.id + '/')
    })
    //console.log(company_documents)
    const isFromHomepage = getQueryString('isFromHomepage')
    return (
      <div className="companyInfo-page page">
        <div className='content-right'>
          <div className='content-right-head companyInforHead'>
            <div className='head-left'>公司信息</div>
            {
              isComplete ? (
                <div className='head-right'>
                  <span style={{ marginRight: 18 }}>{companyInfor.status === '正常' ? '启用' : '停用'}</span>
                  <Button type='primary' onClick={this.clickEditBtn}>编辑</Button>
                  <Button type='primary'
                    disabled={!([-1, 0].indexOf(companyInfor.checkStatus + 0) !== -1 && companyInfor.company_documents.length !== 0)}
                    onClick={this.submitCheck}
                  >提交核验</Button>
                </div>
              ) : (
                  <div className='head-right'>
                    <span style={{ marginRight: 18 }}>{companyInfor.status === '正常' ? '启用' : '停用'}</span>
                    {
                      isEdit ? (<Button type="default" onClick={this.clickCancle}>取消</Button>) : null
                    }
                    <Button type='primary' onClick={this.saveCompanyInfor} disabled={!isEdit}>保存</Button>
                    <Button type='primary' disabled={!([-1, 0].indexOf(companyInfor.checkStatus + 0) !== -1 && companyInfor.company_documents.length !== 0)} onClick={this.submitCheck}>提交核验</Button>
                  </div>
                )
            }
          </div>
          <div className='companyInfoBody'>
            <Row type="flex" justify="space-between" align="middle">
              <Col span={11}>
                <Row type="flex" justify="space-between">
                  <Col span={5}><span className='companyName' style={{ display: 'inline-block' }}>公司全称<span className='require-star'>*</span></span></Col>
                  <Col span={19}>
                    {
                      isComplete ? (<div className='companyInforName' title={companyInfor.name}>{companyInfor.name}</div>) :
                        <Input value={companyInfor.name}
                          onChange={(e) => { this.changeCompanyInfor(e, 'name') }} />
                    }
                  </Col>
                </Row>
                <Row type="flex" justify="space-between">
                  <Col span={5}><span>企业编码</span></Col>
                  <Col span={19}>
                    {
                      isComplete ? (<div>{companyInfor.code}</div>) :
                        <Input value={companyInfor.code} readOnly disabled />
                    }
                  </Col>
                </Row>
                <Row type="flex" justify="space-between">
                  <Col span={5}><span>所属行业</span></Col>
                  <Col span={19}>
                    {
                      isComplete ? (<div>{companyInfor.Industry}</div>) :
                        (<Select value={companyInfor.Industry} style={{ width: 312 }}
                          onChange={this.changeIndustry}
                        >
                          <Option value="离散制造">离散制造</Option>
                          <Option value="流程制造">流程制造</Option>
                          <Option value="装备制造">装备制造</Option>
                          <Option value="流通">流通</Option>
                          <Option value="零售">零售</Option>
                          <Option value="服务">服务</Option>
                          <Option value="金融">金融</Option>
                          <Option value="建筑">建筑</Option>
                          <Option value="房地产">房地产</Option>
                          <Option value="烟草">烟草</Option>
                          <Option value="政府/机构">政府/机构</Option>
                          <Option value="教育/科研">教育/科研</Option>
                          <Option value="电力">电力</Option>
                          <Option value="交通">交通</Option>
                          <Option value="医疗卫生">医疗卫生</Option>
                          <Option value="公共设施">公共设施</Option>
                          <Option value="其他">其他</Option>
                        </Select>)
                    }
                  </Col>
                </Row>
                <Row type="flex" justify="space-between">
                  <Col span={5}><span>公司地址</span></Col>
                  <Col span={19}>
                    {
                      isComplete ? (<div className='companyAddress' title={companyInfor.address}>{companyInfor.address}</div>) :
                        <Input value={companyInfor.address}
                          onChange={(e) => { this.changeCompanyInfor(e, 'address') }}
                        />
                    }
                  </Col>
                </Row>
                <Row type="flex" justify="space-between">
                  <Col span={5}><span>创建时间</span></Col>
                  <Col span={19}>
                    {
                      isComplete ? (<div>{companyInfor.createTime}</div>) :
                        <div style={{ width: 312 }}>
                          <DatePicker value={moment(companyInfor.createTime, 'YYYY-MM-DD')}
                            onChange={this.changeCreateTime} disabled
                          />
                        </div>
                    }
                  </Col>
                </Row>
              </Col>
              <Col span={11}>
                <Row type="flex" justify="space-between" className='uploadLogo'>
                  <div className='uploadLogoDiv'>
                    <Col span={5} style={{ width: '45%' }}><span className='companyLogoSpan'>公司logo</span></Col>
                    <Col span={19} style={{ width: '55%' }}>
                      {
                        isComplete ? (<div className='companyLogo'>
                          <img src={logoSrc} className='uploadLogoDivImg' width='72' height='72' />
                        </div>) : (
                            <div className='uploadLogoBtn'>
                              <img src={logoSrc} className='uploadLogoDivImg' width='72' height='72' />
                              <span className='uploadLogoSpan' onClick={this.uploadLogo}>上传logo</span>
                            </div>
                          )
                      }
                    </Col>
                  </div>
                </Row>
                <Row type="flex" justify="space-between">
                  <Col span={5}><span>上级公司</span></Col>
                  <Col span={19}>
                    {
                      isComplete ? (<div>{companyInfor.parent ? companyInfor.parent.name : '无'}</div>) :
                        <Input value={companyInfor.parent ? companyInfor.parent.name : '无'} readOnly disabled />
                    }
                  </Col>
                </Row>
                <Row type="flex" justify="space-between">
                  <Col span={5}><span>联系电话</span></Col>
                  <Col span={19}>
                    {
                      isComplete ? (<div>{companyInfor.phone}</div>) :
                        <Input value={companyInfor.phone}
                          onChange={(e) => { this.changeCompanyInfor(e, 'phone') }}
                        />
                    }
                  </Col>
                </Row>
                {
                  companyInfor.status == '停用' ? (
                    <Row type="flex" justify="space-between">
                      <Col span={5}><span>停用时间</span></Col>
                      <Col span={19}>
                        {
                          isComplete ? (<div></div>) :
                            <div style={{ width: 312 }}>
                              <DatePicker format="YYYY-MM-DD" disabled placeholder='' />
                            </div>
                        }
                      </Col>
                    </Row>
                  ) : (<Row type="flex" justify="space-between">
                    <Col span={5}><span></span></Col>
                    <Col span={19}></Col>
                  </Row>)
                }
              </Col>
            </Row>
            <div className='billInfoBody'>
              <div className='billInfoBodyTitle'>开票信息</div>
              <Row type="flex" justify="space-between" align="middle">
                <Col span={11}>
                  <Row type="flex" justify="space-between">
                    <Col span={5}><span>纳税人类型</span></Col>
                    <Col span={19}>
                      {
                        isComplete ? (<div>{companyInfor.taxPayerType*1 === 0 ? "一般纳税人" : companyInfor.taxPayerType*1 === 1?'小规模纳税人':''}</div>) :
                          (<Select value={companyInfor.taxPayerType!==null?companyInfor.taxPayerType + '':''} style={{ width: 312 }}
                            onChange={this.changeTaxPayerType}
                          >
                            <Option value='0'>一般纳税人</Option>
                            <Option value='1'>小规模纳税人</Option>
                          </Select>)
                      }
                    </Col>
                  </Row>
                  <Row type="flex" justify="space-between">
                    <Col span={5}><span>开户行</span></Col>
                    <Col span={19}>
                      {
                        isComplete ? (<div>{companyInfor.bankName}</div>) :
                          <Input value={companyInfor.bankName}
                            onChange={(e) => { this.changeCompanyInfor(e, 'bankName') }}
                          />
                      }
                    </Col>
                  </Row>
                </Col>
                <Col span={11}>
                  <Row type="flex" justify="space-between">
                    <Col span={5}><span className='companyTaxIdentifyNumber'>纳税识别号</span></Col>
                    <Col span={19}>
                      {
                        isComplete ? (<div>{companyInfor.taxIdentifyNumber}</div>) :
                          <Input value={companyInfor.taxIdentifyNumber}
                            onChange={(e) => { this.changeCompanyInfor(e, 'taxIdentifyNumber') }}
                          />
                      }
                    </Col>
                  </Row>
                  <Row type="flex" justify="space-between">
                    <Col span={5}><span>银行账号</span></Col>
                    <Col span={19}>
                      {
                        isComplete ? (<div>{companyInfor.bankAccount}</div>) :
                          <Input value={companyInfor.bankAccount}
                            onChange={(e) => { this.changeCompanyInfor(e, 'bankAccount') }}
                          />
                      }
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row type="flex" justify="flex-start">
                <Col span={2}><span>上传图片</span></Col>
                <Col span={20}>
                  {
                    isComplete ? (<div>
                      {
                        company_documents.map((item, i) => {
                          return (
                            <span key={i} className='taxPicWrap'
                              onClick={() => this.setState({ isOpen: true, photoIndex: i })}
                            >
                              <img src={'/organization/companyimg/' + item.id + '/'} width='100%' height='100%' />
                              {isOpen &&
                                <Lightbox
                                  mainSrc={images[photoIndex]}
                                  nextSrc={images[(photoIndex + 1) % images.length]}
                                  prevSrc={images[(photoIndex + images.length - 1) % images.length]}

                                  onCloseRequest={() => this.setState({ isOpen: false })}
                                  onMovePrevRequest={() => this.setState({
                                    photoIndex: (photoIndex + images.length - 1) % images.length,
                                  })}
                                  onMoveNextRequest={() => this.setState({
                                    photoIndex: (photoIndex + 1) % images.length,
                                  })}
                                />
                              }
                            </span>
                          )
                        })
                      }
                    </div>) : (<div>
                      <div style={{ marginTop: -5 }}>
                        <Button type='primary' className='uploadPicBtn' onClick={this.uploadPictures}>上传税务登记证</Button>
                        <Tooltip placement="top" title={<span >请上传税务登记证书，并提交核验</span>} trigger='click'>
                          <Icon type="exclamation-circle-o" />
                        </Tooltip>
                      </div>
                      <div>
                        {
                          company_documents.map((item, i) => {
                            return (
                              <span className='taxPicWrap' key={i}>
                                <img src={'/organization/companyimg/' + item.id + '/'} width='100%' height='100%' />
                                {isOpen &&
                                  <Lightbox
                                    mainSrc={images[photoIndex]}
                                    nextSrc={images[(photoIndex + 1) % images.length]}
                                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                                    onCloseRequest={() => this.setState({ isOpen: false })}
                                    onMovePrevRequest={() => this.setState({
                                      photoIndex: (photoIndex + images.length - 1) % images.length,
                                    })}
                                    onMoveNextRequest={() => this.setState({
                                      photoIndex: (photoIndex + 1) % images.length,
                                    })}
                                  />
                                }
                                <span className='deleteCross'
                                  onClick={(e) => { this.deletetaxPic(e, i) }}><Icon type="close" /></span>
                              </span>
                            )
                          })
                        }
                      </div>
                    </div>)
                  }
                </Col>
              </Row>
            </div>
          </div>
          {
            isFromHomepage ? (
              <div className='backToHomepage' onClick={this.goBackHomepage}>返回新手引导</div>
            ) : null
          }
        </div>
      </div>
    )
  }
}
function companyInfoStateToProps(state) {
  return {
    $$companyInforState: state.get('companyInforState')
  }
}

export default connect(companyInfoStateToProps)(CompanyInfo);
