/**
 * 
 * 
 * 
 */
import React, { Component } from 'react';
import NetWork from '../../../global/utils/network';
import { TreeNode } from '../tree/TreeNode';
import CompanyTree from '../tree/TreeContainer';
import { Spin } from 'antd';

class TreeData extends Component {
    constructor() {
        super();
        this.state = {
            companies: [],
            showIds: []
        }
    }
    static defaultProps = {
        showGroup: false
    };
    componentWillMount() {
        let userInfo = this.props.baseState.userInfo;
        // let isDummy = userInfo.isDummy;
        if (!this.props.showGroup) {
            let obj = {
                code: '',
                id: userInfo['company'],
                name: userInfo['companyname'],
                parent: null,
                status: "正常"
            };
            this.setState({
                companies: [obj]
            });
        } else {
            getGroup(this);
        }
    }
    componentWillReceiveProps(nextProps, nextState) {



    }
    componentDidMount() {

    }
    switchCb = (info, t) => {
        if (t.state.switchOnce) {
            let showIds = this.state.showIds;
            showIds.push(info);
            this.setState({
                showIds
            });
            t.setState({
                switchOnce: false
            });
        }
    }
    genAllCompany = (companies) => {
        let c2 = 'tree-title';
        let userInfo = this.props.baseState.userInfo;
        let showGroup = this.props.showGroup;



        return companies.map((item, i) => {
            //bug
            // if (showGroup && item['id'] === userInfo['company']) {
            //     c2 = 'tree-title tree-selected';
            // } else {
            //     c2 = 'tree-title';
            // }
            let code = '';
            if (item['code'] === undefined || item['code'] === '') {
                code = '';
            } else {
                code = '[' + item['code'] + ']'
            }
            let config = {
                item: item,
                key: i,
                title: code + item['name'],
                info: item['id'],
                hasChildren: true,
                parentLink: this,
                className: c2,
                onSelect: this.props.handleSelect,
                switchCb: this.switchCb
            };
            let config2 = {
                company: item['id'],
                countperpage: this.props.countperpage,
                type: this.props.type,
                onSelect: this.props.handleSelect
            };
            let flag = false;
            for (let j = 0; j < this.state.showIds.length; j++) {
                if (this.state.showIds[j] === item['id']) {
                    flag = true;
                    break;
                }
            }
            return (
                <TreeNode {...config} >
                    {flag ? <CompanyTree {...config2} /> : null}
                </TreeNode>
            );
        });
    }

    render() {
        let companies = this.state.companies;
        let searchCompany = this.props.searchCompany.trim();

        if (searchCompany !== '') {
            companies = companies.filter((item, i) => {

                if (item['name'].indexOf(searchCompany) > -1 || item['code'].indexOf(searchCompany) > -1) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        return (
            <div className="group-root">
                {this.genAllCompany(companies)}
            </div>
        );
    }
}

export default TreeData;

// 获取集团所有公司列表
function getGroup(that) {
    let url = '/organization/loadcompanyingroup/';
    NetWork.get(url, {}, (json) => {

        that.setState({
            companies: json
        });
    });
}






