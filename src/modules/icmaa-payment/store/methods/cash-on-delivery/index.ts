import RootState from '@vue-storefront/core/types/RootState'
import { PaymentStore } from '../../../types/methods/AbstractState'
import State from '../../../types/methods/CashOnDeliveryState'

const CashOnDeliveryStore: PaymentStore<State, RootState> = {
  namespaced: true,
  actions: {
    init () {
      console.error('Cash-on-delivery has been initialized')
    },
    save () {
      console.error('Cash-on-delivery has been saved')
    }
  },
  getters: {
    getInfoComponent: () => false
  }
}

export default CashOnDeliveryStore
