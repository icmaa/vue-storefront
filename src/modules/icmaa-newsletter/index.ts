import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { extendStore } from '@vue-storefront/core/helpers'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'

import { ExtendedNewsletterStore } from './store'
import moduleRoutes from './routes'

export const IcmaaExtendedNewsletterModule: StorefrontModule = function ({ appConfig, router }) {
  extendStore('newsletter', ExtendedNewsletterStore)
  setupMultistoreRoutes(appConfig, router, moduleRoutes, 10)
}
