import { GetterTree } from 'vuex'
import BlogState from '../types/BlogState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<BlogState, RootState> = {
  isUrlResolved: (state) => (key: string) => Object.keys(state.urls).includes(key),
  getResolvedUrlIds: (state) => (key: string) => state.urls[key] || [],
  getArticles: (state) => state.items,
  getArticleBy: (state) => (v: string, k: string = 'identifier') =>
    state.items.find(i => i[k] === v || i[k].includes(v)),
  getCategories: (state, getters, rootState, rootGetters) =>
    rootGetters['icmaaCmsBlock/getJsonBlockByIdentifier']('blog-categories')
}

export default getters
