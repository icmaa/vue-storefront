// import { CheckoutComStore } from './store';
import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { isServer } from '@vue-storefront/core/helpers'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

export const METHOD_CARD = 'checkoutcom_card'

export const PAYMENT_METHODS = [
  METHOD_CARD
];

export const IcmaaCheckoutComPaymentModule: StorefrontModule = function ({ store }) {
  let method = null;
  let shouldHandlePlaceOrder = false

  // Place the order. Payload is empty as we don't have any specific info to add for this payment method '{}'
  const placeOrder = () => {
    if (shouldHandlePlaceOrder) {
      store.dispatch(method + '/placeOrder', null, { root: true })
    }
  }

  if (!isServer) {
    EventBus.$on('checkout-before-placeOrder', placeOrder)

    EventBus.$on('checkout-payment-method-changed', (paymentMethod) => {
      shouldHandlePlaceOrder = paymentMethod && PAYMENT_METHODS.indexOf(paymentMethod.code) >= 0
      method = paymentMethod.code
    })
  }
}
