/**
 * Created by fuwenfang on 3/29/17.
 * 公司信息
 */

import React, { Component } from 'react';
import { Button} from 'antd';
import { connect } from 'react-redux';

class UserIntroduce extends Component {
  constructor() {
    super();
    this.state = {
        
    }
  }
  recover = () => {
    
  }
  componentDidMount(){
  }
  clickUserIntro = ()=>{
    window.location.href = 'http://127.0.0.1:3000/#/company_info'
  }
  render() {
    return (
      <div className="companyInfo-page page">
        <div className='content-right'>
          <Button type='primary' onClick = {this.clickUserIntro}>部门成员新手引导</Button>
        </div>
      </div>
    )
  }
}
function companyInfoStateToProps(state) {
  return {
  }
}

export default connect(companyInfoStateToProps)(UserIntroduce);
