import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CouponState from '../types/CouponState'

const getters: GetterTree<CouponState, RootState> = {
  getCouponBalance: (state) => state.balance,
  getCouponExpires: (state) => state.expires,
  getCoupon: (state) => state.coupon,
  getCouponPin: (state) => state.pin
}

export default getters
