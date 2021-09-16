import Vue from 'vue'
import config from 'config'
import { coreHooks } from '@vue-storefront/core/hooks'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { ExtendedConfigStore } from './store'
import { once, isServer } from '@vue-storefront/core/helpers'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { Logger } from '@vue-storefront/core/lib/logger'

import { round, formatValue } from './helpers/price'

export const cacheStorageKey = 'icmaa-config'

export const IcmaaExtendedConfigModule: StorefrontModule = function ({ store }) {
  StorageManager.init(cacheStorageKey, undefined, config.server.elasticCacheQuota)

  if (config.storeViews.multistore === true) {
    store.registerModule('icmaaConfig', ExtendedConfigStore)

    coreHooks.afterAppInit(() => { store.dispatch('icmaaConfig/setMap') })
    coreHooks.beforeStoreViewChanged(storeView => {
      store.dispatch('icmaaConfig/setMap', storeView)
      return storeView // Must return the storeView variable as it is a mutator-hook
    })

    if (!isServer && !(window as any).Cypress) {
      coreHooks.afterAppInit(async () => {
        const configStorage = StorageManager.get(cacheStorageKey)

        const storageBuildtime = await configStorage.getItem('buildtime')
        const envBuildtime = process.env.__BUILDTIME__

        if (!storageBuildtime || storageBuildtime !== envBuildtime) {
          const allowList = config.icmaa_config.localStorageBuildFlushAllowList || []
          Object.keys(StorageManager.storageMap).forEach(async key => {
            if (!allowList.some(regexString => new RegExp(regexString).test(key))) {
              Logger.log('Flush localforage:', 'icmaa-config', key)()
              await StorageManager.get(key).clear()
            }
          })

          Logger.log('Set build time:', 'icmaa-config', envBuildtime)()
          await configStorage.setItem('buildtime', envBuildtime)
        }
      })
    }
  }

  once('__VUE_EXTEND__', () => {
    Vue.filter('round', round)
    Vue.filter('formatValue', formatValue)
  })
}
