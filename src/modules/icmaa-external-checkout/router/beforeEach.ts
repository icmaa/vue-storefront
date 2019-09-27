import {Route} from 'vue-router'
import rootStore from '@vue-storefront/core/store'
import config from 'config'
import {currentStoreView} from '@vue-storefront/core/lib/multistore'
import { isServer } from '@vue-storefront/core/helpers'

export const shopControllerName = (userToken: string, cartToken: string): string => {
  let shopUrl: string = config.externalCheckout.shopUrl
  if (config.storeViews.multistore) {
    const store = currentStoreView()
    shopUrl = shopUrl.endsWith('/') ? shopUrl.slice(-1) : shopUrl
    shopUrl = store.url.startsWith('/') ? shopUrl + store.url : store.url
  }

  return shopUrl + '/vue/cart/sync/token/' + userToken + '/cart/' + cartToken
}

export function beforeEachGuard (to: Route, from: Route, next) {
  const cartToken: string = rootStore.state.cart.cartServerToken
  const userToken: string = rootStore.state.user.token

  const storeCode = currentStoreView().storeCode
  const multistoreEnabled: boolean = config.storeViews.multistore

  if (to.name === 'checkout' || (multistoreEnabled && to.name === storeCode + '-checkout')) {
    const redirectUrl = shopControllerName(userToken, cartToken)
    if (!isServer) {
      window.location.replace(redirectUrl)
    }
  }

  next()
}
