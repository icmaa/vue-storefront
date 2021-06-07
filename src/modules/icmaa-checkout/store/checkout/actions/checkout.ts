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
  savePaymentDetails ({ commit }, paymentDetails) {
    commit(types.CHECKOUT_SAVE_PAYMENT_DETAILS, paymentDetails)
  },
  async load ({ commit }) {
    const checkoutStorage = StorageManager.get('checkout')
    const [
      personalDetails,
      shippingDetails,
      paymentDetails
    ] = await Promise.all([
      checkoutStorage.getItem('personal-details'),
      checkoutStorage.getItem('shipping-details'),
      checkoutStorage.getItem('payment-details')
    ])

    if (personalDetails) {
      commit(types.CHECKOUT_LOAD_PERSONAL_DETAILS, personalDetails)
    }

    if (shippingDetails) {
      commit(types.CHECKOUT_LOAD_SHIPPING_DETAILS, shippingDetails)
    }

    if (paymentDetails) {
      commit(types.CHECKOUT_LOAD_PAYMENT_DETAILS, paymentDetails)
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
  setLastOrderId ({ commit }, id) {
    commit(types.CHECKOUT_SET_LAST_ORDER_ID, id)
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
    dispatch('savePaymentDetails', {})
    dispatch('saveShippingDetails', {})
    dispatch('dropPassword')
  }
}

export default actions
