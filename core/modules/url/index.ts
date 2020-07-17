import { urlStore } from './store'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { beforeEachGuard } from './router/beforeEach'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

export const UrlModule: StorefrontModule = function ({ store, router }) {
  StorageManager.init('url', undefined, 2048)
  store.registerModule('url', urlStore)
  router.beforeEach(beforeEachGuard)
}
