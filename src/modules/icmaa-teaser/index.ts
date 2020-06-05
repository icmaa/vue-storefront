import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'

import { TeaserStore, teaserStateKey } from './store'
import moduleRoutes from './routes'

export const KEY = 'icmaa-teaser'
export const cacheStorage = StorageManager.init(KEY, undefined, 1024)

export const IcmaaTeaserModule: StorefrontModule = function ({ store, appConfig, router }) {
  store.registerModule(teaserStateKey, TeaserStore)
  setupMultistoreRoutes(appConfig, router, moduleRoutes, 10)
}
