/**
 * Created by uncle on 2017/3/16.
 */
import React  from 'react';
import {Button} from 'antd';

export default class Page extends React.Component {

	constructor() {
		super();
	}

	render() {
		return (
			<div className="page budget-application-page">
				<div className="content-left">
					如果有我，就是左右结构，如果没有我，content-right就是大内容区
				</div>
				<div className="content-right">
					<div className="content-right-head">
						<div className="head-left">
							<span className="billName">预算申请</span>
						</div>
						<div className="head-right">
							<Button className="ant-btn ant-btn-primary">新增</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

