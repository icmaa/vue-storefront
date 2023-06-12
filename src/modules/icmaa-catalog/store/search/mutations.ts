import Vue from 'vue'
import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import SearchState, { Collection, SearchClient } from '../../types/SearchState'

const mutations: MutationTree<SearchState> = {
  [types.ICMAA_SEARCH_INIT_CLIENT]: (state, client: SearchClient) => {
    state.client = client
  },
  [types.ICMAA_SEARCH_SET_COLLECTION]: (state, { key, collection }: { key: string, collection: Collection }) => {
    Vue.set(state.collections, key, collection)
  },
  [types.ICMAA_SEARCH_SET_CURRENT_TERM]: (state, term: string) => {
    state.currentTerm = term
  }
}

export default mutations
