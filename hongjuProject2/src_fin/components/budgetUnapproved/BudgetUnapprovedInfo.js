/**
 * Created by yangyfe on 2017/5/18.
 * 预算报销单待审批右侧数据层
 */
import React, {Component} from 'react';
import {Pagination} from 'antd';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import {bindActionCreators} from 'redux';
import * as types from '../../actions/actionTypes';
import {SearchConditions,EditTable,CommonChoose} from '../../components/common';
import {changeBudgetUnapprovedKeyValue,getMyBudgetUnapprovedList} from '../../reducers/budgetUnapproved/budgetUnapprovedReducer';
import domUtil from '../../global/utils/domutil';


class BudgetUnapprovedInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],  // Check here to configure the default column
            loading: false,
        }
    }
    componentDidMount() {
        // this.props.dispatch(getMyBudgetUnapprovedList());

    }
    componentWillReceiveProps() {
    }

    showHigh = () =>{
        this.props.dispatch({
            type: types.BUDGET_CHANGE_SHOW_OR_HIDE,
            payload: true
        })
    }
    hideHigh = () =>{
        this.props.dispatch({
            type: types.BUDGET_CHANGE_SHOW_OR_HIDE,
            payload: false
        })
    }

    //表格的checkbox选择
    start = () => {
        this.setState({loading: false});
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 100);
    }
    //表格列表的选择
    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    onSearchConditionsChange = (conditions) => {
        this.props.changeBudgetUnapprovedKeyValue('myBudgetUnapprovedSearchConditions', conditions);
    };
    onDoSearch = (btnType) => {
        if (btnType === 'search') {
            this.props.getMyBudgetUnapprovedList();
        }
    };
    render() {

        const columns = [
            {
                title: '单据编号',
                dataIndex: 'code',
                width: '12%'
            }, {
                title: '申请类型',
                dataIndex: 'objectclassname',
                width:'12%'
            }, {
                title: '录入日期',
                dataIndex: 'startDate',
                width: '12%'
            }, {
                title: '申请人',
                dataIndex: 'createrid',
                width: '12%'
            }, {
                title: '申请总额',
                dataIndex: 'departmentname',
                width: '12%'
            }, {
                title: '审批状态',
                dataIndex: 'disburseclassname',
                width: '12%'

            }, {
                title: '备注',
                dataIndex: 'remark',
                width: '28%'

            }
        ];

        const defaultProps = [
            [
                {label: '申请单类型', code: 'objectclassids', type: 'commonChoose', fileType: 'billType', showGroup: false, isRadio: false,billTypes: []},
                {label: '申请单号', code: 'codes', type: 'input',placeholder:'支持查询多张单据，请以英文逗号隔开'},
                {
                    label: '', code: 'listtype', type: 'checkboxGroup', options: [
                    {label: '查看预算调整单', value: 'application'},
                    {label: '查看预算申请单', value: 'adjustment'},
                ]
                },
            ],
            [
                {label: '编制人',code:'createrids', type: 'commonChoose', fileType: 'staff', showGroup: false, isRadio: false},
                {label: '申请时间', colNum: 2, haveHr: true, code1: 'braidDateBegin', code2: 'braidDateEnd', type: 'date'},
                {
                    label: null, type: 'btns',
                    btns: [
                        {btnType: 'clear',},
                        {btnType: 'search',},
                        {btnType: 'collapse',}
                    ]
                }
            ],
            [
                {label: '费用部门', code: 'departmentids', type: 'commonChoose',fileType: 'department',showGroup: false, isRadio: false},
                {label: '项目',code: 'projectitemids', type: 'commonChoose',fileType: 'project',showGroup: false, isRadio: false},
                {label: '支出类型',code: 'disburseclassids', type: 'commonChoose',fileType: 'disburse',showGroup: false, isRadio: false},
            ]
        ];

        //让table自适应高度
        let offset = null;
        const tableHeaderHeight = 20;
        if (this.refs.membersTable) {
            offset = domUtil.getElementOffSet(this.refs.membersTable);
        }
        const tableConfigs = {
            pagination: false,
            scroll: {
                x: false,
                y: this.props.clientHeight - (offset ? offset.top + tableHeaderHeight + tableHeaderHeight + 8  : 400)
            },
            expandedRowRender: false
        };

        const {loading, selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div className="page budgetUnapproved-page">
                <div className = 'content-right'>
                    <div className = 'budgetUnapproved-right'>
                        <div>
                            <SearchConditions
                                conditions={this.props.myBudgetUnapprovedSearchConditions}
                                conditionsRows={defaultProps}
                                onChange={this.onSearchConditionsChange}
                                onBtnClick={this.onDoSearch}
                            />
                        </div>
                        <div ref="membersTable" className="DepartmentData-table">
                            <EditTable
                                {...tableConfigs}
                                clientHeight={this.props.clientHeight}
                                dataSource={this.props.budgetUnapprovedList.rows}
                                isEditing={false}
                                offsetBottom={40}
                                columns={columns}
                                rowKey={(record) => {
                                    return record.key;
                                }}
                                rowSelection={rowSelection}
                            >

                            </EditTable>

                        </div>
                        <div className="page-container">
                            <Pagination onChange={(page, pageSize) => {
                                this.props.myBudgetUnapprovedSearchConditions.pagenum = page;
                                this.onSearchConditionsChange(this.props.myBudgetUnapprovedSearchConditions);
                                this.props.myBudgetUnapprovedSearchConditions.countperpage = pageSize
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//将dispatch传递进来
function mapStateToProps(state) {
    let budgetUnapprovedState = state.get('budgetUnapprovedState');
    let isShow = budgetUnapprovedState.get('isShow');
    let budgetUnapprovedList = budgetUnapprovedState.get('budgetUnapprovedList');
    let myBudgetUnapprovedSearchConditions = budgetUnapprovedState.get('myBudgetUnapprovedSearchConditions').toJS();
    return {
        myBudgetUnapprovedSearchConditions,
        budgetUnapprovedList,
        isShow,
        clientHeight: state.get('baseState').toJS().clientHeight
    };
}
function mapDispatchToProps(dispatch) {
    let method = {
        getMyBudgetUnapprovedList,
        changeBudgetUnapprovedKeyValue,
    };
    let boundActionCreators = bindActionCreators(method, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(BudgetUnapprovedInfo);
