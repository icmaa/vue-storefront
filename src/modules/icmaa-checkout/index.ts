import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'
import { extendStore } from '@vue-storefront/core/helpers'

import { IcmaaExtendedCheckoutStore } from './store/checkout'
import moduleRoutes from './routes'

export const IcmaaCheckoutModule: StorefrontModule = function ({ router, appConfig }) {
  setupMultistoreRoutes(appConfig, router, moduleRoutes, 10)
  extendStore('checkout', IcmaaExtendedCheckoutStore)
}
