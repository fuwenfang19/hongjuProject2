/**
 * Created by lpy on 17/2/22.
 * 懒加载树形控件
 * @类TreeNode
 *   @defaultProps
 *      @item:object; required; //放到节点的一条数据对象
 *      @hasChildren: boolean; default value:false; //判断 TreeNode对象有无子节点
 *      @isLastChild: boolean; default value:false; //判断 TreeNode对象是否是最后一个节点
 *      @switchCb:  function; default value:null; //TreeNode对象如果有子节点，回调函数用来请求子节点数据
 *      @info: any; //TreeNode对象的key
 *      @parentInfo: any; //TreeNode对象的父节点的key
 *      @title: string; //TreeNode对象显示的文本
 *      @onSelect: function; default value:null; //TreeNode节点被选择回调,-----选择事件
 *      @parentLink: object; default value:null; //获取容器组件的引用，用于传递信息给容器组件
 *      @getMore: function; default value:null; //获取更多兄弟节点，需要用父节点信息，重新渲染父节点的子节点
 *      
 *   @defaultStates
 *      @switchClassName: string; default value:tree-switch tree-switch-off; //开关
 *      @childClassName: string; default value:child-nodes fn-hide; //子节点显示隐藏
 */

import React, { Component } from 'react';
import { Icon } from 'antd';

class TreeNode extends Component {
    constructor(props) {
        super();
        this.state = {
            switchClassName: 'state-tree-switch tree-switch tree-switch-off',
            childClassName: 'child-nodes fn-hide',
            switchOnce: true
        };
        this.switchClick = this.switchClick.bind(this);
        this.selectClick = this.selectClick.bind(this);
    }
    static defaultProps = {
        hasChildren: false,
        isLastChild: false,
        switchCb: null,
        onSelect: null,
        parentLink: null,
        info: '',
        parentInfo: '',
        getMore: null,
        toHide: ''
    }

    componentWillMount() {
        // console.log(this.props.hasChildren);
    }
    // 处理展示子节点和请求数据相关
    switchClick() {
        let switchClassName = this.state.switchClassName.indexOf('tree-switch-off') > -1 ? 'state-tree-switch tree-switch tree-switch-open' : 'state-tree-switch tree-switch tree-switch-off';
        let childClassName = switchClassName.indexOf('tree-switch-off') > -1 ? 'child-nodes fn-hide' : 'child-nodes';
        this.setState({
            switchClassName,
            childClassName
        });
    }
    selectClick(info) {
        let parent = this.props.parentLink;
        parent.setState({
            childInfo: info
        });
    }

    render() {

        //处理TreeNode节点被选中和被点击
        let self = this;
        function cb(a, b, handleSelect) {
            if (typeof handleSelect === 'function') {
                handleSelect.call(self, self.props.info, self.props.item);
            }
        }


        if (this.props.isLastChild) {

            return (
                <li className={this.props.toHide}><span className="lazy-tree-more" onClick={(p, e) => {
                    if (typeof this.props.getMore === 'function') {
                        this.props.getMore(this.props.parentInfo);
                    }
                }}>...</span></li>
            );
        }


        return (
            <li className="lazy-tree-node">
                
                <b className={this.props.className} >
                    <span id={`click${this.props.clickId}`} onClick={(p, e) => {
                        // 处理选择与否背景色以及回调
                        this.selectClick(this.props.info);
                        cb(p, e, this.props.onSelect);
                    }
                    } >{this.props.title}</span>
                </b>
                <span className={this.props.hasChildren ? this.state.switchClassName : "state-tree-switch tree-switch no-childe-span" } onClick={(p, e) => {
                    this.switchClick();
                    if (typeof this.props.switchCb === 'function') {
                        // 点击展示子节点的回调函数
                        this.props.switchCb(this.props.info, this);
                    }
                }}>{(() => {
                    if (!this.props.hasChildren) {
                        return <Icon type="file" className="node-leaf" />
                    } else {
                        return this.state.switchClassName.indexOf('tree-switch-open') > -1 ?  <Icon type="up" />:<Icon type="down" />
                    }
                })()}</span>
                <ul className={this.state.childClassName}>{this.props.children}</ul>
            </li>
        )
    }
}

export { TreeNode };

