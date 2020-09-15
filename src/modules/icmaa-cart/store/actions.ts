import { ActionTree } from 'vuex'
import { cart as config } from 'config'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import { CartService } from '@vue-storefront/core/data-resolver'
import { cartHooksExecutors } from '@vue-storefront/core/modules/cart/hooks'
import { productsEquals } from '@vue-storefront/core/modules/cart/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import * as types from '../store/mutation-types'
import * as orgTypes from '@vue-storefront/core/modules/cart/store/mutation-types'

const actions: ActionTree<CartState, RootState> = {
  /**
   * There is a bug in the original method where the method assumes that `getCoupon` always returns an object.
   * This sometimes leads to an exception during the login if a cart exists and the user wants to login into
   * a customer account with a exsisting quote.
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
  async reconnect ({ dispatch, commit }, { token, forceClientState = false }) {
    Logger.info('Reconnect quote with:', 'cart', token)()

    commit(orgTypes.CART_LOAD_CART_SERVER_TOKEN, token)
    return dispatch('sync', { forceClientState, dryRun: !config.serverMergeByDefault, mergeQty: true })
  },
  async removeCoupon ({ getters, dispatch, commit }) {
    if (getters.canSyncTotals) {
      const { result } = await CartService.removeCoupon()
      if (result) {
        await dispatch('couponCallback')

        // 'getCurrentCartHash' has been changed (it's based on cart items data)
        // so we need to update it in vuex and StorageManager
        commit(orgTypes.CART_SET_ITEMS_HASH, getters.getCurrentCartHash)
        return result
      }
    }
  },
  async applyCoupon ({ getters, dispatch, commit }, couponCode) {
    if (couponCode && getters.canSyncTotals) {
      const { result } = await CartService.applyCoupon(couponCode)
      if (result) {
        await dispatch('couponCallback')

        // 'getCurrentCartHash' has been changed (it's based on cart items data)
        // so we need to update it in vuex and StorageManager
        commit(orgTypes.CART_SET_ITEMS_HASH, getters.getCurrentCartHash)
      }
      return result
    }
  },
  /**
   * We need to update/sync the cart after the coupon is applied to update cart for insentive products.
   * There is already an up-to-date representation of the cart in `cart/shipping-information` request
   * of `syncTotals` but this isn't returned so we can't use it without extending the core excessivly.
   * @param param
   */
  async couponCallback ({ getters, dispatch, commit }) {
    const { getCartItems, isTotalsSyncRequired } = getters
    const { result, resultCode } = await CartService.getItems()
    const { serverItems, clientItems } = cartHooksExecutors.beforeSync({ clientItems: getCartItems, serverItems: result })

    if (resultCode === 200) {
      dispatch('updateFreeCartItems', result)

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
    commit(types.CART_DEL_FREE_ITEM)
    result.forEach(cartItem => {
      const { fooman_auto_added_qty, sku } = cartItem
      if (fooman_auto_added_qty && fooman_auto_added_qty > 0) {
        commit(types.CART_ADD_FREE_ITEM, sku)
      }
    })

    return getters.getFreeCartItems
  },
  /**
   * Clone of originial `cart/checkProductStatus`
   *
   * Changes:
   * * We use the synchronous way (`stock/check`) to fetch the stock instead of `stock/queueCheck`
   *
   * Extended descriptions (Ticket #204161):
   * When we put an item to cart using `cart/addItems()`, VSF does a stock check against Magento
   * (if `config.stock.synchronize` is active). This check happens asynchrously using the `StockService.queueCheck()`
   * method. The problem with that is that it sets the cart-items-hash on success and as the method is synchronous,
   * this can lead into the problem that the `cart/sync` action can't see any changes by cart-items-hash if the
   * success action (`cart/stockSync`) of the `queueCheck` is called with a small delay or you click really fast.
   * Then there won't be any success messages shown to the customer as the `cart/sync` action returns nothing at
   * the beginning because `cart/isSyncRequired` returns false. So if we call this synchronous, everything works fine.
   */
  async checkProductStatus ({ dispatch, getters }, { product }) {
    const record = getters.getCartItems.find(p => productsEquals(p, product))
    const qty = record ? record.qty + 1 : (product.qty ? product.qty : 1)
    return dispatch('stock/check', { product, qty }, { root: true })
  }
}

export default actions
