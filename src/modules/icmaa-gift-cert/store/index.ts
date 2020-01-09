import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import GiftCertState from '../types/GiftCertState'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export const GiftCertStore: Module<GiftCertState, RootState> = {
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
