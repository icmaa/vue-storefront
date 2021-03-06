import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

import { SpotifyStore } from './store'

export const KEY = 'icmaa-spotify'
export const storageKey = 'spotify'

export const IcmaaSpotifyModule: StorefrontModule = function ({ store }) {
  StorageManager.init(KEY, undefined, 128)
  store.registerModule('icmaaSpotify', SpotifyStore)
}
