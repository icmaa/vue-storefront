import { ActionTree } from 'vuex'
import { elasticList as elasticListAbstract, MutationTypesInterface } from 'icmaa-cms/store/abstract/actions'

import { stateKey } from './'
import * as types from './mutation-types'
import BlogState, { BlogArticle, BlogRoute } from '../types/BlogState'
import createQuery, { QueryOptions } from '../helpers/queryBuilder'
import RootState from '@vue-storefront/core/types/RootState'

const entityType = 'blog'
const mutationTypes: MutationTypesInterface = {
  add: types.ICMAA_BLOG_ADD,
  upd: types.ICMAA_BLOG_UPD,
  rmv: types.ICMAA_BLOG_RMV
}

type ListOptions = { queryOptions: QueryOptions, size: number, start: number }

const actions: ActionTree<BlogState, RootState> = {
  list: async (context, { queryOptions, size = 3, start = 0 }: ListOptions) => {
    const query = createQuery(queryOptions)
    return elasticListAbstract<BlogArticle, BlogState, RootState>(
      { entityType, mutationTypes, stateKey, context, query, size, start }
    )
  },
  fetchCategories: async ({ dispatch, rootGetters }) => {
    await dispatch('icmaaCmsBlock/single', { value: 'blog-categories' }, { root: true })
    return rootGetters['icmaaCmsBlock/getJsonBlockByIdentifier']('blog-categories')
  },
  resolveUrl: async ({ dispatch, commit, getters }, { route }: { route: BlogRoute }) => {
    const { params } = route
    const { identifier, tag, p } = params

    if (getters.isUrlResolved(identifier)) {
      return
    }

    if (identifier) {
      return dispatch('list', { queryOptions: { resolveUrl: true, identifier, categories: identifier }, size: 9 })
        .then((result) => {
          const { start, perPage, total } = result
          commit(
            types.ICMAA_BLOG_URL_ADD,
            { url: identifier, ids: result.items.map(({ id }) => id), start, perPage, total }
          )
        })
    } else if (tag) {
      return dispatch('list', { queryOptions: { tags: tag }, size: 9 })
        .then((result) => {
          const { start, perPage, total } = result
          commit(
            types.ICMAA_BLOG_URL_ADD,
            { url: `tag-${tag}`, ids: result.items.map(({ id }) => id), start, perPage, total }
          )
        })
    }

    return dispatch('list', { })
  }
}

export default actions
