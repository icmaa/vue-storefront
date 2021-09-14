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
    validations: null,
    token: null
  },
  actions,
  mutations: {
    [types.SET_VALIDATIONS] (state, value: any) {
      state.validations = value
    },
    [types.SET_TOKEN] (state, token: string) {
      state.token = token
    }
  },
  getters: {
    getInfoComponent: (state) => state.infoComponent,
    getValidations: (state) => state.validations,
    getToken: (state) => state.token
  }
})

export default CheckoutComCardStore
