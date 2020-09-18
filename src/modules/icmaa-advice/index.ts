import config from 'config'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

import { AdviceStore, adviceStateKey } from './store'

export const KEY = 'icmaa-advice'

export const IcmaaAdviceModule: StorefrontModule = function ({ store }) {
  StorageManager.init(KEY, undefined, 512)
  store.registerModule(adviceStateKey, AdviceStore)
}
