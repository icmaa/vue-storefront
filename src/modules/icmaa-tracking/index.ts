import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'
import { TrackingStore } from './store'
import moduleRoutes from './routes'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

export const IcmaaTrackingModule: StorefrontModule = async function ({ appConfig, router, store }) {
  store.registerModule('icmaaTracking', TrackingStore)
  setupMultistoreRoutes(appConfig, router, moduleRoutes, 10)

  EventBus.$on('user-after-logout', () => {
    store.dispatch('icmaaTracking/clearTracking')
  })
}
