import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'

import { TeaserStore, teaserStateKey } from './store'
import moduleRoutes from './routes'

export const KEY = 'icmaa-teaser'

export const IcmaaTeaserModule: StorefrontModule = function ({ store, appConfig, router }) {
  StorageManager.init(KEY, undefined, 1024)
  store.registerModule(teaserStateKey, TeaserStore)
  setupMultistoreRoutes(appConfig, router, moduleRoutes, 10)
}
