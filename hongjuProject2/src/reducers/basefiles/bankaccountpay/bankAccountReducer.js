/**
 * Created by uncle on 2017/4/6.
 */
import * as types from '../../../actions/actionTypes';
import {Toast} from '../../../components/common';
import Immutable from 'immutable';


const $$initialState = Immutable.fromJS({
	bankList: [],
	originBankList: [],

	bankAccountList: [],
	originBankAccountList: [],

	payMethodList: [],
	originPayMethodList: [],

	currentTab: '1',//1 bank 2 bankAccount 3.payMethod

	isEditingBank: false,
	isEditingBankAccount: false,
	isEditingPayMethod: false,

	selectBanks: [],
	selectBankAccounts: [],
	selectPayMethods: [],


	tabMapList: {
		"1": 'bankList',
		"2": 'bankAccountList',
		"3": 'payMethodList',
	},
	tabMapSelectList: {
		"1": 'selectBanks',
		"2": 'selectBankAccounts',
		"3": 'selectPayMethods',
	}

});


export default  function bankAccountReducer($$state = $$initialState, action = {}) {
	const state = $$state.toJS();
	const tabMapList = $$state.get('tabMapList').toJS();
	const tabMapSelectList = $$state.get('tabMapSelectList').toJS();
	const currentList = tabMapList[$$state.get('currentTab')];
	const currentSelectedList = tabMapSelectList[$$state.get('currentTab')];

	switch (action.type) {
		case types.GET_BANK_LIST:
			return $$state.merge({bankList: action.payload, originBankList: action.payload});
		case types.GET_BANK_ACCOUNT_LIST:
			return $$state.merge({bankAccountList: action.payload, originBankAccountList: action.payload});
		case types.GET_PAY_METHOD_LIST:
			let payMethods = action.payload;

			payMethods = payMethods.map((item) => {
				if (item.cashpayment) {
					item.payMethod = 'cashpayment';
				} else if (item.bankpayment) {
					item.payMethod = 'bankpayment';
				} else if (item.notepayment) {
					item.payMethod = 'notepayment';
				}
				return item;
			});

			return $$state.merge({payMethodList: action.payload, originPayMethodList: payMethods});

		// tab切换
		case types.CHANGE_FILE_TAB:
			return $$state.merge({currentTab: action.payload});
		// edit状态
		case types.CHANGE_FILE_EDITING_FLAG:
			const {type, flag} = action.payload;
			if (flag === false) {
				$$state = $$state.merge({[currentSelectedList]: []});
			}
			return $$state.merge({[type]: flag});

		// 更新改变table的数据
		case types.UPDATE_BAP_TABLE_DATA:
			return $$state.merge({[currentList]: action.payload.tableData});
		// 增加数据
		case types.ADD_BAP_TABLE_DATA:
			let oldData = $$state.get(currentList).toJS();
			oldData.push(action.payload.data);
			return $$state.merge({[currentList]: oldData});
		// 删除数据
		case types.DELETE_BAP_TABLE_DATA:
			let oldTableData = $$state.get(currentList).toJS();
			let deleteIndex = state[currentSelectedList].slice();
			let hasSavedData = false;

			let newTableData = oldTableData.filter((item, index) => {
				const delIndex = deleteIndex.indexOf(index);//判断是否被选中
				if (delIndex === -1) {//如果没有被选中，则保留在数据中
					return true;
				} else {//如果被选中
					if (item.id) {//如果保存过的，保留
						hasSavedData = true;
						return true;
					} else {//如果是新增的，不保留，并且在勾选数组中直接删除，
						deleteIndex.splice(delIndex, 1);
					}
				}
			});
			if (hasSavedData) {
				Toast.info('已经保存过的数据不允许删除');
			}
			return $$state.merge({[currentList]: newTableData, [currentSelectedList]: deleteIndex});
		// 取消编辑和新增
		case types.CHANGE_TO_ORIGIN:
			if (currentList === tabMapList[1]) {
				return $$state.merge({bankList: state.originBankList.slice()});
			} else if (currentList === tabMapList[2]) {
				return $$state.merge({bankAccountList: state.originBankAccountList.slice()});
			} else if (currentList === tabMapList[3]) {
				return $$state.merge({payMethodList: state.originPayMethodList.slice()});
			}
			return $$state;
		default:
			return $$state;
	}
}