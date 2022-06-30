/**
 * Created by lpy on 17/3/3
 * @TreeContainer
 *   @defaultProps
 *      @type:string  required; value = disburse 或者 department 或者 project
 *      
 *   @defaultStates
 */
import React, {Component} from 'react';
import TreeData from './TreeData';
import {connect} from 'react-redux';

class TreeContainer extends Component{
    constructor(){
        super();
    }
    render(){
        let config = {
            company:this.props.company,
            countperpage:this.props.countperpage||300,
            type:this.props.type,
            handleSelect:this.props.onSelect,
            baseState:this.props.baseState
        };
        return (
            <TreeData {...config}/>
        );
    }
}

function mapStateToProps(state){

     let baseState = state.get('baseState').toJS();
   
    return {
        baseState
    };
}

export default connect(mapStateToProps)(TreeContainer);