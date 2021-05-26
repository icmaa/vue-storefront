import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../types/CheckoutState'
import * as types from './mutation-types'

const actions: ActionTree<CheckoutState, RootState> = {
  loading ({ commit }, status = true) {
    commit(types.SET_LOADING, status)
  },
  setSections ({ commit }, sections) {
    commit(types.SET_SECTIONS, sections)
  },
  activateSection ({ commit, dispatch }, section) {
    dispatch('loading', false)
    commit(types.ACTIVATE_SECTION, section)
  },
  prepareAndPlaceOrder ({ dispatch, rootState, state, rootGetters }, additionalPaymentData) {
    const shippingeMethod: any = state.shippingDetails.shippingMethod
    const paymentMethod: any = state.paymentDetails.paymentMethod
    const order: any = {
      user_id: rootState.user.current ? rootState.user.current.id.toString() : '',
      cart_id: rootState.cart.cartServerToken ? rootState.cart.cartServerToken.toString() : '',
      products: rootState.cart.cartItems,
      addressInformation: {
        billingAddress: state.paymentDetails,
        shipping_method_code: shippingeMethod.method_code,
        shipping_carrier_code: shippingeMethod.carrier_code,
        payment_method_code: paymentMethod.code,
        payment_method_additional: additionalPaymentData
      }
    }

    if (!rootGetters['cart/isVirtualCart']) {
      order.addressInformation.shippingAddress = state.shippingDetails
    }

    dispatch('placeOrder', { order })
  }
}

export default actions
