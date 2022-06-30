/**
 * 可编辑表格 文档就是defaultProps
 默认见 static defaultProps
 如下调用看效果
 <EditTable
 isEditing={true}
 onRowDataChange={(index,data) => {}}
 onTableDataChange={(newTableData) => {}}
 >
 </EditTable>

 如下实际使用的样例 ，注意columns中的dataType属性
 <EditTable
 dataSource={[]}
 columns={[]}
 isEditing={true}
 onTableDataChange={(newTableData) => {}}
 onRowDataChange={(index,data) => {}}
 >
 </EditTable>
 */

import React from 'react';
import {Input, InputNumber, Switch, Table, Radio, Select, Popover} from 'antd';
import {connect} from 'react-redux';
import CommonChoose from './CommonChoose';
import CustomRangeType from './customRangeType'
import uuid from 'uuid';
import domUtil from '../../global/utils/domutil';
import ExpenseType from '../bill/entryBillRule/ExpenseType';

const RadioGroup = Radio.Group;
const Option = Select.Option;
class EditTable extends React.Component {
	constructor() {
		super();
		this.state = {
			offset: null
		};
		this.uuid = uuid.v4();
	}

	componentDidMount() {
		this.resetTableOffset();
	}

	componentWillReceiveProps() {
		this.resetTableOffset();
	}

	resetTableOffset = () => {
		if (this.refs[this.uuid]) {
			this.setState({
				offset: domUtil.getElementOffSet(this.refs[this.uuid])
			})
		}
	};

	static defaultProps = {
		isEditing: true,
		columns: [
			{
				title: '档案参照例子',
				dataIndex: 'name',
				width: '25%',

				dataType: {
					type: 'file',
					fileType: 'staff',
					isRadio: true,
					isDummy: true,//true 不需要显示集团公司 false 需要显示
				},
			}, {
				title: '文本框例子',
				dataIndex: 'age',
				width: '15%',
				dataType: {
					type: 'text',
				},

			}, {
				title: '开关例子',
				dataIndex: 'address',
				width: '40%',
				dataType: {
					type: 'switch',
					switchLabel: 'switch说明',
					trueShowText: '真的',//非编辑态显示的文字
					falseShowText: '假的',//非编辑态显示的文字
					trueText: "正常",//勾选时候的字段对应的值 比如说 status 的 值是正常 的时候勾选
					falseText: "停用"
				}
			}, {
				title: '单选组例子',
				dataIndex: 'test',
				width: '40%',

				dataType: {
					type: 'radio',
					radioList: [
						{
							name: '现金支付',
							value: 'cashpayment'
						}, {
							name: '银行支付',
							value: 'bankpayment'
						}, {
							name: '票据支付',
							value: 'notepayment'
						},
					]
				}
			}
		],
		// dataSource: [
		// 	{
		// 		key: "1",
		// 		name: [{id: 1, code: 1, name: '我是档案'}],
		// 		age: "123",
		// 		address: false,
		// 		test: 'notepayment'
		// 	},
		// 	{
		// 		key: "2",
		// 		name: [],
		// 		age: "123",
		// 		address: true,
		// 		test: 'bankpayment'
		// 	},
		// ],
	};

