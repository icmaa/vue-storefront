import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'
import PaymentMethod from '@vue-storefront/core/modules/cart/types/PaymentMethod'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { CartService } from '@vue-storefront/core/data-resolver'
import { cartHooksExecutors } from '@vue-storefront/core/modules/cart/hooks'
import { createDiffLog, productsEquals, preparePaymentMethodsToSync, createShippingInfoData } from '@vue-storefront/core/modules/cart/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import { notifications } from '../helpers'
import config from 'config'
import * as types from '../store/mutation-types'
import * as orgTypes from '@vue-storefront/core/modules/cart/store/mutation-types'

import omit from 'lodash-es/omit'

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
   * Clone of originial `cart/sync`
   *
   * Changes:
   * * Update the cart-token after `CartService.getItems()` to extend JWT lifetime on each pull.
   */
  async sync ({ getters, rootGetters, commit, dispatch }, { forceClientState = false, dryRun = false, mergeQty = false, forceSync = false }) {
    const shouldUpdateClientState = rootGetters['checkout/isUserInCheckout'] || forceClientState
    const { getCartItems, canUpdateMethods, isSyncRequired, bypassCounter } = getters
    if ((!canUpdateMethods || !isSyncRequired) && !forceSync) return createDiffLog()
    commit(orgTypes.CART_SET_SYNC)
    const { result, resultCode } = await CartService.getItems()
    const { serverItems, clientItems } = await cartHooksExecutors.beforeSync({ clientItems: getCartItems, serverItems: result.items })

    if (resultCode === 200) {
      if (result.token) {
        Logger.log('Server cart token updated.', 'cart', result.token)()
        commit(orgTypes.CART_LOAD_CART_SERVER_TOKEN, result.token)
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

    if (bypassCounter < config.queues.maxCartBypassAttempts) {
      Logger.log('Bypassing with guest cart' + bypassCounter, 'cart')()
      commit(orgTypes.CART_UPDATE_BYPASS_COUNTER, { counter: 1 })
      await dispatch('connect', { guestCart: true })
    }

    cartHooksExecutors.afterSync(result)

    await dispatch('clear', { sync: false })
      .then(() => { Logger.log('Cart has been cleared.', 'cart')() })

    const errorDiffLog = createDiffLog()

    const errorMessage = notifications.getNotificationByResponse(result)
    errorDiffLog.pushNotification(errorMessage)

    const logMessageType = notifications.isKnownError(result) ? 'warn' : 'error'
    Logger[logMessageType]('Error while `cart/sync` action:', 'cart', result)()

    return errorDiffLog
  },
  /**
   * Clone of originial `cart/removeCoupon`
   *
   * Changes:
   * * Add callback function
   */
  async removeCoupon ({ getters, dispatch, commit }, { sync = true } = {}) {
    if (getters.canSyncTotals) {
      const { result } = await CartService.removeCoupon()
      if (result && sync) {
        await dispatch('couponCallback')

        // 'getCurrentCartHash' has been changed (it's based on cart items data)
        // so we need to update it in vuex and StorageManager
        commit(orgTypes.CART_SET_ITEMS_HASH, getters.getCurrentCartHash)
        return result
      }
    }
  },
  /**
   * Clone of originial `cart/applyCoupon`
   *
   * Changes:
   * * Add callback function
   * * Update cart-hash after apply
   */
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
  },
  /**
   * Clone of originial `cart/syncShippingMethods`
   *
   * Changes:
   * * Use our object-key mapping from changes of `icmaa-checkout` and our custom checkout
   */
  async syncShippingMethods ({ getters, rootGetters, dispatch }, { forceServerSync = false }) {
    if (getters.canUpdateMethods && (getters.isTotalsSyncRequired || forceServerSync)) {
      const shippingDetails = rootGetters['checkout/getShippingDetails']
      const accountDefaults = rootGetters['checkout/getAccountDefaults']
      const address = Object.assign({}, accountDefaults, shippingDetails)

      Logger.debug('Refreshing shipping methods', 'cart', address)()
      const { result } = await CartService.getShippingMethods(address)
        .then(resp => {
          if (resp.resultCode === 500 && resp.result.error) {
            throw new Error(resp.result.message)
          }
          return resp
        })

      if (result !== false) {
        await dispatch('updateShippingMethods', { shippingMethods: result })
        return true
      }

      Logger.debug('Shipping methods request was empty', 'cart')()
    }

    Logger.debug('Shipping methods does not need to be updated', 'cart')()
    return true
  },
  /**
   * Clone of originial `cart/syncPaymentMethods`
   *
   * Changes:
   * * Change logic to only sync stuff we need: the available payment-methods
   */
  async syncPaymentMethods ({ getters, rootGetters, dispatch }, { forceServerSync = false }) {
    if (getters.canUpdateMethods && (getters.isTotalsSyncRequired || forceServerSync)) {
      Logger.debug('Refreshing payment methods', 'cart')()

      const { result } = await CartService.getPaymentMethods()
      let backendPaymentMethods: PaymentMethod[] = result

      const { uniqueBackendMethods, paymentMethods } = preparePaymentMethodsToSync(
        backendPaymentMethods,
        rootGetters['checkout/getNotServerPaymentMethods']
      )

      await dispatch('checkout/replacePaymentMethods', paymentMethods, { root: true })

      EventBus.$emit('set-unique-payment-methods', uniqueBackendMethods)
    } else {
      Logger.debug('Payment methods does not need to be updated', 'cart')()
    }
  },
  /**
   * Clone of originial `cart/syncTotals`
   *
   * Changes:
   * * Simplify data-structure and logic
   */
  async syncTotals ({ dispatch, getters, rootGetters }, { forceServerSync = false, methodsData }: { forceServerSync: boolean, methodsData?: any }) {
    if (getters.canSyncTotals && (getters.isTotalsSyncRequired || forceServerSync)) {
      const shippingDetails = Object.assign(
        { country_id: rootGetters['icmaaConfig/getCurrentStoreConfig'].tax.defaultCountry },
        rootGetters['checkout/getShippingDetails'] || { shippingMethod: false }
      )
      const { shippingMethod } = shippingDetails

      const accountDefaults = rootGetters['checkout/getAccountDefaults']
      let billingDetails = rootGetters['checkout/getPaymentDetails'] || { paymentMethod: false }
      billingDetails = Object.assign({}, accountDefaults, billingDetails)
      const { paymentMethod } = billingDetails

      const addressInformation = methodsData || {
        personalDetails: rootGetters['checkout/getPersonalDetails'],
        shippingAddress: omit(shippingDetails, ['shippingMethod']),
        billingAddress: omit(billingDetails, ['paymentMethod']),
        shippingMethod,
        paymentMethod
      }

      if (shippingDetails.country_id) {
        await dispatch('overrideServerTotals', {
          hasShippingInformation: shippingDetails.shippingMethod || false,
          addressInformation
        })
        return
      }

      Logger.error('Please do set the tax.defaultCountry in order to calculate totals', 'cart')()
    }
  }
}

export default actions
