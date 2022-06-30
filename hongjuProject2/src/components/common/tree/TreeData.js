/**
 * Created by lpy on 17/3/3.
 * 树形控件使用
 * @TreeData 
 *   @defaultProps
 *       @handleSelect
 *      
 *   @defaultStates
 */
import React, { Component } from 'react';
import { TreeNode } from './TreeNode';
import { constructTree, travelTree, getTreeData } from './TreeFunction';
import { Spin } from 'antd';

class TreeData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            childInfo: '',
            $data: null,
            $projectPage: null,
            parentPage: 2
        };

        this.genHtml = this.genHtml.bind(this);
        this.getMore = this.getMore.bind(this);
        this.switchCb = this.switchCb.bind(this);
    }
    static defaultProps = {
        countperpage: 300
    };

    componentWillMount() {
        let baseState = this.props.baseState;

        let reqParam = {
            company: this.props.company || baseState.userInfo.company,
            status: '正常',
            page: 1,
            searchtype: 'treeclick',
            parentid: 0,
            countperpage: this.props.countperpage,
        };
        window.loading.add();
        getTreeData(reqParam, this.props.type, this);
    }

    switchCb(info, t) {
        //需要处理网络请求和获取渲染该节点下面的子节点
        let reqParam = {
            company: this.props.company || this.props.baseState.userInfo.company,
            status: '正常',
            page: 1,
            searchtype: 'treeclick',
            parentid: info,
            countperpage: this.props.countperpage,
        };
        if (t.state.switchOnce) {
            //网络请求
            window.loading.add();
            getTreeData(reqParam, this.props.type, this);

            t.setState({
                switchOnce: false
            });
        }
    }
    getMore(pInfo) {

        let page;
        try {
            page = this.state.$projectPage[pInfo]['page'];
        } catch (e) {

        }
        if (!pInfo) {
            page = this.state.parentPage;
            this.setState({
                parentPage: page + 1
            });
        }
        let reqParam = {
            company: this.props.company || this.props.baseState.userInfo.company,
            status: '正常',
            page: page,
            searchtype: 'treeclick',
            parentid: pInfo,
            countperpage: this.props.countperpage,
        };

        // 网络请求
        window.loading.add();
        getTreeData(reqParam, this.props.type, this);
    }

    genHtml(data) {

        let childInfo = this.state.childInfo;
        let _self = this;

        let c1 = 'tree-title tree-selected';
        let c2 = 'tree-title';

        if (!data) {
            return (
                <div>
                    <Spin tip="Loading..."></Spin>
                </div>
            );
        } else {
            let fnHide = '';
            let pageObj = {};
            try {
                pageObj = this.state.$projectPage[0];
            } catch (e) {

            }
            try {
                if (this.state.parentPage > pageObj['pageSum']) {
                    fnHide = 'fn-hide';
                }
            } catch (e) {

            }

            return (
                <ul>
                    {arrToHtml(data, _self)}
                    <TreeNode company={this.props.company} key='p-p' isLastChild={true} parentLink={this} getMore={this.getMore} parentInfo={0} toHide={fnHide} />
                </ul>
            );
        }

        function arrToHtml(arr, _self) {

            if (!arr) {
                return;
            }
            let len = arr.length;

            let html = [];
            for (let i = 0; i < len; i++) {
                let children = arr[i]['children'];

                let item = arr[i];
                let tem;
                let $projectPage = _self.state.$projectPage;
                let fnHide = '';
                let pageObj = {};
                try {
                    pageObj = $projectPage[item['id']];
                } catch (e) {

                }
                if (pageObj && (pageObj['page'] > pageObj['pageSum'])) {
                    fnHide = 'fn-hide';
                }

                if (!arr[i]['isLeaf']) {
                    tem = (
                        <TreeNode
                            company={_self.props.company}
                            item={item}
                            key={i}
                            title={'[' + item['code'] + ']' + item['name']}
                            info={item['id']}
                            hasChildren={true}
                            parentLink={_self}
                            className={item['id'] === childInfo ? c1 : c2}
                            switchCb={_self.switchCb}
                            onSelect={_self.props.handleSelect}>

                            {arrToHtml(children, _self)}


                            {(() => {
                                if (children) {
                                    if (children.length > 0) {
                                        return (
                                            <TreeNode
                                                toHide={fnHide}
                                                key={children ? children.length : 0}
                                                isLastChild={true}
                                                parentLink={_self}
                                                getMore={_self.getMore}
                                                parentInfo={item['id']} />
                                        );
                                    } else {
                                        return null;
                                    }
                                } else {
                                    return null;
                                }
                            })()}
                        </TreeNode>
                    );
                } else {
                    tem = (
                        <TreeNode
                            company={_self.props.company}
                            item={item}
                            onSelect={_self.props.handleSelect}
                            key={i}
                            title={'[' + item['code'] + ']' + item['name']}
                            info={item['id']}
                            parentLink={_self}
                            className={item['id'] === childInfo ? c1 : c2} />
                    );
                }
                html.push(tem);
            }

            return html;
        }
    }

    render() {
        return this.genHtml(this.state.$data);
    }
}

export default TreeData;
