import { createPaymentStore } from '../abstract'
import State from '../../../types/methods/BankPaymentState'

const PrepaymentStore = createPaymentStore<State>({
  namespaced: true,
  state: {
    infoComponent: () => import(
      /* webpackChunkName: "icmaa-payment-method-bankpayment-info" */
      'icmaa-payment/components/methods/bank-payment/Info.vue'
    )
  },
  getters: {
    getInfoComponent: (state) => state.infoComponent
  }
})

export default PrepaymentStore
