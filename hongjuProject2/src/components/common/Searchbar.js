/**
 * Created by liqiankun on 2017/4/14.
 * 封装搜索框
 * parame1:目标元素
 * parame2：class名
 */
import React, { Component } from 'react';
import { Icon, Input } from 'antd';
import './Searchbar.scss'

const Search = Input.Search;

class Searchbar extends Component{
    constructor(props){
        super(props);
        this.OnblurEvent=this.OnblurEvent.bind(this);
        this.OnfocusEvent=this.OnfocusEvent.bind(this);
        this.changeclassname=this.changeclassname.bind(this);
    }
    componentDidMount() {
        var objsearch = document.getElementById('searchbar');
        objsearch.className+=' searchbar1';
        //console.log(objsearch)

    }
    changeclassname=(parame1,parame2) => {
        var objsearch_classname = parame1.className.split(' ');
        //console.log(objsearch_classname)//["ant-input", "ant-input-lg", "ant-input-search", "searchbar1"]
        objsearch_classname.pop();
        //console.log(objsearch_classname);//["ant-input", "ant-input-lg", "ant-input-search"]

        var objsearch_classname_string = objsearch_classname.join(' ');
        //console.log(objsearch_classname_string);//ant-input ant-input-lg ant-input-search

        parame1.className=objsearch_classname_string;
        //console.log(objsearch.className)//ant-input ant-input-lg ant-input-search

        parame1.className += parame2;
        //console.log(objsearch.className) //ant-input ant-input-lg ant-input-search searchbar2
    }

    OnfocusEvent=() =>{
        var objsearch = document.getElementById('searchbar');
        //console.log(objsearch);
        document.getElementById('iconlog').style.paddingLeft='0px';
        this.changeclassname(objsearch,' searchbar2')
        // var objsearch_classname = objsearch.className.split(' ');
        // //console.log(objsearch_classname)//["ant-input", "ant-input-lg", "ant-input-search", "searchbar1"]
        // objsearch_classname.pop();
        // //console.log(objsearch_classname);//["ant-input", "ant-input-lg", "ant-input-search"]
        //
        // var objsearch_classname_string = objsearch_classname.join(' ');
        // //console.log(objsearch_classname_string);//ant-input ant-input-lg ant-input-search
        //
        // objsearch.className=objsearch_classname_string;
        // //console.log(objsearch.className)//ant-input ant-input-lg ant-input-search
        //
        // objsearch.className+=' searchbar2';
        // //console.log(objsearch.className) //ant-input ant-input-lg ant-input-search searchbar2

    }
    OnblurEvent=() =>{
        var objsearch=document.getElementById('searchbar');
        var objlog=document.getElementById('iconlog');
        //console.log(objsearch.placeholder+'》'+objsearch.value)
        //console.log(objsearch)
        if(objsearch.value.trim()==''){

            objlog.style.paddingLeft='50px';
            //objsearch.className+=' searchbar1';
            this.changeclassname(objsearch,' searchbar1')
            objsearch.value = '';
        }
    }

    render(){
        return (
            <Search
                id="searchbar"
                size={this.props.size}
                placeholder={this.props.placeholder}
                style={this.props.style}
                prefix={<Icon id="iconlog" type="search" style={{paddingLeft:'50px',color:'#999'}}/>}
                suffix={<Icon type="" />}
                onFocus={this.OnfocusEvent}
                onBlur={this.OnblurEvent}
                onSearch={this.props.onSearch}
                onChange={this.props.onChange}
            />
        )
    }
}


export default  Searchbar