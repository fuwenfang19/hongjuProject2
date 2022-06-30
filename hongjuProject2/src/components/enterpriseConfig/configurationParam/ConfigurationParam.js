/**
 * Created by yangyfe on 2017/3/29.
 * 管理参数配置
 */
import React, { Component } from 'react';
import { Input,Button,Switch,Select,InputNumber } from 'antd';
import * as types from '../../../actions/actionTypes';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import configurationParamReducer from '../../../reducers'
import {getConfigurationParam,updateConfigurationParam} from '../../../reducers/configurationParam/configurationParamReducer';
const Search = Input.Search;
const Option = Select.Option;

class ConfigurationParam extends Component {
    constructor() {
        super();
        this.state = {
            needSave:false,
        }
        this.editer = this.editer.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount() {
        this.props.dispatch({
            type: types.CONFIGURATION_FOUND_EDITING,
            payload: false
        });
        this.props.getConfigurationParam();
    }
    editer(){

    }
    //编辑
    activeEdit = () => {
        this.props.dispatch({
            type: types.CONFIGURATION_FOUND_EDITING,
            payload: true
        });
    }
    //取消
    cancelEdit = () => {
        this.props.dispatch({
            type: types.CONFIGURATION_FOUND_EDITING,
            payload: false
        });
        this.props.getConfigurationParam();
    }
    //保存
    updateConfigurationParam = () =>{
        if (!this.state.needSave) {
            return;
        }
        let parentId = this.props.currentConfiguration.parent?this.props.currentConfiguration.parent.id:null
        this.props.currentConfiguration.parent = parentId
        this.props.updateConfigurationParam(this.props.currentConfiguration);
        this.cancelEdit();
    }
    //修改选择框
    handleChange(value) {
        this.props.dispatch({
            type:types.CONFIGURATION_SELECT_DATA,
            payload: value
        })
        this.setState({
            needSave: true
        });
    }
    //修改Type开关
    onchangeType = (checked) =>{
        this.props.dispatch({
            type:types.CONFIGURATION_TYPE_CHANGE,
            payload: checked
        })
        this.setState({
            needSave: true
        });
    }
    //修改数字
    onChangeDateRange = (value) =>{
        this.props.dispatch({
            type:types.CONFIGURATION_DATA_CHANGE,
            payload: value
        })
        this.setState({
            needSave: true
        });
    }
    //修改Date开关
    onChangeDate = (checked) => {
        this.props.dispatch({
            type:types.CONFIGURATION_DATE_CHANGE,
            payload: checked
        })
        this.setState({
            needSave: true
        });
    }
    render() {
        const button = [
            {
                key: 'btn1',
                size: 'small',
                type: 'primary',
                text: '编辑',
                onClick: this.activeEdit
            }
        ];
        const buttons = [
            {
                key: 'btn1',
                size: 'small',
                type: 'primary',
                text: '取消',
                onClick: this.cancelEdit,
            },
            // {
            //     key: 'btn2',
            //     size: 'small',
            //     type: 'primary',
            //     text: '保存',
            //     onClick: this.updateConfigurationParam,
            // }
        ];
        let pager;
        if(!this.props.editing){
            pager =
                <div>
                    <div className="content-right-head">
                        <span className="head-left">管理参数配置</span>
                        <span className="head-right">
                                                    {renderToolButton(button)}
                                                </span>
                    </div>
                    <div className="single-line"></div>
                    <div className="ConfigurationParam-body">
                        <div className="ConfigurationParam-card">
                            <div className="gutter-box" style={{marginBottom:'16px'}}>
                                <span className="info-label">项目过滤方式:</span>
                                <span className="info-value">{this.props.currentConfiguration.approvePathType==='departmentbase'?'项目任意选择':(this.props.currentConfiguration.approvePathType==="expensebase"?"按部门过滤项目":"按项目过滤部门")}</span>
                            </div>
                            <div className="gutter-box">
                                <span className="info-label">预定的需要先填写申请单:</span>
                                <span className="info-value" style={{marginLeft:"255px"}}>{this.props.currentConfiguration.orderTicketType==='needapplication'?'是':'否'}</span>
                            </div>
                            <div className="gutter-box">
                                <span className="info-label" style={{width:'350px'}}>申请单的计划出行日期与机票日期需匹配,相差{this.props.currentConfiguration.allowedTravelDateRange}天:</span>
                                <span className="info-value" style={{marginLeft:"72px"}}>{this.props.currentConfiguration.isCheckFlightOrderDate === true?'是':'否'}</span>
                            </div>
                        </div>
                    </div>
                </div>
        }else{
            pager = <div>
                <div className="content-right-head">
                    <span className="head-left">管理参数配置</span>
                    <span className="head-right">
                                                        {renderToolButton(buttons)}
                        {
                            this.state.needSave ?
                                <Button onClick={this.updateConfigurationParam} type="primary">保存</Button>
                                :
                                <Button onClick={this.updateConfigurationParam} type="primary" disabled="currentConfiguration.id == null">保存</Button>
                        }
                                                    </span>
                </div>
                <div className="single-line"></div>
                <div className="ConfigurationParam-body">
                    <div className="ConfigurationParam-card">
                        <div className="gutter-box" style={{marginBottom:'16px'}}>
                            <span className="info-label">项目过滤方式:</span>
                            <Select value={this.props.currentConfiguration.approvePathType} dropdownMatchSelectWidth={false} dropdownStyle={{width:320,height:120}} style={{ width: 260 }} onChange={this.handleChange}>
                                <Option value="departmentbase">项目任意选择</Option>
                                <Option value="expensebase">按部门过滤项目</Option>
                                <Option value="expensedepartmentbase">按项目过滤部门</Option>
                            </Select>
                        </div>
                        <div className="gutter-box">
                            <span className="info-label">预定的需要先填写申请单:</span>
                            <Switch checked={this.props.currentConfiguration.orderTicketType==='needapplication'?true:false} onChange={this.onchangeType} style={{marginLeft:"255px"}}/>
                        </div>
                        <div className="gutter-box">
                            <span className="info-label">申请单的计划出行日期与机票日期需匹配,<InputNumber min={1} max={99} step={1} formatter={value => value.replace(/[^\d]/g,'')} defaultValue={this.props.currentConfiguration.allowedTravelDateRange} disabled={this.props.currentConfiguration.isCheckFlightOrderDate==false ? true:false} onChange={this.onChangeDateRange}/>:</span>
                            <Switch checked={this.props.currentConfiguration.isCheckFlightOrderDate} onChange={this.onChangeDate} style={{marginLeft:"73px"}}/>
                        </div>
                    </div>
                </div>
            </div>
        }
        return (
            <div className="page ConfigurationParam-page">
                <div className="content-right">
                    {pager}
                </div>
            </div>
        );
    }
}
//右侧功能按钮
function renderToolButton(buttons) {
    return buttons.map((button) => {
        return (
            <Button key={button.key} size={button.size} type={button.type} onClick={button.onClick}>
                {button.text}
            </Button>
        )
    })
}

function mapStateToProps(state) {
    let configurationParamState = state.get('configurationParamState');
    let editing = configurationParamState.get('editing');
    let currentConfiguration = configurationParamState.get('currentConfiguration').toJS();
    return {
        configurationParamState,
        currentConfiguration,
        editing,
    };
}
function mapDispatchToProps(dispatch) {
    let method = {
        getConfigurationParam,
        updateConfigurationParam
    };
    let boundActionCreators = bindActionCreators(method, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationParam);