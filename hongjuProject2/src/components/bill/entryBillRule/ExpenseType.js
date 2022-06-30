import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { bindActionCreators } from 'redux';
import Toast from '../../common/Toast.js';
const Option = Select.Option;
import NetWork from '../../../global/utils/network';
import api from '../../../global/utils/api';
function getExpenseType(id, that, Toast) {
	return (dispatch, getState) => {
		let url = api.ENTRY_BILL_RULE_GET_EXPENSE_TYPE.replace(':id', id);
		NetWork.get(url, {}, (json) => {

			that.setState({
				data: json
			});
		}, (errData) => {
			that.setState({
				flag: true
			});
			Toast.error(errData['msg']);
		});

	}
}


class ExpenseType extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      flag: true,
      selectedItem: [],
      initialChoosed: undefined
    };
  }
  componentWillMount() {
    let item = this.props.initialChoosed;
    
    if (item) {
      if (item[0]) {
        let temItem = item[0];
        this.setState({
          initialChoosed: temItem['name'],
          selectedItem: [temItem]
        });
      } else {
        this.setState({
          initialChoosed: item['name'],
          selectedItem: [item]
        });
      }


    }

  }

  handleChange = (val) => {

    let reg = /\${.*}$/;
    let result = reg.exec(val);
    if (result) {
      let resultStr = result[0];
      resultStr = resultStr.slice(2, resultStr.length - 1);
      let id = parseInt(resultStr);
      let data = this.state.data;
      for (let i = 0, len = data.length; i < len; i++) {
        if (data[i]['id'] === id) {
          this.setState({
            selectedItem: [data[i]]
          });
          this.props.onSelect([data[i]]);
          break;
        }
      }
    } else {
      this.setState({
        selectedItem: []
      });
      this.props.onSelect([]);
    }
  }

  genHtml(data) {
    return data.map((item, i) => {
      return <Option value={item['name'].toString() + '${' + item['id'] + '}'} key={i}>{item['name']}</Option>
    })
  }
  handleGetData = () => {
    if (this.state.flag) {
      let id = this.props.billRule.objectClasses[0]['id'];
      this.props.getExpenseType(id, this, Toast);
      this.setState({
        flag: false
      });
    }
  }
  render() {
    return (
      <div onClick={this.handleGetData} className="expense-type-select-box">
        <Select
          defaultValue={this.state.initialChoosed}
          showSearch
          allowClear={true}
          className="expense-type-select"
          placeholder="可输入关键字搜索选项"
          onChange={this.handleChange}>
          {this.genHtml(this.state.data)}
        </Select>
      </div>
    )
  }
}
function mapStateToProps(state) {
  let baseState = state.get('baseState').toJS();
  let entryBillRuleState = state.get('entryBillRuleState');
  let billRule = entryBillRuleState.get('billRule').toJS();
  return {
    billRule
  };
}

function mapDispatchToProps(dispatch) {
  let method = {
    getExpenseType
  };

  let boundActionCreators = bindActionCreators(method, dispatch)
  return {
    ...boundActionCreators,
    dispatch
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ExpenseType);
