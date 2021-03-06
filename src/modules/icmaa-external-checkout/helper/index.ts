import rootStore from '@vue-storefront/core/store'
import config from 'config'
import queryString from 'query-string'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { isServer } from '@vue-storefront/core/helpers'

export const getCookieHostname = (requestHostname?: string): string => {
  let hostname = !isServer ? document.location.host : (requestHostname || '')
  return hostname.startsWith('.') ? hostname : '.' + hostname
}

export const getExternalCheckoutUrl = (): string => {
  const cartToken: string = rootStore.state.cart.cartServerToken
  const userToken: string = rootStore.state.user.token
  let shopUrl: string = config.externalCheckout.shopUrl

  if (config.storeViews.multistore) {
    const store = currentStoreView()
    shopUrl = shopUrl.endsWith('/') ? shopUrl.slice(-1) : shopUrl
    shopUrl = store.url.startsWith('/') ? shopUrl + store.url : store.url
  }

  const url = shopUrl + '/vue/cart/sync'
  const query: { token: string, cart: string } = {
    token: userToken,
    cart: cartToken
  }

  return queryString.stringifyUrl({ url, query })
}

export function getRedirectToExternalCheckoutUrl (routeName: string): string|boolean {
  const storeCode = currentStoreView().storeCode
  const multistoreEnabled: boolean = config.storeViews.multistore

  if (routeName === 'checkout' || (multistoreEnabled && routeName === storeCode + '-checkout')) {
    return !isServer ? getExternalCheckoutUrl() : false
  }

  return false
}
