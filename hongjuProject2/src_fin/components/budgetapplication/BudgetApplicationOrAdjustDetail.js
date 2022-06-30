/**
 * Created by uncle on 2017/5/18.
 */

import React from 'react';
import {Popover, Button, Row, Col, Input} from 'antd';
import {connect} from 'react-redux';
import {SearchConditions, EditTable} from '../../components/common'
import * as actions from '../../actions/index'
import uuid from 'uuid';
import domUtil from '../../global/utils/domutil';
import {hashHistory} from 'react-router';

class BudgetApplicationDetail extends React.Component {

	constructor() {
		super();
	}

	componentDidMount() {
		this.props.dispatch(actions.getMyBudgetApplicationList());
	}

	componentWillReceiveProps() {
	}

	goBack = () => {
		hashHistory.push('budget_application');//路由跳转
	};

	render() {

		const {budgetAppOrAdjustDetailState} = this.props;

		return (
			<div className="page budget-application-page">
				<div className="content-right">
					<div className="content-right-head">
						<div className="head-left">
							<span className="billName">
								<a className="" onClick={this.goBack}>返回</a>
							</span>
						</div>
						<div className="head-right">
						</div>
					</div>
					<div>
						test
					</div>
				</div>
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {
		clientHeight: state.get('baseState').toJS().clientHeight,
		budgetAppOrAdjustDetailState: state.get('budgetAppOrAdjustDetailState').toJS(),
	}
}

export default connect(mapStateToProps)(BudgetApplicationDetail);
