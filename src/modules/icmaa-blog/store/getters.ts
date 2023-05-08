import { GetterTree } from 'vuex'
import BlogState from '../types/BlogState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<BlogState, RootState> = {
  getArticles: (state) => state.items,
  getArticlesBy: (state) => (v: string, k: string = 'categories') => state.items.filter(i => i[k] === v || i[k].includes(v)),
  getArticleBy: (state) => (v: string, k: string = 'identifier') => state.items.find(i => i[k] === v || i[k].includes(v))
}

export default getters
