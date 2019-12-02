import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import RecommendationsState, { Recommendations } from '../types/RecommendationsState'

const mutations: MutationTree<RecommendationsState> = {
  [types.ICMAA_RECOMMENDATIONS_ADD] (state, payload: Recommendations) {
    let list: Recommendations = state.list.find(i => i.product === payload.product)
    if (list) {
      const newProductids = payload.recommendations.map(p => p.id).filter(id => !list.recommendations.map(p => p.id).includes(id))
      list.recommendations.push(...payload.recommendations.filter(p => newProductids.includes(p.id)))
      return
    }
    state.list.push(payload)
  }
}

export default mutations
