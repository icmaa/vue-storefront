import Vue from 'vue'
import VueGtm from 'vue-gtm'
import rootStore from '@vue-storefront/core/store'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { userHooks } from '@vue-storefront/core/modules/user/hooks'
import { catalogHooks } from '@vue-storefront/core/modules/catalog-next/hooks'

import { IcmaaGoogleTagManager as EventHooks } from './'
import triggerPageView from '../helpers/pageView'

export const registerCustomPageEvents = () => {
  catalogHooks.productPageVisited(() => {
    const eventPayload = rootStore.getters['icmaaGoogleTagManager/gtmEventPayload']('product')
    rootStore.dispatch('icmaaGoogleTagManager/updateEvent', eventPayload)
  })

  catalogHooks.categoryPageVisited(() => {
    const eventPayload = rootStore.getters['icmaaGoogleTagManager/gtmEventPayload']('category')
    rootStore.dispatch('icmaaGoogleTagManager/updateEvent', eventPayload)
  })
}

export function afterRegistration () {
  const GTM: VueGtm = (Vue as any).gtm

  const storeView = currentStoreView()
  const currencyCode = storeView.i18n.currencyCode

  const getProduct = item => rootStore.getters['icmaaGoogleTagManager/getProductDTO'](item)

  rootStore.subscribe(({ type, payload }, state) => {
    // Adding a Product to a Shopping Cart
    if (type === 'cart/cart/ADD') {
      GTM.trackEvent({
        event: 'addToCart',
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
        event: 'removeFromCart',
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
    rootStore.dispatch('icmaaGoogleTagManager/resetEvent')
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
