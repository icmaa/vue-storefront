import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import RecommendationsState, { Recommendations } from '../types/RecommendationsState'

const actions: ActionTree<RecommendationsState, RootState> = {
  async single ({ state, commit }, { productId }): Promise<Recommendations|boolean> {
    return false
  }
}

export default actions
