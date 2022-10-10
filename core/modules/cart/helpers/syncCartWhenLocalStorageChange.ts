import rootStore from '@vue-storefront/core/store'
import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'
import { storeViews } from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

function checkMultistoreKey (key: string, path: string, prefix: string = 'shop/cart/'): boolean {
  const { multistore, commonCache } = storeViews
  if (!multistore || (multistore && commonCache)) return key === path
  return key === `${currentStoreView().storeCode}-${prefix}${path}`
}

function getItemsFromStorage ({ key, newValue }) {
  if (checkMultistoreKey(key, 'current-cart')) {
    const value = JSON.parse(newValue)
    rootStore.commit(types.SN_CART + '/' + types.CART_LOAD_CART + types.LS_SUFFIX, value)
  } else if (checkMultistoreKey(key, 'current-cart-token')) {
    const value = JSON.parse(newValue)
    rootStore.commit(types.SN_CART + '/' + types.CART_LOAD_CART_SERVER_TOKEN + types.LS_SUFFIX, value)
  } else if (checkMultistoreKey(key, 'current-cart-hash')) {
    const value = JSON.parse(newValue)
    rootStore.commit(types.SN_CART + '/' + types.CART_SET_ITEMS_HASH + types.LS_SUFFIX, value)
  } else if (checkMultistoreKey(key, 'current-totals')) {
    const value = JSON.parse(newValue)
    rootStore.commit(types.SN_CART + '/' + types.CART_UPD_TOTALS + types.LS_SUFFIX, value)
  }
}

function addEventListener () {
  window.addEventListener('storage', getItemsFromStorage)
}

function removeEventListener () {
  window.removeEventListener('storage', getItemsFromStorage)
}

export {
  addEventListener,
  removeEventListener
}
