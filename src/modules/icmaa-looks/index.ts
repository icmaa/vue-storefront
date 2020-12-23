import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'

import moduleRoutes from './routes'
import { LooksStore, stateKey } from './store'

export const IcmaaLooksModule: StorefrontModule = function ({ store, appConfig, router }) {
  store.registerModule(stateKey, LooksStore)
  setupMultistoreRoutes(appConfig, router, moduleRoutes, 10)
}
