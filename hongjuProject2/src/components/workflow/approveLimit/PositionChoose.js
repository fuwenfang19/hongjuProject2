import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPositionData } from '../../../reducers/workflow/approveLimit/approveLimitReducer';
import { bindActionCreators } from 'redux';
import * as types from '../../../actions/actionTypes';
import { Button, Icon, Checkbox, Input } from 'antd';
const Search = Input.Search;

class PositionChoose extends Component {
    constructor() {
        super();
        this.state = {
            choosedData: [],
            searchKey: ''
        };
    }
    static defaultProps = {
        positionData: []
    }
    componentWillMount() {
        this.props.getPositionData();
    }
    handleToChooseChange = (e) => {
        let checked = e.target.checked;
        let value = e.target.value;
        let data = this.props.positionData;
        let item = {};
        for (let i = 0; i < data.length; i++) {
            if (data[i]['id'] === value) {
                item = data[i];

                this.props.okClick([item]);
                break;
            }
        }

    }

    //生成选项
    toChooseHtml = () => {
        // console.log(this.state.data);
        let searchKey = this.state.searchKey;
        searchKey = searchKey.trim();
        if (searchKey !== '') {
            return this.props.positionData.map((item, index) => {
                if (item['positionname'].indexOf(searchKey) > -1) {
                    return <Checkbox key={index} value={item['id']} onChange={this.handleToChooseChange}>{item['positionname']}</Checkbox>
                }
            });
        }
        return this.props.positionData.map((item, index) => {
            let choosedData = this.state.choosedData.slice(0);
            //bug
            let flag = false;
            for (let i = 0; i < choosedData.length; i++) {
                if (choosedData[i]['id'] === item['id']) {
                    flag = true;
                }
            }
            return <Checkbox key={index} value={item['id']} checked={flag} onChange={this.handleToChooseChange}>{item['positionname']}</Checkbox>
        });
    }


    render() {
        return (
            <div className="position-choose-box">
                <Search
                    placeholder="搜索岗位"
                    style={{ padding: 5 }}
                    value={this.state.searchKey}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onChange={(e) => {
                        this.setState({
                            searchKey: e.target.value
                        });
                    }}
                />
                <div className="check-box" onScroll={this.handleScroll}>
                    {this.toChooseHtml()}
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    let approvelLimitState = state.get('approvelLimitState');
    let positionData = approvelLimitState.get('positionData').toJS();


    return {
        positionData
    };
}

function mapDispatchToProps(dispatch) {
    let method = {
        getPositionData
    };
    let boundActionCreators = bindActionCreators(method, dispatch);
    return {
        dispatch,
        ...boundActionCreators
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(PositionChoose);