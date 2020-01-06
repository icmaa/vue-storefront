import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CouponState from '../types/CouponState'
import actions from './actions'

export const CouponStore: Module<CouponState, RootState> = {
  namespaced: true,
  state: { },
  getters: {},
  actions,
  mutations: {}
}
