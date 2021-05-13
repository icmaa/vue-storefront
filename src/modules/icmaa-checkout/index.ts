import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'

import moduleRoutes from './routes'

export const IcmaaCheckoutModule: StorefrontModule = function ({ router, store, appConfig }) {
  setupMultistoreRoutes(appConfig, router, moduleRoutes, 10)
}
