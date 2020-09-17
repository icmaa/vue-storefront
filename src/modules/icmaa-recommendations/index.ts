import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

import { RecommendationsStore, storageKey, stateKey } from './store'

export const IcmaaRecommendationsModule: StorefrontModule = function ({ store }) {
  StorageManager.init(storageKey, undefined, 512)
  store.registerModule(stateKey, RecommendationsStore)
}
