import Vue from 'vue'
import VueGtm from 'vue-gtm'
import rootStore from '@vue-storefront/core/store'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { userHooks } from '@vue-storefront/core/modules/user/hooks'
import { catalogHooks } from '@vue-storefront/core/modules/catalog-next/hooks'
import * as cartMutations from '@vue-storefront/core/modules/cart/store/mutation-types'
import * as wishlistMutations from '@vue-storefront/core/modules/wishlist/store/mutation-types'

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

  EventHooks.searchResultVisited(() => {
    const event = rootStore.getters['icmaaGoogleTagManager/gtmEventPayload']('search')
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

  rootStore.subscribe(({ type, payload }) => {
    if (payload.hasOwnProperty('forceServerSilence') &&
      payload.forceServerSilence === true
    ) {
      return
    }

    // Adding a product to a Shopping Cart
    if (type === 'cart/' + cartMutations.CART_ADD_ITEM) {
      GTM.trackEvent({
        event: 'icmaa-add-to-cart',
        ecommerce: {
          currencyCode: currencyCode,
          add: {
            products: [ getProduct(payload.product) ]
          }
        }
      })
    }

    // Removing a product from a Shopping Cart
    if (type === 'cart/' + cartMutations.CART_DEL_ITEM) {
      GTM.trackEvent({
        event: 'icmaa-remove-from-cart',
        ecommerce: {
          currencyCode: currencyCode,
          remove: {
            products: [ getProduct(payload.product) ]
          }
        }
      })
    }

    // Adding a product to wishlist
    if (type === 'wishlist/' + wishlistMutations.WISH_ADD_ITEM) {
      GTM.trackEvent({
        event: 'icmaa-add-to-wishlist',
        ecommerce: {
          currencyCode: currencyCode,
          wishlist_add: {
            products: [ getProduct(payload.product) ]
          }
        }
      })
    }

    // Remove a product from wishlist
    if (type === 'wishlist' + wishlistMutations.WISH_DEL_ITEM) {
      GTM.trackEvent({
        event: 'icmaa-remove-from-wishlist',
        ecommerce: {
          currencyCode: currencyCode,
          wishlist_remove: {
            products: payload.product ? [ getProduct(payload.product) ] : [ ]
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

  EventHooks.openProductListFilterSidebar(() => {
    GTM.trackEvent({
      event: 'icmaa-open-product-list-filter-sidebar'
    })
  })

  EventHooks.onProductListFilter(({ filter }) => {
    GTM.trackEvent({
      event: 'icmaa-on-product-list-filter',
      filter
    })
  })

  EventHooks.facebookLoginClicked(({ status }) => {
    GTM.trackEvent({
      event: 'icmaa-facebook-login',
      facebookLoginAction: status
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
