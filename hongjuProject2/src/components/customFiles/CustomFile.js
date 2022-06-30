/**
 * Created by yangyfe on 2017/3/13.
 * 自定义档案
 */
import React, {Component} from 'react';
import {Icon, Button} from 'antd';
import {connect} from 'react-redux';
import CustomFileInfo from './CustomFileInfo';
import CustomFileExpand from './CustomFileExpand';
import {getCustomMembers} from '../../reducers/customFiles/customFilesReducer';
import NetWork from '../../global/utils/network';
import * as types from '../../actions/actionTypes';
import {bindActionCreators} from 'redux';
import * as actionTypes from  '../../actions/actionTypes';
import {Confirm, Toast} from '../../components/common';
import NoInfo from '../common/NoInfo';
import Img from '../../images/basefiles/import_project.png';

class CustomFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
            value: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.addCustom = this.addCustom.bind(this);
        this.showCustomExpandList = this.showCustomExpandList.bind(this);
        this.changeCustomExpandList = this.changeCustomExpandList.bind(this);
    }
    componentWillMount() {
        // this.props.getCustomMembers();
        this.props.dispatch({
            type: types.CUSTOM_FUND_EDIT,
            payload: false
        });
        this.props.getCustomMembers();
    }
    componentDidMount() {
        this.props.getCustomMembers();
    }

    //导入数据
    testConfirm = () => {
        Confirm({
            title: '导入档案数据',
            isUpload: true,
            uploadConfig: {
                url: NetWork.getUrl('/expense/importcustombase/'),//上传的url
                data: {objectid: this.props.CustomMembers[this.props.currentIndex].id}
            },
            onFileUploadSuccess: (returnData) => {
                if (returnData) {
                    Toast.success('上传成功！');
                    this.props.getCustomMembers();
                } else {
                    Toast.error('数据上传失败原因：' + returnData.error.join());
                }
            },
            onOk: () => {

            },
            onCancel: () => {

            }
        });
    }

    //下载模板
    downloadTemplate() {
        NetWork.download('/static/exceltemplate/custombase_template.xlsx');
    }
    showCustomExpandList(value){
        this.props.dispatch({
            type: types.SHOW_CUSTOM_EXPAND_MODAL,
            payload: value
        });
    }
    changeCustomExpandList(value,key,index){
        this.props.dispatch({
            type: types.CHANGE_CUSTOM_EXPAND_LIST,
            payload: {value:value,key:key,index:index}
        });
    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }

    //创建档案
    addCustom() {
        this.props.dispatch({
            type: 'xinzeng',
            payload: [{
                "name": "请输入档案名称",
                "remark": "",
                "isPublic": false,
                "childs": [{
                    "code": "abc",
                    "search_code": "abc",
                    "name": "项目一",
                    "search_name": "项目一",
                    "enable": true
                }],
                "$$hashKey": "object:754"
            }]
        })
        this.props.dispatch({
            type: types.ADD_NEW_CUSTOM,
            payload: true
        })
        this.activeEdit();
    }

    //右侧列表数据的切换，通过改变索引
    click(key) {
        if (key === '0') {
            return
        }
        var ii = 0;
        for (var i = 0; i < this.props.CustomMembers.length; i++) {
            if (key == this.props.CustomMembers[i].id) {
                ii = i;
            }
        }
        this.props.dispatch({
            type: types.CUSTOM_INDEX,
            payload: ii
        });


    }

    // 自定义档案编辑
    //编辑
    activeEdit = () => {
        this.props.dispatch({
            type: types.CUSTOM_FUND_EDIT,
            payload: true
        });
    }
    warning = () =>{
        Toast.warning('请先将新增档案编辑保存或编辑取消，再进行新增')
    }
    render() {
        // const {CustomMembers, editing,currentIndex} = customFilesState;
        let value = this.state.value;
        return (
            <div className="page customFile-page">
                {/*左侧的新增搜索项*/}
                <div className="gutter-box content-left">
                    <div className="content-left-custom">
                        自定义档案
                        {/*<Icon type="plus-circle" style={{"margin": "0 0 0 80px"}} onClick={this.addCustom.bind(this)}/>*/}
                        {
                            this.props.addNewCustom == true ?
                                <input type="button" className="add-input" onClick={this.warning} style={{"margin": "20px 0 0 110px"}}/>
                                :
                                <input type="button" className="add-input" onClick={this.addCustom.bind(this)} style={{"margin": "20px 0 0 110px"}}/>
                        }
                    </div>
                    <div className="custom-button">
                        {
                                this.props.CustomMembers.map((item,key) => {
                                    return <div  key={item.id}
                                                 className={key == this.props.currentIndex?'addButton back':'addButton'}
                                                 onClick={this.click.bind(this, item.id)} ref={"addButtons"}>
                                        <Icon type="file-text" className="addButton-icon"></Icon>
                                        <span style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth:'160px',
                                            display: 'block',
                                            float:'left'
                                        }}>{item.name}</span>
                                    </div>

                                })
                        }
                    </div>
                </div>
                {/*右侧的表格数据*/}
                <div className="gutter-box content-right">
                    {this.props.CustomMembers.length <= 0 ?
                        <NoInfo downloadTemplate={this.downloadTemplate}
                                title="自定义档案"
                                img={Img}
                                importDatas={this.testConfirm}/>
                        :
                        <CustomFileInfo ref="CustomFileInfo"
                                        downloadTemplate={this.downloadTemplate}
                                        showCustomExpandList={this.showCustomExpandList}
                                        testConfirm={this.testConfirm}
                                        value={value}
                                        handleChange={this.handleChange}
                                        CustomMembers={this.props.CustomMembers}
                                        currentIndex={this.props.currentIndex}
                        />
                    }

                </div>
                <CustomFileExpand editExpand={this.props.editExpand}
                                  showCustomExpandList={this.showCustomExpandList}
                                  changeCustomExpandList={this.changeCustomExpandList}
                                  showCustomExpand={this.props.showCustomExpand} >
                </CustomFileExpand>
            </div>
        )
    }
}
//将dispatch传递进来
function mapStateToProps(state) {
    let customFilesState = state.get('customFilesState');
    let CustomMembers = customFilesState.get('CustomMembers').toJS();
    let editing = customFilesState.get('editing');
    let currentIndex = customFilesState.get('currentIndex');
    let addNewCustom = customFilesState.get('addNewCustom');
    let showCustomExpand = customFilesState.get('showCustomExpand');
    let editExpand = customFilesState.get('editExpand');
    return {
        CustomMembers,
        editing,
        currentIndex,
        addNewCustom,
        showCustomExpand,
        editExpand,
        clientHeight: state.get('baseState').toJS().clientHeight
    };
}
function mapDispatchToProps(dispatch) {
    let method = {
        getCustomMembers
    };
    let boundActionCreators = bindActionCreators(method, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomFile);

