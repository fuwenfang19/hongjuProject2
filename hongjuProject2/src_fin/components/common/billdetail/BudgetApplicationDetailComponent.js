/**
 * 预算申请单详情
 * Created by uncle on 2017/5/23.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Table, Row, Col, Icon, Button, Input, Menu, Dropdown, Checkbox, Switch, Spin, Timeline} from 'antd';
import {renderLabelAndValues} from '../../../components/common';
import * as commonConstants from '../../../constants/detail_fields_name'
import NetWork from '../../../global/utils/network';
const {FIELDS_IN_REIM_DETAIL} =commonConstants;
class BudgetApplicationDetailComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            detailType: '',
            code: null,
            id: null,
            param: '',
            detailUrl: '',
            detailSchemaUrl: '',
            detailApprovepathUrl: '',
            detail: null,
            Schema: null,
            Approvepath: null,
            fittedData: []
        }
        this.getHeadCustomFields = this.getHeadCustomFields.bind(this)
        this.getDetailData = this.getDetailData.bind(this)
        this.FitHeadData = this.FitHeadData.bind(this)

    }

    static staticProps = {
        datailType: '',
        type: '',//id 还是 查询条件 获取详情 如果是id取props中的id,如果是查询条件取props的param
        id: 0,
        param: {},
        onGetDetailDataOver: (detail) => {

        }
    };

    componentWillMount() {


    }

    componentDidMount() {
        this.getDetailData();
    }

    componentWillReceiveProps() {

    }

    getFreeitemData(detailSchemaUrl, objectId) {
        let param = {"objectId": objectId, "random": Math.random()};
        NetWork.get(detailSchemaUrl, param, (json) => {
            let expenseSchema = this.getSchemaDefine(json.data);
            expenseSchema.freeitemOrderArray.map((code)=> {
                this.getFields(expenseSchema.freeitemCodeNameMap[code].digits, expenseSchema.freeitemCodeNameMap[code].name, this.state.detail[code], code, expenseSchema.freeitemCodeNameMap[code].inputType)
            })
        })
    }

    getFields(digits, name, filedValue, code, type) {
        if (null == filedValue) {//空
            this.functionForGetFields(name, code, '', false)
        } else if (digits) {//是数字
            try {
                if (code && code == 'reportMoney') {//报销金额 需要可以编辑
                    // filedValue = Number(filedValue).toFixed(digits);
                    this.functionForGetFields(name, code, 'number', false)
                } else {
                    this.functionForGetFields(name, code, 'number', false)
                }
            } catch (e) {
                // filedValue = '';
                this.functionForGetFields(name, code, '', false)
            }
        } else if (type == '12') {
            if (filedValue == true || filedValue == 'true') {
                this.functionForGetFields(name, code, 'true', false)
            } else {
                this.functionForGetFields(name, code, 'false', false);
                filedValue = '否'
            }
        } else if (isArray(filedValue)) {//是数组
            // filedValue = filedValue.map(function (value) {
            //     return value.name;
            // }).join(',');
            this.functionForGetFields(name, code, 'list', false);
        } else if (typeof(filedValue) == 'object') {//是对象
            // filedValue = filedValue.name;
            this.functionForGetFields(name, code, 'name', false);
        }
        if (filedValue == undefined) {
            this.functionForGetFields(name, code, '', false);
        }
    }

    functionForGetFields(name, code, filedValue, isEdit) {
        let object = {
            name: name,
            key: code,
            type: filedValue == '' ? 'null' : filedValue,
            isEdit: isEdit,
            width: 8,
            order: FIELDS_IN_REIM_DETAIL.needJudge.length + FIELDS_IN_REIM_DETAIL.noJudge.length + 1
        };
        FIELDS_IN_REIM_DETAIL.noJudge.push(object);
    }

    getSchemaDefine(schemaData) {
        var schemaArray = [];
        if (schemaData) {
            for (var key in schemaData) {
                if (schemaData.hasOwnProperty(key)) {
                    schemaArray.push(schemaData[key]);
                }
            }
            schemaArray = schemaArray.sort((a, b)=> {
                return a.order - b.order
            });//排序
            var item;
            var orderArr = [];//按顺序存储code 里面的undefined 在取的时候要注意 全部
            var showName = {};//存取code对应的name  全部
            var freeitemOrderArr = [];//按顺序存储自定义字段code
            var freeitemShowName = {};//存取自定义字段code对应的name
            var orderIsZero = [];//order是0的
            var freeitemOrderIsZero = [];
            for (item in schemaArray) {
                if (schemaArray.hasOwnProperty(item)) {
                    var schemaColumn = schemaArray[item];
                    if (schemaColumn.visible) {
                        if (schemaColumn.order == 0) {
                            orderIsZero.push(schemaColumn.code);
                        } else {
                            orderArr.push(schemaColumn.code);
                        }
                        showName[schemaColumn.code] = schemaColumn;//名称和小数位数
                        if (schemaColumn.code.indexOf('freeitem') !== -1) {
                            if (schemaColumn.order == 0) {
                                freeitemOrderIsZero.push(schemaColumn.code);
                            } else {
                                freeitemOrderArr.push(schemaColumn.code);
                            }
                            freeitemShowName[schemaColumn.code] = schemaColumn;
                        }
                    }
                }
            }
            return {
                orderArray: orderIsZero.concat(orderArr),
                codeNameMap: showName,
                freeitemOrderArray: freeitemOrderIsZero.concat(freeitemOrderArr),
                freeitemCodeNameMap: freeitemShowName
            }
        } else {
            console.log(schemaData);
            throw 'schemaData是空';
        }
    }

    getDetailData() {
        const {detailType, id, param, detailUrl, detailSchemaUrl, detailApprovepathUrl}=this.props;
        this.setState({detailType: detailType});
        if (param) {
            NetWork.get(detailUrl, param, (json) => {
                this.setState({detail: json.rows[0]});
                this.getFreeitemData(detailSchemaUrl, json.rows[0].objectClass.id)
                this.setState({code: json.rows[0].code});
                const s = setInterval(() => {
                    let fittedData = this.FitHeadData(FIELDS_IN_REIM_DETAIL.needJudge, this.state.detail).concat(this.FitHeadData(FIELDS_IN_REIM_DETAIL.noJudge, this.state.detail));
                    fittedData.sort(function (b, a) {
                        return b.order - a.order;
                    });
                    this.setState({fittedData: fittedData});
                }, 500)


            })
        } else if (id) {
            let url = detailUrl.concat(id) + '/';
            NetWork.get(url, id, (json) => {
                this.setState({detail: json.rows[0]});
                this.setState({code: json.rows[0].code});
                let fittedData = this.FitHeadData(FIELDS_IN_REIM_DETAIL.needJudge, this.state.detail).concat(this.FitHeadData(FIELDS_IN_REIM_DETAIL.noJudge, this.state.detail));
                fittedData.sort(function (b, a) {
                    return b.order - a.order;
                });
                this.setState({fittedData: fittedData});
            })
        }
    }

    FitHeadData(staticFields, detailData) {
        let fittedList = [];
        staticFields.map((item)=> {
            if (item.type == 'name') {
                let fittedData = {};
                fittedData.name = item.name;
                if (detailData[item.key] != null && typeof(detailData[item.key]) == 'object') {
                    fittedData.value = detailData[item.key][item.type]
                } else if (detailData[item.key] == null) {
                    fittedData.value = ''
                } else {
                    fittedData.value = detailData[item.key];
                }
                fittedData.width = item.width;
                fittedData.order = item.order;
                fittedList.push(fittedData);
            } else if (item.type == 'date') {
                let fittedData = {};
                fittedData.name = item.name;
                fittedData.value = detailData[item.key];
                fittedData.width = item.width;
                fittedData.order = item.order;
                fittedList.push(fittedData);
            } else if (item.type == 'text') {
                let fittedData = {};
                fittedData.name = item.name;
                fittedData.value = detailData[item.key];
                fittedData.width = item.width;
                fittedData.order = item.order;
                fittedList.push(fittedData);
            } else if (item.type == 'number') {
                let fittedData = {};
                fittedData.name = item.name;
                fittedData.value = Number(detailData[item.key]).toFixed(2);
                fittedData.width = item.width;
                fittedData.order = item.order;
                fittedList.push(fittedData);
            } else if (item.type == 'list') {
                let fittedData = {};
                fittedData.name = item.name;
                fittedData.value = [];
                detailData[item.key].map((value)=> {
                    fittedData.value.push(value[item.listKey])
                });
                fittedData.value = fittedData.value.toString();
                fittedData.width = item.width;
                fittedData.order = item.order;
                fittedList.push(fittedData);
            } else if (item.type == 'null') {
                let fittedData = {};
                fittedData.name = item.name;
                fittedData.value = '';
                fittedData.width = item.width;
                fittedData.order = item.order;
                fittedList.push(fittedData);
            } else if (item.type == 'true') {
                let fittedData = {};
                fittedData.name = item.name;
                fittedData.value = '是';
                fittedData.width = item.width;
                fittedData.order = item.order;
                fittedList.push(fittedData);
            } else if (item.type == 'false') {
                let fittedData = {};
                fittedData.name = item.name;
                fittedData.value = '否';
                fittedData.width = item.width;
                fittedData.order = item.order;
                fittedList.push(fittedData);
            }
        });
        return fittedList;
    }

    getHeadCustomFields() {
        let {objectId, CustomFields} =this.props;
        let reqParam = {
            objectId: objectId,
            random: Math.random()
        }

        // NetWork.get(CustomFields, reqParam, (json) => {
        //     console.log(json)
        // })
    }

    // 详情数据用内部state管理，回调函数中传递当前单据详情
    // 回调函数的数量可能有很多个，目前有一个onGetDetailDataOver是获取完详情数据需要返回给外部


    onGetDetailDataOver = () => {
        let detail = '处理完变化的detail数据';
        this.props.onGetDetailDataOver(detail)
    };

    render() {
        return (
            <div>

                {
                    this.state.fittedData.length > 0 ?
                        <div>
                            {renderLabelName(this.state.detailType, this.state.code)}
                            <Row gutter={16}
                                 style={{marginLeft: 0,marginRight: -8,paddingLeft: 8,width: '99%',backgroundColor:'#fff' }}>
                                {
                                    this.state.fittedData.map((item)=> {
                                        return (
                                            renderLabelAndValues(
                                                item.name,
                                                item.value,
                                                false,
                                                item.width)
                                        )
                                    })
                                }
                            </Row>
                            <Timeline pending={<a href="#">See more</a>}  style={{marginLeft: 0,marginTop:20, marginRight: -8,paddingLeft: 8,width: '99%',backgroundColor:'#fff' }}>
                                <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                                <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                                <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                            </Timeline>
                        </div>

                        : <Spin tip="数据加载中...">
                    </Spin>
                }
                <div>

                </div>

            </div>
        )

    }
}
function renderLabelName(detailType, number) {
    return (
        <div style={{width: '99%',backgroundColor:'#fff'}}>
            <div style={{backgroundColor:'red',width:'17%',textAlign:'center',color:'#fff'}}>
                {detailType + '号:' + number}
            </div>

        </div>
    )
}
function isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
}
function mapStateToProps(state) {
    return {
        clientHeight: state.get('baseState').toJS().clientHeight,
    }
}
export default connect(mapStateToProps)(BudgetApplicationDetailComponent);
