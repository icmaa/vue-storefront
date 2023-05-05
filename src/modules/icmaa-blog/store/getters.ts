import { GetterTree } from 'vuex'
import BlogState from '../types/BlogState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<BlogState, RootState> = {
  getArticles: (state) => state.items
}

export default getters
