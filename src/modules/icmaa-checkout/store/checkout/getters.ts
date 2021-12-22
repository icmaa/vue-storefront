import { icmaa_checkout } from 'config'
import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CheckoutState from '../../types/CheckoutState'

const getters: GetterTree<CheckoutState, RootState> = {
  isLoading: state => state.loading,
  getSections: state => state.sections,
  getMessage: state => state.message,
  getPersonalDetails: state => state.personalDetails || {},
  getCreateAccount: (state, getters) => getters.getPersonalDetails.createAccount || false,
  getShippingDetails: state => state.shippingDetails || {},
  getPaymentDetails: state => state.paymentDetails || {},
  getPaymentMethod: (state) => state.paymentMethod || false,
  getPaymentMethodCode: (state, getters) => getters.getPaymentMethod.code || false,
  getShippingMethod: (state) => state.shippingMethod || false,
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
  getDefaultShippingMethod: state => state.shippingMethods.find(item => item.default),
  getPriorityHandling: state => state.priorityHandling || false,
  isPriorityHandlingEnabled: (state, getters): boolean => getters.getPriorityHandling.enabled || false,
  hasPriorityHandling: (state, getters, RootState, rootGetters): boolean => {
    if (!getters.isPriorityHandlingEnabled) return false
    if (getters.getShippingMethod.priorityHandling === true) return true
    const totals = rootGetters['cart/getTotals']
    return totals.some(t => t.code === 'priority_handling')
  },
  isUserInCheckout: (state, getters, rootState, rootGetters) => {
    const currentRouteName = rootGetters['url/getCurrentRoute']?.name
    if (!currentRouteName) return false

    const storeCode = rootGetters['icmaaConfig/getCurrentStore'].storeCode
    const storeCodeRegex = new RegExp(`^(${storeCode})-(checkout)$`, 'gm')
    return currentRouteName.replace(storeCodeRegex, '$2') === 'checkout'
  },
  hasAgreements: (state, getters, rootState, rootGetters): boolean => {
    const countryId = getters.getPaymentDetails.country_id || rootGetters['icmaaConfig/getCurrentStore'].storeCode
    return icmaa_checkout.agreements.countryAllowlist.includes(countryId.toLowerCase())
  },
  getOrderData: (state, getters) => ({
    createAccount: getters.getCreateAccount,
    personalDetails: getters.getPersonalDetails,
    shippingDetails: getters.getShippingDetails,
    shippingMethod: getters.getShippingMethod,
    paymentDetails: getters.getPaymentDetails,
    paymentMethod: getters.getPaymentMethod
  }),
  getGatewayOrder: (state) => state.gatewayOrder || false
}

export default getters
