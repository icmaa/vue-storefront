import RootState from '@vue-storefront/core/types/RootState'
import { PaymentStore } from '../../../types/methods/AbstractState'
import State from '../../../types/methods/BankPaymentState'

const PrepaymentStore: PaymentStore<State, RootState> = {
  namespaced: true,
  state: {
    infoComponent: () => import(
      /* webpackChunkName: "icmaa-payment-method-bankpayment-info" */
      'icmaa-payment/components/methods/bank-payment/Info.vue'
    )
  },
  actions: {
    init () {
      console.error('Bank-payment has been initialized')
    },
    save () {
      console.error('Bank-payment has been saved')
      return false
    }
  },
  getters: {
    getInfoComponent: (state) => state.infoComponent
  }
}

export default PrepaymentStore
