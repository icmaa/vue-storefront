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
  async dropPassword ({ commit, state }) {
    if (state.personalDetails.createAccount) {
      commit(types.CHECKOUT_DROP_PASSWORD)
    }
  },
  async setModifiedAt ({ commit }, timestamp) {
    commit(types.CHECKOUT_SET_MODIFIED_AT, timestamp)
  },
  async savePersonalDetails ({ commit }, personalDetails) {
    commit(types.CHECKOUT_SAVE_PERSONAL_DETAILS, personalDetails)
  },
  async saveShippingDetails ({ commit }, shippingDetails) {
    commit(types.CHECKOUT_SAVE_SHIPPING_DETAILS, shippingDetails)
  },
  async savePaymentDetails ({ commit }, paymentDetails) {
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
  async addPaymentMethod ({ commit }, paymentMethod) {
    commit(types.CHECKOUT_ADD_PAYMENT_METHOD, paymentMethod)
  },
  async replacePaymentMethods ({ commit }, paymentMethods) {
    commit(types.CHECKOUT_SET_PAYMENT_METHODS, paymentMethods)
  },
  async addShippingMethod ({ commit }, shippingMethod) {
    commit(types.CHECKOUT_ADD_SHIPPING_METHOD, shippingMethod)
  },
  async replaceShippingMethods ({ commit }, shippingMethods) {
    commit(types.CHECKOUT_SET_SHIPPING_METHODS, shippingMethods)
  }
}

export default actions
