import { GetterTree } from 'vuex'
import BlogState, { BlogCategory, BlogArticle, BlogUrlEntry } from '../types/BlogState'
import RootState from '@vue-storefront/core/types/RootState'
import pick from 'lodash-es/pick'
import { toDayjsDate } from 'icmaa-config/helpers/datetime'

const getters: GetterTree<BlogState, RootState> = {
  isUrlResolved: (state) => (key: string, start: number) => {
    if (!state.urls[key]) return false
    const current: BlogUrlEntry = state.urls[key]
    if (start === current.start) return true
    if (start > current.start) {
      return false
    } else {
      const length = current.ids.length
      return length === (current.start + current.perPage) || length === current.total
    }
  },
  getResolvedUrl: (state) => (key: string) => state.urls[key],
  getResolvedUrlIds: (state, getters) => (key: string) => getters.getResolvedUrl(key)?.ids || [],
  getArticles: (state) => state.items,
  getArticlesByQuery: (state) => (query: Record<string, (number|string)|(number|string)[]>): BlogArticle[] => {
    return state.items.filter(i => {
      const item = pick(i, Object.keys(query))
      return Object.keys(query).every(k => {
        const value = query[k]
        if (Array.isArray(value)) {
          if (Array.isArray(item[k])) {
            return value.some(v => item[k].includes(v))
          }
          return value.includes(item[k])
        } else {
          if (Array.isArray(item[k])) {
            return item[k].includes(value)
          }
          return item[k] === value
        }
      })
    }).sort((a, b) => {
      const da = toDayjsDate(a.firstPublishedAt)
      const db = toDayjsDate(b.firstPublishedAt)
      return db.unix() - da.unix()
    })
  },
  getArticleByQuery: (state, getters) => (query: Record<string, (number|string)|(number|string)[]>): BlogArticle | null => {
    const articles = getters.getArticlesByQuery(query)
    return articles.length > 0 ? articles[0] : null
  },
  getCategories: (state, getters, rootState, rootGetters) =>
    rootGetters['icmaaCmsBlock/getJsonBlockByIdentifier']('blog-categories') || [],
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
