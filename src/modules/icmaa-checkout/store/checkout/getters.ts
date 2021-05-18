import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../types/CheckoutState'

const getters: GetterTree<CheckoutState, RootState> = {
  getSections: state => state.sections,
  getShippingDetails: state => Object.keys(state.shippingDetails).length === 0 ? false : state.shippingDetails,
  getPaymentDetails: state => Object.keys(state.paymentDetails).length === 0 ? false : state.paymentDetails
}

export default getters
