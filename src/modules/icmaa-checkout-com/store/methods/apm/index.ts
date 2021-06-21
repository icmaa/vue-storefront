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
    getInfoComponent: (state) => state.infoComponent,
    getApmCodeByMethodCode: () => (code: string): string | boolean => {
      const regexp = new RegExp(`${CODE}_(.*)`, 'gm')
      return code.replace(regexp, '$1')
    }
  }
})

export default CheckoutComApmStore
