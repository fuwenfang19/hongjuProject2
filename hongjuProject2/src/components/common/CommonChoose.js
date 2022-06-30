/**
 * 使用示例
 *
 *
 <CommonChoose
 initialChoosed={this.state.choosed}
 showGroup={true}
 type="staff"
 objectId=""
 isRadio={true}
 radioReturnObj={true} //单选的时候如果radioReturnObj是true 那么传入的initialChoosed应该是对象，onSelect返回也是对象
 onSelect={(data) => {
					//你的处理函数---
					console.log('helo');
					console.log(data);
					this.setState({
						choosed: data
					})
		}}
 />
 *
 *
 *
 *
 */

import React, {Component} from 'react';
import {Icon, Popover} from 'antd';
import FileChooseBox from './choose/FileChooseBox';
import domUtil from './../../global/utils/domutil';
import uuid from 'uuid';
import identifyStaff from '../../constants/common/identify-staff.js';

class CommonChoose extends Component {
	constructor() {
		super();
		this.state = {
			data: [],
			checkBoxShow: false,
			uuid: uuid.v4(),
			type: '',
			showGroup: 'true',
		}
	}

	static defaultProps = {
		onSelect: (arr) => {
			console.log('onSelect属性未设置');
		},
	};

	getInitialChoosed = (initialChoosed, radioReturnObj) => {
		radioReturnObj = radioReturnObj || false;
		if (this.props.isRadio && radioReturnObj) {
			if (initialChoosed === null || initialChoosed === undefined) {
				initialChoosed = [];
			} else if (Object.prototype.toString.call(initialChoosed) === '[object Object]') {
				if (Object.keys(initialChoosed).length === 0) {
					initialChoosed = [];
				} else {
					initialChoosed = [initialChoosed];
				}
			} else if (Object.prototype.toString.call(initialChoosed) === '[object Array]') {
				console.error('当radioReturnObj为true时，initialChoosed应该是对象');
				return false;
			} else {
				console.error('当radioReturnObj为true时，initialChoosed应该是对象');
			}
		}
		return initialChoosed;
	};

	componentWillMount() {
		let that = this;
		this.windowClick = function (event) {
			if (domUtil.isParent(event.target, that.refs[that.state.uuid])) {
			} else {
				// console.log('在区域外...');
				that.removeWindowClick();
				that.setState({
					checkBoxShow: false
				});
			}
		};

		let initialChoosed = this.getInitialChoosed(this.props.initialChoosed, this.props.radioReturnObj);
		this.setState({
			data: initialChoosed
		})
	}

	componentWillReceiveProps(nextProps) {
		let initialChoosed = this.getInitialChoosed(nextProps.initialChoosed, nextProps.radioReturnObj);
		this.setState({
			data: initialChoosed
		})
	}

	componentWillUnmount() {
		this.removeWindowClick();
	}

	removeWindowClick = () => {
		window.removeEventListener('click', this.windowClick, true);
	};


	okClick = (arr) => {

		this.setState({
			data: arr,
			checkBoxShow: !this.props.isRadio
		}, function () {
			if (!this.state.checkBoxShow) {
				this.removeWindowClick();
			}
		});
		if (this.props.isRadio && this.props.radioReturnObj) {
			this.props.onSelect(arr[0]);
		} else {
			this.props.onSelect(arr);
		}
	};
	cancelClick = () => {
		const that = this;
		this.setState({
			checkBoxShow: false
		}, function () {
			that.removeWindowClick();
		});
	};
	handleItemClick = (item, index) => {
		let data = this.state.data;
		if (index > -1) {
			data.splice(index, 1);
			this.setState(
				data
			);
			this.props.onSelect(data);
		}
	};
	arrToHtml = (arr) => {
		if (Object.prototype.toString.call(arr) !== '[object Array]') {
			// arr = this.getInitialChoosed(this.props.initialChoosed, this.props.radioReturnObj);
			console.error('commonChoose组件的initialChoosed传入不正确，当radioReturnObj为true的时候传入对象，其他情况传入的应该是数组');
			return;
		}
		return arr.map((item, index) => {
			let view = '';
			if (item[identifyStaff]) {
				if (this.ifNameRepeat(item, arr, index)) {
					view = item['name'] + '[' + item[identifyStaff] + ']';
				} else {
					view = item['name'];
				}
			} else {
				view = item['name']
			}
			return (
				<div className="common-choose-input-value" key={index}>
					<span>{view}</span>
					<Icon onClick={(e) => {
						e.stopPropagation();
						this.handleItemClick(item, index)
					}} type="close"/>
				</div>
			);
		})
	};
	ifNameRepeat = (item, arr, index) => {
		for (let i = 0; i < arr.length; i++) {
			if (i !== index) {
				if (item['name'] === arr[i]['name']) {
					return true;
				}
			}
		}
		return false;
	};
	handleChooseBoxShow = () => {
		if (!this.state.checkBoxShow) {
			const that = this;

			that.setState({
				checkBoxShow: true
			}, function () {
				// window.addEventListener('click', that.windowClick, true);
			});
		}
	};
	handleFocus = (e) => {
		this.refs.inp.focus();
	};
	handleClearData = (e) => {
		e.stopPropagation();
		this.setState({
			data: []
		});
		if (this.props.isRadio && this.props.radioReturnObj) {
			this.props.onSelect(null);
		} else {
			this.props.onSelect([]);
		}
	};

