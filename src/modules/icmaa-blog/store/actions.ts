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

const actions: ActionTree<BlogState, RootState> = {
  list: async (context, { identifier, tags, size, category, resolveUrl }: QueryOptions) => {
    const query = createQuery({ identifier, tags, category, size, resolveUrl })
    return elasticListAbstract<BlogArticle, BlogState, RootState>({ entityType, mutationTypes, stateKey, context, query })
  },
  fetchCategories: async ({ dispatch, rootGetters }) => {
    await dispatch('icmaaCmsBlock/single', { value: 'blog-categories' }, { root: true })
    return rootGetters['icmaaCmsBlock/getJsonBlockByIdentifier']('blog-categories')
  },
  resolveUrl: async ({ dispatch, commit, getters }, { route }: { route: BlogRoute }) => {
    const { params } = route
    const { identifier } = params

    if (getters.isUrlResolved(identifier)) {
      return
    }

    if (identifier) {
      return dispatch('list', { resolveUrl: true, identifier, category: identifier })
        .then((result) => {
          commit(types.ICMAA_BLOG_URL_ADD, { url: identifier, ids: result.items.map(({ id }) => id) })
        })
    }

    return dispatch('list', { })
  }
}

export default actions
