import actions from './actions'
import { ApmState } from 'icmaa-checkout-com/types'
import { createPaymentStore } from 'icmaa-payment/store/methods/abstract'
import { SET_ADDITIONAL_DATA, SET_VALIDATIONS } from './mutation-types'

export const CODE = 'checkoutcom_apm'

const CheckoutComApmStore = createPaymentStore<ApmState>({
  namespaced: true,
  state: {
    additionalData: null,
    validations: null,
    infoComponent: () => import(
      /* webpackChunkName: "icmaa-checkout-com-method-apm-info" */
      'icmaa-checkout-com/components/methods/apm/Info.vue'
    )
  },
  actions,
  getters: {
    getInfoComponent: (state) => state.infoComponent,
    getAdditionalData: (state) => state.additionalData,
    getValidations: (state) => state.validations
  },
  mutations: {
    [SET_ADDITIONAL_DATA] (state: ApmState, value: Record<string, any>) {
      state.additionalData = value
    },
    [SET_VALIDATIONS] (state: ApmState, value: any) {
      state.validations = value
    }
  }
})

export default CheckoutComApmStore
