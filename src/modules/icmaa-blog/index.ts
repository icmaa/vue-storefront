import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { setupMultistoreRoutes, currentStoreView } from '@vue-storefront/core/lib/multistore'

import { BlogStore, stateKey } from './store'
import moduleRoutes from './routes'

export const KEY = 'icmaa-blog'

export const IcmaaBlogModule: StorefrontModule = function ({ store, appConfig, router }) {
  StorageManager.init(KEY, undefined, 128)
  store.registerModule(stateKey, BlogStore)

  const { storeCode } = currentStoreView()
  const ignoredStores: string[] = appConfig?.icmaa_blog?.ignoreStores || []
  if (!ignoredStores.includes(storeCode)) {
    setupMultistoreRoutes(appConfig, router, moduleRoutes, 10)
  }
}
