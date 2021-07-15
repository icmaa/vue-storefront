import PayPalState from '../type/PayPalState'
import { icmaaPayPalStore } from '../store'
import { Store } from 'vuex'

export default async ($store: Store<PayPalState>) => {
  $store.registerModule('icmaaPayPal', icmaaPayPalStore)
  return $store.dispatch('icmaaPayPal/loadSdk')
}
