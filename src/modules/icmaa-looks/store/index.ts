import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import LooksState from '../types/LooksState'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export const stateKey = 'icmaaLooks'
export const storageKey = 'icmaa-looks'

export const LooksStore: Module<LooksState, RootState> = {
  namespaced: true,
  state: {
    items: [],
    products: {}
  },
  actions,
  getters,
  mutations
}
