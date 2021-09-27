import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import PayPalState from '../type/PayPalState'

const mutations: MutationTree<PayPalState> = {
  [types.PAYPAL_SDK_LOADED] (state) {
    state.isSdkLoaded = true
  },
  [types.PAYPAL_SET_CLIENT_ID] (state, clientId) {
    state.clientId = clientId
  },
  [types.PAYPAL_SET_CONFIGS] (state, { referenceId, brandName, softDescriptor }) {
    state.referenceId = referenceId
    state.brandName = brandName
    state.softDescriptor = softDescriptor
  }
}

export default mutations
