import { icmaa_checkout } from 'config'
import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../types/CheckoutState'

const getters: GetterTree<CheckoutState, RootState> = {
  isLoading: state => state.loading,
  getSections: state => state.sections,
  getPersonalDetails: state => state.personalDetails,
  getShippingDetails: state => Object.keys(state.shippingDetails).length === 0 ? false : state.shippingDetails,
  getPaymentDetails: state => Object.keys(state.paymentDetails).length === 0 ? false : state.paymentDetails,
  getPaymentMethod: (state, getters) => getters.getPaymentDetails.paymentMethod || false,
  getPaymentMethodCode: (state, getters) => getters.getPaymentMethod.code || false,
  getShippingMethod: (state, getters) => getters.getShippingDetails.shippingMethod || false,
  getAddressDefaults: (state, getters, rootState, rootGetters) => {
    const storeView = rootGetters['icmaaConfig/getCurrentStoreConfig']
    return { country_id: storeView.tax.defaultCountry }
  },
  getPaymentMethods: (state, getters, rootState, rootGetters) => {
    const isVirtualCart = rootGetters['cart/isVirtualCart']
    return state.paymentMethods.filter(method => !isVirtualCart)
  },
  getPaymentMethodByCode: (state, getters) => (code: string): any => {
    return getters.getPaymentMethods.find(m => m.code === code) || false
  },
  getDefaultPaymentMethod: (state, getters) => getters.getPaymentMethods[0],
  getNotServerPaymentMethods: (state, getters) =>
    getters.getPaymentMethods.filter((itm) =>
      (typeof itm !== 'object' || !itm.is_server_method)
    ),
  getShippingMethods: state => state.shippingMethods,
  getPriorityHandling: state => state.priorityHandling || false,
  isPriorityHandlingEnabled: (state, getters) => getters.getPriorityHandling.enabled || false,
  getDefaultShippingMethod: state => state.shippingMethods.find(item => item.default),
  isUserInCheckout: state => false, // Compatibility
  hasAgreements: (state, getters, rootState, rootGetters): boolean => {
    const countryId = getters.getPaymentDetails.country_id || rootGetters['icmaaConfig/getCurrentStore'].storeCode
    return icmaa_checkout.agreements.countryAllowlist.includes(countryId.toLowerCase())
  }
}

export default getters
