import { GetterTree } from 'vuex'
import BlogState from '../types/BlogState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<BlogState, RootState> = {
  getArticles: (state) => state.items,
  getArticleBy: (state) => (v: string, k: string = 'identifier') => state.items.find(i => i[k] === v)
}

export default getters
