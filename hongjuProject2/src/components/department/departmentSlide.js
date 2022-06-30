/**
 * Created by yangyfe on 2017/3/1.
 * 部门成员详情
 */


import React from 'react';
import Animate from 'rc-animate';
import {Icon, Col, Row, Button} from 'antd';
import Img from '../../images/department/edit.png';
import Code from '../../images/department/code.png';
import Phone from '../../images/department/phone.png';
import Dep from '../../images/department/department.png';
import Man from '../../images/department/man.png';
import Woman from '../../images/department/woman.png';
import Job from '../../images/department/job1.png';
import Next from '../../images/department/next.png';
import Prev from '../../images/department/prev.png';


// const img = {
//     backgroundRepeat: 'no-repeat',
//     backgroundSize: 'contain',
//     width: '30px',
//     height: '30px',
//     margin: '20px 0 0 0',
//     backgroundImage: `url(${Img})`
// }
const style = {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    width: '16px',
    height: '16px',
    margin: '0 6px 2px 0px',
}
export default class departmentSlide extends React.Component {
    constructor() {
        super();
        this.state = {
            level: 'basic',
            isHigherSetting: 0
        };
    }

    componentDidMount() {
    }

    show() {
        this.setState({
            visible: true,

        })
    }

    hide() {
        this.setState({
            visible: false
        })
    }

    CloseSlide = () => {
        this.hide()
    }
    // 编辑成员
    changeAddMembersFlagDepartment = (editMembersType) => {
        // this.props.onEditBeginMembers(editMembersType);
        this.props.changeAddMembersFlagDepartment(editMembersType);
    }
    //next
    nextDetail = () => {
        this.props.next()
    };
    //prev
    prevDetail = () => {
        this.props.prev()
    };

