/**
 * Created by fuwf on 2017/5/26.
 * 复制方案
 */

import React from 'react';
import {Button, Icon, Modal,Checkbox,Spin} from 'antd';
import {connect} from 'react-redux';
import NetWork from '../../../global/utils/network';
import { Toast } from '../../../components/common';

class CopyControlPlan extends React.Component {
    constructor() {
        super();
        this.state = {
            url: '/organization/alldisburse/',
            reqParam : {
              pagenum: 1,
              countperpage: 100,
              status: "正常",
              systemusedstatus: '正常',
              company: window.getUserInfo().company,
              searchtype: "treeclick"
            },
            pageNum:1,
            loading:false,
            disburseList :[],
            isCopyControlShow:false,
            file_choose_flag : true,
            choseDisburse:[]
        }
    }
    recover=()=>{
      this.setState({
        url: '/organization/alldisburse/',
        reqParam : {
          pagenum: 1,
          countperpage: 100,
          status: "正常",
          systemusedstatus: '正常',
          company: window.getUserInfo().company,
          searchtype: "treeclick",
        },
        pageNum:1,
        loading:false,
        disburseList :[],
        isCopyControlShow:false,
        file_choose_flag : true,
        choseDisburse:[]
      })
    }
    componentWillMount(){
    }
    show=()=>{
      this.setState({
        isCopyControlShow:true
      },()=>{
        this.getInitData()
      })
    }
    getInitData = ()=>{
      const url = this.state.url
      const reqParam = this.state.reqParam
				window.loading.add();
      NetWork.get(url, reqParam,
        (returnData) => {
        this.setState({
          disburseList:returnData,
          pageNum:2
        })
		  window.loading.remove();
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
    }
    //滚动加载
    handleScroll = (e)=>{
      let div = e.target;
      let scrollHeight = div.scrollHeight;
      let scrollTop = div.scrollTop;
      let clientHeight = div.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight - 10 && this.state.file_choose_flag) {
			  this.setState({
          file_choose_flag:false
        })
        this.loadingNextData()
      }
    }
    loadingNextData = ()=>{
      const url = this.state.url
      let reqParam = this.state.reqParam
      const pageNum = this.state.pageNum
      reqParam.pagenum = pageNum
      const disburseList = this.state.disburseList
				window.loading.add();

      NetWork.get(url, reqParam,
        (returnData) => {
	    	window.loading.remove();
        this.setState({
          disburseList:disburseList.concat(returnData),
          pageNum:pageNum+1,
          file_choose_flag:true
        })
			},
			(returnData) => {
				Toast.error(returnData.msg)
			})
    }
    handleCancel = () => {
        this.recover()
    };
   
    //点击ok
    clickOkBtn = ()=>{
      const choseDisburse = this.state.choseDisburse
      this.props.choseDisburseData(choseDisburse)
      this.handleCancel()
    }
    //
    checkedDisburse = (e,i)=>{
      let choseDisburse = this.state.choseDisburse
      //const checked = e.target.checked
      const disburseList = this.state.disburseList
      const currentId = disburseList[i].id
      const checked = disburseList[i].ischecked
      //TODO 此处需要判断如果是页面上已选的支出类型  此处不可再次选择
      const commonChooseData = this.props.commonChooseData
      if(commonChooseData.length>0 && currentId*1 ===commonChooseData[0].id*1 ){
        Toast.error('已经选择的支出类型不能再次被选择')
        return
      }
      if(!checked){
        let finalChoseDisburse = choseDisburse.concat([disburseList[i]])
        disburseList[i].ischecked = !disburseList[i].ischecked
        this.setState({
          choseDisburse:finalChoseDisburse,
          disburseList:disburseList
        })
      }else{
        let filertChoseDisburse = choseDisburse.filter((item,i)=>{
          return item.id !== currentId
        })
        disburseList[i].ischecked = !disburseList[i].ischecked
        this.setState({
          choseDisburse:filertChoseDisburse,
          disburseList:disburseList
        })
      }
    }
    render() {
        const title = '复制方案';
        const disburseList = this.state.disburseList
        return (
            <div>
                <Modal title={title}
                       visible={this.state.isCopyControlShow}
                       onOk={this.clickOkBtn}
                       onCancel={this.handleCancel}
                       width = {420}
                       wrapClassName="copyPntrolPlan-budgetControl">
                    <div>将当期预算控制方案批量复制给如下支出类型</div>
                    <div className = 'copyControlWrapper' onScroll={this.handleScroll}>
                        <ul>
                        {
                          disburseList.length === 0?(
                            <div className="ant-table-placeholder">
                              <i className=" anticon anticon-frown-o"></i>
                              <span>暂无数据</span></div>):
                            disburseList.map((item,i)=>{
                              return (
                                <li key={i}>
                                  <Checkbox onChange={(e)=>{this.checkedDisburse(e,i)}} checked={item.ischecked}>
                                    {item.name}
                                  </Checkbox>
                                </li>
                              )
                            })                            
                        }
                      </ul>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default CopyControlPlan;
