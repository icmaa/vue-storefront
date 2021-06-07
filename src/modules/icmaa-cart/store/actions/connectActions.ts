import config from 'config'
import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { Logger } from '@vue-storefront/core/lib/logger'
import { CartService } from '@vue-storefront/core/data-resolver'
import { createDiffLog } from '@vue-storefront/core/modules/cart/helpers'

const actions: ActionTree<CartState, RootState> = {
  /**
   * Clone of originial `cart/authorize`
   *
   * Changes:
   * * There is a bug in the original method where the method assumes that `getCoupon` always returns an object.
   *   This sometimes leads to an exception during the login if a cart exists and the user wants to login into
   *   a customer account with a exsisting quote.
   * * Use `forceSync` in `connect` action as otherwise the quote won't be merged with the server cart after the login.
   */
  async authorize ({ dispatch, getters }) {
    const coupon = getters.getCoupon ? getters.getCoupon.code : false
    if (coupon) {
      await dispatch('removeCoupon', { sync: false })
    }

    await dispatch('connect', { guestCart: false, mergeQty: true })

    if (coupon) {
      await dispatch('applyCoupon', coupon)
    }
  },
  /**
   * Clone of originial `cart/connect`
   *
   * Changes:
   * * There is a bug in the original method where the cart won't be merged with an existing one after login
   *   because the `isSyncRequired` getter will return false – which is correctly because its synced the cart
   *   already with the server. Thats why we nee to add the `forceSync` parameter to the action. We are using
   *   the `serverMergeByDefault` config flag to make it configurable.
   * * We remove the bypass functionallity as we don't need it and don't need to bloat the code again here.
   */
  async connect ({ getters, dispatch, commit }, { guestCart = false, forceClientState = false, mergeQty = false }) {
    if (!getters.isCartSyncEnabled) return
    const { result, resultCode } = await CartService.getCartToken(guestCart, forceClientState)

    if (resultCode === 200) {
      Logger.info('Server cart token created.', 'cart', result)()
      commit(types.CART_LOAD_CART_SERVER_TOKEN, result)

      const { serverMergeByDefault } = config.cart
      const dryRun = !serverMergeByDefault
      const forceSync = serverMergeByDefault

      return dispatch('sync', { forceClientState, dryRun, forceSync, mergeQty })
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
