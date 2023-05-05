import { ActionTree } from 'vuex'
import { elasticList as elasticListAbstract, MutationTypesInterface } from 'icmaa-cms/store/abstract/actions'

import { stateKey } from './'
import * as types from './mutation-types'
import BlogState, { BlogArticle } from '../types/BlogState'
import createQuery from '../helpers/queryBuilder'
import RootState from '@vue-storefront/core/types/RootState'

const entityType = 'blog'
const mutationTypes: MutationTypesInterface = {
  add: types.ICMAA_BLOG_ADD,
  upd: types.ICMAA_BLOG_UPD,
  rmv: types.ICMAA_BLOG_RMV
}

const actions: ActionTree<BlogState, RootState> = {
  list: async (context, { tags, size, category }: { tags?: string, category?: string, size?: string }) => {
    const query = createQuery({ tags, category, size })
    return elasticListAbstract<BlogArticle, BlogState, RootState>({ entityType, mutationTypes, stateKey, context, query })
  }
}

export default actions
