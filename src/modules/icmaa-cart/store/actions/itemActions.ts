import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import { createDiffLog, productsEquals } from '@vue-storefront/core/modules/cart/helpers'
import { cartHooksExecutors } from '@vue-storefront/core/modules/cart/hooks'
import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'

const actions: ActionTree<CartState, RootState> = {
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
  },

  /**
   * Clone of original `cart/removeItem`
   *
   * Ticket MB-16751
   * If cart contains a couponCode before we remove an item, we should sync the cart again in case
   * cart conditions have changed and a free product has been removed or added
   */
  async removeItem ({ commit, dispatch, getters }, payload) {
    const removeByParentSku = payload.product ? !!payload.removeByParentSku && payload.product.type_id !== 'bundle' : true
    const product = payload.product || payload
    const { cartItem } = await cartHooksExecutors.beforeRemoveFromCart({ cartItem: product })

    commit(types.CART_DEL_ITEM, { product: cartItem, removeByParentSku })

    if (getters.isCartSyncEnabled && cartItem.server_item_id) {
      const cartHasCoupon = !!getters.getCoupon
      const diffLog = await dispatch('sync', { forceClientState: true })
      cartHooksExecutors.afterRemoveFromCart(diffLog)
      if (cartHasCoupon) {
        await dispatch('sync', { forceClientState: false, forceSync: true })
      }
      return diffLog
    }

    const diffLog = createDiffLog()
      .pushClientParty({ status: 'no-item', sku: product.sku })
    cartHooksExecutors.afterRemoveFromCart(diffLog)
    return diffLog
  }
}

export default actions
