import { createPaymentStore } from 'icmaa-payment/store/methods/abstract'
import PayPalState from '../type/PayPalState'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export const icmaaPayPalStore = createPaymentStore<PayPalState>({
  namespaced: true,
  state: {
    infoComponent: () => import(
      /* webpackChunkName: "icmaa-paypal-info" */
      'icmaa-paypal/components/Checkout/Info.vue'
    ),
    orderButtonComponent: () => import(
      /* webpackChunkName: "icmaa-paypal-place-order-button" */
      'icmaa-paypal/components/Checkout/PlaceOrderButton.vue'
    ),
    isSdkLoaded: false,
    clientId: null,
    brandName: null,
    softDescriptor: null,
    referenceId: null
  },
  actions,
  mutations,
  getters
})

export default icmaaPayPalStore
