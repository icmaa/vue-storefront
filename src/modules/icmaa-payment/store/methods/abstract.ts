import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import State, { PaymentStore } from '../../types/methods/AbstractState'

import merge from 'lodash-es/merge'

const AbstractPaymentStore: Module<State, RootState> = {
  actions: {
    init () { },
    save () {
      /**
       * If you return false the process will be stalled
       */
    },
    beforePlaceOrder () { },
    afterPlaceOrder () { }
  },
  getters: {
    getInfoComponent: () => false
  }
}

export const createPaymentStore = <S>(store: PaymentStore<S, RootState>): PaymentStore<S, RootState> =>
  merge({}, AbstractPaymentStore, store)

export default AbstractPaymentStore
