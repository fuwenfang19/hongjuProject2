import {Table, Input, Button} from 'antd';
import React from 'react';
import {CommonChoose} from '../components/common/index'

let copyData = [];
class Test extends React.Component {
	constructor() {
		super();

		const data = [];
		for (let i = 0; i < 100; i++) {
			data.push({
				key: i,
				name: '项目1',
				'1_1': i + 1,
				'1_2': 200,
				'2_1': 100,
				'2_2': 2035,
			});
		}
		this.state = {
			data: data,
			columns: [
				{
					title: '项目',
					dataIndex: 'name',
					key: 'name',
					width: 170,
					fixed: 'left',
					render: (text, record, index) => {
						return (
							<CommonChoose
								initialChoosed={[]}
								radioReturnObj={false}
								showGroup={true}
								type="project"
								isRadio={false}
								onSelect={(data) => {
									//你的处理函数---
									console.log(data);
								}}
							/>

						)
					}
				},
				{
					title: '2016年',
					children: [
						{
							title: '支出1',
							sorter: (a, b) => a.age - b.age,
							children: [
								{
									title: '预算',
									dataIndex: '1_1',
									key: '1_1',
									render: (text, record, index) => {
										return <Input defaultValue={record['1_1']} onChange={(e) => {
											const value = e.target.value;
											data[index]['1_1'] = value;
											this.onChange(data);
										}
										}/>
									}
								},
								{
									title: '执行',
									dataIndex: '1_2',
									key: '1_2',
									render: (text, record, index) => {
										return <Input />
									}
								}
							],
						},
						{
							title: '支出2',
							children: [
								{
									title: '预算',
									dataIndex: '2_1',
									key: '2_1',
									render: (text, record, index) => {
										return <Input />
									}
								},
								{
									title: '执行',
									dataIndex: '2_2',
									key: '2_2',
									render: (text, record, index) => {
										return <Input />
									}
								}
							],
						}],
				},
				{
					title: '2017年',
					children: [
						{
							title: '支出1',
							sorter: (a, b) => a.age - b.age,
							children: [
								{
									title: '预算',
									dataIndex: '1_11',
									key: '1_11',
									render: (text, record, index) => {
										return <Input value={record['12_1']} onChange={(e) => {
											const value = e.target.value;
											data[index]['12_1'] = value;
											this.onChange(data);
										}
										}/>
									}
								},
								{
									title: '执行',
									dataIndex: '1_22',
									key: '1_22',
									render: (text, record, index) => {
										return <Input />
									}
								}
							],
						},
						{
							title: '支出2',
							children: [
								{
									title: '预算',
									dataIndex: '2_11',
									key: '2_11',
									render: (text, record, index) => {
										return <Input />
									}
								},
								{
									title: '执行',
									dataIndex: '2_22',
									key: '2_22',
									render: (text, record, index) => {
										return <Input />
									}
								}
							],
						}],
				},
			]
		}
	}

	onChange = (data) => {
		copyData = data;
		console.log(copyData);
	};

	onChangeDisburse = () => {
		const {data, columns} = this.state;
		columns.forEach((item) => {
			if (item.children) {
				item.children.push(
					{
						title: '支出1',
						sorter: (a, b) => a.age - b.age,
						children: [
							{
								title: '预算',
								dataIndex: '1_1',
								key: '1_1' + Math.random(),
								render: (text, record, index) => {
									return <Input defaultValue={record['1_1']} onChange={(e) => {
										const value = e.target.value;
										data[index]['1_1'] = value;
										this.onChange(data);
									}
									}/>
								}
							},
							{
								title: '执行',
								dataIndex: '1_2',
								key: '1_2' +  Math.random(),
								render: (text, record, index) => {
									return <Input />
								}
							}
						],
					},
				)
			}
		});
		this.setState({columns})
	};
	onChangeTime = () => {
		const {data, columns} = this.state;
		columns.push(
			{
				title: '2017年',
				children: [
					{
						title: '支出1',
						sorter: (a, b) => a.age - b.age,
						children: [
							{
								title: '预算',
								dataIndex: '1_121',
								key: '1_211' + new Date(),
								render: (text, record, index) => {
									return <Input />
								}
							},
							{
								title: '执行',
								dataIndex: '1_222',
								key: '1_222' + new Date(),
								render: (text, record, index) => {
									return <Input />
								}
							}
						],
					},
					{
						title: '支出2',
						children: [
							{
								title: '预算',
								dataIndex: '2_211',
								key: '22_11' + new Date(),
								render: (text, record, index) => {
									return <Input />
								}
							},
							{
								title: '执行',
								dataIndex: '2_222',
								key: '2_222' + new Date(),
								render: (text, record, index) => {
									return <Input />
								}
							}
						],
					}],
			},
		);
		this.setState({columns})
	};

	addData = () => {
		const {data} = this.state;
		for (let i = 0; i < 100; i++) {
			data.push({
				key: i + new Date(),
				name: '项目1',
				'1_1': i + 1,
				'1_2': 200,
				'2_1': 100,
				'2_2': 2035,
			});
		}
		this.setState({data})
	};


	addColumn = () => {
		const {columns} = this.state;
		columns.unshift({
			title: '项目' + new Date(),
			dataIndex: 'name',
			key: 'name' + new Date(),
			width: 170,
			fixed: 'left',
			render: (text, record, index) => {
				return (
					<CommonChoose
						initialChoosed={[]}
						showGroup={true}
						type="staff"
						isRadio={true}
						onSelect={(data) => {
							//你的处理函数---
							console.log(data);
						}}
					/>

				)
			}
		},);
		this.setState({columns})
	};

	render() {
		const {data, columns} = this.state;


		return (
			<div>
				<Button onClick={this.addColumn}>加一列</Button>
				<Button onClick={this.addData}>加200条数据</Button>
				<Button onClick={this.onChangeTime}>增加期间</Button>
				<Button onClick={this.onChangeDisburse}>增加支出类型</Button>

				<Table
					columns={columns}
					dataSource={data}
					bordered
					size="small"
					pagination={false}
					// rowKey={(record, index) => {
					// 	return index;
					// }}
					scroll={{x: '130%', y: 500}}
				/>
			</div>
		)
	}
}

export default Test;