import React from 'react';
import {Button, Row, Col, Switch, Form, Input, DatePicker, Icon, Select, Modal} from 'antd';
import {Toast, Confirm, renderLabelAndValues, DropdownList} from '../../../components/common';

const Option = Select.Option;
const FormItem = Form.Item;
class SupplierDetail extends React.Component {
  constructor() {
    super();

  }
  handDropDownBtnClick = (key) => {
  	if(key === 'delete') {
  		this.props.deleteSupplier();
		}
	}
	handleOk = () => {
    this.props.form.validateFields(
      (errors,values) => {
        if(errors) {
          let errorStr = '';
          for(let i in errors) {
            errorStr += errors[i].errors[0].message;
          }
          Toast.info(errorStr);
        } else {
          this.props.handleOk(this.props.editData.title);
        }
      }
    )
  }
  handleCancel = () => {
    if(this.props.supplierEditChanged) {
      Confirm({
        title: '供应商',
        content: {
          message: '还有数据没有保存确定要离开吗?'
        },
        onOk: this.props.handleCancel,
        onCancel: function() {

        },
        okText: '确定',
        cancelText: '取消'
      })
    } else {
      this.props.handleCancel();
    }

  }
  render() {
    const {currentSupplierDetail} = this.props;
		const {editData, currentSupplier, bankList, supplierEditChanged} = this.props;
    const {getFieldDecorator} = this.props.form;
    const formLayout = {
      labelCol: {span: 8},
			wrapperCol: {span: 16},
    }
    const buttons = [
      {
				key: 'btn1',
				size: 'small',
				type: 'primary',
				text: '下载模板',
				onClick: this.props.downloadTemplate
			},
			{
				key: 'btn2',
				size: 'small',
				type: 'primary',
				text: '导入数据',
				onClick: this.props.importDatas
			}
    ];
    const dropDownList = {trigger: 'click', data: [{id: 'delete', name: '删除'}]};
    return (
      <div className="content-right supplier-content-right">
        <div className="content-right-head">
					<div className="head-left">{editData.title !== 'edit' && editData.show ? '' : '[' + currentSupplierDetail.code + '] ' + currentSupplierDetail.name} </div>
					<div className="head-right">
						启用<Switch checked={currentSupplierDetail.status === "正常"} onChange={(value) => this.props.enableSupplier(value)} />
						{renderToolButton(buttons)}
						<Button onClick={this.props.editSupplier} type='primary' style={{display: editData.show ? 'none' : 'inline-block'}}>编辑供应商</Button>
						<Button onClick={this.handleCancel} type='primary' className="btn-cancel" style={{display: editData.show ? 'inline-block' : 'none'}}>取消</Button>
						<Button onClick={this.handleOk} type='primary' disabled={!supplierEditChanged} style={{display: editData.show ? 'inline-block' : 'none'}}>保存</Button>
					</div>
				</div>

        <div className="supplierEdit" style={{display: true ? 'block' : 'none'}}>
					<Form>
            <Row gutter={40}>
              <Col span={12}>
                <FormItem  label="供应商编码" required='required' {...formLayout}>
                  {editData.show ? getFieldDecorator('code', {
                    rules: [{ required: true, message: '供应商编码不能为空!' }],
                  })(<Input disabled={editData.title === 'edit'} style={{height: 30}}/>)
                  :
                  <span style={{fontSize: 14}}>{currentSupplierDetail.code}</span>}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem  label="供应商名称" required='required' {...formLayout}>
                  {editData.show ? getFieldDecorator('name', {
                    rules: [{ required: true, message: '供应商名称不能为空!' }],
                  })(<Input />)
                  :
                  <span style={{fontSize: 14}}>{currentSupplierDetail.name}</span>
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem  label="开户行" {...formLayout}>
                  {editData.show ? getFieldDecorator('bank', {
                    rules: [{ required: false, message: 'name is required!' }],
                  })(<Select mode="combobox">
                      {
                        bankList.map(function(item,index) {
                          return (<Option key={index} value={item.name}>{item.name}</Option>)
                        })
                      }
                    </Select>): <span style={{fontSize: 14}}>{currentSupplierDetail.bank}</span>}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem  label="银行账号" {...formLayout}>
                  {editData.show ? getFieldDecorator('bankAccount', {
                    rules: [{ required: false, message: 'name is required!' }],
                  })(<Input />) : <span style={{fontSize: 14}}>{currentSupplierDetail.bankAccount}</span>}
                </FormItem>
              </Col>
              <Col span={24} style={{paddingRight: 60, width: '98%'}}>
                <FormItem  label="供应商地址" labelCol={{span: 4}}	wrapperCol={{span: 20}}>
                  {editData.show ? getFieldDecorator('address', {
                    rules: [{ required: false, message: 'name is required!' }],
                  })(<Input />) : <span style={{fontSize: 14}}>{currentSupplierDetail.address}</span>}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>

      </div>
    )
  }
}
const supplierDetail = Form.create({
	onFieldsChange(props, changedFields) {//改变的字段对象
		// console.log(props, changedFields);
		const key = Object.keys(changedFields)[0];
		//银行账号格式化
    // if(key === 'bankAccount') {
     //  changedFields[key].value = changedFields[key].value.replace(/(\d{4})(?=\d)/g,"$1"+" ")
    // }
		props.onFilesChange({...changedFields[key]});
	},
	mapPropsToFields(props) {
		return {
			code: {
				value: props.editSupplierData.code,
			},
			name: {
				value: props.editSupplierData.name,
			},
      bank: {
			  value: props.editSupplierData.bank,
      },
			bankAccount: {
			  value: props.editSupplierData.bankAccount,
      },
      address: {
			  value: props.editSupplierData.address,
      },
      status: {
			  value: props.editSupplierData.status,
      },

		};
	},
	onValuesChange(props, values) {//改变的字段名和对应的值
		// console.log(props, values);
	},
})(SupplierDetail);
//右侧功能按钮
function renderToolButton(buttons) {
	return buttons.map((button) => {
		return (
			<Button key={button.key} size={button.size} type={button.type} disabled={button.disabled}
			        onClick={button.onClick}>
				{button.text}
			</Button>
		)
	})
}

export default supplierDetail;