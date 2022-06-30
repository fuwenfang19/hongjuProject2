/**
 * Created by yeyawei on 17/3/14.
 */
import React from 'react';
import {Icon, Spin} from 'antd';

class SupplierList extends React.Component {
  constructor() {
    super();
  }
  render() {
    let arr = this.props.list;
    /*let newArr = [];
    for(let i = 0,len = arr.length; i < len; i++) {
      let item = arr[i];
      newArr.push(
        <li className={item.id == this.props.currentSupplier.id ? 'supplier-item currentSupplier':'supplier-item'}
            onClick={() => this.props.onSelect(item)}>
          <Icon type="file" />
          <span style={{marginLeft: '5px'}}>
            [{item.code}]
          </span>
          <span style={{marginLeft: '5px'}}>
            {item.name}
          </span>
        </li>
      )
    }*/
    return (

      <ul className="supplier-wraper">
        {
          getSupplierListHtml.call(this,arr)
          /*arr === null ?

          <li style={{paddingLeft: '20px',paddingTop: '5px'}}>
            <Spin tip="数据加载中..."/>
          </li>
          :

          arr.length === 0 ?
          <li style={{paddingLeft: '20px',color: '#999'}}>
            没有找到供应商
          </li>
          :
          arr.map(function(item,key) {
            return (
               <li className={item.id == this.props.currentSupplier.id ? 'supplier-item currentSupplier':'supplier-item'}
                   key={key}
                   onClick={() => this.props.onSelect(item)}>
                  <Icon type="file" style={{color: 'rgb(128,128,128)'}}/>
                  <span style={{marginLeft: '5px',color: 'rgb(128,128,128)'}}>
                    [{item.code}]
                  </span>
                  <span style={{marginLeft: '5px'}}>
                    {item.name}
                  </span>
               </li>
            )
          },this)*/

        }
      </ul>
    )
  }
}
function getSupplierListHtml(arr) {
  if(!arr) {
    return (
      <li style={{paddingLeft: '20px',paddingTop: '5px'}}>
        <Spin tip="数据加载中..."/>
      </li>
    )
  } else if (arr.length === 0){
    return (
      <li style={{paddingLeft: '20px',color: '#999'}}>
        没有找到供应商
      </li>
    )
  } else {
    let html =  arr.map(function(item,key) {
      return (
        <li className={item.id == this.props.currentSupplier.id && !(this.props.editType.show && this.props.editType.title !== 'edit') ? 'supplier-item currentSupplier':'supplier-item'}
          key={key}
           onClick={() => this.props.onSelect(item)}>
          <Icon type="file" style={{color: 'rgb(128,128,128)'}}/>
          <span style={{marginLeft: '5px',color: 'rgb(128,128,128)'}}>
            [{item.code}]
          </span>
          <span style={{marginLeft: '5px'}}>
            {item.name}
          </span>
       </li>
      )
    },this)
    if(this.props.editType.show && this.props.editType.title !== 'edit') {
      let newItem = (
        <li className='supplier-item currentSupplier'
          key={'new'}>
          <Icon type="file" style={{color: 'rgb(128,128,128)'}}/>
          <span style={{marginLeft: '5px',color: 'rgb(128,128,128)'}}>
            [{}]
          </span>
          <span style={{marginLeft: '5px'}}>
            未命名
          </span>
        </li>
      )
      html.unshift(newItem);
    }
    return html;
  }
}

export default SupplierList;