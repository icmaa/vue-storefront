import rootStore from '@vue-storefront/core/store'
import { Route } from 'vue-router'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { RouteEvent } from '../types/GoogleTagManagerState'
import { IcmaaGoogleTagManagerExecutors } from '../hooks'
import { disallowList } from '../'

export default (to: Route) => {
  const pageType = to.meta.gtm || to.name
  if (disallowList.includes(pageType)) {
    return
  }

  const eventRouteData = {
    'content-name': to.fullPath,
    'content-view-name': to.meta.gtm || to.name,
    'store_code': currentStoreView().storeCode
  }

  const event: RouteEvent = Object.assign(
    rootStore.getters['icmaaGoogleTagManager/gtmEventPayload'](),
    eventRouteData
  )

  IcmaaGoogleTagManagerExecutors.onGtmPageView({ type: event.event, event })
}
