/**
 * Created by yangyfe on 2017/4/5.
 * 首页
 */
import React, { Component } from 'react';
import {Carousel,Table,Button,Icon,Modal,Radio,Select} from 'antd';
import domUtil from '../../global/utils/domutil';
import * as types from '../../actions/actionTypes';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {getDepartmentStaffsById,homeDepartmentInvite,homePageSelect,getCompany} from '../../reducers/homePage/homePageReducer';
import NetWork from '../../global/utils/network';
import { changeLeftMenuSelected } from '../../actions';
import getQueryString from '../../global/utils/getQueryString';

import entranceImg from '../../images/homePage/entrance.png';
import lunBo1 from '../../images/homePage/lun1.png';
import lunBo2 from '../../images/homePage/lun2.png';
import lunBo3 from '../../images/homePage/lun3.png';
import head from '../../images/homePage/head.png';
import im from '../../images/homePage/im.png';
import hang from '../../images/homePage/hang.png';

const RadioGroup = Radio.Group;
const Option = Select.Option;

class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            selectedRowKeys: [],  // Check here to configure the default column
            loading: false,
            visible: false,
        };
    }
    componentDidMount() {
        this.start;
        this.props.getCompany();
        const guide = getQueryString('guide') ;
        if(guide){
	        this.props.dispatch({
		        type:types.HOMEPAGE_GO_XIN,
		        payload:guide !== 'true'
	        })
        }

    }
    componentWillMount() {
        this.props.getDepartmentStaffsById('正常');


    }
    start = () => {
        this.setState({loading: false});
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 100);
    }
    //跳转到新手引导
    xin = () =>{
    	window.location.hash = '#/homePage?guide=true';
        this.props.dispatch({
            type:types.HOMEPAGE_GO_XIN,
            payload:false
        })
    }
    //返回到首页
    sou = () =>{
        this.props.dispatch({
            type:types.HOMEPAGE_GO_SOU,
            payload:true
        })
    }
    //跳转到company_info
    goCompanyInfo = () =>{
        window.location.hash="#/company_info?isFromHomepage=1";
        this.props.dispatch(changeLeftMenuSelected('company_info'))
        this.sou();
    }
    //跳转到部门department
    goDepartment = () =>{
        window.location.hash="#/department?isFromHomepage=1";
        this.props.dispatch(changeLeftMenuSelected('department'))
        this.sou();
    }
    //跳转到billingSetting
    goBillingSetting = () =>{
        window.location.hash="#/billingSetting?isFromHomepage=1";
        this.props.dispatch(changeLeftMenuSelected('billingSetting'))
        this.sou();
    }
    //跳转到workflow
    goWorkflow = () =>{
        window.location.hash="#/workflow?isFromHomepage=1";
        this.props.dispatch(changeLeftMenuSelected('billingSetting'))
        this.sou();
    }

    //人员列表的选择
    onSelectChange = (selectedRowKeys)=> {
        this.setState({selectedRowKeys});
    }
    //邀请人员
    homeDepartmentInvite = (staffids) => {
        this.props.homeDepartmentInvite(staffids)
    }

    //弹窗选择
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    //put行业信息
    putSelect = (industry) =>{
        this.props.homePageSelect(industry)
    }
    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 0);
        this.props.dispatch({
            type: types.CHANGE_CLICK,
            payload: true
        })
        this.putSelect(this.props.value);
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    // //单选
    // onChange = (e) => {
    //     this.setState({
    //         value: e.target.value,
    //     });
    // }
    // 单选框的选择
    changeRadio = (value) => {
        this.props.dispatch({
            type: types.CHANGE_RADIO,
            payload: value
        })
    }
    render() {
        //让table自适应高度
        let offset = null;
        const tableHeaderHeight = 20;
        if (this.refs.membersTable) {
            offset = domUtil.getElementOffSet(this.refs.membersTable);
        }
        const tableConfig = {
            pagination: false,
            scroll: {
                x: false,
                y: this.props.clientHeight - (offset ? offset.top + tableHeaderHeight + tableHeaderHeight + 8 : 400)
            },
            expandedRowRender: false
        };
        const columns = [
            {
                title: '成员编码',
                dataIndex: 'code',
                width: 100
            }, {
                title: '成员姓名',
                dataIndex: 'name',
                width: 100
            }, {
                title: '岗位',
                dataIndex: 'positionname',
                width: 100
            }, {
                title: '上级主管',
                dataIndex: 'parentname',
                width: 100
            }, {
                title: '部门',
                dataIndex: 'departmentname',
                width: 100
            }, {
                title: '账号状态',
                dataIndex: 'inviteStatus',
                width: 100

            }
        ];
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        //复选框选中的交互随复选框是否选中的交互
        let currentClassName = '';
        const hasSelected = selectedRowKeys.length > 0;
        if (hasSelected > 0) {
            currentClassName = "homePage-body-left-show";
        } else {
            currentClassName = "homePage-body-left-hide";
        }
        return (
            <div className="page homePage">
                {
                    this.props.sou == true?<div className="content-right">
                        <div className="homePage-head">
                            <img className="homePage-head-left" src={entranceImg} onClick={this.xin}></img>
                            <span className="homePage-head-right">
                          <Carousel autoplay>
                            <div style={{background:'#00c0ff'}}><img src={lunBo1} style={{display:'block',margin:'0 auto'}}/></div>
                            <div style={{background:'#51c210'}}><img src={lunBo2} style={{display:'block',margin:'0 auto'}}/></div>
                            <div style={{background:'#00c3d1'}}><img src={lunBo3} style={{display:'block',margin:'0 auto'}}/></div>
                          </Carousel>
                        </span>

                        </div>
                        <div className="homePage-body">
                            <div className="homePage-body-left">
                                <div className={currentClassName}>
                                    <div className="homePage-body-left-head">
                                        <div className="homePage-body-left-head-left">
                                            <Button type="primary" onClick={this.start}
                                                    disabled={!hasSelected}
                                            >取消选择</Button>
                                            <span style={{marginLeft: 8}}>{hasSelected ? `选择了 ${selectedRowKeys.length} 个成员` : ''}</span>
                                        </div>
                                        <div className="homePage-body-left-head-right">
                                            <span className="homePage-body-left-head-right-marg" onClick={this.homeDepartmentInvite.bind(this, selectedRowKeys)}>
                                                <Icon type="user" />
                                                邀请
                                            </span>
                                        </div>
                                    </div>

                                    <div className="homePage-body-left-head1">
                                        发放企业微财务账号
                                        {
                                            this.props.currentDepartmentStaffs.total>100?
                                                <div onClick={this.goDepartment} className="homePage-body-left-head1-department">进入部门成员</div>
                                                :
                                                ''
                                        }
                                    </div>
                                </div>
                                <Table
                                    {...tableConfig}
                                    columns={columns}
                                    dataSource={this.props.currentDepartmentStaffs.rows}
                                    rowKey={(record) => {
                                        return record.id;
                                    }}
                                    rowSelection={rowSelection}

                                />
                            </div>
                            <div className="homePage-body-right">
                                <div className="homePage-body-right-ke">
                                    <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=3073758318&site=qq&menu=yes"
                                    ><img
                                          src={im}
                                          alt="点击这里给我发消息"
                                          title="点击这里给我发消息"/></a>
                                </div>
                            </div>
                        </div>
                    </div>
                :
                    <div className="content-right beginnerGuide">
                        <div className="beginnerGuide-head">
                            <span onClick={() =>{
	                            window.location.hash="#/homePage";this.sou();
                            }
                            } style={{cursor:'pointer'}}>首页&nbsp;</span>
                            >
                            <span>&nbsp;欢迎来到新手引导</span>
                        </div>
                        <div className="beginnerGuide-body">
                            <div className="beginnerGuide-body-left">
                                <div className="beginnerGuide-body-left1">
                                    <img src={head}/>
                                </div>
                                <div className="beginnerGuide-body-left3">
                                    <span>为了让您快速上手微财务系统配置，请按照我们提示的步骤进行操作,将给您带来全新的配置体验感受：</span>
                                </div>
                                <div className="beginnerGuide-body-left4">
                                    <div className="lump1" onClick={this.showModal} style={{position:'relative'}}>
                                        <div className="lump1-1">
                                            <div className="lump1-1-1" style={{backgroundColor:'#ed7140'}}>1</div>
                                        </div>
                                        {this.props.value!=null?<Icon type="check" style={{position:'absolute',right:'0px',top:'0px',width:'22px',height:'22px',color:'#ed7140'}}/>:''}
                                        <div className="lump1-2"><p>请选择您的所属行业</p><p style={{
                                            fontSize:'18px',
                                            color:'#449ff7',
                                            letterSpacing:'0px',
                                        }}>{this.props.value}</p></div>
                                    </div>
                                    <Modal
                                        visible={this.state.visible}
                                        title="请选择您的所属行业"
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                        footer={[
                                            <Button key="submit" type="primary" size="large" style={{width:'330px',height:'38px',marginBottom:'30px'}} loading={this.state.loading} onClick={this.handleOk}>
                                                确定
                                            </Button>,
                                        ]}
                                    >
                                        <div className="modal1" style={{textAlign:'center'}}>
                                            <img src={hang}/>
                                        </div>
                                        <div className="modal2" style={{margin:'0 100px'}}><p style={{
                                            fontSize:'14px',
                                            color:'#9b9b9b',
                                            lineHeight:'20px',
                                            textAlign:'left',
                                            width:'300px',
                                            marginTop:'12px'
                                        }}>选择您的所属行业，我们将为您定制适合您行业特性的产品。</p></div>
                                        <div className="modal3" style={{height:'50px',lineHeight:'50px',margin:'0 100px'}}>
                                            <Select value={this.props.value} style={{ width: 312 }}
                                                    onChange={this.changeRadio}
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
                                            </Select>
                                        </div>
                                        <div className="modal4" style={{
                                            fontSize:'12px',
                                            color:'#ed7140',
                                            letterSpacing:'-0.29px',
                                            margin:'0 100px'
                                        }}>注：请谨慎选择行业，选择好后不可修改哟！</div>
                                    </Modal>
                                    <div onClick={this.goCompanyInfo} className="lump2">
                                        <div className="lump1-1">
                                            <div className="lump1-1-1" style={{background:'#449ff7'}}>2</div>
                                        </div>
                                        <div className="lump1-2">请完善企业信息</div>
                                    </div>
                                    <div onClick={this.goDepartment} className="lump3">
                                        <div className="lump1-1">
                                            <div className="lump1-1-1" style={{background:'#ffb400'}}>3</div>
                                        </div>
                                        <div className="lump1-2">邀请成员加入企业</div>
                                    </div>
                                </div>
                                <div className="beginnerGuide-body-left5">
                                    <div onClick={this.goBillingSetting} className="lump4">
                                        <div className="lump1-1">
                                            <div className="lump1-1-1" style={{background:'#7ed321'}}>4</div>
                                        </div>
                                        <div className="lump1-2">设置单据信息</div>
                                    </div>
                                    <div onClick={this.goWorkflow} className="lump5">
                                        <div className="lump1-1">
                                            <div className="lump1-1-1" style={{background:'#ff607f'}}>5</div>
                                        </div>
                                        <div className="lump1-2">添加审批流</div>
                                    </div>
                                </div>
                            </div>
                            <div className="beginnerGuide-body-right">
                                <div className="beginnerGuide-body-right1">
                                    <p className="p1">微财务移动端</p>
                                    <p className="p2">页面相关文字介绍</p>
                                </div>
                                <div className="beginnerGuide-body-right2">
                                    <Carousel autoplay>
                                        <div className="img1"></div>
                                        <div className="img2"></div>
                                        <div className="img3"></div>
                                    </Carousel>
                                </div>
                                <div className="beginnerGuide-body-right3">
                                    <div className="foot-page"></div>
                                    <div className="">
                                        <div className=""></div>
                                        <div className=""></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                </div>
        );
    }
}
function mapStateToProps(state) {
    let homePageState = state.get('homePageState');
    let currentDepartmentStaffs = homePageState.get('currentDepartmentStaffs').toJS();
    let condition = homePageState.get('condition');
    let sou = homePageState.get('sou');
    let value = homePageState.get('value');
    return {
        currentDepartmentStaffs,
        condition,
        sou,
        value,
        clientHeight: state.get('baseState').toJS().clientHeight,
    };
}
function mapDispatchToProps(dispatch) {
    let method = {
        getDepartmentStaffsById,
        homeDepartmentInvite,
        homePageSelect,
        getCompany
    };
    let boundActionCreators = bindActionCreators(method, dispatch)
    return {
        ...boundActionCreators,
        dispatch
    };
 }
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
