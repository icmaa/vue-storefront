import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

import { SpotifyStore } from './store'

export const KEY = 'icmaa-spotify'
export const storageKey = 'spotify'
export const cacheStorage = StorageManager.init(KEY)

export const IcmaSpotifyModule: StorefrontModule = function (app, store, router, moduleConfig, appConfig) {
  store.registerModule('icmaaSpotify', SpotifyStore)
}
