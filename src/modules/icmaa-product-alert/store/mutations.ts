import { MutationTree } from 'vuex'
import ProductAlertState from '../types/ProductAlertState'
import * as types from './mutation-types'

const mutations: MutationTree<ProductAlertState> = {
  [types.ICMAA_PRODUCT_ALERT_ADD_PRODUCT] (state, payload) {
    state.map = payload
  }
}

export default mutations
