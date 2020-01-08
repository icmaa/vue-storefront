import { ActionTree } from 'vuex'
import { entities } from 'config'
import CouponService from '../data-resolver/CouponService'
import RootState from '@vue-storefront/core/types/RootState'
import CouponState from '../types/CouponState'
import * as types from './mutation-types'

const actions: ActionTree<CouponState, RootState> = {
  async fetchCoupon ({ commit }, { number = '', pin = '' } = {}): Promise<boolean> {
    commit(
      types.ICMAA_COUPON_CLR
    )

    const result = await CouponService.loadCoupon(number, pin)

    commit(
      types.ICMAA_COUPON_ADD,
      { number: result.cert_number, balance: result.balance, expires: result.expire_at, currency: result.currency_code }
    )
    return true
  }
}

export default actions
