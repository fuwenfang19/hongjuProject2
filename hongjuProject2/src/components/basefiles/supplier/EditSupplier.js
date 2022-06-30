import React from 'react';
import {Form, Row, Col, Input, DatePicker, Icon, Modal, Switch, Select} from 'antd';
import {Toast} from '../../common';
const Option = Select.Option;

const FormItem = Form.Item;
class EditSupplier extends React.Component {
  constructor() {
    super();
  }
  handleOk = () => {
    this.props.form.validateFields(
      (errors,values) => {
        if(errors) {
          let errorStr = '';
          for(let i in errors) {
            errorStr += errors[i].errors[0].message;
            errorStr += '\n'
          }
          Toast.info(errorStr);
        } else {
          this.props.handleOk(this.props.editData.title);
        }
      }
    )
  }
  handleCancel = () => {
    this.props.handleCancel();
  }
  render() {
    const {editData, currentSupplier, bankList} = this.props;
    const {getFieldDecorator} = this.props.form;
    const formLayout = {
      labelCol: {span: 7},
			wrapperCol: {span: 17},
    }
    return (
      <Modal title={editData.title == "edit" ? '编辑供应商' : '增加供应商'}
             visible={editData.show}
             onOk={this.handleOk}
             okText="保存"
             width="700px"
             onCancel={this.props.handleCancel}>
        <Form
          className="ant-advanced-search-form">
          <Row gutter={40}>
            <Col span={12}>
              <FormItem  label="供应商编码" {...formLayout}>
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: '供应商编码不能为空!' }],
                })(<Input disabled={editData.title === 'edit'}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  label="供应商名称" {...formLayout}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '供应商名称不能为空!' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  label="开户行" {...formLayout}>
                {getFieldDecorator('bank', {
                  rules: [{ required: false, message: 'name is required!' }],
                })(<Select>
                    {
                      bankList.map(function(item,index) {
                        return (<Option key={index} value={item.name}>{item.name}</Option>)
                      })
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  label="银行账号" {...formLayout}>
                {getFieldDecorator('bankAccount', {
                  rules: [{ required: false, message: 'name is required!' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  label="供应商地址" {...formLayout}>
                {getFieldDecorator('address', {
                  rules: [{ required: false, message: 'name is required!' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  label="状态" {...formLayout}>
                {getFieldDecorator('status', {
                  rules: [{ required: false, message: 'name is required!' }],
                })(
                  <Select>
                    <Option value="正常">正常</Option>
                    <Option value="停用">停用</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>

          </Row>
        </Form>
      </Modal>
    )
  }
}
const editSupplier = Form.create({
	onFieldsChange(props, changedFields) {//改变的字段对象
		// console.log(props, changedFields);
		const key = Object.keys(changedFields)[0];
		//银行账号格式化
    // if(key === 'bankAccount') {
     //  changedFields[key].value = changedFields[key].value.replace(/(\d{4})(?=\d)/g,"$1"+" ")
     //  // for(var i = 0,len = changedFields[key].value.length;i < len;i ++) {
		//    //  switch(i) {
     //  //     case 3:
     //  //       if(changedFields[key].value.charAt(4) == ' ' || len === 4) {
     //  //
     //  //       } else {
     //  //         len++
     //  //         changedFields[key].value = changedFields[key].value.substring(0,4) + " " + changedFields[key].value.substring(4)
     //  //       }
     //  //       break;
     //  //     case 8:
     //  //       if(changedFields[key].value.charAt(9) == ' ' || len === 9) {
     //  //
     //  //       } else {
     //  //         len++
     //  //         changedFields[key].value = changedFields[key].value.substring(0,9) + " " + changedFields[key].value.substring(9)
     //  //       }
     //  //       break;
     //  //     case 13:
     //  //       if(changedFields[key].value.charAt(14) == ' ' || len === 14) {
     //  //
     //  //       } else {
     //  //         len++
     //  //         changedFields[key].value = changedFields[key].value.substring(0,14) + " " + changedFields[key].value.substring(14)
     //  //       }
     //  //       break;
     //  //   }
     //  // }
    // }
		props.onFilesChange({...changedFields[key]});
	},
	mapPropsToFields(props) {
		return {
			code: {
				value: props.editSupplier.code,
			},
			name: {
				value: props.editSupplier.name,
			},
      bank: {
			  value: props.editSupplier.bank,
      },
			bankAccount: {
			  value: props.editSupplier.bankAccount,
      },
      address: {
			  value: props.editSupplier.address,
      },
      status: {
			  value: props.editSupplier.status,
      },

		};
	},
	onValuesChange(props, values) {//改变的字段名和对应的值
		// console.log(props, values);
	},
})(EditSupplier);
export default editSupplier;