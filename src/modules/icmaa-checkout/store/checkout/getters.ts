import { icmaa_checkout } from 'config'
import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../types/CheckoutState'

const getters: GetterTree<CheckoutState, RootState> = {
  isLoading: state => state.loading,
  getSections: state => state.sections,
  getShippingDetails: state => Object.keys(state.shippingDetails).length === 0 ? false : state.shippingDetails,
  getPaymentDetails: state => Object.keys(state.paymentDetails).length === 0 ? false : state.paymentDetails,
  hasAgreements: (state, getters, rootState, rootGetters): boolean => {
    const countryId = getters.getPaymentDetails.country_id || rootGetters['icmaaConfig/getCurrentStore'].storeCode
    return icmaa_checkout.agreements.countryAllowlist.includes(countryId.toLowerCase())
  }
}

export default getters
