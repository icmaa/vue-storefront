import { GetterTree } from 'vuex'
import BlogState, { BlogCategory } from '../types/BlogState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<BlogState, RootState> = {
  isUrlResolved: (state) => (key: string) => Object.keys(state.urls).includes(key),
  getResolvedUrlIds: (state) => (key: string) => state.urls[key] || [],
  getArticles: (state) => state.items,
  getArticleBy: (state) => (v: string, k: string = 'identifier') =>
    state.items.find(i => i[k] === v || i[k].includes(v)),
  getCategories: (state, getters, rootState, rootGetters) =>
    rootGetters['icmaaCmsBlock/getJsonBlockByIdentifier']('blog-categories'),
  getCategoryBy: (state, getters) => (v: string, k: string = 'url'): BlogCategory | null => {
    const findTreeNode = (tree: BlogCategory[], key: string): BlogCategory | null => {
      let result: BlogCategory | null = null;
      tree.some(t => {
        if (t[k] === key) {
          result = t
          return true
        } else if (t.children) {
          result = findTreeNode(t.children, key)
          if (result) return true
        }
      })
      return result
    }
    return findTreeNode(getters.getCategories, v)
  }
}

export default getters
