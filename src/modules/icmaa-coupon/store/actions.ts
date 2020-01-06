import { ActionTree } from 'vuex'
import { entities } from 'config'
import CouponService from '../data-resolver/CouponService'
import RootState from '@vue-storefront/core/types/RootState'
import CouponState from '../types/CouponState'

const actions: ActionTree<CouponState, RootState> = {
  async fetchCouponCredit ({ commit }, { coupon = '', pin = '' } = {}): Promise<string> {
    const couponCredit = await CouponService.checkCoupon(coupon, pin)
    return couponCredit
  }
}

export default actions
