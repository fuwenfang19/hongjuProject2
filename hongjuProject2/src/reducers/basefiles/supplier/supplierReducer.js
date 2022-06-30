/**
 * Created by yeyawei on 17/3/14.
 */
import * as types from '../../../actions/actionTypes';
import Immutable from 'immutable';

const $$initialState = Immutable.fromJS({
  supplierCount: 0,
  supplierList: [],
  searchData: {
    status: "正常",
    key: ""
  },
  currentSupplier: {},
  currentSupplierDetail: {},
  bankList: [],
  editType: {
    show: false,
    title: "edit"
  },
  editSupplier: {
    code: "",
    name: "",
    bank: "",
    bankAccount: "",
    address: "",
    status: "正常"
  },
  supplierEditChanged: false
})
export default function SupplierPageReducer($$state = $$initialState, action={}) {
  switch (action.type) {
    case types.SUPPLIER_SEARCHDCOUNT:
      return $$state.merge({supplierCount: action.payload})
    case types.SUPPLIER_SEARCHDATA:
      return $$state.merge({searchData: action.payload})
    case types.SUPPLIER_SUPPLIER_LIST:
      return $$state.merge({supplierList: action.payload});
    case types.SUPPLIER_BANK_LIST:
      return $$state.merge({bankList: action.payload});
    case types.SUPPLIER_CURRENT_SUPPLIER:
      return $$state.merge({currentSupplier: action.payload});
    case types.SUPPLIER_CURRENT_SUPPLIER_DETAIL:
      return $$state.merge({currentSupplierDetail: action.payload});
    case types.SUPPLIER_SHOW_EDIT:
      return $$state.merge({
        editType: action.payload,
        editSupplier: action.payload.title === "edit" ? $$state.get('currentSupplierDetail') : $$initialState.get('editSupplier')
      });
    case types.SUPPLIER_EDIT_SUPPLIER:
      return $$state.merge({
        editSupplier: action.payload
      });
    case types.SUPPLIER_EDIT_CHANGED:
      return $$state.merge({
        supplierEditChanged: action.payload
      })
    default:
      return $$state;
  }
}