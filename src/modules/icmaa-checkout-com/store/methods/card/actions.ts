import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { CardState } from 'icmaa-checkout-com/types'

const actions: ActionTree<CardState, RootState> = {
  init () {
  },
  save () {
  },
  async beforePlaceOrder ({ dispatch, rootGetters, getters }) {
    const paymentDetails = rootGetters['checkout/getPaymentDetails'] || { paymentMethod: false }
    const paymentMethod = paymentDetails.paymentMethod

    paymentMethod.additional_data = {
      cardToken: getters.getToken
    }

    await dispatch(
      'checkout/savePaymentDetails',
      Object.assign({}, rootGetters['checkout/getPaymentDetails'], { paymentMethod }),
      { root: true }
    )
  },
  afterPlaceOrder () {
    console.error('Payment after place order')
  }
}

export default actions
