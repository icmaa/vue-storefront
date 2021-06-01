import * as types from './mutation-types'
import { Module } from 'vuex'
import actions from './actions'
import { CardState } from 'icmaa-checkout-com/types'

const CheckoutComCardStore: Module<CardState, any> = {
  namespaced: true,
  state: {
    infoComponent: () => import(
      /* webpackChunkName: "icmaa-checkout-com-method-card-info" */
      'icmaa-checkout-com/components/methods/card/Info.vue'
    ),
    isValid: true,
    token: null
  },
  actions,
  mutations: {
    [types.SET_TOKEN] (state, token: string) {
      state.token = token
    },
    [types.SET_IS_VALID] (state, valid: boolean) {
      console.log('aaaaaaaaaa')
      state.isValid = valid === true
    }
  },
  getters: {
    getToken: (state) => state.token,
    getInfoComponent: (state) => state.infoComponent
  }
}

export default CheckoutComCardStore
