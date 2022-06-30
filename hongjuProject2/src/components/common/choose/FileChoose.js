import React, {Component} from 'react';
import {Checkbox, Button, Icon, Spin} from 'antd';
import {getInitData, scrollGetData, searchData} from './fetchChooseItem';
import identifyStaff from '../../../constants/common/identify-staff.js';

class FileChoose extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			page: 1,
			choosedData: [],
			url: '',
			fetchData: true
		};
		//节流阀:用来控制滚动加载
		this.file_choose_flag = true;
		this.handleScroll = this.handleScroll.bind(this);
		this.toChooseHtml = this.toChooseHtml.bind(this);
		this.handleToChooseChange = this.handleToChooseChange.bind(this);
		this.handleChoosedChange = this.handleChoosedChange.bind(this);
		this.okClick = this.okClick.bind(this);
		this.cancelClick = this.cancelClick.bind(this);
	}

	static defaultProps = {
		searchKey: '',
		//选人---部门id
		department: null,
		//默认已经选择的值
		initialChoosed: [],
		type: '',
		countperpage: 100,
		systemusedstatus: '正常',
		objectId: '',
		typeMap: {
			// 人员
			staff: '/organization/getstaffsforwebbyrecursivedownview/',
			//业务序列
			operation: '/organization/web/busiseq/list/',
			//岗位
			station: '/organization/webpositionsforcombo/',
			//人员级别
			level: '/expense/getpersonranksforweb/',
			//部门
			department: '/organization/alldepartments/',
			// 支出
			disburse: '/organization/alldisburse/',
			// 项目
			project: '/organization/allexpenseitems/',
			// 城市列表
			city: '/expense/getcitiesbycountryforweb/',
			country: '/organization/web/country/list/',
			// 集团下所有公司
			group: '/organization/loadcompanyingroup/',
			//自定义
			selfDefine: '/expense/custombase/:objectId/',
			//银行
			bank: '/organization/web/bank/list/',
			// 供应商
			supplier: '/organization/supplier/app/list/',
			// 资金来源
			fundSource: '/organization/getfundsource/',
			transport: '/expense/transports/',
			billType: '/expense/getobjectclassbytopclass/',
		}
	};

	componentWillMount() {
		// console.log('-------will mount')
		this.setState({
			data: [],
			page: 1,
			url: '',
			choosedData: this.props.initialChoosed
		});
		if (this.props.type === 'staff') {
			let reqParam = {
				department: this.props.department,
				searchtype: "treeclick",
				pagenum: 1,
				countperpage: this.props.countperpage,
				status: "正常",
				systemusedstatus: this.props.systemusedstatus,
				company: this.props.company || window.getUserInfo().company
			};
			window.loading.add();
			getInitData(reqParam, this.props.typeMap[this.props.type], this);
		} else {

			let reqParam = {
				pagenum: 1,
				countperpage: this.props.countperpage,
				status: "正常",
				systemusedstatus: this.props.systemusedstatus,
				company: this.props.company || window.getUserInfo().company,
				searchtype: "treeclick"
			};
			if (this.props.type === 'billType') {
				reqParam = {type: this.props.currentBillType, namelike: this.props.searchKey || ''};
			}
			window.loading.add();
			if (this.props.type === 'selfDefine') {
				let url = this.props.typeMap[this.props.type].replace(':objectId', this.props.objectId);

				getInitData(reqParam, url, this);
			} else {
				getInitData(reqParam, this.props.typeMap[this.props.type], this);
			}
		}

	}

	componentWillReceiveProps(nextProps) {

		if (this.props.initialChoosed !== nextProps.initialChoosed) {
			this.setState({
				choosedData: nextProps.initialChoosed
			});
			return;
		}

		let reqParam = {
			company: nextProps.company || window.getUserInfo().company,
			pagenum: 1,
			countperpage: this.props.countperpage,
			status: "正常",
			systemusedstatus: this.props.systemusedstatus,
			searchtype: "treeclick"
		};

		if (!nextProps.typeMap[nextProps['type']] || !nextProps.typeMap[nextProps.type]) {
			return;
		}

		this.setState({
			data: [],
			fetchData: true
		});
		if (this.props.type === 'staff') {
			let reqParam = {
				department: nextProps.department,
				searchtype: "treeclick",
				pagenum: 1,
				countperpage: this.props.countperpage,
				status: "正常",
				systemusedstatus: this.props.systemusedstatus,
				company: nextProps.company || window.getUserInfo().company
			};

			// console.log(reqParam);
			if (nextProps['searchKey'].trim() !== '') {
				reqParam = {
					department: nextProps.department,
					status: "正常",
					systemusedstatus: this.props.systemusedstatus,
					company: nextProps.company || window.getUserInfo().company
				};
				reqParam['namelike'] = nextProps['searchKey'].trim();
				searchData(reqParam, nextProps.typeMap[nextProps.type], this);
			} else {
				getInitData(reqParam, nextProps.typeMap[nextProps.type], this);
			}


		} else {
			if (nextProps['searchKey'].trim() !== '') {
				reqParam = {
					company: nextProps.company || window.getUserInfo().company,
					status: "正常",
					systemusedstatus: this.props.systemusedstatus
				}
				if (this.props.type === 'billType') {
					reqParam = {type: nextProps.currentBillType};
				}
				reqParam['namelike'] = nextProps['searchKey'].trim();


				searchData(reqParam, nextProps.typeMap[nextProps.type], this);
			} else {
				if (this.props.type === 'billType') {
					reqParam = {type: nextProps.currentBillType};
					reqParam['namelike'] = nextProps['searchKey'].trim();
				}
				getInitData(reqParam, nextProps.typeMap[nextProps.type], this);
			}
		}

	}


	// 滚动加载请求数据
	handleScroll(e) {

		//资金来源不分页
		if (this.props.type === 'fundSource') {
			return;
		}
		//岗位不分页
		if (this.props.type === 'station') {
			return;
		}
		//单据类型不分页
		if (this.props.type === 'billType') {
			return;
		}


		if (this.props.searchKey.trim() !== '') {
			return;
		}
		let div = e.target;
		let scrollHeight = div.scrollHeight;
		let scrollTop = div.scrollTop;
		let clientHeight = div.clientHeight;

		if (scrollTop + clientHeight >= scrollHeight - 10 && this.file_choose_flag) {
			this.file_choose_flag = false;

			if (this.props.type === 'staff') {
				let reqParam = {
					department: this.props.department,
					searchtype: "treeclick",
					company: this.props.company || window.getUserInfo().company,
					pagenum: this.state.page,
					countperpage: this.props.countperpage,
					status: "正常",
					systemusedstatus: this.props.systemusedstatus,
				};
				window.loading.add();
				scrollGetData(reqParam, this.state.url, this);
			} else {
				let reqParam = {
					company: this.props.company || window.getUserInfo().company,
					pagenum: this.state.page,
					countperpage: this.props.countperpage,
					status: "正常",
					systemusedstatus: this.props.systemusedstatus,
					searchtype: "treeclick"
				};
				window.loading.add();
				scrollGetData(reqParam, this.state.url, this);
			}
		}
	}

	// 选择
	handleToChooseChange(e) {
		let target = e.target;
		let isChecked = target.checked;
		let value = target.value;
		let choosedData = this.state.choosedData.slice(0);
		let data = this.state.data;

		if (this.props.isRadio) {

			for (let i = 0; i < data.length; i++) {
				if (data[i]['id'] === value) {
					choosedData = [data[i]];
					break;
				}
			}
			this.setState({
				choosedData
			});
			//....
			this.props.okClick(choosedData.slice(0));

		} else {
			if (isChecked) {
				// console.log(isChecked);
				let exist = false;
				for (let j = 0; j < choosedData.length; j++) {
					if (choosedData[j]['id'] === value) {
						exist = true;
						break;
					}
				}
				// console.log(exist);
				if (!exist) {
					for (let i = 0; i < data.length; i++) {
						if (data[i]['id'] === value) {
							choosedData.push(data[i]);
						}
					}
				}
			} else {
				for (let j = 0; j < choosedData.length; j++) {
					if (choosedData[j]['id'] === value) {
						choosedData.splice(j, 1);
					}
				}

			}
			// console.log(choosedData);
			this.setState({
				choosedData
			});
			//....
			this.props.okClick(choosedData.slice(0));
		}


	}

	//处理已经选择
	handleChoosedChange(item) {

		let choosedData = this.state.choosedData.slice(0);
		let id = item['id'];
		let index = -1;
		for (let i = 0; i < choosedData.length; i++) {
			if (id === choosedData[i]['id']) {
				index = i;
			}
		}
		if (index > -1) {
			choosedData.splice(index, 1);
		}

		setTimeout(() => {
			this.setState({
				choosedData
			});
		}, 0);

	}

	// 确定按钮
	okClick() {
		// console.log(this.state.choosedData);
		this.props.okClick(this.state.choosedData.slice(0));
	}

	cancelClick() {
		this.props.cancelClick();
	}

	//生成选项
	toChooseHtml() {
		// console.log(this.state.data);
		return this.state.data.map((item, index) => {
			let choosedData = this.state.choosedData.slice(0);
			//
			let flag = false;
			for (let i = 0; i < choosedData.length; i++) {
				if (choosedData[i]['id'] === item['id']) {
					flag = true;
				}
			}
			let view = '';
			if (item[identifyStaff]) {
				let arr = this.state.data;
				if (this.ifNameRepeat(item, arr, index)) {
					view = item['name'] + '[' + item[identifyStaff] + ']';
				} else {
					view = item['name'];
				}
			} else {
				view = item['name'];
			}
			return <Checkbox className={this.props.isRadio ? "radio-check-box" : ""} key={index} value={item['id']}
			                 checked={flag} onChange={this.handleToChooseChange}>{view}</Checkbox>
		});
	}

	ifNameRepeat = (item, arr, index) => {
		for (let i = 0; i < arr.length; i++) {
			if (i !== index) {
				if (item['name'] === arr[i]['name']) {
					return true;
				}
			}
		}
		return false;
	}

	render() {

		let fetchDataing = this.state.fetchData;
		if (!fetchDataing) {
			window.loading.remove();
		}
		return (
			<div className="check-box" onScroll={this.handleScroll}>
				{!fetchDataing ? this.toChooseHtml() : <Spin tip="Loading..."></Spin>}
			</div>
		);
	}
}

export default FileChoose;