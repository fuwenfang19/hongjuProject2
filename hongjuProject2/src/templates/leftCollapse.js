/**
 * Created by fuwenfang on 3/16/17.
 * 费用类型
 */

import React, {Component} from 'react';
import {Button, Switch, Icon, Tooltip, Input, Select} from 'antd';
import {connect} from 'react-redux';
import update from 'react/lib/update';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {Collapse} from '../../common'
import uuid from 'uuid';
const Panel = Collapse.Panel;

const customPanelStyle = {
	borderRadius: 4,
	marginBottom: 10,
	border: 0,
};

class ExpenseType extends Component {
	constructor() {
		super();
	}

	render() {

		return (
			<div className="page">
				<div className='content-left'>
					<div className='leftCollapse'>
						<Collapse
							bordered={false}
							defaultActiveKey={'1'}
							accordion
						>
							<Panel
								header={
									<span>
	                  <span className='leftCollapseTitle'>标题名称</span>
	                  <Icon type="plus-circle"/>
                  </span>}
								key="1"
								style={customPanelStyle}>
								<div className='leftCollapseListWrap'>
									<div className={'current leftCollapseListItem'}>
										<Icon type="file-text"/>
										<span style={{marginLeft: 18}}>list名称</span>
									</div>
								</div>
								<div className='leftCollapseHr'></div>
							</Panel>
						</Collapse>
						<div className='content-right'></div>
					</div>
				</div>
			</div>
		)
	}
}
function expenseTypeStateToProps(state) {
	return {
		clientHeight: state.get('baseState').toJS().clientHeight,
		$$expenseTypeState: state.get('expenseTypeState')
	}
}

export default connect(expenseTypeStateToProps)(ExpenseType);
