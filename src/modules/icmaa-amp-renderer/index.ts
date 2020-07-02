import moduleRoutes from './router'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'
import config from 'config'

const icmaaAmpRendererStore = {
  namespaced: true,
  state: {
    key: null
  }
}

/**
 * To enable this module you need to
 * - include the module inside the `src/modules/client.ts`
 * - uncomment the meta-link part in `src/modules/icmaa-meta/mixins/productMeta.ts`
 *   and `src/modules/icmaa-meta/mixins/categoryMeta.ts`
 */
export const IcmaaAmpRendererModule: StorefrontModule = function ({ store, router }) {
  store.registerModule('icmaa-amp-renderer', icmaaAmpRendererStore)
  setupMultistoreRoutes(config, router, moduleRoutes, 10)
}
