import React from 'react';
import {Form, Row, Col, Input, Button, Icon, Modal} from 'antd';
import {CommonChoose, Confirm} from '../../common/index'
const FormItem = Form.Item;


class BatchEditProject extends React.Component {
	constructor() {
		super();
		this.state = {
			"expenseitem": [],
			"department": [],
			"director": []
		}
	}

	handleOk = (e) => {
		e.preventDefault();
		const {expenseitem, department, director} = this.state;
		const reqData = {
			expenseitem: expenseitem[0] && expenseitem[0].id,
			department: department[0] && department[0].id,
			director: director[0] && director[0].id
		};

		if (director[0] === undefined) {
			Confirm({
				title: '提示',
				content: {
					message: '您确定清空当前批量条件下所有项目的项目总监吗？',
					explain: '此操作会清空所有当前批量条件下的项目的项目总监',
					highLightText: '清空当前批量条件下所有项目的项目总监',
				},
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.props.doBatchEdit(reqData);
				},
				onCancel: () => {
				}
			});
		} else {
			this.props.doBatchEdit(reqData);
		}
	};
	handleCancel = () => {
		this.props.changeBatchEditProjectFlag(false);
	};

	//选择部门的回调
	handleSelect = (code, value) => {
		this.setState({
			[code]: value
		})
	};


	render() {
		const formItemLayout = {
			labelCol: {span: 7},
			wrapperCol: {span: 17},
		};

		const fields = [
			{code: 'expenseitem', fileType: window.FILETYPE.project, labelName: '项目', showGroup: false, isRadio: true},
			{code: 'department', fileType: window.FILETYPE.department, labelName: '所属部门', showGroup: false, isRadio: true},
			{code: 'director', fileType: window.FILETYPE.staff, labelName: '项目总监', showGroup: true, isRadio: true},
		];


		const getFileds = (filed) => {
			const {code, labelName, fileType, showGroup, isRadio} = filed;
			return (
				<Col span={12} key={code}>
					<FormItem {...formItemLayout} colon={false} label={`${labelName}`}>
						<CommonChoose initialChoosed={this.state[code] || []}
						              showGroup={showGroup}
						              type={fileType}
						              isRadio={isRadio}
						              onSelect={(value) => {
							              this.handleSelect(code, value);
						              }}/>
					</FormItem>
				</Col>
			)
		};

		const title = '批量修改';

		return (
			<div>
				<Modal title={title}
				       visible={this.props.showBatchEditModal}
				       onOk={this.handleOk}
				       onCancel={this.handleCancel}
				       okText={'修改'}
				       wrapClassName="batch-edit-project">
					<Form
						className="ant-advanced-search-form">
						<Row className="batch-edit-row">
							<p>选择修改条件</p>
						</Row>
						<Row gutter={40}>
							{getFileds(fields[0])}
							{getFileds(fields[1])}
						</Row>
						<Row className="batch-edit-row">
							<p className="edit-value">填写修改为</p>
						</Row>

						<Row gutter={40}>
							{getFileds(fields[2])}
						</Row>
					</Form>
				</Modal>
			</div>
		);
	}
}

export default BatchEditProject;