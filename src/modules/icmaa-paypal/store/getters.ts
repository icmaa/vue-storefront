import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import PayPalState from '../type/PayPalState'

const getters: GetterTree<PayPalState, RootState> = {
  isSdkLoaded: state => !!state.isSdkLoaded,
  getClientId: state => state.clientId,
  getCurrency: (state, getters, rootState, rootGetters): string =>
    rootGetters['icmaaConfig/getCurrentStoreConfig']?.i18n?.currencyCode || 'EUR'
}

export default getters
