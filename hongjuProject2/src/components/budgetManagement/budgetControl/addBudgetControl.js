/**
 * Created by fuwf on 17/5/17.
 */
import React from 'react';
import {Icon, Button, Input, Checkbox, Spin,Switch,Select} from 'antd';
import CommonChoose from '../../../components/common/CommonChoose';
import EditTable from '../../../components/common/EditTable';
import CopyBudgetControl from './copyControlPlan'
class AddBudgetControl extends React.Component {
  constructor() {
    super();
    this.state = {
      'disburse':[],
      selectedRowKeys:[],
      scrollX:850,
      isCopyControlShow:false
    }
  }
  //选择支出类型的回调
  handleSelect = (code, value) => {
    this.setState({
      [code]: value
    },()=>{
      this.props.selectDisburse({id:value[0]?value[0].id:'',name:value[0]?value[0].name:''})
    })
  };
  //选择预算维度的回调
  checkedDimensionData = (e,i)=>{
    this.props.checkedDimensionData(e,i)
  }
  //列表的选择
  onSelectChange = (selectedRowKeys) => {
      this.props.onSelectChange(selectedRowKeys)
  }
  //取消列表的选择
  cancleChose = ()=>{
    let selectedRowKeys = []
    this.props.onSelectChange(selectedRowKeys)
  }
  //改变datasource数据
  rowDataChange = (index,data)=>{
    this.props.rowDataChange(index,data)
  }
  //新增表格行
  clickAddTableItem = ()=>{
    this.props.clickAddTableItem()
  }
  //删除表格行
  clickDeleteTableItem = ()=>{
    const selectedRowKeys = this.props.selectedRowData
    this.props.clickDeleteTableItem(selectedRowKeys)
  }
  //新增界面取消按钮
  clickAddCancle = ()=>{
    this.props.clickCancleBtn()
  }
  
  //关闭复制方案
  copyControlPlan = ()=>{
    this.refs.copyBudgetControl.show()
  }
  choseDisburseData = (choseDisburse)=>{
    console.log(choseDisburse)
  }
  render() {
    const {code, labelName, fileType, showGroup, isRadio} = this.props.fields[0];
    const {dimensionData,budgetControlListColumns,dataSource,budgetPlanDetail,selectedRowData} = this.props;
    let commonChooseData = budgetPlanDetail.startDimValue.id === ''?[]:
    [{id:budgetPlanDetail.startDimValue.id,name:budgetPlanDetail.startDimValue.name}]
    let dimensionDataChose = []
    dimensionData.map((item,i)=>{
      if(item.isChecked){
        dimensionDataChose.push(item)
      }
    })
    const scrollX = this.state.scrollX + dimensionDataChose.length * 200 +'px'
    let budgetControlTableHead = null
    if(selectedRowData.length === 0){
      budgetControlTableHead = (
      <div className = 'budgetControlTableHead'>
          <div className='budgetControlTableHead-left'>
            <span style={{marginRight:'5px'}}>预算控制列表</span>
            <span>{`${dataSource.length}条`}</span>
          </div>
          <div className='budgetControlTableHead-right'>
            <span className='addBtn' onClick={this.clickAddTableItem}><Icon type="plus-circle"  style={{marginRight:'5px'}}/>新增</span>
          </div>
        </div>
      )
    }else{
      budgetControlTableHead = (
        <div className = 'budgetControlTableHead-chose'>
        <div className='budgetControlTableHead-chose-left'>
          <span className='budgetControlTableHead-chose-right-marg' onClick={this.cancleChose}>取消选择</span>
					<span style={{marginLeft: 8}}>{`选择了 ${selectedRowData.length} 个成员` }</span>
        </div>
        <div className='budgetControlTableHead-chose-right'>
          <span className="budgetControlTableHead-chose-right-marg" >
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
        selectedRowKeys:selectedRowData,
        onChange: this.onSelectChange,
    };
    return (
      <div className = 'content-right'>
        <div className = 'content-right-head'>
          <div className = 'head-left'>
            <Input placeholder="请输入方案名称" />
          </div>
          <div className = 'head-right'>
            启用
            <Switch className='switch'></Switch>
            <Button type="default" onClick = {this.clickAddCancle}>取消</Button>
            <Button type='primary' onClick = {this.copyControlPlan}>复制方案</Button>
            <Button type="primary" >保存</Button>
          </div>
        </div>
        <div className = 'repayType'>
          <span className = 'repayTypeLeft'>支出类型<span className='require-star'>*</span></span>
          <div className = 'repayTypeChose'>
            <CommonChoose initialChoosed={commonChooseData}
            showGroup={showGroup}
            type={fileType}
            isRadio={isRadio}
            onSelect={(value) => {
              this.handleSelect(code, value);
            }}/>
          </div>
        </div>
        <div className = 'dimension'>
          <span className = 'dimensionLeft'>预算控制维度</span>
          {
            dimensionData.map((item,i)=>{
              return (<span className = 'dimensionRight' key={i}>
                <Checkbox checked = {item.isChecked} 
                onChange = {(e)=>{this.checkedDimensionData(e,i)}}>
                  {item.dimension.name}</Checkbox></span>)
            })
          }
        </div>
        {budgetControlTableHead}
        <div ref="membersTable" className="budgetControl-table">
            <EditTable
              dataSource={dataSource}
              isEditing={true}
              columns={budgetControlListColumns}
              scrollX= {scrollX}
              onTableDataChange={(newTableData) => {}}
              onRowDataChange={(index,data) => {this.rowDataChange(index,data)}}
              rowSelection={rowSelection}
            />
        </div>
        <CopyBudgetControl
          ref = 'copyBudgetControl'
          commonChooseData = {commonChooseData}
          choseDisburseData = {this.choseDisburseData}
        />
      </div>
    )
  }
}


export default AddBudgetControl;