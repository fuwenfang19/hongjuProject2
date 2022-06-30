/**
 * Created by fuwf on 2017/5/26.
 * 控制方案
 */


import React, {Component} from 'react';
import {Icon, Button, Input, Checkbox, Spin,Switch,Select} from 'antd';
import Searchbar from '../../common/Searchbar';
import {connect} from 'react-redux';

import {CommonTree, Confirm, Toast,NoInfo} from '../../../components/common';
import {is} from 'immutable';
import CommonChoose from '../../../components/common/CommonChoose';
import Img from '../../../images/basefiles/import_project.png';
import EditTable from '../../../components/common/EditTable';

import BudgetControlLeftList from './budgetControlLeftList';
import AddBudgetControl from './addBudgetControl'
import BatchEditing from './batchEditing'
import * as actions from '../../../actions';
import {fileTypeDimCode,budgetPlanDetail_template,budgetColumn_template} from './constant'
const Search = Input.Search;

class budgetControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'disburse':[],
            scrollX:850,
            isBatchEdit:false
        }
    }
    componentDidMount() {
      const {dispatch} = this.props
      dispatch(actions.getBudgetPlanList())
    }
    //选择支出类型的回调
    handleSelect = (code, value) => {
      this.selectDisburse({id:value[0].id,name:value[0].name})
    };
    //下载模板
  downloadTemplate = () => {
		//NetWork.download('/static//exceltemplate/supplier_template.xlsx');
	};
  //上传
  importDatas = () => {
    
		Confirm({
			title: '导入预算控制方案',
			isUpload: true,
			uploadConfig: {
				url: NetWork.getUrl('/organization/web/supplier/import/'),//上传的url
			},
			onFileUploadSuccess: (returnData) => {
				//返回的是上传结束后的response
				if (returnData) {
					Toast.success('上传成功！');
				} else {
					Toast.error(returnData.data);
				}
			},
			onOk: () => {
				//显示左侧树 关闭窗口
			},
			onCancel: () => {
				//显示左侧树 关闭窗口
			}
		});
	};
  addBudgetControl = ()=>{
    const {dispatch,$$budgetControlState} = this.props
    let budgetList = $$budgetControlState.toJS().budgetList
    const currentStatus = $$budgetControlState.toJS().currentStatus
    if(currentStatus === 'add'){
      return
    }
    let addNewItem = {code: "",name: "请输入预算控制方案名称",id:''}
    budgetList.unshift(addNewItem)
    dispatch(actions.addBudgetControl(budgetList,budgetPlanDetail_template,budgetColumn_template))
  }
  //改变table行数据
  handleRowDataChange = (index,data)=>{
    const {dispatch,$$budgetControlState} = this.props
    let oldDataSource = $$budgetControlState.toJS().dataSource.concat()
    let budgetPlanDetail = $$budgetControlState.toJS().budgetPlanDetail
		const dimensionRefs_itemCodes = budgetPlanDetail.dimensionRefs.map(p=>p.dimensionRef.item_code)
    //数据格式转换
    data.controlLevel = data.controlLevel *1
    data.overageKind = data.overageKind *1

    if([0,1,2,3,5].indexOf(data.controlKind)<0 && data.controlKind.substring(0,2)==='20'){
      data.startDate = data.controlKind.split('~')[0]
      data.endDate = data.controlKind.split('~')[1]
      //data.controlKind = 5
    }else{
      data.controlKind = data.controlKind *1
    }
    //根据
    for(let key in data.controlItemPlan){
      if(dimensionRefs_itemCodes.indexOf(key)>-1){
        if(data[key].length === 0){
          data.controlItemPlan[key] = 0
          data.controlItemPlan[key+'Name'] = null
        }else{
          data.controlItemPlan[key] = data[key][0].id
          data.controlItemPlan[key+'Name'] = data[key][0].name
        }
      }
    }
    oldDataSource[index] = data
    dispatch(actions.rowDataChange(oldDataSource))
  }
  //选择预算维度的回调
  checkedDimensionData = (e,i)=>{
    const checked = e.target.checked
    const {dispatch,$$budgetControlState} = this.props
    let dimensionData = $$budgetControlState.toJS().dimensionData
    let otherDimensionData = $$budgetControlState.toJS().dimensionData
    let budgetPlanDetail = $$budgetControlState.toJS().budgetPlanDetail
    let dimensionRefs = budgetPlanDetail.dimensionRefs
    let currentDimensionData = otherDimensionData[i]
    let budgetControlListColumns = $$budgetControlState.toJS().budgetControlListColumns
    let dataSource = $$budgetControlState.toJS().dataSource
    dimensionData[i].isChecked = checked
    let checkedDimensionData = dimensionData.filter((item,i)=>{
      return item.isChecked === true
    })
    delete currentDimensionData.isChecked
    if(checked){
      //改变budgetPlanDetail.dimensionRefs
      let newDimensionRefsItem = {budgetOrder: checkedDimensionData.length,
        dimensionRef: currentDimensionData}
      let newDimensionRefs = dimensionRefs.concat([newDimensionRefsItem])
      budgetPlanDetail.dimensionRefs = newDimensionRefs
      dispatch(actions.changeDimensionRefs(dimensionData,budgetPlanDetail))
      //动态改变columns
      let newColumn = {title: currentDimensionData.dimension.name,
          dataIndex: currentDimensionData.item_code,
          key: currentDimensionData.item_code,
          width:200,
          dataType:{
            type: 'file',
            fileType: fileTypeDimCode[currentDimensionData.item_code],
            isRadio: true,
          }}
      budgetControlListColumns.unshift(newColumn)
      //动态改变dataSource
      dataSource.map((item,i)=>{
        item[currentDimensionData.item_code] = []
      })
      //修改表头以及数据
      dispatch(actions.changeColumnDataSource(budgetControlListColumns,dataSource))  

    }else{
      let newDimensionRefs = dimensionRefs.filter((item,i)=>{
        return item.dimensionRef.id*1 !== currentDimensionData.id*1
      })
      let minusNum = checkedDimensionData.length - newDimensionRefs.length
      newDimensionRefs.map((item,i)=>{
        item.budgetOrder = i+1
      })
      budgetPlanDetail.dimensionRefs = newDimensionRefs
      dispatch(actions.changeDimensionRefs(dimensionData,budgetPlanDetail))

      //动态改变columns
      let filterColumns = budgetControlListColumns.filter((item,i)=>{
        return item.dataIndex !== currentDimensionData.item_code
      })
      //动态改变dataSource的值 （1 删除item_code对应字段  2 controlItemPlan{}内对应的item_code值分别置为0 以及null）
      let filertDataSource = dataSource.concat()
      filertDataSource.map((item,i)=>{
        delete item[currentDimensionData.item_code]
        item.controlItemPlan[currentDimensionData.item_code] = 0
        item.controlItemPlan[currentDimensionData.item_code+'Name'] = null
        return item
      })
      //修改表头以及数据
      dispatch(actions.changeColumnDataSource(filterColumns,filertDataSource)) 
    }
    
    dispatch(actions.checkedDimensionData(checked,i))    
  }
  //选择支出类型的回调
  selectDisburse = (data) =>{
    const {dispatch} = this.props
    dispatch(actions.selectDisburse(data))    
  }
  //新增表格行
  clickAddTableItem = ()=>{
    const {dispatch,$$budgetControlState} = this.props
    let oldDataSource = $$budgetControlState.toJS().dataSource
    let otherDataSource = $$budgetControlState.toJS().dataSource
    let lastOneRowDataSource = $$budgetControlState.toJS().lastOneRowDataSource
    const budgetPlanDetail = $$budgetControlState.toJS().budgetPlanDetail
		const dimensionRefs_itemCodes = budgetPlanDetail.dimensionRefs.map(p=>p.dimensionRef.item_code)
    let templateDataSource = oldDataSource.length === 0?lastOneRowDataSource:oldDataSource[0]
    templateDataSource.id = ''
    templateDataSource.controlKind = 0  //默认为年
    templateDataSource.controlLevel = 1 //默认为提醒
    templateDataSource.overageKind = 3  //默认为按年累计
    templateDataSource.warnLimit = '100'
    templateDataSource.controlLimit = '100'
    for(let key in templateDataSource.controlItemPlan){
      if(dimensionRefs_itemCodes.indexOf(key)>-1){
        templateDataSource[key] = []
      }
    }
    let newDataSource = otherDataSource.concat([templateDataSource])
    dispatch(actions.clickAddTableItem(newDataSource))    
  }
  //删除表格行
  clickDeleteTableItem = ()=>{
    const {dispatch,$$budgetControlState} = this.props
    const selectedRowKeys = $$budgetControlState.toJS().selectedRowKeys
    const dataSource = $$budgetControlState.toJS().dataSource
    let lastOneRowDataSource = {}
    //TODO 要区分所选择的行中哪些事已保存过（删除接口删除） 未保存过（直接本地删除）
    let hasSavedData = false;
    let newTableData = dataSource.filter((item, index) => {
      const delIndex = selectedRowKeys.indexOf(index);//判断是否被选中
      if (delIndex === -1) {//如果没有被选中，则保留在数据中
        return true;
      } else {//如果被选中
        if (item.id) {//如果保存过的，保留(TODO 需确认 已保存过的数据行是否可以删除)
          hasSavedData = true;
          return true;
        } else {//如果是新增的，不保留，并且在勾选数组中直接删除，
          selectedRowKeys.splice(delIndex, 1);
        }
      }
    });
    //如果dataSource只有一行数据的时候 删除之前需要把这行数据格式保存
    if(dataSource.length === 1){
      lastOneRowDataSource = dataSource[0]
    }
    dispatch(actions.clickDeleteTableItem(newTableData,selectedRowKeys,lastOneRowDataSource))
  }
  //选择表格行
  onSelectChange = (selectedRowKeys)=>{
    const {dispatch} = this.props
    dispatch(actions.onSelectChange(selectedRowKeys))
  }
  //取消列表的选择
  cancleChose = ()=>{
    let selectedRowKeys = []
    this.onSelectChange(selectedRowKeys)
  }
  //启用开关
  changeSwicthBtn = (checked)=>{
    const status = checked
    const {dispatch} = this.props
    dispatch(actions.changeSwicthBtn(status?0:1))
  }
  //编辑按钮
  clickEditBtn = ()=>{
    const {dispatch} = this.props
    dispatch(actions.clickEditBtn())
  }
  //修改名称
  changeBudgetPlanName = (e)=>{
    const value =  e.target.value
    const {dispatch} = this.props
    dispatch(actions.clickBlurInput(value))
  }
  //修改名称失去焦点保存改变同时改变左侧菜单名称
  clickBlurInput = ()=>{
    // const nameValue = this.state.nameValue
    // const {dispatch} = this.props
    // dispatch(actions.clickBlurInput())
  }
  //编辑页面取消按钮
  clickEditPageCancleBtn = ()=>{
    const {dispatch,$$budgetControlState} = this.props
    const originDataSource = $$budgetControlState.toJS().originDataSource
    const originBudgetControlListColumns = $$budgetControlState.toJS().originBudgetControlListColumns
    const localBudgetPlanDetail = $$budgetControlState.toJS().localBudgetPlanDetail
    const localBudgetList = $$budgetControlState.toJS().localBudgetList
    const localDimensionData = $$budgetControlState.toJS().localDimensionData
    dispatch(actions.clickEditPageCancleBtn(originDataSource,originBudgetControlListColumns,localBudgetPlanDetail,localBudgetList,localDimensionData))
    this.cancleChose()
  }
  //新增页面取消按钮
  clickAddPageCancleBtn = ()=>{
    const {dispatch,$$budgetControlState} = this.props
    const originDataSource = $$budgetControlState.toJS().originDataSource
    const originBudgetControlListColumns = $$budgetControlState.toJS().originBudgetControlListColumns
    const localBudgetPlanDetail = $$budgetControlState.toJS().localBudgetPlanDetail
    const localDimensionData = $$budgetControlState.toJS().localDimensionData
    dispatch(actions.clickAddPageCancleBtn(originDataSource,originBudgetControlListColumns,localBudgetPlanDetail,localDimensionData))
    this.cancleChose()
  }
  //批量编辑
  clickbatchEditing = ()=>{
    this.setState({
      isBatchEdit:true
    })
  }
  //关闭批量编辑
  closeBatchEditingModal = ()=>{
    this.setState({
      isBatchEdit:false
    })
  }
  //批量修改dataSource值
  changeControlLevel = (value,type)=>{
    const {dispatch,$$budgetControlState} = this.props
    const selectedRowKeys = $$budgetControlState.toJS().selectedRowKeys
    let dataSource = $$budgetControlState.toJS().dataSource
    if(type === 'controlLevel' || type === 'overageKind'){
      value = value*1
      selectedRowKeys.map((item,i)=>{
        dataSource[item][type] = value
      })
    }else if(type === 'controlKind'){
      if([0,1,2,3,5].indexOf(value)<0 && value.substring(0,2)==='20'){
        let startDate = value.split('~')[0]
        let endDate = value.split('~')[1]
        //value = 5
        selectedRowKeys.map((item,i)=>{
          dataSource[item][type] = value
          dataSource[item]['startDate'] = startDate
          dataSource[item]['endDate'] = endDate
        })
      }else{
        value = value*1
        selectedRowKeys.map((item,i)=>{
          dataSource[item][type] = value
        })
      }
    }else{
      selectedRowKeys.map((item,i)=>{
        dataSource[item][type] = value
      })
    }
    dispatch(actions.rowDataChange(dataSource))
    let curentSelectRowKeys = []
    this.onSelectChange(curentSelectRowKeys)
  }
  //保存按钮
  clickSavebtn = ()=>{
    const {dispatch,$$budgetControlState} = this.props
    //TODO 1、遍历dataSource里的controlKind字段 如果是日期 则置成数字5
    //2、遍历dataSource 删除key名为“dim_two”类似字段（dimensionRefs.dimensionRef.item_code存在的字段）
    //3、用dataSource替换budgetPlanDetail里的dims
  }
  //选中某一个方案
  selectOneListItem = (item)=>{
    const {dispatch,$$budgetControlState} = this.props
    const budgetList = $$budgetControlState.toJS().budgetList
    let newBudgetList = budgetList.filter((item,i)=>{
      return item.id !== ''
    })
    dispatch(actions.getBudgetPlanDetail(item.id))
    dispatch(actions.changeBudgetList(newBudgetList))
  }
  render() {
      const isBatchEdit = this.state.isBatchEdit
      const {$$budgetControlState} = this.props
      const dimensionData = $$budgetControlState.toJS().dimensionData
      const budgetList = $$budgetControlState.toJS().budgetList
      const budgetPlanDetail = $$budgetControlState.toJS().budgetPlanDetail
      const currentStatus = $$budgetControlState.toJS().currentStatus
      const budgetControlListColumns = $$budgetControlState.toJS().budgetControlListColumns
      const dataSource = $$budgetControlState.toJS().dataSource
      const currentBudgetPlanId = $$budgetControlState.toJS().currentBudgetPlanId
      const selectedRowKeys = $$budgetControlState.toJS().selectedRowKeys
      const fields = [
        {code: 'disburse', fileType: window.FILETYPE.disburse, labelName: '支出类型', showGroup: false, isRadio: true}
      ];
      const {code, labelName, fileType, showGroup, isRadio} = fields[0];
      let commonChooseData = budgetPlanDetail.startDimValue.id === ''?[]:
      [{id:budgetPlanDetail.startDimValue.id,name:budgetPlanDetail.startDimValue.name}]

      let addBudgetControlData = {}
      addBudgetControlData.currentStatus = currentStatus
      addBudgetControlData.budgetControlListColumns = budgetControlListColumns
      addBudgetControlData.dataSource = dataSource
      addBudgetControlData.dimensionData = dimensionData
      addBudgetControlData.fields = fields
      addBudgetControlData.budgetPlanDetail = budgetPlanDetail
      addBudgetControlData.selectedRowData = selectedRowKeys
      
      let budgetControlLeftListData = {}
      budgetControlLeftListData.budgetList = budgetList
      budgetControlLeftListData.currentStatus = currentStatus
      budgetControlLeftListData.currentBudgetPlanId = currentBudgetPlanId
      //console.log(dataSource)
      let dimensionDataChose = []
      dimensionData.map((item,i)=>{
        if(item.isChecked){
          dimensionDataChose.push(item)
        }
      })
      const scrollX = this.state.scrollX + dimensionDataChose.length * 200 +'px'

    let budgetControlTableHead = null
    if(selectedRowKeys.length === 0){
      budgetControlTableHead = (
      <div className = 'budgetControlTableHead'>
          <div className='budgetControlTableHead-left'>
            <span style={{marginRight:'5px'}}>预算控制列表</span>
            <span>{`${dataSource.length}条`}</span>
          </div>
          {
            currentStatus === 'view'?null:(
              <div className='budgetControlTableHead-right'>
                <span className='addBtn' onClick={this.clickAddTableItem}><Icon type="plus-circle"  style={{marginRight:'5px'}}/>新增</span>
              </div>
            )
          }
        </div>
      )
    }else{
      budgetControlTableHead = (
        <div className = 'budgetControlTableHead-chose'>
        <div className='budgetControlTableHead-chose-left'>
          <span className='budgetControlTableHead-chose-right-marg' onClick={this.cancleChose}>取消选择</span>
					<span style={{marginLeft: 8}}>{`选择了 ${selectedRowKeys.length} 个成员` }</span>
        </div>
        <div className='budgetControlTableHead-chose-right'>
          <span className="budgetControlTableHead-chose-right-marg" onClick = {this.clickbatchEditing}>
              <Icon type="edit" />
              批量修改
          </span>
          <span className="budgetControlTableHead-chose-right-marg" onClick={this.clickDeleteTableItem}>
              <Icon type="close" />
              删除
          </span>         
        </div>
      </div>
      )
    } 
    const rowSelection = {
        selectedRowKeys:selectedRowKeys,
        onChange: this.onSelectChange,
    };

    return (
      <div className="page budgetControl-page">
          {/*左侧的新增搜索项*/}
          <div className="gutter-box content-left">
              <Searchbar
                  placeholder="搜索预算控制方案"
                  size={'large'}
                  style={{width: '100%', marginTop: '6px', color:'#999'}}
              />
              <div className="project-left-btns">
                  <Button className="add-btn" style={{width:'100%'}} size={'default'} 
                    onClick = {this.addBudgetControl}
                  >
                      <Icon type="plus-circle"/>
                      新增预算控制方案
                  </Button>
              </div>
              <div style={{margin: '10px 0 0 2%'}}>
                  <Checkbox >停用的预算控制方案</Checkbox>
              </div>
            <br/>
              <BudgetControlLeftList
              {...budgetControlLeftListData}
              onSelect = {this.selectOneListItem}
              />
          </div>
          {
            budgetList.length === 0?(
              <NoInfo downloadTemplate={this.downloadTemplate}
              title="预算控制方案"
              img={Img}
              importDatas={this.importDatas} />
            ):
            (
              currentStatus === 'add'?(
                <AddBudgetControl 
                {...addBudgetControlData}
                rowDataChange = {this.handleRowDataChange}
                checkedDimensionData = {this.checkedDimensionData}
                selectDisburse = {this.selectDisburse}
                clickAddTableItem = {this.clickAddTableItem}
                clickDeleteTableItem = {this.clickDeleteTableItem}
                onSelectChange = {this.onSelectChange}
                clickCancleBtn = {this.clickAddPageCancleBtn}
                />
                ):(
                <div className = 'content-right'>
                  <div className = 'content-right-head'>
                    <div className = 'head-left'>
                      {
                        currentStatus==='edit'?<Input placeholder="请输入方案名称" 
                        value={budgetPlanDetail.name} onChange={this.changeBudgetPlanName}
                        onBlur = {this.clickBlurInput}/>:
                        <span className='caseName'>{budgetPlanDetail.name}</span>
                      }
                    </div>
                    {
                      currentStatus==='edit'?(
                        <div className = 'head-right'>
                          {!budgetPlanDetail.status?'启用':'停用'}
                          <Switch className='switch' checked = {!budgetPlanDetail.status}
                          onChange = {this.changeSwicthBtn}
                          ></Switch>
                          <Button type='default' onClick = {this.clickEditPageCancleBtn}>取消</Button>
                          <Button type='primary' onClick = {this.clickSavebtn}>保存</Button>
                        </div>
                      ):(
                        <div className = 'head-right'>
                          {!budgetPlanDetail.status?'启用':'停用'}
                          <Switch className='switch' checked = {!budgetPlanDetail.status}
                          onChange = {this.changeSwicthBtn}
                          ></Switch>
                          <Button type='primary' >下载模板</Button>
                          <Button type='primary' >导入方案</Button>
                          <Button type="primary" >删除</Button>
                          <Button type='primary' onClick = {this.clickEditBtn}>编辑</Button>
                        </div>
                      )
                    }
                  </div>
                  <div className = 'repayType'>
                    <span className = 'repayTypeLeft'>支出类型<span className='require-star'>*</span></span>
                    {
                      currentStatus==='edit'?(
                        <div className = 'repayTypeChose'>
                          <CommonChoose initialChoosed={commonChooseData}
                          showGroup={showGroup}
                          type={fileType}
                          isRadio={isRadio}
                          onSelect={(value) => {
                            this.handleSelect(code, value);
                          }}/>
                        </div>
                      ):(<span className = 'repayTypeRight'>{budgetPlanDetail.startDimValue.name}</span>)
                    }
                  </div>
                  <div className = 'dimension'>
                    <span className = 'dimensionLeft'>预算控制维度</span>
                    {
                      currentStatus==='edit'?
                      (<div>
                        {
                          dimensionData.map((item,i)=>{
                            return (<span className = 'dimensionRight' key={i}>
                            <Checkbox checked = {item.isChecked} 
                              onChange = {(e)=>{this.checkedDimensionData(e,i)}}
                            >{item.dimension.name}</Checkbox></span>)
                          })
                        }
                      </div>):
                      (<div>
                        {
                          dimensionData.map((item,i)=>{
                            if(item.isChecked){
                              return (<span className = 'dimensionRight' key={i}>{item.dimension.name}</span>)
                            }
                          })
                        }
                      </div>)
                    }
                  </div>
                  {budgetControlTableHead}
                  <div ref="membersTable" className="budgetControl-table">
                      <EditTable
                        dataSource={dataSource}
                        isEditing={currentStatus==='edit'?true:false}
                        columns={budgetControlListColumns}
                        scrollX= {scrollX}
                        onTableDataChange={(newTableData) => {}}
                        onRowDataChange={(index,data) => {this.handleRowDataChange(index,data)}}
                        rowSelection={currentStatus==='edit'?rowSelection:null}
                      />
                  </div>
                </div>
              )                  
            )
          }
          <BatchEditing
            isBatchEdit = {isBatchEdit}
            closeBatchEditingModal = {this.closeBatchEditingModal}
            changeControlLevel = {this.changeControlLevel}
          />
      </div>
    )
  }
}
//将dispatch传递进来
function mapStateToProps(state) {
    return {
        $$budgetControlState:state.get('budgetControlState'),
        clientHeight: state.get('baseState').toJS().clientHeight,
        baseState: state.get('baseState').toJS()
    }
}
export default connect(mapStateToProps)(budgetControl);
