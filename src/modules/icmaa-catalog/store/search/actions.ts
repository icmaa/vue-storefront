import { ActionTree } from 'vuex'
import { icmaa_search } from 'config'
import { SearchClient } from 'typesense'

import * as types from './mutation-types'
import SearchState, { Collection, SearchResponse } from '../../types/SearchState'
import RootState from '@vue-storefront/core/types/RootState'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export type SearchOptions = {
  type: string,
  term: string,
  size: number,
  page?: number
}

const actions: ActionTree<SearchState, RootState> = {
  initClient: ({ getters, commit }) => {
    if (getters.getClient) return
    const client = new SearchClient(icmaa_search?.typesense?.config || {})
    commit(types.ICMAA_SEARCH_INIT_CLIENT, client)
  },
  getCollection: ({ dispatch, commit, getters }, key): Collection => {
    let collection = getters.getCollection(key)
    if (!collection) {
      dispatch('initClient')
      collection = getters.getClient?.collections(key + '-' + currentStoreView().storeCode)
      commit(types.ICMAA_SEARCH_SET_COLLECTION, { key, collection })
    }

    return collection
  },
  setCurrentTerm: ({ commit }, term: string) => {
    commit(types.ICMAA_SEARCH_SET_CURRENT_TERM, term)
  },
  search: ({ dispatch }, { type = 'product', term, size = 16 }: SearchOptions): Promise<SearchResponse> => {
    const collection = dispatch('getCollection', type) as unknown as Collection
    return collection.documents()
      .search({
        q: term,
        preset: type + '-default',
        per_page: size,
        use_cache: true
      } as any, {})
  }
}

export default actions
