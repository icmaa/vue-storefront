import { MutationTree } from 'vuex'
import CouponState from '../types/CouponState'
import * as types from './mutation-types'

const mutations: MutationTree<CouponState> = {
  [types.ICMAA_COUPON_ADD] (state, payload) {
    state.number = (payload.number)
    state.expires = (payload.expires)
    state.balance = (payload.balance)
    state.currency = (payload.currency)
  },
  [types.ICMAA_COUPON_CLR] (state) {
    state.number = ''
    state.expires = ''
    state.balance = -1
    state.currency = ''
  }
}

export default mutations
