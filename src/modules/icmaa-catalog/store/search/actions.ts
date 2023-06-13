import { ActionTree } from 'vuex'
import { icmaa_search } from 'config'
import { SearchClient } from 'typesense'

import * as types from './mutation-types'
import SearchState from '../../types/SearchState'
import i18n from '@vue-storefront/i18n'
import RootState from '@vue-storefront/core/types/RootState'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export type SearchOptions = {
  type: string,
  term: string,
  size: number,
  page?: number
}

const client = new SearchClient(icmaa_search?.typesense?.config || {})

const actions: ActionTree<SearchState, RootState> = {
  setCurrentTerm: ({ commit }, term: string) => {
    commit(types.ICMAA_SEARCH_SET_CURRENT_TERM, term)
  },
  search: async (context, { type = 'product', term, size = 16 }: SearchOptions): Promise<any> => {
    const collection = client.collections(type + '-' + currentStoreView().storeCode)
    return collection.documents()
      .search({
        q: term,
        preset: type + '-default',
        per_page: size,
        use_cache: true
      } as any, {})
  },
  loadSearchBreadcrumbs: async ({ dispatch, rootGetters }) => {
    const routes = [ { name: i18n.t('Search') } ]
    const current = rootGetters['icmaaSearch/getCurrentResultsPageTerm']
    await dispatch('breadcrumbs/set', { current, routes }, { root: true })
  }
}

export default actions
