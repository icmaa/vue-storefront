import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import { CartService } from '@vue-storefront/core/data-resolver'
import { cartHooksExecutors } from '@vue-storefront/core/modules/cart/hooks'
import { createDiffLog } from '@vue-storefront/core/modules/cart/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import { notifications } from '../../helpers'
import config from 'config'
import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'

const actions: ActionTree<CartState, RootState> = {
  /**
   * Clone of originial `cart/sync`
   *
   * Changes:
   * * Update the cart-token after `CartService.getItems()` to extend JWT lifetime on each pull
   * * Clear cart if token isn't valid
   * * Filter errors that are returned to only spawn notice for important and readable errors
   * * Remove `maxCartBypassAttempts` logic as we don't need it
   */
  async sync ({ getters, rootGetters, commit, dispatch }, { forceClientState = false, dryRun = false, mergeQty = false, forceSync = false }) {
    const shouldUpdateClientState = rootGetters['checkout/isUserInCheckout'] || forceClientState
    const { getCartItems, canUpdateMethods, isSyncRequired } = getters
    if ((!canUpdateMethods || !isSyncRequired) && !forceSync) return createDiffLog()
    commit(types.CART_SET_SYNC)
    const { result, resultCode } = await CartService.getItems()
    const { serverItems, clientItems } = await cartHooksExecutors.beforeSync({ clientItems: getCartItems, serverItems: result.items })

    if (resultCode === 200) {
      if (result.token) {
        Logger.log('Server cart token updated.', 'cart', result.token)()
        commit(types.CART_LOAD_CART_SERVER_TOKEN, result.token)
      }

      const diffLog = await dispatch('merge', {
        dryRun,
        serverItems,
        clientItems,
        forceClientState: shouldUpdateClientState,
        mergeQty
      })
      cartHooksExecutors.afterSync(diffLog)
      return diffLog
    }

    await dispatch('clear', { sync: false })
      .then(() => { Logger.log('Cart has been cleared.', 'cart')() })

    const errorDiffLog = createDiffLog()

    const errorMessage = notifications.getNotificationByResponse(result)
    errorDiffLog.pushNotification(errorMessage)

    const logMessageType = notifications.isKnownError(result) ? 'warn' : 'error'
    Logger[logMessageType]('Error while `cart/sync` action:', 'cart', result)()

    return errorDiffLog
  }
}

export default actions
