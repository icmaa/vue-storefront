import { ActionTree } from 'vuex'
import * as types from '../mutation-types'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../../types/CheckoutState'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

const actions: ActionTree<CheckoutState, RootState> = {
  async updateOrderTimestamp () {
    const userStorage = StorageManager.get('user')
    await userStorage.setItem('last-cart-bypass-ts', new Date().getTime())
  },
  savePersonalDetails ({ commit }, personalDetails) {
    commit(types.CHECKOUT_SAVE_PERSONAL_DETAILS, personalDetails)
  },
  saveShippingDetails ({ commit }, shippingDetails) {
    commit(types.CHECKOUT_SAVE_SHIPPING_DETAILS, shippingDetails)
  },
  saveShippingMethod ({ commit }, method) {
    commit(types.CHECKOUT_SAVE_SHIPPING_METHOD, method)
  },
  savePaymentDetails ({ commit }, paymentDetails) {
    commit(types.CHECKOUT_SAVE_PAYMENT_DETAILS, paymentDetails)
  },
  savePaymentMethod ({ commit }, method) {
    commit(types.CHECKOUT_SAVE_PAYMENT_METHOD, method)
  },
  async load ({ commit }) {
    const checkoutStorage = StorageManager.get('checkout')
    const [
      personalDetails,
      shippingDetails,
      shippingMethod,
      paymentDetails,
      paymentMethod
    ] = await Promise.all([
      checkoutStorage.getItem('personal-details'),
      checkoutStorage.getItem('shipping-details'),
      checkoutStorage.getItem('shipping-method'),
      checkoutStorage.getItem('payment-details'),
      checkoutStorage.getItem('payment-method')
    ])

    if (personalDetails) {
      commit(types.CHECKOUT_SAVE_PERSONAL_DETAILS, personalDetails)
    }

    if (shippingDetails) {
      commit(types.CHECKOUT_SAVE_SHIPPING_DETAILS, shippingDetails)
    }

    if (shippingMethod) {
      commit(types.CHECKOUT_SAVE_SHIPPING_METHOD, shippingMethod)
    }

    if (paymentDetails) {
      commit(types.CHECKOUT_SAVE_PAYMENT_DETAILS, paymentDetails)
    }

    if (paymentMethod) {
      commit(types.CHECKOUT_SAVE_PAYMENT_METHOD, paymentMethod)
    }
  },
  addPaymentMethod ({ commit }, paymentMethod) {
    commit(types.CHECKOUT_ADD_PAYMENT_METHOD, paymentMethod)
  },
  replacePaymentMethods ({ commit }, paymentMethods) {
    commit(types.CHECKOUT_SET_PAYMENT_METHODS, paymentMethods)
  },
  addShippingMethod ({ commit }, shippingMethod) {
    commit(types.CHECKOUT_ADD_SHIPPING_METHOD, shippingMethod)
  },
  replaceShippingMethods ({ commit }, shippingMethods) {
    commit(types.CHECKOUT_SET_SHIPPING_METHODS, shippingMethods)
  },
  updateAdditionalShippingInformation ({ commit }, additional) {
    if (additional && Object.keys(additional).length > 0) {
      if (additional['priorityHandling']) {
        commit(types.CHECKOUT_SET_PRIORITY_HANDLING, additional['priorityHandling'])
      }
    }
  },
  setLastOrderId ({ commit }, id) {
    commit(types.CHECKOUT_SET_LAST_ORDER_ID, id)
  },
  setLastOrderResponse ({ commit }, response) {
    commit(types.CHECKOUT_SET_LAST_ORDER_RESPONSE, response)
  },
  dropPassword ({ commit, state }) {
    if (state.personalDetails.createAccount) {
      commit(types.CHECKOUT_DROP_PASSWORD)
    }
  },
  async reset ({ dispatch }, { clearCart = true }: { clearCart?: boolean }) {
    await dispatch('updateOrderTimestamp')

    if (clearCart) {
      await dispatch('cart/clear', { sync: false }, { root: true })
    }

    dispatch('savePersonalDetails', {})
    dispatch('saveShippingDetails', {})
    dispatch('saveShippingMethod', {})
    dispatch('savePaymentDetails', {})
    dispatch('savePaymentMethod', {})
    dispatch('dropPassword')
  }
}

export default actions
