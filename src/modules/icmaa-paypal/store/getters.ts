import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import PayPalState from '../type/PayPalState'

const getters: GetterTree<PayPalState, RootState> = {
  getInfoComponent: (state) => state.infoComponent,
  isSdkLoaded: state => !!state.isSdkLoaded,
  getClientId: state => state.clientId,
  getBrandName: state => state.brandName,
  getSoftDescriptor: state => state.softDescriptor,
  getReferenceId: state => state.referenceId,
  getCurrency: (state, getters, rootState, rootGetters): string =>
    rootGetters['icmaaConfig/getCurrentStoreConfig']?.i18n?.currencyCode || 'EUR',
  getLocale: (state, getters, rootState, rootGetters): string =>
    rootGetters['icmaaConfig/getCurrentStoreConfig']?.i18n?.defaultLocale || 'en-US'
}

export default getters
