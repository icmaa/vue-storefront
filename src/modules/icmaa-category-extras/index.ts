import config from 'config'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

import { CategoryExtrasStore, categoryExtrasStateKey, categoryExtrasStorageKey } from './store'

export const cacheStorage = StorageManager.init(categoryExtrasStorageKey, undefined, 2048)

export const IcmaaCategoryExtrasModule: StorefrontModule = function ({ store }) {
  store.registerModule(categoryExtrasStateKey, CategoryExtrasStore)
}
