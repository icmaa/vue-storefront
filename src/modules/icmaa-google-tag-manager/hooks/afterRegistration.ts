import Vue from 'vue'
import VueGtm from 'vue-gtm'
import rootStore from '@vue-storefront/core/store'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { userHooks } from '@vue-storefront/core/modules/user/hooks'
import { catalogHooks } from '@vue-storefront/core/modules/catalog-next/hooks'

import { IcmaaGoogleTagManager as EventHooks, IcmaaGoogleTagManagerExecutors } from './'
import triggerPageView from '../helpers/pageView'

export const registerCustomPageEvents = () => {
  catalogHooks.productPageVisited(() => {
    const event = rootStore.getters['icmaaGoogleTagManager/gtmEventPayload']('product')
    IcmaaGoogleTagManagerExecutors.onGtmPageView({ type: event.event, event })
  })

  catalogHooks.categoryPageVisited(() => {
    const event = rootStore.getters['icmaaGoogleTagManager/gtmEventPayload']('category')
    IcmaaGoogleTagManagerExecutors.onGtmPageView({ type: event.event, event })
  })
}

export function afterRegistration () {
  const GTM: VueGtm = (Vue as any).gtm

  const storeView = currentStoreView()
  const currencyCode = storeView.i18n.currencyCode

  const getProduct = item => {
    const { qty: quantity } = item
    return Object.assign({ quantity }, rootStore.getters['icmaaGoogleTagManager/getProductDTO'](item))
  }

  rootStore.subscribe(({ type, payload }, state) => {
    // Adding a Product to a Shopping Cart
    if (type === 'cart/cart/ADD') {
      GTM.trackEvent({
        event: 'icmaa-add-to-cart',
        ecommerce: {
          currencyCode: currencyCode,
          add: {
            products: [getProduct(payload.product)]
          }
        }
      })
    }

    // Removing a Product from a Shopping Cart
    if (type === 'cart/cart/DEL') {
      GTM.trackEvent({
        event: 'icmaa-remove-from-cart',
        ecommerce: {
          remove: {
            products: [getProduct(payload.product)]
          }
        }
      })
    }
  })

  EventHooks.afterEach(({ to }) => triggerPageView(to))

  EventHooks.onGtmPageView(({ event }) => {
    GTM.trackEvent(event)
  })

  registerCustomPageEvents()

  EventHooks.onSearchResult(({ term: searchTerm }) => {
    GTM.trackEvent({
      event: 'icmaa-search',
      searchTerm
    })
  })

  userHooks.afterUserAuthorize(() => {
    GTM.trackEvent({
      event: 'icmaa-login'
    })
  })

  userHooks.afterUserUnauthorize(() => {
    GTM.trackEvent({
      event: 'icmaa-logout'
    })
  })
}
