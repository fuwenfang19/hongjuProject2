/**
 * Created by lpy on 17/3/2.
 * @CommonTreeContainer
 *   @defaultProps
 *      @type:string  required; value = disburse 或者 department 或者 project
 *      
 *   @defaultStates
 */
import React, {Component} from 'react';
import CommonTree from './CommonTree';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// import {getTreeData} from '../../reducers/treeReducer/treeReducer';
import {getTreeData} from '../../global/utils/tree';
class CommonTreeContainer extends Component{
    constructor(){
        super();
    }
    render(){
        return (
            <CommonTree  
            clearActionType="TREE_ClEAR"
            treeDataActionType="TREE_GET_DATA"
            treePageActionType="TREE_GET_PAGE"
            countperpage={this.props.countperpage}
            type={this.props.type} 
            handleSelect={this.props.onSelect}
            reducerState="treeReducerState"
            baseState={this.props.baseState}
            treeState={this.props.treeState}
            dispatch={this.props.dispatch}/>
        );
    }
}

function mapStateToProps(state){

     let baseState = state.get('baseState').toJS();
     let treeState = state.get('treeReducerState').toJS();
   
    return {
        baseState,
        treeState
    };
}

function mapDispatchToProps(dispatch){
    let actionCreators = {getTreeData};
    let boundActionCreators = bindActionCreators(actionCreators, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CommonTreeContainer);