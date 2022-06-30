/**
 * Created by uncle on 2017/5/18.
 * 使用方式参见 staticProps
 */

import React from 'react';
import {InputNumber, Checkbox, Row, Col, Input, DatePicker, Button, Icon, Switch} from 'antd';
import {connect} from 'react-redux';
import CommonChoose from '../CommonChoose'
// const {RangePicker} = DatePicker;
const CheckboxGroup = Checkbox.Group;

const btnsLabel = {
	clear: '清空',
	search: '搜索',
	collapse: '高级'
};
class SearchConditions extends React.Component {

	constructor() {
		super();
		this.state = {
			showingHigh: false,
		}
	}

	componentDidMount() {
		this.changeStyle(false);
	}

	componentWillReceiveProps() {
	}

	changeStyle = (isDisplay) => {
		const nodeList = document.querySelectorAll('.high-col');
		for (let i = 0, l = nodeList.length; i < l; i++) {
			nodeList[i].style.display = isDisplay ? 'block' : 'none';
		}
	};

	/**
	 * 实例
	 */
	static defaultProps = {
		//条件的模型 对应redux中的定义，此处的key,应该和rows中的code吻合
		conditions: {
			billCode: '',
			billType: [],
			budgetStart: null,
			budgetEnd: null,
			createTimeBegin: null,
			createTimeEnd: null,

			approveStatus: ['Apple'],
			remark: '',
		},
		// 清空时候的数据
		clearedConditions: {
			billCode: '',
			billType: [],
			budgetStart: null,
			budgetEnd: null,
			createTimeBegin: null,
			createTimeEnd: null,

			approveStatus: ['Apple'],
			remark: '',
		},
		// * rows 中
		// * label 名称
		// * type 控件类型
		// * colNum 列数
		// * haveHr 是否有中间的短杠
		conditionsRows: [
			[
				{
					label: '单据类型',
					code: 'billType',
					type: 'commonChoose',
					fileType: 'billType',
					showGroup: false,
					isRadio: false,
				},
				{label: '单据编号', code: 'billCode', type: 'input', disabled: true},
				{label: '预算总额', colNum: 2, haveHr: true, code1: 'budgetStart', code2: 'budgetEnd', type: 'inputNumber',}
			],
			[
				{label: '录入日期', colNum: 2, haveHr: true, code1: 'createTimeBegin', code2: 'createTimeEnd', type: 'date',},
				{
					label: '审批状态', code: 'approveStatus', type: 'checkboxGroup', options: [
					{label: '未提交', value: 'Apple'},
					{label: '审批中', value: 'Pear'},
					{label: '已通过', value: 'Orange'},
					{label: '已驳回', value: 'Orange2'},
				]
				},
				{
					label: null, type: 'btns',
					btns: [
						{btnType: 'clear',},
						{btnType: 'search',},
						{btnType: 'collapse',}
					]
				}
			],
			[{label: '备注', code: 'remark', type: 'input'}]
		],
		//字段发生改变时候的回调，第一个返回参数是和conditions一样的模型
		onChange: (conditions) => {
			console.log(conditions);
		},
		//点击按钮回调 第一个返回参数是按钮的类型，
		onBtnClick: (btnType) => {
			// 比如点击搜索按钮之后的处理
			if (btnType === 'search') {
				console.log('do search...');
			}
		}
	};

	onChange = (key, value) => {
		let {conditions} = this.props;
		conditions[key] = value;
		this.props.onChange(conditions);
	};

	onBtnClick = (btnType) => {
		this.props.onBtnClick(btnType);
	};

	getSearchConditionRowsLayOut = (rows) => {
		let btnsIndex = 99999;
		let highConditions = false;
		return (
			<div className="search-conditions-container">
				{rows.map((row, rowIndex) => {
					return (
						<Row gutter={16} key={rowIndex}>
							{
								row.map((col, colIndex) => {
									if (col.type === 'btns') {
										btnsIndex = rowIndex;
									}
									if (rowIndex > btnsIndex) {
										highConditions = true;
									}
									return this.getSearchConditionColLayOut(col, colIndex, highConditions);
								})
							}
						</Row>
					)
				})}
			</div>
		)
	};
	/**
	 * 日期 可以扩展 选年，月，日，时间
	 */
	getSearchConditionColLayOut = (col, colIndex, highConditions) => {
		const isBtns = col.type === 'btns';
		let colClass = '';
		if (isBtns) {
			colClass = 'btns';
		}
		if (col.type === 'checkboxGroup') {
			colClass += ' checkbox-group-col';
		}
		return (
			<Col span={8} key={colIndex} className={highConditions ? 'high-col' : ''}>
				<Row gutter={0}>
					<Col span={isBtns ? 0 : 6}>
						<label className="info-label">{col.label}</label>
					</Col>
					<Col span={ isBtns ? 24 : 18} className={colClass}>
						{
							(() => {
								const code = col.code;
								const code1 = col.code1;
								const code2 = col.code2;
								//------------ 一列 -----------------------------------
								if (col.colNum === 1 || col.colNum === undefined) {
									return this.getComponent(code, col);
									//------------ 两列 -----------------------------------
								} else if (col.colNum === 2) {
									if (col.haveHr) {
										return (
											<Row gutter={0}>
												<Col span={11}>
													{this.getComponent(code1, col)}
												</Col>
												<Col span={2} style={{textAlign: 'center'}}>
													{col.haveHr ? '-' : null }
												</Col>
												<Col span={11}>
													{this.getComponent(code2, col)}
												</Col>
											</Row>
										)
									} else {
										return (
											<Row gutter={0}>
												<Col span={12}>
													{this.getComponent(code1, col)}
												</Col>
												<Col span={12}>
													{this.getComponent(code2, col)}
												</Col>
											</Row>
										)
									}
								}
							})()
						}
					</Col>
				</Row>
			</Col>
		)
	};


