import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

const actions: ActionTree<CartState, RootState> = {
  /**
   * Clone of originial `cart/authorize`
   *
   * Changes:
   * * There is a bug in the original method where the method assumes that `getCoupon` always returns an object.
   *   This sometimes leads to an exception during the login if a cart exists and the user wants to login into
   *   a customer account with a exsisting quote.
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
