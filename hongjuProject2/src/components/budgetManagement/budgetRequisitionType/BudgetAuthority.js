/**
 * Created by yeyawei on 2017/5/26.
 */
import React, {Component} from 'react';
import {Icon, Button, Input, Checkbox, Modal, Tag} from 'antd';
import './BudgetAuthority.scss'
import {connect} from 'react-redux';
import {CommonTree, Confirm, Toast} from '../../../components/common';
var Search = Input.Search;
class BudgetAuthority extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
        <Modal
            title="预算申请权限分配"
            visible={this.props.visible}
            width={802}
            style={{top: "30px"}}
        >
          <div className="budgetAuthority-wrapper">
            <div className="budgetAuthority-left">
              <div style={{paddingBottom: "10px"}}>
                预算申请单
              </div>
              <div className="left-content">
                <ul>
                  <li className="budget-item">方案1</li>
                  <li className="budget-item buget-sel-item">方案2</li>
                </ul>
              </div>
            </div>
            <div className="budgetAuthority-right">
              <div style={{paddingBottom: "10px"}}>
                允许使用人员
              </div>
              <div className="right-content">
                <div className="person-wrapper">
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Tag color="#fff" closable={true}>啊啊啊</Tag>
                  <Button size="small">
                    更多 <Icon type="down" />
                  </Button>
                </div>
                <div className="search-wrapper">
                  <div className="search-department">
                    <Search></Search>
                    <div className="department-list">

                    </div>
                  </div>
                  <div className="search-person">
                    <Search></Search>
                    <div className="person-list">

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
    )
  }
}

export default BudgetAuthority;