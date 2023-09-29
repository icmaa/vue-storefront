import { GetterTree } from 'vuex'
import RecommendationsState, { Recommendations } from '../types/RecommendationsState'
import RootState from '@vue-storefront/core/types/RootState'
import { getCookie } from 'icmaa-recommendations/helpers/Cookies'

const getters: GetterTree<RecommendationsState, RootState> = {
  getGAVisitorId: (): string | null => {
    const cookie = getCookie('_ga')
    if (cookie) {
      const regex = /^GA\d\.\d\./g
      return cookie.replace(regex, '')
    }
  },
  getList: (state): Recommendations[] => state.list,
  getByTypeAndProductId: (state, getters) => (productId: string | null, eventType: string, servingConfigs: string, filter: string): Recommendations =>
    getters.getList
      .find(r => (r.productId === productId) && r.eventType === eventType && r.servingConfigs === servingConfigs && r.filter === filter)
}

export default getters
