import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import RecommendationsState, { Recommendations } from '../types/RecommendationsState'

const mutations: MutationTree<RecommendationsState> = {
  [types.ICMAA_RECOMMENDATIONS_ADD] (state, payload: Recommendations) {
    let list: Recommendations = state.list
      .find(i => i.productId === payload.productId &&
          i.eventType === payload.eventType &&
          i.servingConfigs === payload.servingConfigs
      )

    if (list) {
      list.products = payload.products
      return
    }

    state.list.push(payload)
  }
}

export default mutations
