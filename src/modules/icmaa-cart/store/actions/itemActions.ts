import config from 'config'
import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import { createDiffLog, productsEquals, validateProduct, notifications } from '@vue-storefront/core/modules/cart/helpers'
import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'
import { Logger } from '@vue-storefront/core/lib/logger'

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
   * Clone of originial `cart/addItems`
   *
   * Note: There was a bug which causes the first attemp to put an item in cart to fail without message.
   * It's important to have `serverMergeByDefault` enabled to synchronize an existing customer cart, also enable
   * `serverSyncCanRemoveLocalItems` and `serverSyncCanModifyLocalItems` to update and remove orphaned items
   * from client cart and adding the `connect` action to the beginning of `addItems` action if the cart
   * is not yet connected. Only this way we prevent the `synchronizeServerItem` method during server- and
   * client-cart-merge to remove the new item from cart again if the cart was empty at first.
   *
   * Changes:
   * * Add `connect` action at the beginning of the action if cart isn't yet connected.
   */
  async addItems ({ commit, dispatch, getters }, { productsToAdd, forceServerSilence = false }) {
    if (!getters.isCartConnected) {
      await dispatch('connect', { guestCart: false })
    }

    let productIndex = 0
    const diffLog = createDiffLog()
    for (let product of productsToAdd) {
      const errors = validateProduct(product)
      diffLog.pushNotifications(notifications.createNotifications({ type: 'error', messages: errors }))

      if (errors.length === 0) {
        const { status, onlineCheckTaskId } = await dispatch('checkProductStatus', { product })

        if (status === 'volatile' && !config.stock.allowOutOfStockInCart) {
          diffLog.pushNotification(notifications.unsafeQuantity())
        }
        if (status === 'out_of_stock') {
          diffLog.pushNotification(notifications.outOfStock())
        }

        if (status === 'ok' || status === 'volatile') {
          commit(types.CART_ADD_ITEM, {
            product: { ...product, onlineStockCheckid: onlineCheckTaskId },
            forceServerSilence
          })
        }
        if (productIndex === (productsToAdd.length - 1) && (!getters.isCartSyncEnabled || forceServerSilence)) {
          diffLog.pushNotification(notifications.productAddedToCart())
        }
        productIndex++
      }
    }

    let newDiffLog = await dispatch('create')
    if (newDiffLog !== undefined) {
      diffLog.merge(newDiffLog)
    }

    if (getters.isCartSyncEnabled && getters.isCartConnected && !forceServerSilence) {
      const syncDiffLog = await dispatch('sync', { forceClientState: true })

      if (!syncDiffLog.isEmpty()) {
        diffLog.merge(syncDiffLog)
      }
    }

    return diffLog
  }
}

export default actions
