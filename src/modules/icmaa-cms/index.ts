import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'

import { BlockStore, cmsBlockStateKey } from './store/block'
import { PageStore, cmsPageStateKey } from './store/page'
import moduleRoutes from './routes'

export const KEY = 'icmaa-cms'
export const cacheStorage = StorageManager.init(KEY)

export const IcmaaCmsModule: StorefrontModule = function ({ store, appConfig, router }) {
  store.registerModule(cmsBlockStateKey, BlockStore)
  store.registerModule(cmsPageStateKey, PageStore)
  setupMultistoreRoutes(appConfig, router, moduleRoutes, 10)
}
