import { Store } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { RouteEvent } from '../types/GoogleTagManagerState'
import { IcmaaGoogleTagManagerExecutors } from '../hooks'

export default (route: any, store: Store<any>) => {
  const eventPayload = store.getters['icmaaGoogleTagManager/gtmEventPayload']()
  store.dispatch('icmaaGoogleTagManager/updateEvent', eventPayload)

  const eventRouteData = {
    'content-name': route.fullPath,
    'content-view-name': route.meta.gtm || route.name,
    'store_code': currentStoreView().storeCode
  }

  const event: RouteEvent = Object.assign(
    eventRouteData,
    store.getters['icmaaGoogleTagManager/getQueuedRouteEvent']
  )

  IcmaaGoogleTagManagerExecutors.onGtmPageView({ type: event.event, event })
}
