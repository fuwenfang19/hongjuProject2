/**
 * Created by lpy on 17/3/3
 *  handleSelect(id, item, p, companyId) {
        let dom = findDom(p.target, 'group-root');
        let targetP = p.target.parentNode;
        let doms = dom.querySelectorAll('.tree-title');
        if (targetP) {
            targetP.className = 'tree-title tree-selected';
        }
        for (let i = 0; i < doms.length; i++) {
            if (doms[i] && doms[i] !== targetP) {
                doms[i].className = 'tree-title';
            }
        }

        console.log(item);
        console.log(companyId);
    }
<GroupTree type="department" onSelect={this.handleSelect} countperpage={6} showGroup={false} />
 */
import React, { Component } from 'react';
import TreeData from './TreeData';
import { connect } from 'react-redux';

class GroupTree extends Component {
    constructor() {
        super();
    }
    render() {
        let config = {
            company: this.props.company,
            countperpage: this.props.countperpage,
            type: this.props.type,
            handleSelect: this.props.onSelect,
            baseState: this.props.baseState,
            showGroup: this.props.showGroup,
            searchCompany: this.props.searchCompany
        };
        return (
            <TreeData {...config} />
        );
    }
}

function mapStateToProps(state) {

    let baseState = state.get('baseState').toJS();

    return {
        baseState
    };
}

export default connect(mapStateToProps)(GroupTree);


export function findDom(dom, cName) {
    var theDom = null;
    while (dom && dom.parentNode) {
        if (dom.className.indexOf(cName) > -1) {
            theDom = dom;
            dom = null;
        } else if (dom.parentNode.className.indexOf(cName) > -1) {
            theDom = dom.parentNode;
            dom = null;
        } else {
            dom = dom.parentNode;
        }
    }
    return theDom;
}

export function findSearchParent(dom, cName){
    var theDom = null;
    while (dom && dom.parentNode) {
        if (dom.className.indexOf(cName) > -1) {
            theDom = dom;
            dom = null;
        } else if (dom.parentNode.className.indexOf(cName) > -1) {
            theDom = dom.parentNode;
            dom = null;
        } else {
            dom = dom.parentNode;
        }
    }
    return theDom;
}