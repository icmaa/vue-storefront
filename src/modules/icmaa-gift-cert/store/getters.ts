import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import GiftCertState from '../types/GiftCertState'

const getters: GetterTree<GiftCertState, RootState> = {
  getCouponBalance: (state) => state.balance,
  getCouponExpires: (state) => state.expires,
  getCoupon: (state) => state.number,
  getCouponCurrency: (state) => state.currency
}

export default getters
