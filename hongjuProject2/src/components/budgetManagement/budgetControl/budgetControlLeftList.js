/**
 * Created by fuwf on 17/5/17.
 */
import React from 'react';
import {Icon, Spin} from 'antd';

class BudgetControlLeftList extends React.Component {
  constructor() {
    super();
  }
  render() {
    let {budgetList,currentStatus,currentBudgetPlanId} = this.props
    return (

      <ul className="entry-rule-left-content">
        {
          getSupplierListHtml.call(this,budgetList,currentStatus)
        }
      </ul>
    )
  }
}
function getSupplierListHtml(budgetList,currentStatus) {
  if(!budgetList) {
    return (
      <li style={{paddingLeft: '20px',paddingTop: '5px'}}>
        <Spin tip="数据加载中..."/>
      </li>
    )
  } else if (budgetList.length === 0){
    return (
      <li style={{paddingLeft: '20px',color: '#999'}}>
        没有找到预算控制方案
      </li>
    )
  } else {
    let html =  budgetList.map(function(item,key) {
      
      if(item.id === '' && currentStatus === 'add'){
        return (
          <li className='entry-rule-left-content-item entry-rule-left-content-item-selected'
          key={'new'}>
          <Icon type="file" style={{color: 'rgb(128,128,128)'}}/>
          <span style={{marginLeft: '5px'}}>
            请输入预算控制方案名称
          </span>
        </li>
        )
      }else{
        return (
          <li className={item.id === this.props.currentBudgetPlanId ? 'entry-rule-left-content-item entry-rule-left-content-item-selected':'entry-rule-left-content-item'}
            key={key}
            onClick={() => this.props.onSelect(item)}>
            <Icon type="file" style={{color: 'rgb(128,128,128)'}}/>
            <span style={{marginLeft: '5px'}}>
              {item.name}
            </span>
        </li>
        )
      }
    },this)
    return html;
  }
}

export default BudgetControlLeftList;