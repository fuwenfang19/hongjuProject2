import React from 'react';
import {Form, Row, Col, Input, DatePicker, Icon, Modal, Switch, Select} from 'antd';
import {FileChooseBox, CommonChoose} from '../../common';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

class EditProjectForm extends React.Component {
	constructor() {
		super();
	}

	componentWillReceiveProps(nextState) {

	}

	handleOk = () => {
		this.props.form.validateFields((err, values) => {
			if (err === null) {
				this.props.updateCurrentProject(values);
			}
		});
	};
	handleCancel = () => {
		this.props.onEditOver();
	};

	//选择档案的回调
	overChooseFiles = (fieldCode, fileValue, index) => {
		fileValue = fileValue[0] || null;
		this.props.onFilesChange({name: fieldCode, value: fileValue});
		// this.overCancelChoose(index);
	};

	beginChooseFile = (index) => {
		this.props.changeFileChooseFlag(index, true);

	};
	overCancelChoose = (index) => {
		this.props.changeFileChooseFlag(index, false);
	};


	render() {
		const {getFieldDecorator} = this.props.form;
		const formItemLayout = {
			labelCol: {span: 7},
			wrapperCol: {span: 17},
		};
		const fields = this.props.editFields;

		const getFileds = (field, index) => {
			const {code, labelName, isRequire, choosing, disabled, inputType} = field;
			if (inputType === 'switch') {
				return (
					<Col span={12} key={`${code}`}>
						<FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
							{getFieldDecorator(`${code}`, {
								valuePropName: 'checked',
								rules: [
									{required: !!isRequire, message: `请输入${labelName}`},
								],
							})(
								<Switch/>
							)}
						</FormItem>
					</Col>);
			} else if (['staff', 'department'].indexOf(inputType) !== -1) {
				return (
					<div key={`${code + 1}`} style={{paddingLeft: '0', paddingRight: '0'}}>
						<Col span={12} style={{paddingLeft: '20px', paddingRight: '20px'}} key={`${code}`}>
							<FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
								{getFieldDecorator(`${code}`, {
									rules: [
										{required: !!isRequire, message: `请输入${labelName}`},
									],
								})(
									<CommonChoose
										initialChoosed={ this.props.editingProject[code] ? [this.props.editingProject[code]] : []}
										showGroup={(inputType === 'staff')&&!window.getUserInfo().isDummy}
										type={inputType}
										isRadio={true}
										onSelect={(value) => {
											this.overChooseFiles(code, value, index);
										}}/>
								)}
							</FormItem>
						</Col>
					</div>
				);
			} else if (inputType === 'select') {
				return (
					<Col span={12} key={`${code}`}>
						<FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
							{getFieldDecorator(`${code}`, {
								rules: [
									{required: !!isRequire, message: `请输入${labelName}`},
								],
								initialValue: '正常'
							})(
								<Select >
									<Option value="正常">正常</Option>
									<Option value="停用">停用</Option>
								</Select>
							)}
						</FormItem>
					</Col>
				)
			} else if (inputType === 'date') {
				return (
					<Col span={12} key={`${code}`}>
						<FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
							{getFieldDecorator(`${code}`, {
								rules: [
									{required: !!isRequire, message: `请输入${labelName}`},
								],
							})(
								<DatePicker placeholder="" style={{width: '100%'}}/>
							)}
						</FormItem>
					</Col>
				)
			}
			else {
				return (
					<Col span={12} key={`${code}`}>
						<FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
							{/*项目编码 项目名称 项目别名*/}
							{getFieldDecorator(`${code}`, {
								rules: [
									{required: !!isRequire, message: `请输入${labelName}`},
								],
							})(
								<Input placeholder="" disabled={disabled}/>
							)}
						</FormItem>
					</Col>
				)
			}
		};


		const title = this.props.editType == 'edit' ? '编辑项目' : (this.props.editType == 'add' ? '新增项目' : '新增子项目');

		return (
			<div>
				<Modal title={title}
				       visible={this.props.showEditModal}
				       onOk={this.handleOk}
				       okText={'保存'}
				       onCancel={this.handleCancel}
				       wrapClassName="add-or-edit-project">

					<Form
						className="ant-advanced-search-form">
						{this.props.showEditModal ?
							<Row gutter={40}>
								{
									fields.map(function (item, index) {
										return getFileds(item, index)
									})
								}
							</Row> : null}
					</Form>
				</Modal>
			</div>
		);
	}
}


const editProjectForm = Form.create({
	onFieldsChange(props, changedFields) {//改变的字段对象
		// console.log(props, changedFields);
		const key = Object.keys(changedFields)[0];
		props.onFilesChange({...changedFields[key]});
	},
	mapPropsToFields(props) {
		return {
			code: {
				value: props.editingProject.code,
			},
			name: {
				value: props.editingProject.name,
			},
			searchName: {
				value: props.editingProject.searchName,
			},
			department: {
				obj: props.editingProject.department,
				value: props.editingProject.department && props.editingProject.department.name,
			},
			director: {
				obj: props.editingProject.director,
				value: props.editingProject.director && props.editingProject.director.name,
			},
			manager: {
				obj: props.editingProject.manager,
				value: props.editingProject.manager && props.editingProject.manager.name,
			},
			finManager: {
				obj: props.editingProject.finManager,
				value: props.editingProject.finManager && props.editingProject.finManager.name,
			},
			startDate: {
				value: moment(props.editingProject.startDate).format() == 'Invalid date' ? null : moment(props.editingProject.startDate),
			},
			status: {
				value: props.editingProject.status,
			},
			endDate: {
				value: moment(props.editingProject.endDate).format() == 'Invalid date' ? null : moment(props.editingProject.endDate),
			},
			isCommon: {
				value: props.editingProject.isCommon,
			},
		};
	},
	onValuesChange(props, values) {//改变的字段名和对应的值
		// console.log(props, values);
	},
})(EditProjectForm);
export default editProjectForm;