	renderColumns = (isEditing, rowData, index, key, dataType) => {
		let keyArr = key.split('.');
		let evalKey = 'rowData';
		keyArr.forEach(item => {
			evalKey += `["${item}"]`
		});

		let value = eval(evalKey);
		const that = this;
		const onChange = function (value) {
			if (typeof value === 'string') {
				eval(`${evalKey} = "${value}"`);
			} else {
				value = JSON.stringify(value);
				eval(`${evalKey} = ${value}`);
			}
			that.handleChange(index, rowData);
		};
		const getValueHtml = (value) => {
			if (Object.prototype.toString.call(value) === '[object Object]') {
				return <div>{value.name}</div>
			} else if (Object.prototype.toString.call(value) === '[object Array]') {
				return <div>{value.map((item) => {
					return item.name + ' ';
				})}</div>
			}
			return <div> {value || ' '}</div>
		};
		return (
			<div className="edit-row-container">
				{(() => {
					if (isEditing) {
						if (dataType) {
							const {
								type,
								fileType, isRadio = true, isDummy = false, showGroup = false, objectId,
								switchLabel, trueText = true, falseText = false,
								step = 1,
								radioList, selectList
							} = dataType;
							if (type === 'file') {
								if (fileType === undefined) {
									console.error('dataType为file时，必须传递fileType参数');
								} else if (fileType === 'expenseType') {
									return (<ExpenseType
										initialChoosed={value || null}
										onSelect={(value) => {
											onChange(value);
										}}/>)
										;
								} else {
									if (Object.prototype.toString.call(value) === '[object Object]') {
										value = [value];
									}
									return (
										<CommonChoose initialChoosed={value || []}
										              showGroup={showGroup !== undefined ? showGroup : isDummy}
										              objectId={objectId}
										              type={fileType}
										              isRadio={isRadio}
										              onSelect={(value) => {
											              onChange(value);
										              }}/>
									)
								}
							} else if (type === 'switch') {
								return (
									<div>
										<span style={{marginRight: 6}}>{switchLabel}</span>
										<Switch checked={value === trueText}
										        onChange={(checked) => {
											        onChange(checked ? trueText : falseText);
										        }}/>
									</div>
								)
							} else if (type === 'radio') {
								return (
									<RadioGroup
										value={value}
										onChange={(e) => {
											onChange(e.target.value);
										}}>
										{radioList.map((item) => {
											return <Radio key={item.value} value={item.value}>{item.name}</Radio>
										})}
									</RadioGroup>
								)
							} else if (type === 'text') {
								return <Input className="edit-table-td-input" value={value} onChange={(e) => {
									onChange(e.target.value);
								}
								}/>
							} else if (type === 'number') {
								return <InputNumber style={{width: '100%'}} value={value} min={0} step={step}
								                    onChange={(value) => {
									                    onChange(value);
								                    }
								                    }/>
							} else if (type === 'numberPercent') {
								return <InputNumber style={{width: '100%'}} value={value}
												min={1}
												max={100}
												formatter={value => `${value}%`}
												parser={value => value.replace('%', '')}
												step={step}
								        onChange={(value) => {
									                    onChange(value);
								                    }
								                    }/>
							} else if (type === 'select') {
								return (
									<Select value={value+''} style={{ width: '100%' }}
									onChange={(value) => {
											onChange(value);
										}}>
										{selectList.map((item) => {
											return <Option key={item.value} value={item.value+''}>{item.name}</Option>
										})}
									</Select>
								)
							} else if (type === 'customRangeType') {
								return (
									<CustomRangeType
										value={value}
										onSelect={(value) => {
											onChange(value);
										}}
									/>
								)
							}
						} else {//没传dataType说明不需要编辑
							return getValueHtml(value);
						}
					} else {
						if (dataType) {
							if (dataType.type === 'switch') {
								const trueText = dataType.trueText || true;
								return <div>{value === trueText ? dataType.trueShowText : dataType.falseShowText}</div>
							}
							if (dataType.type === 'radio') {
								let selected = dataType.radioList.filter((item) => {
									return item.value === value;
								})[0];
								return <div>{selected.name}</div>
							}
							if (dataType.type === 'select') {
								let selected = dataType.selectList.filter((item) => {
									return item.value === value;
								})[0];
								return <div>{selected.name}</div>
							}if (dataType.type === 'customRangeType') {
								const selectedValue = value===0?'年':value===1?'半年':value===2?'季度':value===3?'月份':value
								return <div>{selectedValue}</div>
							}
						}
						return getValueHtml(value);
					}
				})()}

			</div>
		)
	};

	handleChange = (index, rowData) => {
		//console.log('表格数据改变：', index, rowData);
		this.props.dataSource[index] = rowData;
		if (this.props.onRowDataChange) {
			this.props.onRowDataChange(index, rowData);
		}
		this.props.onTableDataChange(this.props.dataSource);
	};


	render() {
		let {columns, dataSource, isEditing} = this.props;
		// console.log(this.props)
		// const isDummy = window.getUserInfo().isDummy;
		if (!this.props.clientHeight) {
			console.error('必须给editTable传clientHeight属性');
		}

		// 多级表头的时候 需要递归遍历的是最末级的定义！ 预算申请录入时需要支持
		const setColumnsRender = (columns) => {
			columns.forEach((item) => {
				if (item.children === undefined || item.children.length === 0) {
					item.render = (text, record, index) => {
						return this.renderColumns(isEditing, record, index, item.dataIndex, item.dataType);
					}
				} else {
					setColumnsRender(item.children);
				}
			});
		};
		setColumnsRender(columns);

		let offset = null;
		const tableHeaderHeight = 60;
		let temOffset = this.props.offsetBottom ? this.props.offsetBottom : 0;
		const offsetParentTop = 60 + temOffset;

		if (this.refs[this.uuid]) {
			offset = domUtil.getElementOffSet(this.refs[this.uuid]);
			// console.log(offset);
		}
		const tableConfig = {
			pagination: false,
			scroll: {
				x: this.props.scrollX ? this.props.scrollX : 600,
				y: this.props.clientHeight - (offset ? offset.top + tableHeaderHeight + offsetParentTop : 200)
			},
			expandedRowRender: false
		};


		return (
			<div ref={this.uuid}>
				<Table
					{...tableConfig}
					bordered
					dataSource={dataSource}
					columns={columns}

					className={isEditing ? 'edit-table edit-table-editing' : "edit-table"}
					rowClassName={(record) => {
						if (record['status'] === '正常') {
							return 'edit-table-row';
						} else {
							return 'edit-table-row-negative';
						}

					}}
					rowKey={this.props.rowKey ? this.props.rowKey : (record, index) => {
						return index;
					}}
					rowSelection={this.props.rowSelection}
					onRowClick={this.props.onRowClick}
					style={this.props.style}
				/>
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {
		clientHeight: state.get('baseState').toJS().clientHeight,
	}
}

export default connect(mapStateToProps)(EditTable);
