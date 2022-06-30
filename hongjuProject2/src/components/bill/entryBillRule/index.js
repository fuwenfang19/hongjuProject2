import React, { Component } from 'react';
import { Input, Icon, Spin, Switch, Button, Select, Table, Checkbox, Tabs, Pagination, Popconfirm, Modal } from 'antd';
import {
    getBillRuleList,
    getBillTypes,
    getBillCanUseItems,
    getBillCanUseItemsOnlyBody,
    saveOrAddRule,
    getBillRule,
    getbillruledetails,
    deleteRule,
    saveBillRuleDetails,
    getExpenseMinorType
} from '../../../reducers/bill/entryBillRule/entryBillRuleReducer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as types from '../../../actions/actionTypes';
import api from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';
import { Confirm, Toast, EditTable } from '../../common/';
import Searchbar from '../../common/Searchbar.js'
import Animate from 'rc-animate';
import { inputTypesMap } from '../../../constants/reim/inputTypes';
import editImg from '../../../images/basefiles/edit.png';

const Search = Input.Search;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

let addData = {
    "bodyEntryRule": null,
    "companyID": 0,
    "department": null,
    "disburseClass": null,
    "expenseClass": null,
    "expenseItem": null,
    "freeitem1": null,
    "freeitem2": null,
    "freeitem3": null,
    "freeitem4": null,
    "freeitem5": null,
    "freeitem6": null,
    "freeitem7": null,
    "freeitem8": null,
    "freeitem9": null,
    "freeitem10": null,
    "freeitem11": null,
    "freeitem12": null,
    "freeitem13": null,
    "freeitem14": null,
    "freeitem15": null,
    "freeitem16": null,
    "freeitem17": null,
    "freeitem18": null,
    "freeitem19": null,
    "freeitem20": null,
    "fundSource": null,
    "groupID": 0,
    "id": null,
    "isHeader": true,
    "objectClassEntryRule": 0
};

