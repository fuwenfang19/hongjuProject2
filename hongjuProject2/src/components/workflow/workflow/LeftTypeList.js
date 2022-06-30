/**
 * Created by uncle on 2017/3/14.
 */
import React from 'react';
import {Icon, Button, Collapse, Input} from 'antd';
import {Confirm, Toast} from '../../common';

const Panel = Collapse.Panel;
const customPanelStyle = {
    borderRadius: 4,
    marginBottom: 10,
    border: 0,
};

class LeftTypeList extends React.Component {
    constructor() {
        super();

    }

    getWorkFlowById = (process) => {
        this.props.getWorkFlowById(process);
    };

    clickAdd = (event, type, billTypeId, billName) => {
        event.stopPropagation();
        this.props.showAddWorkFlowModal(true, type, billTypeId, billName);
    };


    render() {
        const {typeList, clientHeight, currentDesign} = this.props;
        //申请单 2 290
        const getPanel = (title, type, height) => {
            return (
                <Panel
                    header={
						<span>
							<span className="leftCollapseTitle">{title}</span>
						</span>
					}
                    key={type}
                    style={customPanelStyle}
                >
                    <div className='left-type-list-container'
                         style={{minHeight: clientHeight - height, maxHeight: clientHeight - height}}>

                        <Collapse
                            accordion
                            bordered={false}
                            activeKey={this.props.activeBillTypeKey}
                            onChange={(k) => {
								this.props.changeWorkFlowRootKeyValue('activeBillTypeKey', k);
							}}>{
                            typeList.map((item, i) => {
                                if (item.ptype_id === type) {
                                    return (
                                        <Panel key={`${type}-${item.id}`}
                                               header={
											       <span>
												       <span className="leftCollapseSubTitle">{item.name}</span>
												       <Icon type="plus-circle" onClick={(e) => {
													       this.clickAdd(e, type, item.id, item.name);
												       }}/>
											       </span>}>
                                            {
                                                item.processDesigns.length === 0 ?
                                                    <div className="ant-table-placeholder">
                                                        <i className=" anticon anticon-frown-o"></i>
                                                        <span>暂无数据</span>
                                                    </div>
                                                    :
                                                    item.processDesigns.map((process, j) => {
                                                        return (
                                                            <div key={j} className="leftCollapseListWrap">
                                                                <div
                                                                    className={process.id === currentDesign.id ? 'current leftCollapseSubListItem' : 'leftCollapseSubListItem'}
                                                                    key={process.id} onClick={() => {
																	this.getWorkFlowById(process);
																}}>
                                                                    <span className="design-num">{`${j + 1}`}</span>
                                                                    <span className="design-name">{process.name}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                            }
                                            <div className='leftCollapseHr'></div>
                                        </Panel>
                                    )
                                }
                            })
                        }
                        </Collapse>
                    </div>
                </Panel>
            )
        };
        return (
            <div className="leftCollapse">
                <Collapse
                    accordion
                    bordered={false}
                    activeKey={this.props.activeBigTypeKey}
                    onChange={(k) => {
						this.props.changeWorkFlowRootKeyValue('activeBigTypeKey', k);
					}}>
                    {getPanel('申请单', 2, 360)}
                    {getPanel('报销单', 3, 360)}
                    {getPanel('还款单', 15, 360)}
                    {getPanel('订票单', 7, 360)}
                    {getPanel('预算申请单', 8, 360)}

                </Collapse>
            </div>
        );
    }
}


export default LeftTypeList;
