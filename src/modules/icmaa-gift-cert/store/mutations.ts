import { MutationTree } from 'vuex'
import GiftCertState from '../types/GiftCertState'
import * as types from './mutation-types'

const mutations: MutationTree<GiftCertState> = {
  [types.ICMAA_GIFTCERT_ADD] (state, payload) {
    state.number = (payload.number)
    state.expires = (payload.expires)
    state.balance = (payload.balance)
    state.currency = (payload.currency)
  },
  [types.ICMAA_GIFTCERT_CLR] (state) {
    state.number = ''
    state.expires = ''
    state.balance = -1
    state.currency = ''
  }
}

export default mutations