class EntryBillRule extends Component {
    constructor() {
        super();
        this.state = {
            searchValue: '',
            showDisabledBillRuleList: false,
            selectedRule: {},
            visible: false,
            mainBillType: '3',
            minorBillType: [],
            addBillRuleName: '',
            addBillRuleStart: true,
            ruleTitleUse: {},
            ruleBodyUse: {},
            detailHeadColumn: [],
            detailBodyColumn: [],
            detailHeadItems: [],
            detailBodyItems: [],
            headCurrent: 1,
            headTotal: 0,
            editHead: false,
            editBody: false,
            bodyCurrent: 1,
            bodyTotal: 0,
            showHeadDelete: false,
            headSelectedRows: [],
            headSelectedRowKeys: [],
            bodySelectedRows: [],
            bodySelectedRowKeys: [],
            showBodyDelete: false,
            isEditRule: false,
            headScrollX: 600,
            bodyScrollX: 600,
            headTempId: 1,
            headDelArr: [],
            bodyDelArr: [],
            isAdd: false,
            addBody: false,
            addHead: false
        };
    }
    initState = () => {
        this.setState({
            searchValue: '',
            selectedRule: {},
            visible: false,
            mainBillType: '3',
            minorBillType: [],
            addBillRuleName: '',
            addBillRuleStart: true,
            ruleTitleUse: {},
            ruleBodyUse: {},
            detailHeadColumn: [],
            detailBodyColumn: [],
            detailHeadItems: [],
            detailBodyItems: [],
            headCurrent: 1,
            headTotal: 0,
            editHead: false,
            editBody: false,
            bodyCurrent: 1,
            bodyTotal: 0,
            showHeadDelete: false,
            headSelectedRows: [],
            headSelectedRowKeys: [],
            bodySelectedRows: [],
            bodySelectedRowKeys: [],
            showBodyDelete: false,
            isEditRule: false,
            headScrollX: 600,
            bodyScrollX: 600,
            headTempId: 1,
            headDelArr: [],
            bodyDelArr: [],
            isAdd: false,
            addBody: false,
            addHead: false
        });
        this.props.dispatch({
            type: types.ENTRY_BILL_RULE_EDIT_OR_ADD_SAVE_FLAG,
            payload: false
        });
        this.props.dispatch({
            type: types.ENTRY_BILL_RULE_GET_BILL_RULE_LIST_SUCCESS,
            payload: false
        });
        this.props.dispatch({
            type: types.ENTRY_BILL_RULE_GET_DISABLED_BILL_RULE_LIST_SUCCESS,
            payload: false
        });
        this.props.getBillRuleList(1);
        this.props.getBillRuleList(0);
    }
    static defaultProps = {
        countperpage: 20
    };
    componentWillMount() {
        this.props.dispatch({
            type: types.ENTRY_BILL_RULE_EDIT_OR_ADD_SAVE_FLAG,
            payload: false
        });
        this.props.dispatch({
            type: types.ENTRY_BILL_RULE_GET_BILL_RULE_LIST_SUCCESS,
            payload: false
        });
        this.props.dispatch({
            type: types.ENTRY_BILL_RULE_GET_DISABLED_BILL_RULE_LIST_SUCCESS,
            payload: false
        });
        this.props.getBillRuleList(1);
        this.props.getBillRuleList(0);
    }
    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps['saveSuccess']) {
            //初始化
            this.initState();
            return;
        }
        if (nextProps['deleteRuleSuccess']) {
            this.initState();

            this.props.dispatch({
                type: types.ENTRY_BILL_RULE_DELETE_RULE_SUCCESS,
                payload: false
            });

            return;

        }

        let obj = {};
        for (let i = 0; i < nextProps['addBillTitleData'].length; i++) {
            obj[nextProps['addBillTitleData'][i]['code']] = false;
        }
        let objBody = {};
        for (let i = 0; i < nextProps['addBillBodyData'].length; i++) {
            objBody[nextProps['addBillBodyData'][i]['code']] = false;
        }

        if (this.state.isEditRule) {
            for (let key in obj) {
                obj[key] = nextProps['billRule'][key];
            }
            if (nextProps['billRule']['entryrule_bodyrules'][0]) {
                let len = nextProps['billRule']['entryrule_bodyrules'].length;
                for (let key in objBody) {
                    objBody[key] = nextProps['billRule']['entryrule_bodyrules'][len - 1][key];
                }
            }
        }

        this.setState({
            ruleTitleUse: obj,
            ruleBodyUse: objBody
        });
        //  detailBillHead,
        // detailBilBody
        if (nextProps.detailBillHeadSuccess) {
            this.props.dispatch({
                type: types.ENTRY_BILL_RULE_DETAIL_BILL_HEAD_SUCCESS,
                payload: false
            });

            let billRule = nextProps['billRule'];
            let entryrule_bodyrules = billRule['entryrule_bodyrules'];
            let id = this.state.selectedRule['id'];


            this.props.getbillruledetails(id, { "countperpage": this.props.countperpage, "pagenum": 1, "body": null }, false);

            let detailBillHead = nextProps.detailBillHead;
            let detailHeadColumn = [];

            for (let i = 0; i < detailBillHead.length; i++) {

                let obj = {
                    title: detailBillHead[i]['name'],
                    dataIndex: detailBillHead[i]['title'],
                    width: 200,
                    dataType: {
                        type: 'file',
                        fileType: inputTypesMap[detailBillHead[i]['inputType']],
                        objectId: detailBillHead[i]['object_id'] || ''
                    }
                };
                detailHeadColumn[i] = obj;
            }
            if (!entryrule_bodyrules[0]) {
                this.setState({
                    detailBodyColumn:[],
                    detailHeadColumn,
                    headCurrent: 1,
                    headScrollX: detailHeadColumn.length * 200
                });
            } else {
                this.setState({
                    detailHeadColumn,
                    headCurrent: 1,
                    headScrollX: detailHeadColumn.length * 200
                });
            }

        }

        if (nextProps.detailBilBodySuccess) {

            this.props.dispatch({
                type: types.ENTRY_BILL_RULE_DETAIL_BILL_BODY_SUCCESS,
                payload: false
            });
            let billRule = nextProps['billRule'];
            let entryrule_bodyrules = billRule['entryrule_bodyrules'];
            let id = this.state.selectedRule['id'];

            if (entryrule_bodyrules[0]) {
                let len = entryrule_bodyrules.length;
                this.props.getbillruledetails(id, { "countperpage": this.props.countperpage, "pagenum": 1, "body": entryrule_bodyrules[len - 1]['id'] }, true);
            }

            let detailBilBody = nextProps.detailBilBody;
            let detailBodyColumn = [];

            for (let i = 0; i < detailBilBody.length; i++) {
                let obj = {
                    title: detailBilBody[i]['name'],
                    dataIndex: detailBilBody[i]['title'],
                    width: 200,
                    dataType: {
                        type: 'file',
                        fileType: inputTypesMap[detailBilBody[i]['inputType']],
                        objectId: detailBilBody[i]['object_id'] || ''
                    }
                };
                detailBodyColumn[i] = obj;
            }
            this.setState({
                detailBodyColumn,
                bodyCurrent: 1,
                bodyScrollX: detailBodyColumn.length * 200,
            });
        }

        if (nextProps['detailHeadItemsSuccess']) {
            this.props.dispatch({
                type: types.ENTRY_BILL_RULE_DETAIL_HEAD_TIEMS_SUCCESS,
                payload: false
            });
            let detailHeadItems = nextProps['detailHeadItems']['details'];

            this.setState({
                detailHeadItems,
                headTotal: nextProps['detailHeadItems']['count']
            });

        }

        if (nextProps['detailBodyItemsSuccess']) {
            this.props.dispatch({
                type: types.ENTRY_BILL_RULE_DETAIL_BODY_TIEMS_SUCCESS,
                payload: false
            });
            let detailBodyItems = nextProps['detailBodyItems']['details'];

            this.setState({
                detailBodyItems,
                bodyTotal: nextProps['detailBodyItems']['count']
            });
        }

        //保存成功
        if (nextProps['saveBillRuleDetailsSuccess']) {
            this.props.dispatch({
                type: types.ENTRY_BILL_RULE_SAVE_BILL_RULE_DETAILS_SUCCESS,
                payload: false
            });

            let billRule = nextProps['billRule'];
            let entryrule_bodyrules = billRule['entryrule_bodyrules'];
            let id = this.state.selectedRule['id'];

            this.props.getbillruledetails(id, { "countperpage": this.props.countperpage, "pagenum": 1, "body": null }, false);
            if (entryrule_bodyrules[0]) {
                let len = entryrule_bodyrules.length;
                this.props.getbillruledetails(id, { "countperpage": this.props.countperpage, "pagenum": 1, "body": entryrule_bodyrules[len - 1]['id'] }, true);
            }
            // 需完善
            this.setState({
                editHead: false,
                headCurrent: 1,
                editBody: false,
                bodyCurrent: 1,
                showHeadDelete: false,
                headSelectedRows: [],
                bodySelectedRows: [],
                showBodyDelete: false
            });
        }

    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.isAdd) {
            let doms = document.querySelectorAll('.entry-rule-detail-box .ant-table-body');
            let len = doms.length;
            let dom = null;
            if (len === 1) {
                dom = doms[0];
            } else if (len === 2) {
                if (this.state.addBody) {
                    dom = doms[1];
                } else if (this.state.addHead) {
                    dom = doms[0];
                }
            }
            if (dom) {
                let trs = dom.querySelectorAll('tr');
                let tr = trs[trs.length - 1];
                if (tr) {
                    let tds = tr.querySelectorAll('td');
                    let td = null
                    if (tds && tds.length >= 2) {
                        td = tds[1];
                        if (td) {
                            let inp = td.querySelector('input');
                            if (inp) {
                                inp.click();
                            }
                        }
                    }
                }

            }
            this.setState({
                isAdd: false,
                addBody: false,
                addHead: false
            });
        }
    }

    handleSearch = (e) => {
        this.setState({
            searchValue: e.target.value
        });
    }
    handleBillRuleSelect = (item) => {
        this.props.dispatch({
            type: types.ENTRY_BILL_RULE_SELECTED_RULE,
            payload: item
        });
        this.setState({
            detailHeadColumn: [],
            detailBodyColumn: [],
            detailHeadItems: [],
            detailBodyItems: [],
            headCurrent: 1,
            headTotal: 0,
            editHead: false,
            editBody: false,
            bodyCurrent: 1,
            bodyTotal: 0,
            showHeadDelete: false,
            headSelectedRows: [],
            headSelectedRowKeys: [],
            bodySelectedRows: [],
            bodySelectedRowKeys: [],
            showBodyDelete: false,
            selectedRule: item
        });

        this.props.getBillRule(item['id']);
    }
    handleDeleteRule = (item, e) => {
        e.stopPropagation();
        this.props.deleteRule(item['id']);
    }
    billRuleList = () => {

        let arr = [];
        let searchValue = this.state.searchValue.trim();
        if (this.state.showDisabledBillRuleList) {
            if (!this.props.disabledBillRuleListSuccess) {
                return <Spin tip="Loading..."></Spin>
            }
            arr = this.props.disabledRuleList;

        } else {

            if (!this.props.billRuleListSuccess) {
                return <Spin tip="Loading..."></Spin>
            }
            arr = this.props.billRuleList;
        }

        let c1 = 'entry-rule-left-content-item';
        let c2 = 'entry-rule-left-content-item entry-rule-left-content-item-selected';

        if (searchValue === '') {
            return arr.map((item, i) => {

                return (
                    <div key={i} className={this.state.selectedRule['id'] === item['id'] ? c2 : c1} onClick={this.handleBillRuleSelect.bind(this, item)}>
                        <Icon type="file" />
                        <span >{item['name']}</span>

                    </div>
                );
            });
        } else {
            let filterArr = []
            arr.map((item, i) => {
                if (item['name'].toString().trim().indexOf(searchValue) > -1) {
                    let val = (
                        <div key={i} className={this.state.selectedRule['id'] === item['id'] ? c2 : c1} onClick={this.handleBillRuleSelect.bind(this, item)}>
                            <Icon type="file" />
                            <span >{item['name']}</span>

                        </div>
                    );
                    filterArr.push(val);
                }
            });
            return filterArr;
        }


    }
    switchBillList = () => {
        this.setState({
            showDisabledBillRuleList: !this.state.showDisabledBillRuleList
        });
    }

    handleDownload = (item) => {
        NetWork.download(api.ENTRY_BILL_RULE_DOWNLOAD_TEMPLATE + item['id'] + '/');
    }
    handleUpload = (item) => {
        //
        let url = NetWork.getUrl(api.ENTRY_BILL_RULE_UPLOAD_TEMPLATE + item['id'] + '/');
        Confirm({
            title: '导入数据',
            isUpload: true,
            uploadConfig: {
                url: url,//上传的url
                data: {},//上传时需要的参数
                accept: '',//接收的文件类型 不传是xls和xlsx
            },
            onFileUploadSuccess: (response) => {//返回的是上传结束后的response
                Toast.success('上传成功!');
                document.getElementsByClassName('ant-modal-close')[0].click()
            },
            onOk: () => {
                this.forceUpdate();
            },
            onCancel: () => {
                this.forceUpdate();
            }
        });
    }
    //新增规则
    handleAddRule = () => {
        this.props.dispatch({
            type: types.ENTRY_BILL_RULE_SELECTED_RULE,
            payload: { id: 'addRuleid' }
        });
        this.props.getExpenseMinorType(3);

        this.setState({
            visible: true,
            isEditRule: false,
            addBillRuleStart: true,
            addBillRuleName: '',
            minorBillType: [],
            mainBillType: '3',
            showDisabledBillRuleList: false
        });
        this.props.getBillTypes();

    }
    //编辑规则
    //fn
    handleEditRule = () => {

        let billRule = this.props.billRule;

        let objectClasses = billRule['objectClasses'];
        let arr = [];
        for (let i = 0; i < objectClasses.length; i++) {
            arr[i] = objectClasses[i]['name'] + '${' + objectClasses[i]['id'] + '}';
        }
        this.props.getExpenseMinorType(billRule['topClass']['id']);

        this.setState({
            visible: true,
            isEditRule: true,
            addBillRuleStart: billRule['status'] === 1 ? true : false,
            addBillRuleName: billRule['name'],
            minorBillType: arr,
            mainBillType: billRule['topClass']['id'].toString()
        });
        this.props.getBillTypes();
        this.handleMinorBillTypeChoose(arr);

    }

    closeSlip = () => {
        this.setState({
            visible: false
        });
    }
    handleMainBillTypeChoose = (val) => {
        this.props.getExpenseMinorType(parseInt(val));
        this.setState({
            mainBillType: val,
            minorBillType: []
        });


        this.props.dispatch({
            type: types.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_TITLE,
            payload: []
        });

        if (val === '3') {
            this.props.getBillCanUseItemsOnlyBody({ "object_ids": [], "isBody": true });
        } else {
            this.props.dispatch({
                type: types.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_BODY,
                payload: []
            });
        }
    }
    handleMinorBillTypeChoose = (val) => {

        let object_ids = [];
        for (let i = 0; i < val.length; i++) {
            let reg = /\${.*}$/;
            let result = reg.exec(val[i]);
            if (result) {
                let resultStr = result[0];
                resultStr = resultStr.slice(2, resultStr.length - 1);
                object_ids.push(parseInt(resultStr));
            }
        }

        let mainBillType = this.state.mainBillType;

        this.setState({
            minorBillType: val
        });

        if (mainBillType.toString() === '3') {
            if (object_ids.length > 0) {
                this.props.getBillCanUseItems({ "object_ids": object_ids, "isBody": true });
                this.props.getBillCanUseItems({ "object_ids": object_ids, "isBody": false });
            } else {
                this.props.dispatch({
                    type: types.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_TITLE,
                    payload: []
                });
            }

        } else {
            if (object_ids.length > 0) {
                this.props.getBillCanUseItems({ "object_ids": object_ids, "isBody": false });
            } else {
                this.props.dispatch({
                    type: types.ENTRY_BILL_RULE_GET_CAN_USE_ITEMS_TITLE,
                    payload: []
                });
            }
        }


    }
    handleAddBillRuleName = (e) => {
        this.setState({
            addBillRuleName: e.target.value
        });
    }
    handleAddBillRuleStart = (v) => {
        this.setState({
            addBillRuleStart: v,
            showDisabledBillRuleList: !v
        });

    }
    //fn
    handleAddBillRuleSave = () => {

        // saveOrAddRule
        let topName = '';
        let mainBillType = this.state.mainBillType;
        let bodyData = this.props.addBillBodyData;
        let entryrule_bodyrules = [];
        let addBillTitleData = this.props.addBillTitleData;
        let ruleTitleUse = this.state.ruleTitleUse;
        let ruleBodyUse = this.state.ruleBodyUse;
        let addBillRuleName = this.state.addBillRuleName;
        let minorBillType = this.state.minorBillType;
        let billTypes = this.props.billTypes;
        let allMinorBillType = billTypes[mainBillType];
        let object_ids = [];
        let objectClasses = [];
        let billRule = this.props.billRule;
        let isEditRule = this.state.isEditRule;
        if (this.state.isEditRule) {
            if (billRule['entryrule_bodyrules'] && billRule['entryrule_bodyrules'][0]) {
                ruleBodyUse['id'] = billRule['entryrule_bodyrules'][0]['id'];
            }
        }

        if (addBillRuleName.trim() === '') {
            Toast.info('规则名称不能为空');
            return;
        }
        if (minorBillType.length <= 0) {

            Toast.info('影响单据类型不能为空');
            return;
        }

        for (let key in ruleBodyUse) {

            if (key !== 'useExpenseClass' && key !== 'id') {

                if (ruleBodyUse[key]) {
                    if (ruleBodyUse['useExpenseClass'] === false) {

                        Toast.info('单据体规则必须设置对应的费用类型');
                        return;
                    }
                }
            }

        }


        if (mainBillType === '2') {
            topName = '申请单';
        } else if (mainBillType === '3') {
            topName = '报销单'
        } else if (mainBillType === '15') {
            topName = '还款单';
        }


        for (let i = 0; i < minorBillType.length; i++) {
            let reg = /\${.*}$/;
            let result = reg.exec(minorBillType[i]);
            if (result) {
                let resultStr = result[0];
                resultStr = resultStr.slice(2, resultStr.length - 1);
                object_ids.push(parseInt(resultStr));
            }
        }

        for (let i = 0; i < object_ids.length; i++) {
            for (let j = 0; j < allMinorBillType.length; j++) {
                if (allMinorBillType[j]['id'] === object_ids[i]) {
                    objectClasses.push(allMinorBillType[j]);
                    break;
                }
            }
        }

        if (mainBillType === '3') {
            if (object_ids.length > 1) {
                for (let key in ruleBodyUse) {
                    if (key !== 'id') {
                        ruleBodyUse[key] = false;
                    }
                }
            }

            entryrule_bodyrules = [ruleBodyUse];
        } else {
            entryrule_bodyrules = [];
        }

        let req = {
            "id": null,
            "code": "",
            "name": this.state.addBillRuleName,
            "topClass": {
                "id": parseInt(mainBillType),
                "code": mainBillType,
                "name": topName
            },
            "status": this.state.addBillRuleStart ? 1 : 0,

            "objectClasses": objectClasses,
            "entryrule_bodyrules": entryrule_bodyrules
        };
        for (let key in ruleTitleUse) {
            req[key] = ruleTitleUse[key];
        }

        if (isEditRule) {
            req['id'] = billRule['id'];
            req['code'] = billRule['code'];
        }

        this.props.saveOrAddRule(req, Toast);

    }

    handleTittleUseChange = (val, checked) => {

        let ruleTitleUse = this.state.ruleTitleUse;
        ruleTitleUse[val] = checked;
        this.setState({
            ruleTitleUse: Object.assign({}, ruleTitleUse)
        });

    }
    handleBodyUseChange = (val, checked) => {

        let ruleBodyUse = this.state.ruleBodyUse;
        ruleBodyUse[val] = checked;

        this.setState({
            ruleBodyUse: Object.assign({}, ruleBodyUse)
        });


    }
    //单据头 编辑
    handleDetailHeadEdit = () => {
        this.setState({
            editHead: true,
            headSelectedRows: []
        });
    }
    //单据头 取消
    handleDetailHeadCancel = () => {
        let billRule = this.props['billRule'];
        let entryrule_bodyrules = billRule['entryrule_bodyrules'];
        let id = this.state.selectedRule['id'];

        this.props.getbillruledetails(id, { "countperpage": this.props.countperpage, "pagenum": 1, "body": null }, false);

        this.setState({
            editHead: false,
            headCurrent: 1,
            headSelectedRowKeys: [],
            headSelectedRows: [],
            headDelArr: [],
            showHeadDelete: false
        });
    }

    //单据头 新增
    handleDetailHeadAdd = () => {
        let { detailHeadItems, selectedRule } = this.state;
        let baseState = this.props.baseState;
        let userInfo = baseState['userInfo'];
        let item = Object.assign({}, addData);
        item['groupID'] = userInfo['groupid'];
        item['companyID'] = userInfo['company'];
        item['isHeader'] = true;
        item['objectClassEntryRule'] = selectedRule['id'];
        item['headTempId'] = this.state.headTempId;

        detailHeadItems.push(item);
        this.setState({
            editHead: true,
            addBody: false,
            addHead: true,
            detailHeadItems,
            headTempId: this.state.headTempId + 1,
            isAdd: true

        });

    }
    //单据头 保存
    handleDetailHeadSave = () => {
        let { detailHeadColumn, detailHeadItems, headDelArr } = this.state;
        let createItems = [];
        // let deleteItems = [];
        let updateItems = [];
        let req = {
            create: [],
            delete: [],
            update: []
        };

        //区分新增和更新
        for (let i = 0, len = detailHeadItems.length; i < len; i++) {
            if (detailHeadItems[i]['id'] === null) {
                //headTempId
                let tempItem = detailHeadItems[i];
                if (tempItem) {
                    delete tempItem['headTempId'];
                }
                createItems.push(tempItem);
            } else {
                updateItems.push(detailHeadItems[i]);
            }
        }

        //处理新增
        for (let i = 0, len = createItems.length; i < len; i++) {

            let item = createItems[i];
            for (let j = 0; j < detailHeadColumn.length; j++) {
                if (item[detailHeadColumn[j]['dataIndex']] && item[detailHeadColumn[j]['dataIndex']][0]) {
                    item[detailHeadColumn[j]['dataIndex']] = item[detailHeadColumn[j]['dataIndex']][0];
                }
            }

            for (let j = 0; j < detailHeadColumn.length; j++) {
                let temp = item[detailHeadColumn[j]['dataIndex']];
                if (temp && temp.length === 0) {
                    item[detailHeadColumn[j]['dataIndex']] = null;
                }
            }
            createItems[i] = item;
        }

        //处理更新
        for (let i = 0, len = updateItems.length; i < len; i++) {

            let item = updateItems[i];
            for (let j = 0; j < detailHeadColumn.length; j++) {
                if (item[detailHeadColumn[j]['dataIndex']] && item[detailHeadColumn[j]['dataIndex']][0]) {
                    item[detailHeadColumn[j]['dataIndex']] = item[detailHeadColumn[j]['dataIndex']][0];
                }
            }

            for (let j = 0; j < detailHeadColumn.length; j++) {
                let temp = item[detailHeadColumn[j]['dataIndex']];
                if (temp && temp.length === 0) {
                    item[detailHeadColumn[j]['dataIndex']] = null;
                }
            }

            updateItems[i] = item;
        }

        req['create'] = createItems;
        req['update'] = updateItems;
        req['delete'] = headDelArr;

        this.props.saveBillRuleDetails(req);
        this.setState({
            headSelectedRowKeys: [],
            headSelectedRows: [],
            editHead: false,
            headDelArr: [],
            showHeadDelete: false
        });
    }

    //单据头 删除
    handleDeleteHead = () => {
        let headSelectedRows = this.state.headSelectedRows;
        let detailHeadItems = this.state.detailHeadItems;
        let headDelArr = this.state.headDelArr;

        let arr = [];
        let delArr = [];
        for (let i = 0; i < detailHeadItems.length; i++) {
            if (detailHeadItems[i]['id'] !== null) {
                let flag = false;
                for (let j = 0; j < headSelectedRows.length; j++) {
                    if (headSelectedRows[j]['id'] === detailHeadItems[i]['id']) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    delArr.push(detailHeadItems[i]['id']);

                } else {
                    arr.push(detailHeadItems[i]);
                }
            } else {
                let flag = false;
                for (let j = 0; j < headSelectedRows.length; j++) {
                    if (headSelectedRows[j]['headTempId'] === detailHeadItems[i]['headTempId']) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    arr.push(detailHeadItems[i]);
                }
            }

        }


        this.setState({
            headSelectedRowKeys: [],
            headSelectedRows: [],
            detailHeadItems: arr,
            editHead: false,
            headDelArr: headDelArr.concat(delArr),
            showHeadDelete: false
        });
        setTimeout(() => {
            this.setState({
                editHead: true
            });
        }, 0);
    }
    //单据头 取消选择
    handleDeleteHeadCancel = () => {
        this.setState({
            showHeadDelete: false,
            headSelectedRows: [],
            headSelectedRowKeys: [],
        });
    }
    //单据体 取消选择
    handleDeleteBodyCancel = () => {
        this.setState({
            bodySelectedRowKeys: [],
            bodySelectedRows: [],
            showBodyDelete: false
        });
    }

    //单据体 删除
    handleDeleteBody = () => {

        //////
        let bodySelectedRows = this.state.bodySelectedRows;
        //detailBodyItems
        let detailBodyItems = this.state.detailBodyItems;
        let bodyDelArr = this.state.bodyDelArr;

        let arr = [];
        let delArr = [];
        for (let i = 0; i < detailBodyItems.length; i++) {
            if (detailBodyItems[i]['id'] !== null) {
                let flag = false;
                for (let j = 0; j < bodySelectedRows.length; j++) {
                    if (bodySelectedRows[j]['id'] === detailBodyItems[i]['id']) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    delArr.push(detailBodyItems[i]['id']);

                } else {
                    arr.push(detailBodyItems[i]);
                }
            } else {
                let flag = false;
                for (let j = 0; j < bodySelectedRows.length; j++) {
                    if (bodySelectedRows[j]['headTempId'] === detailBodyItems[i]['headTempId']) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    arr.push(detailBodyItems[i]);
                }
            }

        }


        this.setState({
            bodySelectedRowKeys: [],
            bodySelectedRows: [],
            detailBodyItems: arr,
            editBody: false,
            bodyDelArr: bodyDelArr.concat(delArr),
            showBodyDelete: false
        });
        setTimeout(() => {
            this.setState({
                editBody: true
            });
        }, 0);
    }


    //单据体 新增
    handleDetailBodyAdd = () => {
        let { detailBodyItems, selectedRule } = this.state;
        let baseState = this.props.baseState;
        let userInfo = baseState['userInfo'];
        let billRule = this.props.billRule;
        let obj = billRule['entryrule_bodyrules'][0];
        let item = Object.assign({}, addData);
        item['bodyEntryRule'] = obj['id'];
        item['groupID'] = userInfo['groupid'];
        item['companyID'] = userInfo['company'];
        item['isHeader'] = false;
        item['objectClassEntryRule'] = selectedRule['id'];
        item['headTempId'] = this.state['headTempId'];

        detailBodyItems.push(item);
        this.setState({
            editBody: true,
            addBody: true,
            addHead: false,
            detailBodyItems,
            headTempId: this.state.headTempId + 1,
            isAdd: true
        });


    }

    //单据体 保存

    handleDetailBodydSave = () => {
        let { detailBodyColumn, detailBodyItems, bodyDelArr } = this.state;
        let createItems = [];
        // let deleteItems = [];
        let updateItems = [];
        let req = {
            create: [],
            delete: [],
            update: []
        };

        //区分新增和更新
        for (let i = 0, len = detailBodyItems.length; i < len; i++) {
            if (detailBodyItems[i]['id'] === null) {
                //headTempId
                let tempItem = detailBodyItems[i];
                if (tempItem) {
                    delete tempItem['headTempId'];
                }
                createItems.push(tempItem);
            } else {
                updateItems.push(detailBodyItems[i]);
            }
        }

        //处理新增
        for (let i = 0, len = createItems.length; i < len; i++) {

            let item = createItems[i];
            for (let j = 0; j < detailBodyColumn.length; j++) {
                if (item[detailBodyColumn[j]['dataIndex']] && item[detailBodyColumn[j]['dataIndex']][0]) {
                    item[detailBodyColumn[j]['dataIndex']] = item[detailBodyColumn[j]['dataIndex']][0];
                }
            }

            for (let j = 0; j < detailBodyColumn.length; j++) {
                let temp = item[detailBodyColumn[j]['dataIndex']];
                if (temp && temp.length === 0) {
                    item[detailBodyColumn[j]['dataIndex']] = null;
                }
            }
            createItems[i] = item;
        }


        //处理更新
        for (let i = 0, len = updateItems.length; i < len; i++) {

            let item = updateItems[i];
            for (let j = 0; j < detailBodyColumn.length; j++) {
                if (item[detailBodyColumn[j]['dataIndex']] && item[detailBodyColumn[j]['dataIndex']][0]) {
                    item[detailBodyColumn[j]['dataIndex']] = item[detailBodyColumn[j]['dataIndex']][0];
                }
            }

            for (let j = 0; j < detailBodyColumn.length; j++) {
                let temp = item[detailBodyColumn[j]['dataIndex']];
                if (temp && temp.length === 0) {
                    item[detailBodyColumn[j]['dataIndex']] = null;
                }
            }

            updateItems[i] = item;
        }

        //处理  单据体规则必须设置对应的费用类型

        for (let i = 0, len = detailBodyColumn.length; i < len; i++) {

            if (detailBodyColumn[i]['dataIndex'] === 'expenseClass') {
                for (let j = 0; j < createItems.length; j++) {
                    if (!createItems[j]['expenseClass']) {
                        Toast.warning('单据体规则必须设置对应的费用类型');
                        return;
                    }
                }
                for (let j = 0; j < updateItems.length; j++) {
                    if (!updateItems[j]['expenseClass']) {
                        Toast.warning('单据体规则必须设置对应的费用类型');
                        return;
                    }
                }
            }
        }

        req['create'] = createItems;
        req['update'] = updateItems;
        req['delete'] = bodyDelArr;

        this.props.saveBillRuleDetails(req);
        this.setState({
            bodySelectedRowKeys: [],
            bodySelectedRows: [],
            editBody: false,
            bodyDelArr: [],
            showBodyDelete: false
        });
    }

    //单据体 编辑
    handleDetailBodyEdit = () => {
        this.setState({
            editBody: true,
            bodySelectedRows: []
        });
    }

    //单据体 取消
    handleDetailBodyCancel = () => {
        let billRule = this.props['billRule'];
        let entryrule_bodyrules = billRule['entryrule_bodyrules'];
        let id = this.state.selectedRule['id'];

        if (entryrule_bodyrules[0]) {
            let len = entryrule_bodyrules.length;
            this.props.getbillruledetails(id, { "countperpage": this.props.countperpage, "pagenum": 1, "body": entryrule_bodyrules[len - 1]['id'] }, true);
        }
        //
        this.setState({
            editBody: false,
            bodyCurrent: 1,
            bodySelectedRowKeys: [],
            bodySelectedRows: [],
            bodyDelArr: [],
            showBodyDelete: false
        });

    }


    //单据头 分页
    headPaginationChange = (page) => {

        let id = this.state.selectedRule['id'];
        this.props.getbillruledetails(id, { "countperpage": this.props.countperpage, "pagenum": page, "body": null }, false);

        this.setState({
            headCurrent: page
        });
    }

    //单据体 分页
    bodyPaginationChange = (page) => {
        let id = this.state.selectedRule['id'];
        let billRule = this.props.billRule;
        let obj = billRule['entryrule_bodyrules'][0];
        this.props.getbillruledetails(id, { "countperpage": this.props.countperpage, "pagenum": page, "body": obj['id'] }, true);
        this.setState({
            bodyCurrent: page
        });
    }
    getEditBillTypes = () => {
        let billRule = this.props.billRule;
        let objectClasses = billRule['objectClasses'];
        let arr = [];
        for (let i = 0; i < objectClasses.length; i++) {
            arr[i] = objectClasses[i]['name'] + '${' + objectClasses[i]['id'] + '}';
        }
        return arr;
    }
    genAddAndEditHtml = () => {
        let arr = [];
        let { isEditRule, mainBillType, minorBillType } = this.state;
        let { getExpenseMinorType, billRule, minorBillTypeItems, billTypes } = this.props;

        if (isEditRule) {
            let tem = billTypes[mainBillType];
            let temArr = [];
            let editBill = this.getEditBillTypes();
            if (tem) {
                for (let i = 0; i < editBill.length; i++) {
                    let reg = /\${.*}$/;
                    let result = reg.exec(editBill[i]);
                    if (result) {
                        let resultStr = result[0];
                        resultStr = resultStr.slice(2, resultStr.length - 1);
                        for (let jj = 0, len2 = tem.length; jj < len2; jj++) {
                            if (tem[jj]['id'] === parseInt(resultStr)) {
                                temArr.push(tem[jj]);
                                break;
                            }
                        }
                    }
                }
            }
            minorBillTypeItems = minorBillTypeItems.concat(temArr);
        }
        billTypes[mainBillType] = minorBillTypeItems;

        for (let key in billTypes) {
            arr.push(key);
        }

        if (arr.length <= 0) {
            return null;
        }

        let ruleTitleUse = this.state.ruleTitleUse;
        let ruleBodyUse = this.state.ruleBodyUse;

        let defaultValue = '3';
        if (isEditRule) {
            defaultValue = billRule['topClass']['id'].toString();
        }
        const columns = [{
            title: '栏目(单据头)',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text) => {
                return <span>{text}</span>
            },
        }, {
            title: '请选择',
            dataIndex: 'code',
            key: 'code',
            width: 200,
            className: 'entry-rule-add-rule-content-table-row',
            render: (text) => {
                return <Switch checked={ruleTitleUse[text]} onChange={this.handleTittleUseChange.bind(this, text)} />
            }
        }];
        let data = this.props.addBillTitleData;
        for (let i = 0; i < data.length; i++) {
            data[i]['key'] = i;
        }

        const bodyColumns = [{
            title: '栏目(单据体)',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text) => {
                return <span>{text}</span>
            },
        }, {
            title: '请选择',
            dataIndex: 'code',
            key: 'code',
            width: 200,
            className: 'entry-rule-add-rule-content-table-row',
            render: (text) => {
                return <Switch checked={ruleBodyUse[text]} onChange={this.handleBodyUseChange.bind(this, text)} />
            }
        }];

        let bodyData = this.props.addBillBodyData;
        for (let i = 0; i < bodyData.length; i++) {
            bodyData[i]['key'] = i;
        }


        return (
            <div className="entry-rule-add-rule-content" onClick={this.closeSlip}>
                <div onClick={(e) => {
                    e.stopPropagation();
                }}
                    className="entry-rule-add-rule-content-content"
                >
                    <div className="entry-rule-add-rule-scroll-box" >

                        <div className="entry-rule-add-rule-content-switch">
                            <div>启用该规则</div>
                            <Switch checked={this.state.addBillRuleStart} onChange={this.handleAddBillRuleStart} />
                        </div>
                        <div className="entry-rule-add-rule-content-inp1">
                            <div className="inp1-rule1">
                                <span className="s1">规则名称</span>
                                <Input placeholder="请输入规则名称" value={this.state.addBillRuleName} onChange={this.handleAddBillRuleName} />
                            </div>
                            <div className="inp1-rule2">
                                <span className="s1">影响单据大类</span>
                                <Select className="inp1-rule2-select" defaultValue={defaultValue} value={this.state.mainBillType} onChange={this.handleMainBillTypeChoose}>
                                    {arr.map((item, i) => {
                                        item = item.toString();
                                        let val = '';
                                        if (item === '2') {
                                            val = '申请单';
                                        } else if (item === '3') {
                                            val = '报销单'
                                        } else if (item === '15') {
                                            val = '还款单';
                                        }

                                        return <Option value={item} key={i}>{val}</Option>
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="entry-rule-add-rule-content-inp2">
                            <div className="inp2-rule2">
                                <span className="s1">影响单据类型</span>
                                <Select
                                    allowClear={true}
                                    value={this.state.minorBillType}
                                    className="inp2-rule2-select"
                                    mode="multiple"
                                    placeholder="请先选择影响单据大类,可输入关键字搜索选项"
                                    onChange={this.handleMinorBillTypeChoose}>

                                    {billTypes[this.state.mainBillType] ? billTypes[this.state.mainBillType].map((item, i) => {
                                        return <Option value={item['name'].toString() + '${' + item['id'] + '}'} key={i}>{item['name']}</Option>
                                    }) : null}
                                </Select>
                            </div>
                        </div>
                        <div className="entry-rule-add-rule-content-table-title">影响规则的栏目</div>
                        <div className="entry-rule-add-rule-content-table fn-clear" >
                            <div className="entry-rule-add-rule-content-table-right">
                                <Table columns={columns} dataSource={data} pagination={false} bordered={true} scroll={{ y: 300 }} />
                            </div>

                            {this.state.mainBillType === '3' && this.state.minorBillType.length < 2 ? (<div className="entry-rule-add-rule-content-table-left">
                                <Table columns={bodyColumns} dataSource={bodyData} pagination={false} bordered={true} scroll={{ y: 300 }} />
                            </div>) : null}
                        </div>

                    </div>

                </div>
            </div>
        );
    }
    render() {
        let headRowSelect = {
            onChange: (selectedRowKeys, selectedRows) => {
                let flag = false;
                if (selectedRows.length > 0) {
                    flag = true;
                }
                this.setState({
                    headSelectedRows: selectedRows,
                    showHeadDelete: flag,
                    headSelectedRowKeys: selectedRowKeys
                });
            },
            selectedRowKeys: this.state.headSelectedRowKeys
        };

        let bodyRowSelect = {
            onChange: (selectedRowKeys, selectedRows) => {
                let flag = false;
                if (selectedRows.length > 0) {
                    flag = true;
                }
                this.setState({
                    bodySelectedRows: selectedRows,
                    showBodyDelete: flag,
                    bodySelectedRowKeys: selectedRowKeys
                });
            },
            selectedRowKeys: this.state.bodySelectedRowKeys
        };

        return (
            <div className="page entry-rule-box" >


                <Modal
                    className="entry-rule-box-ant-modal"
                    title="规则设置" visible={this.state.visible}
                    width={940}
                    onOk={this.handleAddBillRuleSave}
                    onCancel={this.closeSlip}
                >
                    {this.genAddAndEditHtml()
                    }
                </Modal>
                <div className="content-left entry-rule-left">
                    <div className="entry-rule-left-top">
                        <div className="entry-rule-search-box">
                            <Searchbar
                                size="large"
                                placeholder="搜索规则"
                                style={{ width: "100%" }}
                                value={this.state.searchValue}
                                onChange={this.handleSearch}
                            />
                        </div>
                        <div className="entry-rule-left-add-rule" onClick={this.handleAddRule}>
                            <Icon type="plus-circle" />
                            <span>新增规则</span>
                        </div>
                        <div className="entry-rule-show-disabled-rule">
                            {this.state.showDisabledBillRuleList ? <div onClick={this.switchBillList} className="entry-rule-show-disabled-rule-bg"><Icon type="check" /></div> : <div onClick={this.switchBillList}></div>}
                            <span onClick={this.switchBillList}>已停用规则</span>
                        </div>
                    </div>
                    <div className="entry-rule-left-content">
                        {this.billRuleList()}
                    </div>
                </div>
                {
                    (() => {
                        if (this.state.selectedRule.id === undefined) {
                            return (
                                <div className="content-right entry-rule-right">没有规则被选择,请选择一个规则或者新建一个规则</div>
                            )
                        } else {
                            return (
                                <div className="content-right entry-rule-right">
                                    <div className="entry-rule-right-top">
                                        <div className="entry-rule-right-top-left">{this.state.selectedRule['name']}</div>
                                        <div className="entry-rule-right-top-right">
                                            <Button size="small" type="primary" onClick={this.handleDownload.bind(this, this.state.selectedRule)}>下载模版</Button>
                                            <Button size="small" type="primary" onClick={this.handleUpload.bind(this, this.state.selectedRule)}>导入数据</Button>
                                            <Popconfirm title={`确定删除${this.state.selectedRule['name']}?`} onConfirm={this.handleDeleteRule.bind(this, this.state.selectedRule)} okText="确定" cancelText="取消">
                                                <Button size="small" type="primary" >删除</Button>
                                            </Popconfirm>
                                            <Button size="small" type="primary" onClick={this.handleEditRule}>设置</Button>
                                        </div>
                                    </div>
                                    <div className="entry-rule-right-top-title">
                                        <span className="entry-rule-right-top-title-types-title">
                                            影响单据类型:
                        </span>
                                        <div className="entry-rule-right-top-title-types">
                                            {(() => {
                                                let billRule = this.props.billRule;
                                                if (billRule && billRule.objectClasses) {
                                                    let objectClasses = billRule.objectClasses;
                                                    return objectClasses.map((item, i) => {
                                                        return <span className="entry-rule-right-top-title-types-item" key={i}>{item['name']}</span>
                                                    });
                                                } else {
                                                    return null
                                                }
                                            })()}
                                        </div>
                                    </div>
                                    <div className="entry-rule-right-content">
                                        <div className="entry-rule-right-content-scroll">
                                            <Tabs className="entry-rule-tabs" defaultActiveKey="1" onChange={() => { }}>
                                                {(() => {

                                                    if (this.state.detailHeadColumn.length > 0) {
                                                        return (
                                                            <TabPane tab="单据头" key="1">
                                                                {(() => {
                                                                    if (this.state.showHeadDelete) {
                                                                        return (
                                                                            <div className="entry-rule-detail-edit entry-rule-detail-edit-padding fn-clear">
                                                                                <div className="entry-rule-detail-edit-delete">
                                                                                    <div onClick={this.handleDeleteHead}>
                                                                                        <Icon type="close" />
                                                                                        <span>删除</span>
                                                                                    </div>
                                                                                    <div className="fn-left">
                                                                                        <span onClick={this.handleDeleteHeadCancel}>取消选择</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    } else {
                                                                        return (
                                                                            <div className="entry-rule-detail-edit fn-clear">
                                                                                <div onClick={this.handleDetailHeadAdd}>
                                                                                    <Icon type="plus-circle" />
                                                                                    <span>新增</span>

                                                                                </div>

                                                                                {this.state.editHead ?
                                                                                    <div onClick={this.handleDetailHeadSave}>
                                                                                        <Icon type="save" />
                                                                                        <span>保存</span>

                                                                                    </div> :
                                                                                    <div onClick={this.handleDetailHeadEdit}>
                                                                                        <img src={editImg} className="edit-image-icon" alt="" />
                                                                                        <span>编辑</span>

                                                                                    </div>}
                                                                                {this.state.editHead ?
                                                                                    <div onClick={this.handleDetailHeadCancel}>

                                                                                        <span>取消</span>

                                                                                    </div> : null}

                                                                            </div>
                                                                        )
                                                                    }
                                                                })()}


                                                                <div className="entry-rule-detail-box">

                                                                    <EditTable
                                                                        scrollX={this.state.headScrollX}
                                                                        offsetBottom={200}
                                                                        clientHeight={this.props.clientHeight}
                                                                        dataSource={this.state.detailHeadItems}
                                                                        isEditing={this.state.editHead}
                                                                        columns={this.state.detailHeadColumn}
                                                                        onTableDataChange={(v) => {
                                                                        }}
                                                                        rowSelection={this.state.editHead ? headRowSelect : null}
                                                                    />
                                                                    {this.state.editHead ?
                                                                        null :
                                                                        <Pagination
                                                                            className="edit-table-pagination"
                                                                            current={this.state.headCurrent}
                                                                            pageSize={this.props.countperpage}
                                                                            onChange={this.headPaginationChange}
                                                                            total={this.state.headTotal}
                                                                        />
                                                                    }
                                                                </div>
                                                            </TabPane>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })()}
                                                {
                                                    (() => {
                                                        if (this.state.detailBodyColumn.length > 0) {
                                                            return (
                                                                <TabPane tab="单据体" key={this.state.detailHeadColumn.length > 0?"2":"1"}>
                                                                    {(() => {
                                                                        if (this.state.showBodyDelete) {
                                                                            return (
                                                                                <div className="entry-rule-detail-edit entry-rule-detail-edit-padding fn-clear">
                                                                                    <div className="entry-rule-detail-edit-delete">
                                                                                        <div onClick={this.handleDeleteBodyCancel} className="fn-left">
                                                                                            <span>取消选择</span>
                                                                                        </div>
                                                                                        <div onClick={this.handleDeleteBody} >
                                                                                            <Icon type="close" />
                                                                                            <span>删除</span>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        } else {
                                                                            return (
                                                                                <div className="entry-rule-detail-edit fn-clear">
                                                                                    <div onClick={this.handleDetailBodyAdd}>
                                                                                        <Icon type="plus-circle" />
                                                                                        <span>新增</span>

                                                                                    </div>
                                                                                    {this.state.editBody ?
                                                                                        <div onClick={this.handleDetailBodydSave}>
                                                                                            <Icon type="save" />
                                                                                            <span>保存</span>

                                                                                        </div> :
                                                                                        <div onClick={this.handleDetailBodyEdit}>
                                                                                            <img src={editImg} className="edit-image-icon" alt="" />
                                                                                            <span>编辑</span>

                                                                                        </div>}
                                                                                    {this.state.editBody ?
                                                                                        <div onClick={this.handleDetailBodyCancel}>

                                                                                            <span>取消</span>

                                                                                        </div> : null}

                                                                                </div>
                                                                            )
                                                                        }
                                                                    })()}


                                                                    <div className="entry-rule-detail-box">

                                                                        <EditTable
                                                                            scrollX={this.state.bodyScrollX}
                                                                            offsetBottom={200}
                                                                            clientHeight={this.props.clientHeight}
                                                                            dataSource={this.state.detailBodyItems}
                                                                            isEditing={this.state.editBody}
                                                                            columns={this.state.detailBodyColumn}
                                                                            onTableDataChange={(v) => {

                                                                            }}
                                                                            rowSelection={this.state.editBody ? bodyRowSelect : null}
                                                                        />
                                                                        {this.state.editBody ?
                                                                            null :
                                                                            <Pagination
                                                                                className="edit-table-pagination"
                                                                                current={this.state.bodyCurrent}
                                                                                pageSize={this.props.countperpage}
                                                                                onChange={this.bodyPaginationChange}
                                                                                total={this.state.bodyTotal}
                                                                            />
                                                                        }
                                                                    </div>
                                                                </TabPane>
                                                            );
                                                        } else {
                                                            return null;
                                                        }
                                                    })()
                                                }


                                            </Tabs>
                                        </div>
                                    </div>

                                </div>
                            );
                        }
                    })()
                }

            </div>
        );
    }
}

function mapStateToProps(state) {
    let baseState = state.get('baseState').toJS();
    let entryBillRuleState = state.get('entryBillRuleState');
    let billRuleList = entryBillRuleState.get('billRuleList').toJS();
    let disabledRuleList = entryBillRuleState.get('disabledRuleList').toJS();
    let billRuleListSuccess = entryBillRuleState.get('billRuleListSuccess');
    let disabledBillRuleListSuccess = entryBillRuleState.get('disabledBillRuleListSuccess');
    let billTypes = entryBillRuleState.get('billTypes').toJS();
    let addBillBodyData = entryBillRuleState.get('addBillBodyData').toJS();
    let addBillTitleData = entryBillRuleState.get('addBillTitleData').toJS();
    let saveSuccess = entryBillRuleState.get('saveSuccess');
    let billRule = entryBillRuleState.get('billRule').toJS();
    let detailBillHead = entryBillRuleState.get('detailBillHead').toJS();
    let detailBilBody = entryBillRuleState.get('detailBilBody').toJS();
    let detailBillHeadSuccess = entryBillRuleState.get('detailBillHeadSuccess');
    let detailBilBodySuccess = entryBillRuleState.get('detailBilBodySuccess');

    let detailHeadItems = entryBillRuleState.get('detailHeadItems').toJS();
    let detailBodyItems = entryBillRuleState.get('detailBodyItems').toJS();

    let detailHeadItemsSuccess = entryBillRuleState.get('detailHeadItemsSuccess');
    let detailBodyItemsSuccess = entryBillRuleState.get('detailBodyItemsSuccess');

    let saveBillRuleDetailsSuccess = entryBillRuleState.get('saveBillRuleDetailsSuccess');

    let deleteRuleSuccess = entryBillRuleState.get('deleteRuleSuccess');
    let minorBillTypeItems = entryBillRuleState.get('minorBillTypeItems').toJS();
    return {
        baseState,
        billRuleList,
        disabledRuleList,
        billRuleListSuccess,
        disabledBillRuleListSuccess,
        clientHeight: state.get('baseState').toJS().clientHeight,
        billTypes,
        addBillBodyData,
        addBillTitleData,
        saveSuccess,
        billRule,
        detailBillHead,
        detailBilBody,
        detailBillHeadSuccess,
        detailBilBodySuccess,
        detailHeadItems,
        detailBodyItems,
        detailHeadItemsSuccess,
        detailBodyItemsSuccess,
        saveBillRuleDetailsSuccess,
        deleteRuleSuccess,
        minorBillTypeItems
    };
}

function mapDispatchToProps(dispatch) {
    let method = {
        getBillRuleList,
        getBillTypes,
        getBillCanUseItems,
        getBillCanUseItemsOnlyBody,
        saveOrAddRule,
        getBillRule,
        getbillruledetails,
        deleteRule,
        saveBillRuleDetails,
        getExpenseMinorType
    };
    let boundActionCreators = bindActionCreators(method, dispatch)
    return {
        ...boundActionCreators,
        dispatch
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(EntryBillRule);