	hide = () => {
		this.setState({
			checkBoxShow: false,
		});
	};
	handleVisibleChange = (visible) => {
		this.setState({checkBoxShow: visible});
	};

	render() {
		// this.props.type
		let config = {
			showGroup: this.props.showGroup,
			type: this.props.type,
			billTypes: this.props.billTypes,//单据类型
			isRadio: this.props.isRadio,
			// 如果单选返回对象，那么传进来的也是对象，简单处理 内部都转化成数组 返回的时候再处理成对象
			radioReturnObj: this.props.radioReturnObj === undefined ? false : this.props.radioReturnObj,//是否单选返回对象 由于历史原因，默认应该是false
			objectId: this.props.objectId || '',
			okClick: this.okClick,
			cancelClick: this.cancelClick,
			initialChoosed: this.state.data,
			countperpage: this.props.countperpage || 300
		};
		return (
			<div>
				{1 ?
					<Popover
						content={
							<div>
								{this.state.checkBoxShow ? <FileChooseBox {...config} /> : ''}
							</div>
						}
						// title="档案选择"
						trigger="click"
						placement="bottomLeft"
						overlayClassName="common-choose-popover"
						visible={this.state.checkBoxShow}
						onVisibleChange={this.handleVisibleChange}
					>

						<div className={this.state.checkBoxShow ? "ant-select-open common-choose-box" : "common-choose-box"}
						     onClick={this.handleFocus} ref={this.state.uuid}>
							<div className="common-choose-input-box" onClick={this.handleChooseBoxShow}>
								{this.arrToHtml(this.state.data)}
								<input
									type="text"
									value=""
									className="common-choose-input"
									ref="inp"
									onKeyDown={(e) => {
										if (e.keyCode === 8) {
											let data = this.state.data;
											data.pop();
											this.setState({
												data
											});
											this.props.onSelect(data);
										}
									}}
								/>
							</div>
							{
								this.props.isRadio ? null : <div className="common-choose-clear" onClick={this.handleClearData}>
									<Icon type="close-circle" className="common-choose-clear-icon"/>
								</div>
							}{
							<div
								className={this.props.isRadio ? "common-choose-icon common-choose-icon-radio" : "common-choose-icon"}>
								<i className="ant-select-arrow"></i>
							</div>
						}

						</div>

					</Popover>
					:
					// 原来的逻辑
					<div onClick={this.handleFocus} ref={this.state.uuid} className="common-choose-box">

						<div className="common-choose-input-box" onClick={this.handleChooseBoxShow}>
							{this.arrToHtml(this.state.data)}
							<input
								type="text"
								value=""
								className="common-choose-input"
								ref="inp"
								onKeyDown={(e) => {
									if (e.keyCode === 8) {
										let data = this.state.data;
										data.pop();
										this.setState({
											data
										});
										this.props.onSelect(data);
									}
								}}
							/>

						</div>
						<div className="common-choose-clear" onClick={this.handleClearData}>
							<Icon type="close-circle" className="common-choose-clear-icon"/>
						</div>
						{this.state.checkBoxShow ? <FileChooseBox {...config} /> : ''}
					</div>
				}
			</div>







		);
	}
}

export default CommonChoose;
