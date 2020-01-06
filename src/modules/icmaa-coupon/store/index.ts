import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CouponState from '../types/CouponState'

export const CouponStore: Module<CouponState, RootState> = {
  namespaced: true,
  state: { },
  getters: {},
  actions: {},
  mutations: {}
}
