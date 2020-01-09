import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import GiftCertState from '../types/GiftCertState'

const getters: GetterTree<GiftCertState, RootState> = {
  getGiftCertNumber: (state) => state.number,
  getGiftCertBalance: (state) => state.balance,
  getGiftCertExpires: (state) => state.expires,
  getGiftCertCurrency: (state) => state.currency
}

export default getters
