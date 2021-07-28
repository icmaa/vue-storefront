import { Module } from 'vuex'
import PayPalState from '../type/PayPalState'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export const icmaaPayPalStore: Module<PayPalState, any> = {
  namespaced: true,
  state: {
    isSdkLoaded: false,
    clientId: null,
    brandName: null,
    softDescriptor: null,
    referenceId: null
  },
  actions,
  mutations,
  getters
}
