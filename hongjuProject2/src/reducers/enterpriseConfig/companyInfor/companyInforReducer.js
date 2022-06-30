/**
 * Created by fuwenfang on 30/3/12.
 */
import * as types from '../../../actions/actionTypes';
import Immutable from 'immutable';
import uuid from 'uuid';

const $$initialState = Immutable.fromJS({
  companyInfor:{
    name:'',
    code:'',
    Industry:'',
    address:'',
    createTime:'',
    phone:'',
    parent:'',
    taxIdentifyNumber:'',
    bankName:'',
    bankAccount:'',
    taxPayerType:0,
    isComplete :true,
    company_documents:[{id:'1'}],
  },
  isEdit:false,
  logoSrc:require('../../../images/companyInfor/Logo.png'),
  uploadLogo:false,
  initCompanyInfor:{}
})

export default function rootPageReducer($$state = $$initialState, action = {}) {
  switch (action.type) {
		case types.COMPANYINFOR_GETINFOR:
			return $$state.merge({ 
        companyInfor: action.payload,
        initCompanyInfor:action.payload,
       })
    case types.COMPANYINFOR_GETLOGO:
      return $$state.merge({logoSrc:'/organization/getlogo/' + `?${uuid.v4()}`,uploadLogo:true})
    // case types.COMPANYINFOR_GETLOGO_DEFAULT:
    //   return $$state.merge({uploadLogo:false})
    case types.COMPANYINFOR_CLICKEDIT:
      return $$state.updateIn(['companyInfor','isComplete'],(isComplete)=>{
        return action.payload
      })
    case types.COMPANYINFOR_ADDUPLODPIC:
      return $$state.updateIn(['companyInfor','company_documents'],(company_documents)=>{
        return action.payload
      })
    case types.COMPANYINFOR_ADDUPLODPIC_UPDATEINIT:
      return $$state.updateIn(['initCompanyInfor','company_documents'],(company_documents)=>{
        return action.payload
      })
    case types.COMPANYINFOR_DELETETAXPIC:
      return $$state.updateIn(['companyInfor','company_documents'],(company_documents)=>{
        return action.payload
      })
    case types.COMPANYINFOR_DELETETAXPIC_UPDATEINIT:
      return $$state.updateIn(['initCompanyInfor','company_documents'],(company_documents)=>{
        return action.payload
      })
    case types.COMPANYINFOR_SUBMITCHECK:
      return $$state.merge({
        companyInfor: action.payload,
        initCompanyInfor:action.payload
      })
    case types.COMPANYINFOR_CLICKCANCLE:
      return $$state.merge({
        companyInfor: action.payload,
        isEdit:false
      })
    case types.COMPANYINFOR_CHANGEINFOR:
      const type = action.payload.type
      return $$state.updateIn(['companyInfor',type],(type)=>{
        return action.payload.value
      })
    case types.COMPANYINFOR_SAVECOMPANYINFOR:
      return $$state.merge({
        initCompanyInfor:action.payload,
        companyInfor:action.payload,
      })
    case types.COMPANYINFOR_ISEDITED:
      return $$state.merge({isEdit:action.payload})
    default:
			return $$state;
  }
}