    render() {
        const currentDepartmentMemberDetails = this.props.currentDepartmentMemberDetails;
        const currentDepartmentMembers = this.props.currentDepartmentMembers;
        const pagenum = this.props.pagenum;
        return (
            <div>
                {this.state.visible == true ? <div className="modal-dv" style={{
                    height: "100%",
                    background: "rgba(0,0,0,.5)",
                    width: "100%",
                    position: "fixed",
                    right: "0px",
                    top: "0px",
                    zIndex: "5"
                }}></div> : null}
                <Animate transitionName="move-right">
                    {this.state.visible ? (
                        <div className="departmentSlideBg">
                            <div className="hideEvent" onClick={this.CloseSlide}></div>
                            {
                                <div className="departmentSlideCon">
                                    <div style={{height: '28%',background:'#2c2d46'}}>

                                        <div className="new_Slide_head" style={{height: '20%'}}>
                                            成员详情
                                            <span className="hide_new_task anticon anticon-close"
                                                  onClick={this.CloseSlide} style={{fontSize:'24px'}}></span>
                                            <div className="departmentSettingcon">
                                                {/*<span>*/}
                                                    {/*<img src={Job} style={style}/>*/}
                                                    {/*兼职*/}
                                                {/*</span>*/}
                                                <span onClick={this.changeAddMembersFlagDepartment.bind(this, 'editMembers')}>
                                                    <img src={Img} style={style}/>
                                                    编辑
                                                </span>
                                            </div>
                                        </div>
                                        <div className="departmentSlideContent1" style={{height: '40%'}}>
                                            <div className="departmentSlideContent1-left">
                                                <div
                                                    className="departmentSlideContent1-left-cirl">{currentDepartmentMemberDetails.name.slice(1)}</div>
                                            </div>
                                        </div>
                                        <div className="departmentSlideContent2"
                                             style={{height: '20%'}}>{currentDepartmentMemberDetails.name}</div>
                                        <div className="departmentSlideContent3" style={{height: '20%'}}>
                                                <span className="span1 span">
                                                    {
                                                        currentDepartmentMemberDetails.gender == '男'?
                                                            <img style={style} src={Man}></img>
                                                            :
                                                            <img style={style} src={Woman}></img>
                                                    }

                                                    {currentDepartmentMemberDetails.gender}
                                                </span>
                                            <span className="span2 span">
                                               <img style={style} src={Code}></img>
                                                {currentDepartmentMemberDetails.code}
                                            </span>
                                            <span className="span3 span">
                                                <img style={style} src={Phone}></img>
                                                {currentDepartmentMemberDetails.mobile}
                                            </span>
                                            <span className="span4 span">
                                                <img style={style} src={Dep}></img>
                                                {currentDepartmentMemberDetails.department && currentDepartmentMemberDetails.department.name }
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{height: '72%'}}>
                                        <Row gutter={16} style={{marginRight: '0px', marginLeft: '5%',marginTop:'3%'}}>
                                            {renderDeptInfoItem('上级主管', currentDepartmentMemberDetails.parent && currentDepartmentMemberDetails.parent.name, false)}
                                            {renderDeptInfoItem('岗位', currentDepartmentMemberDetails.position && currentDepartmentMemberDetails.position.name, false)}
                                            {renderDeptInfoItem('人员级别', currentDepartmentMemberDetails.personrank && currentDepartmentMemberDetails.personrank.name, false)}
                                            {renderDeptInfoItem('邮箱 ', currentDepartmentMemberDetails.email, false)}
                                            {renderDeptInfoItem('办公电话', currentDepartmentMemberDetails.phone, false)}
                                            {renderDeptInfoItem('身份证号', currentDepartmentMemberDetails.identification, false)}
                                            {renderDeptInfoItem('银行账号 ', currentDepartmentMemberDetails.bankAccount, false)}
                                            {renderDeptInfoItem('报销委托人', currentDepartmentMemberDetails.reportAgent && currentDepartmentMemberDetails.reportAgent.name, false)}
                                            {renderDeptInfoItem('工作地', currentDepartmentMemberDetails.workPlace && currentDepartmentMemberDetails.workPlace.name, false)}
                                            {renderDeptInfoItem('成员状态 ', currentDepartmentMemberDetails.status, false)}
                                            {renderDeptInfoItem('入职时间', currentDepartmentMemberDetails.startdate, false)}
                                            {renderDeptInfoItem('离职时间', currentDepartmentMemberDetails.enddate, false)}
                                        </Row>
                                        <div className="single-line"></div>
                                        <Row gutter={16} style={{marginRight: '0px', marginLeft: '5%'}}>
                                            {renderDeptInfoItem1('差旅申请单需审批', currentDepartmentMemberDetails.missionneedapproval === true ? "是" : "否", false)}
                                            {renderDeptInfoItem1('差旅申请单需填写 ', currentDepartmentMemberDetails.needfillapplication === true ? "是" : "否", false)}
                                            {renderDeptInfoItem1('手机号归企业所有', currentDepartmentMemberDetails.isCorpMobile === true ? "是" : "否", false)}
                                            {renderDeptInfoItem1('允许登录系统', currentDepartmentMemberDetails.systemusedstatus === '正常' ? '允许' : '禁止', false)}
                                        </Row>
                                        <div className="slider-button">
                                            <div className="slider-btn">
                                                {
                                                    pagenum == 1 ?
                                                        <Button disabled="currentDepartmentMemberDetails.id == null" ghost="true">
                                                            <img src={Prev}/>
                                                            <div>上一个</div>
                                                        </Button>
                                                         :
                                                         <Button onClick={this.prevDetail} ghost="true">
                                                            <img src={Prev}/>
                                                            <div>上一个</div>
                                                        </Button>
                                                }
                                                {
                                                    pagenum >= currentDepartmentMembers.total ?
                                                        <Button disabled="currentDepartmentMemberDetails.id == null" ghost="true">
                                                            <img src={Next}/>
                                                            <div>下一个</div>
                                                        </Button>
                                                         :
                                                         <Button onClick={this.nextDetail} ghost="true">
                                                            <img src={Next}/>
                                                            <div>下一个</div>
                                                        </Button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    ) : true
                    }
                </Animate>
            </div>
        );
    }
}


//人员信息项
function renderDeptInfoItem(labelName, value, isRequire) {
    return (
        <Col className="gutter-row" span={6}>
            <div className="gutter-box" style={{height:'29px'}}>
                <span className="info-label" style={{width:'32%'}}>{labelName}{isRequire ?
                    <span className="require-star">*</span> : ''}:</span>
                <span className="info-value">{value}</span>
            </div>
        </Col>
    )
}
//人员信息项
function renderDeptInfoItem1(labelName, value, isRequire) {
    return (
        <Col className="gutter-row" span={6}>
            <div className="gutter-box">
                <span className="info-label" style={{width:'48%'}}>{labelName}{isRequire ?
                    <span className="require-star">*</span> : ''}:</span>
                <span className="info-value">{value}</span>
            </div>
        </Col>
    )
}



