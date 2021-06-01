import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import State, { PaymentStore } from '../../types/methods/AbstractState'

import merge from 'lodash-es/merge'

const AbstractPaymentStore: Module<State, RootState> = {
  actions: {
    init () {
      console.error('Payment has been initialized')
    },
    save () {
      /**
       * If you return false the process will be stalled
       */
      console.error('Payment has been saved')
    },
    beforePlaceOrder () {
      console.error('Payment before place order')
    },
    afterPlaceOrder () {
      console.error('Payment after place order')
    }
  },
  getters: {
    getInfoComponent: () => false
  }
}

export const createPaymentStore = <S>(store: PaymentStore<S, RootState>): PaymentStore<S, RootState> =>
  merge(AbstractPaymentStore, store)

export default AbstractPaymentStore
