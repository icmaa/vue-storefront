import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import PayPalState from '../type/PayPalState'

const mutations: MutationTree<PayPalState> = {
  [types.PAYPAL_SDK_LOADED] (state) {
    state.isSdkLoaded = true
  },
  [types.PAYPAL_SET_CLIENT_ID] (state, clientId) {
    state.clientId = clientId
  }
}

export default mutations
