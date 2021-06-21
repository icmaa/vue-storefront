import actions from './actions'
import { ApmState } from 'icmaa-checkout-com/types'
import { createPaymentStore } from 'icmaa-payment/store/methods/abstract'

export const CODE = 'checkoutcom_apm'

const CheckoutComApmStore = createPaymentStore<ApmState>({
  namespaced: true,
  state: {
    infoComponent: false
  },
  actions
})

export default CheckoutComApmStore
