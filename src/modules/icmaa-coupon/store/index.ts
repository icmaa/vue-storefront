import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CouponState from '../types/CouponState'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export const CouponStore: Module<CouponState, RootState> = {
  namespaced: true,
  state: {
    number: '',
    expires: '',
    balance: -1,
    currency: ''
  },
  getters,
  actions,
  mutations
}
