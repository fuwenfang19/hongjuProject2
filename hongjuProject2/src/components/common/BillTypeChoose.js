
/**
 * Created by lpy on 2017/3/2
 * 
 * @BillTypeChoose
 *   @props
 *     
 */


import React, { Component } from 'react';
import { Checkbox, Button, Icon, Input } from 'antd';
import NetWork from '../../global/utils/network'
import api from '../../global/utils/api';
const Search = Input.Search;

class BillTypeChoose extends Component {
    constructor() {
        super();
        this.state = {
            choosedData: [],
            data: {},
            searchKey: ''
        };
        this.onChange = this.onChange.bind(this);
        this.toChooseHtml = this.toChooseHtml.bind(this);
        this.handleChoosedChange = this.handleChoosedChange.bind(this);
        this.whenIsRadio = this.whenIsRadio.bind(this);
        this.whenIsNotRadio = this.whenIsNotRadio.bind(this);
        this.travelData = this.travelData.bind(this);
        this.ifChecked = this.ifChecked.bind(this);
        this.okClick = this.okClick.bind(this);
        this.cancelClick = this.cancelClick.bind(this);
    }
    static defaultProps = {
        initialChoosed: [],
        type: ['2', '3', '15'],
        isRadio: false,
        okClick: (val) => { },
        cancelClick: () => { }
    };
    componentWillMount() {
        this.setState({
            choosedData: this.props.initialChoosed
        });
        let _self = this;
        window.loading.add();
        // '/erp/common/billtypes/'
        NetWork.get(api.ENTRY_BILL_RULE_BILL_TYPES, { enable: true }, (json) => {
            // console.log(json);
            _self.setState({
                data: json['data']
            });
            window.loading.remove();
        });
    }
    onChange(e) {
        let val = e.target.value;
        let checked = e.target.checked;
        if (this.props.isRadio) {
            this.whenIsRadio(val, checked);
        } else {
            this.whenIsRadio(val, checked);
            // this.whenIsNotRadio(val, checked);
        }
    }
    whenIsRadio(val, checked) {
        let item = this.travelData(this.state.data, val);

        if (checked) {
            this.setState({
                choosedData: [item]
            });
        } else {
            this.setState({
                choosedData: []
            });

        }

        this.props.okClick([item].slice(0));
    }
    travelData(data, searchKey) {
        for (let key in data) {
            let arr = data[key];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i]['id'] === searchKey) {
                    return Object.assign({}, arr[i]);
                }
            }
        }
        return undefined;
    }
    whenIsNotRadio(val, checked) {
        if (checked) {
            let item = this.travelData(this.state.data, val);
            let choosedData = this.state.choosedData.slice(0);
            choosedData.push(item);
            this.setState({
                choosedData
            });
        } else {
            let choosedData = this.state.choosedData.slice(0);
            for (let i = 0; i < choosedData.length; i++) {
                if (choosedData[i]['id'] === val) {
                    choosedData.splice(i, 1);
                    this.setState({
                        choosedData
                    });
                    break;
                }
            }
        }
    }
    ifChecked(arr, key) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]['id'] === key) {
                return true;
            }
        }
        return false;
    }
    handleChoosedChange(item) {
        let choosedData = this.state.choosedData.slice(0);
        for (let i = 0; i < choosedData.length; i++) {
            if (choosedData[i]['id'] === item['id']) {
                choosedData.splice(i, 1);
                this.setState({
                    choosedData
                });
                break;
            }
        }
    }
    // 生成选项
    toChooseHtml() {
        let data = this.state.data;
        let _self = this;
        let dataObj = {};
        let types = this.props.type;
        let len = 0;
        let searchKey = this.state.searchKey;

        searchKey = searchKey.trim();
        if (searchKey !== '') {
            let arr = [];
            for (let key in data) {
                let dataArr = data[key];
                for (let i = 0; i < dataArr.length; i++) {
                    arr.push(dataArr[i]);
                }
            }

            let htmlArr = arr.map((item, index) => {
                if (item['name'].indexOf(searchKey) > -1) {
                    return (
                        <Checkbox value={item['id']} onChange={this.onChange} className="checkbox-block" key={index}>{item['name']}</Checkbox>
                    );
                }
            });
            return <div className="billType-to-choose">{htmlArr}</div>
        }

        for (let key in data) {
            if (types.indexOf(key) > -1) {
                len++;
                let tem = data[key].map((item, index) => {
                    let flag = this.ifChecked(this.state.choosedData, item['id']);
                    return <Checkbox checked={flag} onChange={this.onChange} value={item['id']} className="checkbox-block" key={index}>{item['name']}</Checkbox>
                });
                dataObj[key] = tem;
            }
        }
        let htmlArr = [];
        let titleObj = {
            2: '申请单',
            3: '报销单',
            15: '还款单'
        };
        if (len > 1) {
            for (let key in dataObj) {
                //header={titleObj[key]}
                let tem = (
                    <div key={key} className="billType-to-choose-panel" >
                        <h5 onClick={(e) => {
                            e.stopPropagation();
                        }}>{titleObj[key]}</h5>
                        {dataObj[key]}
                    </div>
                );
                htmlArr.push(tem);
            }
            return <div
                className="billType-to-choose"
            >{htmlArr}</div>
        } else {
            for (let key in dataObj) {
                let tem = dataObj[key];
                htmlArr.push(tem);
            }
            return <div className="billType-to-choose-div">{htmlArr}</div>
        }

    }

    // 确定按钮
    okClick() {
        // console.log(this.state.choosedData);
        this.props.okClick(this.state.choosedData.slice(0));
    }
    cancelClick() {
        this.props.cancelClick();
    }
    render() {
        return (
            <div className="billType-box">
                <Search
                    placeholder="搜索单据类型"
                    style={{ padding: 5 }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    value={this.state.searchKey}
                    onChange={(e) => {
                        this.setState({
                            searchKey: e.target.value
                        });
                    }}
                />
                {this.toChooseHtml()}
            </div>

        );
    }
}

export default BillTypeChoose;
