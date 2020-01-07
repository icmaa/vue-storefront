import { ActionTree } from 'vuex'
import { entities } from 'config'
import CouponService from '../data-resolver/CouponService'
import RootState from '@vue-storefront/core/types/RootState'
import CouponState from '../types/CouponState'
import * as types from './mutation-types'

const actions: ActionTree<CouponState, RootState> = {
  async fetchCoupon ({ commit }, { code = '', pin = '' } = {}): Promise<CouponState|boolean> {
    const coupon = await CouponService.loadCoupon(code, pin)

    commit(
      types.ICMAA_COUPON_CLR
    )

    commit(
      types.ICMAA_COUPON_ADD,
      {coupon: coupon.coupon, pin: coupon.pin, balance: coupon.balance, expires: coupon.expires}
    )
    return true
  }
}

export default actions
