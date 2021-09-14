import { createPaymentStore } from '../abstract'
import State from '../../../types/methods/CashOnDeliveryState'

const CashOnDeliveryStore = createPaymentStore<State>({
  namespaced: true,
  state: {
    infoComponent: () => import(
      /* webpackChunkName: "icmaa-payment-cashondelivery-info" */
      'icmaa-payment/components/methods/cash-on-delivery/Info.vue'
    )
  },
  getters: {
    getInfoComponent: (state) => state.infoComponent
  }
})

export default CashOnDeliveryStore