	getComponent = (code, col) => {//code 不能取col中的，因为有的是code1 code2
		const {conditions} = this.props;
		const type = col.type;
		if (col.canEdit === undefined) {
			col.canEdit = true;
		}
		const canEdit = col.canEdit;
		let value = conditions[code];
		if (canEdit) {
			if (type === 'input') {
				return <Input placeholder={col.placeholder || ''} disabled={col.disabled} value={conditions[code]} onChange={(e) => {
					this.onChange(code, e.target.value.trim())
				}}/>
			}
			if (type === 'switch') {
				return <Switch disabled={col.disabled} checked={false} onChange={(e) => {
					this.onChange(code, e);
				}}/>
			} else if (type === 'inputNumber') {
				return <InputNumber disabled={col.disabled} step={col.step || 1} value={conditions[code]} onChange={(num) => {
					this.onChange(code, num)
				}}/>
			} else if (type === 'commonChoose') {
				let choosed = conditions[code];
				if (choosed === null || choosed === undefined) {
					choosed = [];
				} else {
					if (Object.prototype.toString.call(choosed) === '[object Object]') {
						choosed = [choosed];
					} else if (Object.prototype.toString.call(choosed) === '[object Array]') {

					} else {

					}
				}
				if (col.fileType === 'billType') {
					if (col.billTypes === undefined) {
						console.info('Hi,你好，我是SearchConditions公共组件，' +
							'我发现您的' + col.code + '字段是参照单据类型，' +
							'如果你不需要所有的单据类型，请在conditionsRows的元素对象传递和type平级的billTypes，' +
							'它是一个数组，里面是你想要的单据类型,比如你想要申请单和报销单类型就传递' +
							'[2,3]，如果需要全部的单据类型，那么可以传递空数组 [],' +
							'同时我也就不会出现了，ByeBye~');
					}
				}
				const {isRadio = true} = col;
				return <CommonChoose
					initialChoosed={choosed}
					showGroup={col.showGroup || false}
					type={col.fileType || console.log('type是commonChoose的col中请传递fileType')}
					billTypes={col.billTypes}
					isRadio={isRadio}
					radioReturnObj={col.radioReturnObj || false}
					onSelect={(data) => {
						this.onChange(code, data)
					}}
				/>
			} else if (type === 'date') {
				return <DatePicker placeholder={''} disabled={col.disabled} value={conditions[code]}
				                   onChange={(date, dateStr) => {
					                   this.onChange(code, date)
				                   }}/>
			} else if (type === 'checkboxGroup') {
				return <CheckboxGroup disabled={col.disabled} options={col.options} value={conditions[code]}
				                      onChange={(checkedValues) => {
					                      this.onChange(code, checkedValues)
				                      }}/>
			} else if (type === 'btns') {
				return (
					(() => {
						return col.btns.map((btn, btnIndex) => {
							if (btn.btnType === 'collapse') {
								return <Button key={btnIndex} onClick={() => {
									this.setState({
										showingHigh: !this.state.showingHigh
									}, () => {
										this.changeStyle(this.state.showingHigh);
									})
								}} className={`${btn.btnType} ant-btn ant-btn-primary`}>{btnsLabel[btn.btnType]}
									{this.state.showingHigh ? <Icon type="up"/> : <Icon type="down"/> }

								</Button>
							} else {
								return <Button key={btnIndex} onClick={() => {
									this.onBtnClick(btn.btnType);
								}} className={`${btn.btnType} ant-btn ant-btn-primary`}>{btnsLabel[btn.btnType]}</Button>
							}
						})
					})()
				)
			}
		} else {

			if (type === 'input') {
				return <span>{value}</span>
			}
			if (type === 'switch') {
				return <span>{value ? '是' : '否'}</span>
			} else if (type === 'inputNumber') {
				let step = col.step || 1;
				let numCount = 0;
				if (String(step) === '0.01') {
					numCount = 1;
				} else if (String(step) === '0.01') {
					numCount = 2;
				}
				return <span>{Number(value).toFixed(numCount)}</span>
			} else if (type === 'commonChoose') {
				if (Boolean(col.isRadio) === true) {//单选
					if (Object.prototype.toString.call(value) === '[object Object]') {
						value = value.name;
					} else if (Object.prototype.toString.call(value) === '[object Array]') {
						value = (value[0] && value[0].name) || '';
					}
				} else {
					value = value && value.map(item => {
						return item.name;
					})
				}
				return <span>{value}</span>
			} else if (type === 'date') {
				return <span>{value}</span>
			} else if (type === 'checkboxGroup') {
				return <span>{value}</span>
			}
		}

	};


	render() {
		return (
			<div>
				{this.getSearchConditionRowsLayOut(this.props.conditionsRows)}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		clientHeight: state.get('baseState').toJS().clientHeight,
	}
}

export default connect(mapStateToProps)(SearchConditions);
