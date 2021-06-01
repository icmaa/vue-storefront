import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import PaymentState from '../../types/PaymentState'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export const PaymentStore: Module<PaymentState, RootState> = {
  namespaced: true,
  state: {
    registeredMethods: [],
    methodsFactories: {
      'bankpayment': () => import(/* webpackChunkName: "icmaa-payment-method-bankpayment" */ '../methods/bank-payment'),
      'cashondelivery': () => import(/* webpackChunkName: "icmaa-payment-method-cashondelivery" */ '../methods/cash-on-delivery'),
      'checkoutcom_card': () => import(/* webpackChunkName: "icmaa-payment-method-checkoutcom-card" */ 'icmaa-checkout-com/store/methods/card')
    }
  },
  actions,
  getters,
  mutations
}
