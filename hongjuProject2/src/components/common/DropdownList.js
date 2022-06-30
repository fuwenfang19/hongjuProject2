/**
 * Created by fuwenfang on 2/27/17.
 * 基于antd的Dropdown封装
 * 使用方法：
 * （1）父组件先import
 * （2）示例：
 *      <DropdownList {...DropdownListData} clickAddItem={(key)=>{this.clickAddItem(key)}}>
            <Icon type="plus-circle"/>   //此处可以自定义为其他node节点
        </DropdownList>
        DropdownListData需要传递参数为：
        const DropdownListData={}
        DropdownListData.trigger='click'   //触发下拉框 可选'hover'
        DropdownListData.data=[{'name':'申请单','id':'1'},{'name':'申请单111','id':'2'}]  //下拉框列表 至少需要两个参数name与id
        function clickAddItem   为父组件接受下拉列表的选择结果（会把id传给父组件）

 */
import { Menu, Dropdown,Icon} from 'antd';
import React from 'react';

const DropdownList = React.createClass({
    getInitialState() {
        return {
            
        };
    },
    onClick(key) {
        //message.info(`Click on item ${key}`);
        if(key.key==='item_0'){
            return 
        }
        this.props.clickAddItem(key.key)
    },

    render() {
        const {trigger,hasNullItem,hasNullItemName,data}=this.props
        const menu = (
            <Menu onClick={this.onClick}>
                <Menu.Item style={{height:24,float:'right',paddingRight:10}}>
                    <span className="anticon anticon-cross" style={{width:20,float:'right'}}></span>
                </Menu.Item>
                {
                    hasNullItem?(
                        <Menu.Item key={111111111} style={{marginTop:'4px'}}><Icon style={{marginRight:'6px'}}></Icon>{hasNullItemName}</Menu.Item>
                    ):null
                }
                {
                    data.length ===0?null:
                    (
                        data.map((item,i)=>{
                            return <Menu.Item key={item.id} style={{marginTop:'4px'}}><Icon type={item.type} style={{marginRight:'6px'}}></Icon>{item.name}</Menu.Item>
                        })
                    )
                }
            </Menu>
        )
        return (
            <Dropdown overlay={menu} trigger={[trigger]}>
                {this.props.children}
            </Dropdown>
        );
    }
});
export default DropdownList