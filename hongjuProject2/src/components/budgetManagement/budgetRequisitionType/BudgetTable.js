import React, { Component } from 'react';
import { Table } from 'antd';

class BudgetTable extends Component {
    constructor() {
        super();
    }
    render() {
        let pdata = this.props.data;
        if (!pdata['id']) {
            return null;
        }

        let titleArr = [];
        switch (pdata['kind']) {
            case 0:
                titleArr = ['全年'];
                break;
            case 1:
                titleArr = ['上半年', '下半年'];
                break;
            case 2:
                titleArr = ['一季度', '二季度', '三季度', '四季度'];
                break;
            case 3:
                titleArr = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
                break;
            case 4:
                titleArr = ['自定义期间'];
                break;
        }
        let len = titleArr.length;
        let timeArr = [];
        let horizontalBody = pdata['horizontalBody'];
        let verticalBody = pdata['verticalBody'];
        let horizontalBodyValues = pdata['horizontalBodyValues'];

        for (let i = 0; i < len; i++) {
            if (horizontalBody && horizontalBody.length > 0) {
                let c = [];
                timeArr[i] = {
                    title: titleArr[i],
                    children: c
                };
                for (let j = 0; j < horizontalBody.length; j++) {
                    c[j] = {
                        title: horizontalBodyValues[j]['value']['name'],
                        children: [{
                            title: '预算',
                            dataIndex: 'companyAddress',
                            key: '$' + i + '$',
                            width: 60
                        }, {
                            title: '执行',
                            dataIndex: 'companyName',
                            key: '$' + i + '$2',
                            width: 60
                        }]
                    }
                }

            } else {
                timeArr[i] = {
                    title: titleArr[i],
                    children: [{
                        title: '预算',
                        dataIndex: 'companyAddress',
                        key: '$' + i + '$',
                        width: 60
                    }, {
                        title: '执行',
                        dataIndex: 'companyName',
                        key: '$' + i + '$2',
                        width: 60
                    }]
                }
            }
        }
        let v_arr = [];
        verticalBody.map((item, index) => {
            v_arr[index] = {
                title: item['dimensionRef']['dimension']['name'],
                dataIndex: item['dimensionRef']['dimension']['code'],
                key: item['dimensionRef']['dimension']['code'],
                width: 200
            };

        });

        const columns = [
            ...v_arr,
            ...timeArr
        ];

        const data = [];
        for (let i = 0; i < 2; i++) {
            data.push({
                key: i,
                street: '.',
                companyAddress: '.',
                companyName: '.'
            });
        }
        return (
            <Table
                className="budget-table"
                columns={columns}
                dataSource={data}
                bordered
                size="middle"
                scroll={{ x: len * 100 }}
                pagination={false}
            />
        );
    }
}

export default BudgetTable;