/**
 * Created by yangyfe on 2017/5/18.
 * 预算报销单待审批右侧数据层
 */
import React, {Component} from 'react';
import {Pagination} from 'antd';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import {SearchConditions,EditTable,CommonChoose} from '../../components/common'
import {bindActionCreators} from 'redux';
import * as types from '../../actions/actionTypes';
import {getMyBudgetApprovedList,changeBudgetApprovedKeyValue} from '../../reducers/budgetApproved/budgetApprovedReducer';
import domUtil from '../../global/utils/domutil';



const data = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        code: `code${i}`,
        name: `name ${i}`,
        position: `position${i}`,
        parent: `parent${i}`,
        department: `department${i}`,
        accountStatus: `accountStatus${i}`,
        checked: ``,
    });
}
class BudgetApprovedInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],  // Check here to configure the default column
            loading: false,
        }
    }
    componentDidMount() {

    }
    componentWillReceiveProps() {
    }

    showHigh = () =>{
        this.props.dispatch({
            type: types.BUDGET_CHANGE_APPROVED_SHOW_OR_HIDE,
            payload: true
        })
    }
    hideHigh = () =>{
        this.props.dispatch({
            type: types.BUDGET_CHANGE_APPROVED_SHOW_OR_HIDE,
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
        this.props.changeBudgetApprovedKeyValue('myBudgetApprovedSearchConditions', conditions);
    };
    onDoSearch = (btnType) => {
        if (btnType === 'search') {
            this.props.getMyBudgetApprovedList();
        }
    };
    render() {
        //搜索的所有的条件
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
                {label: '申请时间', colNum: 2, haveHr: true, code1: 'braidDateBegin', code2: 'braidDateEnd', type: 'date',},
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
                {label: '费用部门',  code: 'departmentids', fileType: 'department',type: 'commonChoose',showGroup: false, isRadio: false},
                {label: '项目', code: 'projectitemids',fileType: 'project',type: 'commonChoose',showGroup: false, isRadio: false},
            ],
            [
                {label: '支出类型',code: 'disburseclassids', fileType: 'disburse',type: 'commonChoose',showGroup: false, isRadio: false},
                {
                    label: '审批状态', code: 'approveStatus', type: 'checkboxGroup', options: [
                    {label: '同意', value: '1'},
                    {label: '驳回', value: '2'},
                ]
                },
            ]
        ]

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
        const columns = [
            {
                title: '单据编号',
                dataIndex: 'code',
                width: '10%',
            }, {
                title: '申请单类型',
                dataIndex: 'objectclassname',
                width: '12%',
            }, {
                title: '申请日期',
                dataIndex: 'startDate',
                width: '10%',
            }, {
                title: '申请人',
                dataIndex: 'createrid',
                width: '10%',
            }, {
                title: '申请总额',
                dataIndex: 'adjusted',
                width: '10%',
            }, {
                title: '审批意见',
                dataIndex: 'approvalstatus',
                width: '10%',

            }, {
                title: '审批日期',
                dataIndex: 'approvaltime ',
                width: '10%',

            }, {
                title: '编制部门',
                dataIndex: 'createrdepartmentid',
                width: '10%',

            },
            {
                title: '是由',
                dataIndex: 'remark',
                width: '18%',

            }
        ];
        const {loading, selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div className="page budgetApproved-page">
                <div className = 'content-right'>
                    <div className = 'budgetApproved-right'>
                        <div>
                            <SearchConditions
                                conditions={this.props.myBudgetApprovedSearchConditions}
                                conditionsRows={defaultProps}
                                onChange={this.onSearchConditionsChange}
                                onBtnClick={this.onDoSearch}
                            />
                        </div>
                        <div ref="membersTable" className="DepartmentData-table">
                            <EditTable
                                {...tableConfigs}
                                clientHeight={this.props.clientHeight}
                                dataSource={this.props.budgetApprovedList.rows}
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
                                this.props.myBudgetApprovedSearchConditions.pagenum = page;
                                this.onSearchConditionsChange(this.props.myBudgetApprovedSearchConditions);
                                this.props.myBudgetApprovedSearchConditions.countperpage = pageSize
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
    let budgetApprovedState = state.get('budgetApprovedState');
    let isShow = budgetApprovedState.get('isShow');
    let budgetApprovedList = budgetApprovedState.get('budgetApprovedList');
    let myBudgetApprovedSearchConditions = budgetApprovedState.get('myBudgetApprovedSearchConditions').toJS();
    return {
        budgetApprovedList,
        myBudgetApprovedSearchConditions,
        isShow,
        clientHeight: state.get('baseState').toJS().clientHeight
    };
}
function mapDispatchToProps(dispatch) {
    let method = {
        getMyBudgetApprovedList,
        changeBudgetApprovedKeyValue
    };
    let boundActionCreators = bindActionCreators(method, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(BudgetApprovedInfo);
