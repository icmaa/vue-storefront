import { GetterTree } from 'vuex'
import RecommendationsState from '../types/RecommendationsState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<RecommendationsState, RootState> = {
  list: state => state.list
}

export default getters
