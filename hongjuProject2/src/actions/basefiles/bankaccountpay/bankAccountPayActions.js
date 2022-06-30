//基础档案-银行账号
import * as types from '../../actionTypes';
import bankAccountInterface from '../../../global/utils/api';
import NetWork from '../../../global/utils/network';
import {Toast} from '../../../components/common';
import _ from 'lodash';

export const getAllBankList = (param) => {
	return (dispatch, getState) => {
		let url = bankAccountInterface.GET_BANK_LIST;
		NetWork.get(url, param,
			(returnData) => {
				dispatch({
					type: types.GET_BANK_LIST,
					payload: returnData.data
				})
			},
			(returnData) => {
				Toast.error(returnData.msg);
			}
		)
	}
};

export const getBankAccountList = (param) => {
	return (dispatch, getState) => {
		let url = bankAccountInterface.GET_BANK_ACCOUNT_LIST;
		NetWork.get(url, param,
			(returnData) => {
				dispatch({
					type: types.GET_BANK_ACCOUNT_LIST,
					payload: returnData.data
				})
			},
			(returnData) => {
				Toast.error(returnData.msg);
			}
		)
	}
};

export const getPayMethodList = (param) => {
	return (dispatch, getState) => {
		let url = bankAccountInterface.GET_PAY_METHOD_LIST;
		NetWork.get(url, param,
			(returnData) => {
				dispatch({
					type: types.GET_PAY_METHOD_LIST,
					payload: returnData.data
				})
			},
			(returnData) => {
				Toast.error(returnData.msg);
			}
		)
	}
};

export const updateBapTableData = (tableData) => {
	return {
		type: types.UPDATE_BAP_TABLE_DATA,
		payload: {tableData}
	}
};

export const addBapTableData = (data) => {
	return {
		type: types.ADD_BAP_TABLE_DATA,
		payload: {data}
	}
};

export const changeFileTab = (index) => {
	return {
		type: types.CHANGE_FILE_TAB,
		payload: index
	}
};

export const changebEditingFlag = (type, flag) => {
	return {
		type: types.CHANGE_FILE_EDITING_FLAG,
		payload: {type, flag}
	}
};

export const changebToOriginData = () => {
	return {
		type: types.CHANGE_TO_ORIGIN,
		payload: null
	}
};

export const deleteBAMTableData = () => {
	return {
		type: types.DELETE_BAP_TABLE_DATA,
		payload: null
	}
};

//SAVE_BAP_TABLE_DATA
export const saveBapTableData = () => {
	return (dispatch, getState) => {
		let bankState = getState().get('bankAccountState').toJS();
		let {currentTab, bankList, bankAccountList, payMethodList} = bankState;
		let hasError = false;
		if (currentTab === "1") {//银行档案

			bankList.forEach((item) => {
				if (item.code === "") {
					hasError = '请输入银行编码';
				} else if (item.name === "") {
					hasError = '请输入银行名称';
				}
			});
			if (hasError) {
				Toast.error(hasError);
			} else {
				NetWork.put(bankAccountInterface.MODIFY_BANK_LIST, {banks: bankList},
					() => {
						Toast.success('保存成功');
						dispatch(getAllBankList());
						dispatch(changebEditingFlag('isEditingBank', false));
					},
					(returnData) => {
						Toast.error(returnData.msg);
					}
				)
			}
		} else if (currentTab === "2") {//银行账号档案
			bankAccountList = bankAccountList.map((item) => {
				let bank = item.bank;
				if (!bank) {
					hasError = '请选择银行!';
				} else if (_.isArray(bank)) {
					if (bank.length === 0) {
						hasError = '请选择银行!';
					} else {
						bank = bank[0].id;
					}
				} else if (_.isObject(bank)) {
					bank = bank.id;
				}
				if (item.shortname === "") {
					hasError = '请输入支行简称';
				} else if (item.name === "") {
					hasError = '请输入支行全称';
				} else if (item.account === "") {
					hasError = '请输入账号';
				}
				item.bank = bank;
				return item;
			});
			if (hasError) {
				Toast.error(hasError);
			} else {
				NetWork.put(bankAccountInterface.MODIFY_BANK_ACCOUNT_LIST, {bankaccounts: bankAccountList},
					() => {
						Toast.success('保存成功');
						dispatch(getBankAccountList());
						dispatch(changebEditingFlag('isEditingBankAccount', false));
					},
					(returnData) => {
						Toast.error(returnData.msg);
					}
				)
			}
		} else if (currentTab === "3") {//支付方式档案

			payMethodList = payMethodList.map((item) => {
				if (item) {
					if (item.code === "") {
						hasError = '请输入编码';
					} else if (item.name === "") {
						hasError = '请输入名称';
					}
				}
				const method = item.payMethod;
				if (method === 'cashpayment') {
					item.cashpayment = true;
					item.bankpayment = false;
					item.notepayment = false;
				} else if (method === 'bankpayment') {
					item.cashpayment = false;
					item.bankpayment = true;
					item.notepayment = false;
				} else if (method === 'notepayment') {
					item.cashpayment = false;
					item.bankpayment = false;
					item.notepayment = true;
				}
				return item;
			});

			if (hasError) {
				Toast.error(hasError);
			} else {
				NetWork.put(bankAccountInterface.MODIFY_PAY_METHOD_LIST, {paymentmethods: payMethodList},
					() => {
						Toast.success('保存成功');
						dispatch(getPayMethodList());
						dispatch(changebEditingFlag('isEditingPayMethod', false));
					},
					(returnData) => {
						Toast.error(returnData.msg);
					}
				)
			}
		}
	}
};
