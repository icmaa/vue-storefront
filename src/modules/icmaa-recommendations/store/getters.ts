import { GetterTree } from 'vuex'
import RecommendationsState, { Recommendations } from '../types/RecommendationsState'
import RootState from '@vue-storefront/core/types/RootState'
import { getCookie } from 'icmaa-recommendations/helpers/Cookies'

const getters: GetterTree<RecommendationsState, RootState> = {
  getGAVisitorId: (): string | null => getCookie('_ga'),
  getList: (state): Recommendations[] => state.list,
  getByTypeAndProductId: (state, getters) => (productId: string, eventType: string, servingConfigs: string): Recommendations =>
    getters.getList
      .find(r => r.productId === productId && r.eventType === eventType && r.servingConfigs === servingConfigs)
}

export default getters
