/**
 * Created by yeyawei on 17/3/14.
 */
import * as types from '../../actionTypes';
import baseFilesInterface from '../../../global/utils/api';
import {Toast} from '../../../components/common';
import NetWork from '../../../global/utils/network';



const getSupplierState = (getState) => {
	return getState().get('supplierState').toJS();
};
//关键字
export const searchText = (value) => {
	return (dispatch, getState) => {
		let searchData = getSupplierState(getState).searchData;
		if(value === "" && value == null) {
			searchData.key = '';
    } else {
		  searchData.key = value;
    }
    dispatch({
    	type: types.SUPPLIER_SEARCHDATA,
			payload: searchData
		})
	}
}
//停用供应商
export const disableSupplier = (checked) => {
	return (dispatch, getState) => {
		let searchData = getSupplierState(getState).searchData;
		if(checked) {
			searchData.status = '停用';
		} else {
			searchData.status = '正常';
		}
		dispatch({
			type: types.SUPPLIER_SEARCHDATA,
			payload: searchData
		})
	}
}
//获取供应商列表
export const getSupplierList = (add) => {
	return (dispatch, getState) => {
	  dispatch({
      type: types.SUPPLIER_SUPPLIER_LIST,
      payload: null
    });
		let url = baseFilesInterface.SUPPLIER_GET_SUPPLIER_LIST;
		let params = getSupplierState(getState).searchData;
		NetWork.get(url,params,
			(returnData) => {
				dispatch({
					type: types.SUPPLIER_SUPPLIER_LIST,
					payload: returnData.data
				});
				dispatch({
					type: types.SUPPLIER_SEARCHDCOUNT,
					payload: returnData.count
				});
				if(!add && returnData.data.length !== 0) {
					dispatch(selectSupplier(returnData.data[0]));
				}
			},
			(returnData) => {
				Toast.error(returnData.data);
			});
	}
};
//新增列表修改,详情修改
export const addSupplier = (addItem) => {
	return (dispatch, getState) => {
		let list = getSupplierState(getState).supplierList;
		list.unshift(addItem);
		//修改列表
		dispatch({
			type: types.SUPPLIER_SUPPLIER_LIST,
      payload: list
		})
		//列表当前供应商
		dispatch({
			type: types.SUPPLIER_CURRENT_SUPPLIER,
			payload: addItem
		})
		//修改详情
		dispatch({
			type: types.SUPPLIER_CURRENT_SUPPLIER_DETAIL,
			payload: addItem
		});

	}
}
//获取银行列表
export const getBankList = () => {
  return (dispatch,getState) => {
    let url = baseFilesInterface.SUPPLIER_GET_BANK_LIST;
    let params = {enable:true};
    NetWork.get(url,params,
      (returnData) => {
        dispatch({
          type: types.SUPPLIER_BANK_LIST,
          payload: returnData.data
        })
      }
    )
  }
}
//选择当前供应商及详情
export const selectSupplier = (currentSupplier) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.SUPPLIER_CURRENT_SUPPLIER,
			payload: currentSupplier
		})
		if(currentSupplier.id) {
			let url = baseFilesInterface.SUPPLIER_GET_SUPPLIER_DETAIL.replace(':supplierId',currentSupplier.id);
			NetWork.get(url,
				(returnData) => {
					dispatch({
						type: types.SUPPLIER_CURRENT_SUPPLIER_DETAIL,
						payload: returnData.data
					});
				},
				(returnData) => {
					Toast.error(returnData.msg);
				}
			);
		} else {
			dispatch({
				type: types.SUPPLIER_CURRENT_SUPPLIER_DETAIL,
				payload: {}
			});
		}

	}
}
export const onSupplierFilesChange = (changeItem) => {
	return (dispatch, getState) => {
	  let editSupplier = getState().toJS().supplierState.editSupplier;
	  editSupplier[changeItem.name] = changeItem.value;
	  dispatch({
      type: types.SUPPLIER_EDIT_SUPPLIER,
      payload: editSupplier
    })
  }
}

//显示隐藏编辑框
export const changeSupplierEdit = (showEdit, title) => {
	return (dispatch, getState) => {
		dispatch({
			type: types.SUPPLIER_SHOW_EDIT,
			payload: {
					show: showEdit,
					title: title
				}
		})
	}
}
//保存供应商
export const saveSupplierEdit = (editType) => {
	return (dispatch, getState) => {
		let currentSupplierId = getState().toJS().supplierState.currentSupplierDetail.id;
		let params = getState().toJS().supplierState.editSupplier;
		if(editType == 'edit') {
			alert('edit')
		} else {
			alert('add')
		}
		console.log(params)
		alert(currentSupplierId)
	}
}
//编辑文件是否改变
export const supplierEditChanged = (editChanged) => {
	return (dispatch,getState) => {
		dispatch({
      type: types.SUPPLIER_EDIT_CHANGED,
      payload: editChanged
    })
	}
}
//启用、停用供应商
export const enableSupplier = (isEnable) => {
  return (dispatch,getState) => {
    let currentSupplierDetail = getSupplierState(getState).currentSupplierDetail;
    if(isEnable) {
      currentSupplierDetail.status = "正常";
    } else {
      currentSupplierDetail.status = "停用";
    }
    dispatch({
      type: types.SUPPLIER_CURRENT_SUPPLIER_DETAIL,
      payload: currentSupplierDetail
    });
    let url = baseFilesInterface.SUPPLIER_EDIT_SUPPLIER;
    url = url + "?/id=" + currentSupplierDetail.id;
    NetWork.post(url,currentSupplierDetail,
      (returnData) => {
        if(isEnable) {
          Toast.success('已启用此供应商');
        } else {
          Toast.success('已停用此供应商');
        }
      },
      (returnData) => {
		    Toast.error(returnData.data)
      }
    )
  }
}