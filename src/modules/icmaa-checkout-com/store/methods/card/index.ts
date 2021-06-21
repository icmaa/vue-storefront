import actions from './actions'
import { CardState } from 'icmaa-checkout-com/types'
import { createPaymentStore } from 'icmaa-payment/store/methods/abstract'
import * as types from './mutation-types'

export const CODE = 'checkoutcom_card'

const CheckoutComCardStore = createPaymentStore<CardState>({
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
      state.isValid = valid === true
    }
  },
  getters: {
    getToken: (state) => state.token,
    getInfoComponent: (state) => state.infoComponent
  }
})

export default CheckoutComCardStore
