import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import { CartService } from '@vue-storefront/core/data-resolver'
import { cartHooksExecutors } from '@vue-storefront/core/modules/cart/hooks'
import * as types from '../../store/mutation-types'
import * as orgTypes from '@vue-storefront/core/modules/cart/store/mutation-types'

const actions: ActionTree<CartState, RootState> = {
  /**
   * Clone of originial `cart/applyCoupon`
   *
   * Changes:
   * * Add callback function
   * * Update cart-hash after apply
   */
  async applyCoupon ({ getters, dispatch, commit }, couponCode) {
    if (couponCode && getters.canSyncTotals) {
      const response = await CartService.applyCoupon(couponCode)
      const { result } = response
      if (result) {
        await dispatch('couponCallback')

        // 'getCurrentCartHash' has been changed (it's based on cart items data)
        // so we need to update it in vuex and StorageManager
        commit(orgTypes.CART_SET_ITEMS_HASH, getters.getCurrentCartHash)
      }
      return response
    }
  },
  /**
   * Clone of originial `cart/removeCoupon`
   *
   * Changes:
   * * Add callback function
   */
  async removeCoupon ({ getters, dispatch, commit }, { sync = true } = {}) {
    if (getters.canSyncTotals) {
      const response = await CartService.removeCoupon()
      const { result } = response
      if (result && sync) {
        await dispatch('couponCallback')

        // 'getCurrentCartHash' has been changed (it's based on cart items data)
        // so we need to update it in vuex and StorageManager
        commit(orgTypes.CART_SET_ITEMS_HASH, getters.getCurrentCartHash)
        return response
      }
    }
  },
  /**
   * We need to update/sync the cart after the coupon is applied to update cart for insentive products.
   * There is already an up-to-date representation of the cart in `cart/shipping-information` request
   * of `syncTotals` but this isn't returned so we can't use it without extending the core excessivly.
   */
  async couponCallback ({ getters, dispatch, commit }) {
    const { getCartItems, isTotalsSyncRequired } = getters

    const { result, resultCode } = await CartService.getItems()
    const { serverItems, clientItems } = await cartHooksExecutors.beforeSync({
      clientItems: getCartItems,
      serverItems: result.items
    })

    if (resultCode === 200) {
      dispatch('updateFreeCartItems', result.items)

      const diffLog = await dispatch('merge', {
        dryRun: false,
        serverItems,
        clientItems,
        forceClientState: false
      })

      // Force server sync of totals if not already done after `merge`
      if (!isTotalsSyncRequired && clientItems.length > 0) {
        dispatch('syncTotals', { forceServerSync: true })
      }

      cartHooksExecutors.afterSync(diffLog)

      return diffLog
    }
  },
  updateFreeCartItems ({ commit, getters }, result): number[] {
    /**
     * This otherwise would block any reasonable error output on server errors that are returned to the client.
     * This caused the `TypeError: result.forEach is not a function` notifcation on add-to-cart.
     * */
    if (!Array.isArray(result)) {
      return result
    }

    commit(types.CART_DEL_FREE_ITEM)
    result.forEach(cartItem => {
      const { fooman_auto_added_qty, sku } = cartItem
      if (fooman_auto_added_qty && fooman_auto_added_qty > 0) {
        commit(types.CART_ADD_FREE_ITEM, sku)
      }
    })

    return getters.getFreeCartItems
  }
}

export default actions
