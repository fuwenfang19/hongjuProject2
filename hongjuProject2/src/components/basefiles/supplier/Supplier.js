/**
 * Created by yeyawei on 17/3/14.
 */
import React from 'react';
import {Icon, Button, Input, Checkbox} from 'antd';
import {connect} from 'react-redux';

import {
	getSupplierList, selectSupplier, changeSupplierEdit, onSupplierFilesChange, getBankList, saveSupplierEdit,
  enableSupplier,	disableSupplier, searchText, supplierEditChanged, addSupplier
} from '../../../actions';
import SupplierList from './SupplierList';
import NoSupplier from './NoSupplier';
import SupplierDetail from './SupplierDetail2';
import Img from '../../../images/basefiles/import_project.png';
import NetWork from '../../../global/utils/network';
import baseFilesInterface from '../../../global/utils/api';
import {CommonTree, Confirm, Toast, NoInfo} from '../../common';
import Searchbar from "../../common/Searchbar";

const Search = Input.Search;

class Supplier extends React.Component {
  constructor() {
		super();
		this.getSupplierList = this.getSupplierList.bind(this);
		this.selectSupplier = this.selectSupplier.bind(this);
	}
	componentWillMount() {
    this.getSupplierList();
    this.getBankList();
    this.props.dispatch(changeSupplierEdit(false));
  }
  //搜索条件
  searchText = (value) => {
		this.props.dispatch(searchText(value));
		// this.getSupplierList();
  }
  disableSupplier = (e) => {
    let supplierState = this.props.$$supplierState.toJS();
    if(supplierState.editType.show && supplierState.supplierEditChanged) {
      Confirm({
        title: '供应商',
        content: {
          message: '还有数据没有保存确定要离开吗?'
        },
        onOk: () => {
          this.props.dispatch(disableSupplier(e.target.checked));
          this.getSupplierList();
          this.props.dispatch(changeSupplierEdit(false));
          this.props.dispatch(supplierEditChanged(false));
        },
        onCancel: function() {

        },
        okText: '确定',
        cancelText: '取消'
      })
    } else {
      this.props.dispatch(disableSupplier(e.target.checked));
      this.getSupplierList();
    }

  }
	//搜索
  searchSupplierList = () => {
    let supplierState = this.props.$$supplierState.toJS();
    if(supplierState.editType.show && supplierState.supplierEditChanged) {
      Confirm({
        title: '供应商',
        content: {
          message: '还有数据没有保存确定要离开吗?'
        },
        onOk: () => {
          this.getSupplierList();
          this.props.dispatch(changeSupplierEdit(false));
          this.props.dispatch(supplierEditChanged(false));
        },
        onCancel: function() {

        },
        okText: '确定',
        cancelText: '取消'
      })
    } else {
      this.getSupplierList();
    }
	}
  //获取供应商列表
  getSupplierList(add) {
    this.props.dispatch(getSupplierList(add));
  }
  //获取银行列表
  getBankList = () => {
    this.props.dispatch(getBankList());
  }
  //获取当前供应商及详情
  selectSupplier(currentSupplier) {
  	let supplierState = this.props.$$supplierState.toJS();
  	if(supplierState.editType.show && supplierState.supplierEditChanged) {
  		Confirm({
				title: '供应商',
				content: {
					message: '还有数据没有保存确定要离开吗?'
				},
				onOk: () => {
					this.props.dispatch(selectSupplier(currentSupplier));
					this.props.dispatch(changeSupplierEdit(false));
					this.props.dispatch(supplierEditChanged(false));
				},
				onCancel: function() {

				},
				okText: '确定',
				cancelText: '取消'
			})
		} else {
  		this.props.dispatch(selectSupplier(currentSupplier))
			this.props.dispatch(changeSupplierEdit(false));
		}
  }
  //下载模板
  downloadTemplate = () => {
		NetWork.download('/static//exceltemplate/supplier_template.xlsx');
	};
  //上传
  importDatas = () => {
		Confirm({
			title: '导入供应商数据',
			isUpload: true,
			uploadConfig: {
				url: NetWork.getUrl('/organization/web/supplier/import/'),//上传的url
			},
			onFileUploadSuccess: (returnData) => {
				//返回的是上传结束后的response
				if (returnData) {
					Toast.success('上传成功！');
				} else {
					Toast.error(returnData.data);
				}
			},
			onOk: () => {
				//显示左侧树 关闭窗口
			},
			onCancel: () => {
				//显示左侧树 关闭窗口
			}
		});
	};
  //启用
  enableSupplier = (isEnable) => {
    this.props.dispatch(enableSupplier(isEnable));
  }
  //编辑
  editSupplier = (editType) => {
		this.props.dispatch(changeSupplierEdit(true,editType))
	}
  onSupplierFilesChange = (changeItem) => {
		this.props.dispatch(onSupplierFilesChange(changeItem))
		this.props.dispatch(supplierEditChanged(true))
	}
	//保存确定
	handleOk = (editType) => {
  	let supplierState = this.props.$$supplierState.toJS();
  	let currentSupplierId = supplierState.currentSupplierDetail.id;
  	let currentSupplier = supplierState.currentSupplier;
		let params = supplierState.editSupplier;
  	let url = baseFilesInterface.SUPPLIER_EDIT_SUPPLIER;
  	let word = '新增成功';
		if(editType == 'edit') {
			url = url + "?/id=" + currentSupplierId;
			word = '修改成功';
		}
		NetWork.post(url,params,
      (returnData) => {
        Toast.success(word);
				if(editType != 'edit') {
        	// this.getSupplierList(true);
        	// this.selectSupplier(returnData.data);
					this.props.dispatch(addSupplier(returnData.data));
				} else {
					this.selectSupplier(currentSupplier);
				}
      },
      (returnData) => {
		    Toast.error(returnData.msg || returnData.data)
      }
    )
		this.props.dispatch(changeSupplierEdit(false));
		this.props.dispatch(supplierEditChanged(false))
	}
	//保存取消
	handleCancel = () => {
		this.props.dispatch(changeSupplierEdit(false))
		this.props.dispatch(supplierEditChanged(false))
	}
	//删除
  deleteSupplier = () => {
    if(this.props.$$supplierState.toJS().currentSupplier.id) {
      alert('delete');
      this.selectSupplier({});
    } else {
			Toast.info('请选择要删除的供应商！')
    }
  }
	render() {
    const supplierState = this.props.$$supplierState.toJS();
		const {supplierList, currentSupplier, currentSupplierDetail, editType, editSupplier, bankList, supplierEditChanged, supplierCount} = supplierState;
    return(
      <div className="page supplier-page">
        <div className="content-left" style={{overflow: 'hidden'}}>
          {/*<Search*/}
						{/*size={'large'}*/}
						{/*placeholder="搜索供应商"*/}
						{/*style={{width: '100%'}}*/}
						{/*onChange={e => this.searchText(e.target.value)}*/}
            {/*onSearch={this.getSupplierList}*/}
					{/*/>*/}
			<Searchbar
				size={'large'}
				placeholder="搜索供应商"
				style={{width: '100%',marginTop:'6px'}}
				onChange={e => this.searchText(e.target.value)}
				onSearch={this.searchSupplierList}
			/>
          <Button style={{marginTop: '10px',width: '100%',height: '32px'}} onClick={() => this.editSupplier("add")}>
            <Icon type="plus-circle"/>
							新增供应商
          </Button>
					<div style={{lineHeight: '30px'}}>
             <Checkbox onChange={this.disableSupplier}>停用的供应商</Checkbox>
          </div>
          <SupplierList list={supplierList}
                        onSelect={this.selectSupplier}
                        editType={editType}
                        currentSupplier={currentSupplier}/>
        </div>
        {
          supplierCount === 0 && currentSupplier.id === undefined && !editType.show ?
            <NoInfo downloadTemplate={this.downloadTemplate}
                    title="供应商"
                    img={Img}
                    importDatas={this.importDatas} />
          :
						supplierCount !== 0 && currentSupplier.id === undefined && !editType.show?
							<NoSupplier
								editSupplier={this.editSupplier}
							/>
					:
            <SupplierDetail currentSupplierDetail={currentSupplierDetail}
														editSupplier={this.editSupplier.bind(this,"edit")}
														downloadTemplate={this.downloadTemplate}
                            deleteSupplier = {this.deleteSupplier}
                            enableSupplier={this.enableSupplier}
														importDatas={this.importDatas}

														supplierEditChanged={supplierEditChanged}
														editData={editType}
														handleOk={this.handleOk}
														handleCancel={this.handleCancel}
														editSupplierData={editSupplier}
														onFilesChange={this.onSupplierFilesChange}
														bankList={bankList}
														currentSupplier={currentSupplierDetail}
						/>
        }
				{/*<EditSupplier editData={editType}
											handleOk={this.handleOk}
											handleCancel={this.handleCancel}
											editSupplier={editSupplier}
											onFilesChange={this.onFilesChange}
                      bankList={bankList}
											currentSupplier={currentSupplierDetail}
				/>*/}
      </div>
    )
  }
}

function mapStateToProps(state) {
	return {
		$$supplierState: state.get('supplierState')
	}
}
export default connect(mapStateToProps)(Supplier);