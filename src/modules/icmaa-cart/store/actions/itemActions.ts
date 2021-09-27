import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import { productsEquals } from '@vue-storefront/core/modules/cart/helpers'

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
  }
}

export default actions
