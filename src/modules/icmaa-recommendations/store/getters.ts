import { GetterTree } from 'vuex'
import RecommendationsState, { Recommendations } from '../types/RecommendationsState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<RecommendationsState, RootState> = {
  list: (state): Recommendations[] => state.list,
  getByTypeAndProductId: (state, getters) => (productId: string, type: string): Recommendations =>
    getters.list.find(r => r.productId === productId && r.type === type)
}

export default getters
