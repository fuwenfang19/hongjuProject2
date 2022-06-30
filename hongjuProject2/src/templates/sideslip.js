/**
 * Created by uncle on 2017/3/16.
 */
import React, {Component} from 'react';
import {Icon, Checkbox, Modal} from 'antd';
import Animate from 'rc-animate'

export default class ConditionsSideSlip extends React.Component {

	constructor() {
		super();
		this.state = {
			visible: true,
			imgVisible: true,
		};
	}

	componentDidMount() {
	}

	closeSlip = () => {
		this.setState({
			visible: false
		})
	};

	render() {
		return (
			<div>
				<Animate transitionName="move-right">
					{this.state.visible ? (
							<div className="choose-side-slip">
								<div className="hide-event-wrap" onClick={this.closeSlip}></div>
								<div className="slip-real-container" style={{height: this.props.clientHeight - 60}}>
									<div className="normal-slip-head">
										<span className="level-text">高级</span>
										<span className='title'>标题</span>
										<span className="close-icon" onClick={() => {
										}}> <Icon type="cross"/></span>
									</div>
									<ul className="list-container"  style={{height: this.props.clientHeight - 130}}>
										<li className="list-choose-all">
                            <span className="check-all">
                                <Checkbox checked={true}
                                          onChange={() => {
                                          }}>
                                </Checkbox>
                            </span>
											<span className="spec">点击选择至详情区域</span>
										</li>
										<li className="list-item" key={1}>
                      <span className="item-checkbox">
                          <Checkbox
	                          checked={1}
	                          onChange={(e) => {

	                          }}>
                          </Checkbox>
                      </span>
											<div className="item-content">
												<div className="item-title">条目的名称</div>
												<div className="item-remark">条目的说明</div>
											</div>

											<span className="item-icon">
														<Icon type="exclamation-circle-o"
														      onClick={() => {
															      this.setState({
																      imgVisible: true
															      })
														      }}/>
											</span>

										</li>
									</ul>
								</div>
							</div>
						) :
						null
					}
				</Animate>
				<Modal title=""
				       visible={this.state.imgVisible}
				       onCancel={() => {
					       this.setState({
						       imgVisible: false
					       })
				       }}
				       wrapClassName='img-view-modal'
				       max-width='520'
				>
					<div>
						<img src={require('../images/billSetting/basicImg.jpg')}/>
					</div>
				</Modal>
			</div>
		);
	}
}

