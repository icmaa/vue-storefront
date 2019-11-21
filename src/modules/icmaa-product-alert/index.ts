import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { ProductAlertStore } from './store'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

export const cacheStorageKey = 'icmaa-product-alert'
export const cacheStorage = StorageManager.init(cacheStorageKey)

export const IcmaaProductAlertModule: StorefrontModule = async function ({ store }) {
  store.registerModule('icmaaProductAlert', ProductAlertStore)

  EventBus.$on('user-after-loggedin', async result => {
    const productStockAlerts = await store.dispatch('icmaaProductAlert/fetchProductStockAlerts')
  })

  EventBus.$on('user-after-logout', result => {
    store.dispatch('icmaaProductAlert/clearProductStockAlerts')
  })
}
