import PayPalState from '../type/PayPalState'
import { Store } from 'vuex'

export default async ($store: Store<PayPalState>) => {
  if (!$store.hasModule('icmaaPayPal')) {
    const store = await import(/* webpackChunkName: "icmaa-payment-method-paypal" */ '../store')
    $store.registerModule('icmaaPayPal', store.icmaaPayPalStore as any)
  }
  return $store.dispatch('icmaaPayPal/loadSdk')
}
