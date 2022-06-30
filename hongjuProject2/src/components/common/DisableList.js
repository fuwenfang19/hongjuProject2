import React, {Component} from 'react';
import NetWork from '../../global/utils/network'

class DisableList extends Component{
    constructor(){
        super();
        this.file_choose_flag = true;
        this.state = {
            data:[],
            page:1,
            selectedId:''
        };
        this.handleScroll = this.handleScroll.bind(this);
        this.constructorData = this.constructorData.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.selectedCallBack = this.selectedCallBack.bind(this);
    }
    static defaultProps = {
        type:'',
        countperpage:10,
        onSelect:()=>{}
    };

    componentWillMount(){
        let urlMap = {
           disburse:'/organization/getdisburse/',
           department:'/organization/webdepartments/',
           project:'/organization/webexpenseitems/'
       };
        let reqParam = {
			status: '停用',
			page: 1,
			parentid: null,
			countperpage: this.props.countperpage,
			searchtype: 'treeclick'
		};
        let _self = this;
        NetWork.get(urlMap[this.props.type], reqParam, (json)=>{
            _self.setState({
                data:json['data'],
                page:this.state.page+1
            });
        });
    }
    handleScroll(e){
        let div = e.target;
        let scrollHeight = div.scrollHeight;
        let scrollTop = div.scrollTop;
        let clientHeight = div.clientHeight;
       
        if(scrollTop + clientHeight >= scrollHeight-10 && this.file_choose_flag){
            this.file_choose_flag = false;
            let urlMap = {
                disburse:'/organization/getdisburse/',
                department:'/organization/webdepartments/',
                project:'/organization/webexpenseitems/'
            };
            let reqParam = {
                status: '停用',
                page: this.state.page,
                parentid: null,
                countperpage: this.props.countperpage,
                searchtype: 'treeclick'
            };
            let _self = this;
            window.loading.add();
            NetWork.get(urlMap[this.props.type], reqParam, (json)=>{
                if(json['data'].length<=0){
                    window.loading.remove();
                    return ;
                }
                _self.setState({
                    data:_self.constructorData(json['data']),
                    page:this.state.page+1
                });
                _self.file_choose_flag = true;
                window.loading.remove();
            });
        }
    }
    constructorData(data){
        let $data = this.state.data.slice(0);
        let existIds = [];
        for(let i=0; i<$data.length; i++){
            existIds[i]=$data[i]['id'];
        }
        for(let j=0; j<data.length; j++){
            let index = existIds.indexOf(data[j]['id']);
            if(index>-1){
                continue;
            }else{
                $data.push(data[j]);
            }
        }
        return $data;
    }
    handleSelected(item){
        this.setState({
            selectedId:item['id']
        });
    }
    selectedCallBack(item, _self){
        this.props.onSelect(item, _self);
    }
    genHtml(data){
        let _self = this;
        return data.map((item, index)=>{
            let c1 = this.state.selectedId === item['id']?'disable-list-item-title disable-list-item-title-selected':'disable-list-item-title';
            return (
                <div key={index} className="disable-list-item" onClick={()=>{
                    this.handleSelected(item);
                    this.selectedCallBack(item, _self);
                }}>
                    <i className="disable-list-item-icon">停用</i>
                    <span className={c1}>{item['name']}</span>
                </div>
            )
        });
    }
    render(){
        return (
            <div className="disable-list-box" onScroll={this.handleScroll}>
                {this.genHtml(this.state.data)}
            </div>
        )
    }
}

export default DisableList;