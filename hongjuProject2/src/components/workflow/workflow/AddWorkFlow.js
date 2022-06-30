import React from 'react';
import {Modal, Checkbox} from 'antd';
import {Toast} from '../../common';
import * as constants from  '../../../constants/workflow/workflow';

const addType = {
	T: 'templates',
	P: 'process'
};
class AddWorkFlow extends React.Component {
	constructor() {
		super();
		this.state = {
			visible: false,
			type: 2,
			billTypeId: 0,
			billName: '',
			currentShow: 'local',//system local
			addedList: {
				[addType.P]: [],
				[addType.T]: []
			},
		}
	}

	handleOk = () => {
		const {type, billTypeId, addedList} = this.state;
		if (addedList[addType.P].length === 0 && addedList[addType.T].length === 0) {
			Toast.info('请勾选要添加的审批流');
			return false;
		}
		this.props.doAddWorkFlow(type, billTypeId, addedList);
		this.show(false);
	};
	handleCancel = () => {
		this.show(false);
	};

	show = (flag, type, billTypeId, billName) => {
		if (flag) {
			this.setState({
				visible: flag,
				show: flag,
				type: type,
				currentShow: 'local',
				newKey: +new Date(),
				billTypeId: billTypeId,
				billName: billName,
				addedList: {
					[addType.P]: [],
					[addType.T]: []
				},
			})
		} else {
			this.setState({
				visible: flag,
				show: flag,
			})
		}

	};

	add = (templateOrProcess, item) => {
		let temp = this.state.addedList[templateOrProcess].slice();
		temp.push(item.id);
		this.setState({
			addedList: {
				...this.state.addedList,
				[templateOrProcess]: temp
			}
		})
	};
	remove = (templateOrProcess, item) => {
		let addedList = this.state.addedList[templateOrProcess];
		const index = addedList.indexOf(item.id);
		addedList.splice(index, 1);
		this.setState({
			addedList: {
				...this.state.addedList,
				[templateOrProcess]: addedList
			}
		})
	};

	render() {
		const {addList} = this.props;
		const {
			type, visible, newKey,
			billName, currentShow, addedList
		} = this.state;
		const billIndexInAddList = {
			2: 0,
			3: 1,
			7: 2,
			15: 3,
		};

		const title = <p>新增<span className="bill-name">{billName}</span>审批流</p>;
		return (
			<div>
				<Modal title={title}
				       key={newKey}
				       visible={visible}
				       onOk={this.handleOk}
				       onCancel={this.handleCancel}
				       wrapClassName="add-work-flow">
					{this.state.show ?
						<div>
							{addList.length > 0 ? <div className="add-container">
								<div className="left">
									<ul>
										<li onClick={() => {
											this.setState({
												currentShow: 'local'
											})
										}} className={currentShow === 'local' ? 'active' : ''}>已建审批流
										</li>
										<li onClick={() => {
											this.setState({
												currentShow: 'system'
											})
										}} className={currentShow === 'system' ? 'active' : ''}>系统审批流模板
										</li>
									</ul>
								</div>
								{currentShow === 'system' ?
									<div className="right">
										<ul>
											{
												addList[0].templates[billIndexInAddList[type]].process.map((item, i) => {
													return (
														<li key={i}>
															<Checkbox defaultChecked={addedList[addType.T].indexOf(item.id) !== -1}
															          onChange={(e) => {
																          if (e.target.checked) {
																	          this.add(addType.T, item);
																          } else {
																	          this.remove(addType.T, item);
																          }
															          }
															          }>{item.name}</Checkbox>
														</li>
													)
												})
											}
										</ul>
									</div>
									:
									<div className="right">
										{
											addList[1].process[billIndexInAddList[type]].child_object.map((item, i) => {
												return (
													<div key={i}>
														<p>{item.name}</p>
														<ul>
															{
																item.process.map((process, j) => {
																	return (
																		<li key={j}>
																			<Checkbox defaultChecked={addedList[addType.P].indexOf(process.id) !== -1}
																			          onChange={(e) => {
																				          if (e.target.checked) {
																					          this.add(addType.P, process);
																				          } else {
																					          this.remove(addType.P, process)
																				          }
																			          }}>{process.name}</Checkbox>
																		</li>
																	)
																})
															}
														</ul>
													</div>
												)
											})
										}
									</div>
								}
							</div>
								:
								null}
						</div>
						: null
					}
				</Modal>
			</div>
		);
	}
}

export default AddWorkFlow;