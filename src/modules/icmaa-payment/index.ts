import { StorefrontModule } from '@vue-storefront/core/lib/modules'

import { PaymentStore } from './store/payment'

export const IcmaaPaymentModule: StorefrontModule = function ({ store }) {
  store.registerModule('payment', PaymentStore)
}
