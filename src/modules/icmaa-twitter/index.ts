import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

import { TwitterStore } from './store'

export const KEY = 'icmaa-twitter'

export const IcmaaTwitterModule: StorefrontModule = function ({ store }) {
  StorageManager.init(KEY, undefined, 512)
  store.registerModule('icmaaTwitter', TwitterStore)
}
