import React from 'react';
import {Modal, Button} from 'antd';
import {FileChooseBox, Toast} from '../../common';


class AddMembers extends React.Component {
	constructor() {
		super();
		this.choosed = [];
	}

	handleOk = () => {
		const staffs = this.choosed;
		if (staffs.length === 0) {
			Toast.info('请选择要添加的项目人员！');
		} else {
			const staffIds = staffs.map(item => {
				return item.id.toString();
			});
			this.clear();
			this.props.addMembers(staffIds);
		}
	};
	handleCancel = () => {
		this.clear();
		this.props.changeAddMembersFlag(false);
	};

	clear = () => {
		this.choosed = [];
	};

	handleChange = (staffs) => {
		this.choosed = staffs;
	};

	render() {
		const title = '添加项目成员';
		return (
			<div>
				<Modal title={title}
				       visible={this.props.isAddingMembers}
				       onOk={this.handleOk}
				       onCancel={this.handleCancel}
				       wrapClassName="add-project-members-modal">
					{this.props.isAddingMembers ?
						<FileChooseBox
							isRadio={false} isDummy={true} type={'staff'}
							okClick={(staffs) => {
								this.handleChange(staffs);
							}}
							cancelClick={() => {
								this.handleCancel();
							}}
						/>
						:
						null
					}
				</Modal>
			</div>
		);
	}
}

export default AddMembers;