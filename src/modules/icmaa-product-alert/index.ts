import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { ProductAlertStore } from './store'

import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

export const cacheStorageKey = 'icmaa-product-alert'
export const cacheStorage = StorageManager.init(cacheStorageKey)

export const IcmaaProductAlertModule: StorefrontModule = function ({ store }) {
  store.registerModule('icmaaProductAlert', ProductAlertStore)
}
