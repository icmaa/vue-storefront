import actions from './actions'
import { ApmState } from 'icmaa-checkout-com/types'
import { createPaymentStore } from 'icmaa-payment/store/methods/abstract'

export const CODE = 'checkoutcom_apm'

const CheckoutComApmStore = createPaymentStore<ApmState>({
  namespaced: true,
  state: {
    infoComponent: () => import(
      /* webpackChunkName: "icmaa-checkout-com-method-apm-info" */
      'icmaa-checkout-com/components/methods/apm/Info.vue'
    )
  },
  actions,
  getters: {
    getInfoComponent: (state) => state.infoComponent
  }
})

export default CheckoutComApmStore
