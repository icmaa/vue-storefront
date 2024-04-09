import PayPalState from '../type/PayPalState'
import { Store } from 'vuex'

export default async ($store: Store<PayPalState>) => {
  if (!$store.hasModule('icmaa_paypal_checkout')) {
    const store = await import(/* webpackChunkName: "icmaa-payment-method-paypal" */ '../store')
    $store.registerModule('icmaa_paypal_checkout', store.icmaaPayPalStore() as any)
  }
  return $store.dispatch('icmaa_paypal_checkout/loadSdk')
}
