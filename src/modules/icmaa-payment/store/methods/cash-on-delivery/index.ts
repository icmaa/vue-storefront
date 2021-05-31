import RootState from '@vue-storefront/core/types/RootState'
import { PaymentStore } from '../../../types/methods/AbstractState'
import State from '../../../types/methods/CashOnDeliveryState'

const CashOnDeliveryStore: PaymentStore<State, RootState> = {
  namespaced: true,
  state: {
    infoComponent: () => import(
      /* webpackChunkName: "icmaa-payment-cashondelivery-info" */
      'icmaa-payment/components/methods/cash-on-delivery/Info.vue'
    )
  },
  actions: {
    init () {
      console.error('Cash-on-delivery has been initialized')
    },
    save () {
      console.error('Cash-on-delivery has been saved')
    }
  },
  getters: {
    getInfoComponent: (state) => state.infoComponent
  }
}

export default CashOnDeliveryStore
