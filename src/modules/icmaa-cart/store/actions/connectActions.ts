import config from 'config'
import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { CartService } from '@vue-storefront/core/data-resolver'
import { createDiffLog } from '@vue-storefront/core/modules/cart/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<CartState, RootState> = {
  /**
   * Clone of originial `cart/authorize`
   *
   * Changes:
   * * There is a bug in the original method where the method assumes that `getCoupon` always returns an object.
   *   This sometimes leads to an exception during the login if a cart exists and the user wants to login into
   *   a customer account with a exsisting quote.
   * * Use `mergeItems` in `connect` action as otherwise the quote won't be merged with the server cart after the login.
   * * Add `forceSync` if a coupon is in cart to prevent that incentives are
   *   added to cart twice after removing them before without sync.
   */
  async authorize ({ dispatch, getters }) {
    let forceSync = false
    const coupon = getters.getCoupon ? getters.getCoupon.code : false
    if (coupon) {
      await dispatch('removeCoupon', { sync: true })
      forceSync = true
    }

    const { serverMergeByDefault, serverSyncCanRemoveLocalItems, serverSyncCanModifyLocalItems } = config.cart
    const mergeItems = (serverMergeByDefault && serverSyncCanRemoveLocalItems && serverSyncCanModifyLocalItems)
    await dispatch('connect', { guestCart: false, forceSync, mergeItems, mergeQty: true })

    if (coupon) {
      await dispatch('applyCoupon', coupon)
    }
  },
  /**
   * Clone of originial `cart/clear`
   *
   * Changes:
   * * Add `forceSync` and `mergeItems` paramaters to pass them to `sync` method
   */
  async connect ({ getters, dispatch, commit }, { guestCart = false, forceSync = false, forceClientState = false, mergeItems = false, mergeQty = false }) {
    if (!getters.isCartSyncEnabled) return
    const { result, resultCode } = await CartService.getCartToken(guestCart, forceClientState)

    if (resultCode === 200) {
      Logger.info('Server cart token created.', 'cart', result)()
      commit(types.CART_LOAD_CART_SERVER_TOKEN, result)

      return dispatch('sync', { forceSync, forceClientState, mergeItems, dryRun: !config.cart.serverMergeByDefault, mergeQty })
    }

    if (resultCode === 401 && getters.bypassCounter < config.queues.maxCartBypassAttempts) {
      Logger.log('Bypassing with guest cart' + getters.bypassCounter, 'cart')()
      commit(types.CART_UPDATE_BYPASS_COUNTER, { counter: 1 })
      Logger.error(result, 'cart')()
      return dispatch('connect', { guestCart: true })
    }

    Logger.warn('Cart sync is disabled by the config', 'cart')()
    return createDiffLog()
  },
  /**
   * Clone of originial `cart/clear`
   *
   * Changes:
   * * Add `cart-after-cleared` event
   * * Add reset of checkout using `checkout/reset`
   */
  async clear ({ commit, dispatch }, { disconnect = true, sync = true } = {}) {
    await commit(types.CART_LOAD_CART, [])
    if (sync) {
      await dispatch('sync', { forceClientState: true, forceSync: true })
    }
    if (disconnect) {
      await commit(types.CART_SET_ITEMS_HASH, null)
      await dispatch('disconnect')
    }

    await dispatch('checkout/reset', { clearCart: false }, { root: true })

    EventBus.$emit('cart-after-cleared', { disconnect, sync })
  }
}

export default actions
