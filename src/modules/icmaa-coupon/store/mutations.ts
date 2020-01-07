import { MutationTree } from 'vuex'
import CouponState from '../types/CouponState'
import * as types from './mutation-types'

const mutations: MutationTree<CouponState> = {
  [types.ICMAA_COUPON_ADD] (state, payload) {
    state.coupon = (payload.coupon)
    state.pin = (payload.pin)
    state.expires = (payload.expires)
    state.balance = (payload.balance)
  },
  [types.ICMAA_COUPON_CLR] (state) {
    state.coupon = ''
    state.pin = ''
    state.balance = 0
    state.expires = ''
  }
}

export default mutations
