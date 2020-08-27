import rootStore from '@vue-storefront/core/store'
import { Route } from 'vue-router'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { RouteEvent } from '../types/GoogleTagManagerState'
import { IcmaaGoogleTagManagerExecutors } from '../hooks'

const triggerPageView = (to: Route) => {
  const eventRouteData = {
    'content-name': to.fullPath,
    'content-view-name': to.meta.gtm || to.name,
    'store_code': currentStoreView().storeCode
  }

  const event: RouteEvent = Object.assign(
    rootStore.getters['icmaaGoogleTagManager/gtmEventPayload'](),
    eventRouteData,
    rootStore.getters['icmaaGoogleTagManager/getQueuedRouteEvent']
  )

  IcmaaGoogleTagManagerExecutors.onGtmPageView({ type: event.event, event })
}

export default (to: Route) => {
  /**
   * On the first load (SSR), the `afterEach` guard is called before the `asyncData` methods of
   * the page components, thats why we need to wait a bit before we fire the page-view event
   * to let the `asyncData` collect the page data. After initialization the event is fired immediately.
   */
  if (!rootStore.getters['icmaaGoogleTagManager/initiated']) {
    setTimeout(() => triggerPageView(to), 2000)
    return
  }

  return triggerPageView(to)
}
