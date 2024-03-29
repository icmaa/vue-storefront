import Vue from 'vue'
import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import SearchState, { Collection, SearchClient } from '../../types/SearchState'

const mutations: MutationTree<SearchState> = {
  [types.ICMAA_SEARCH_SET_CURRENT_TERM]: (state, term: string) => {
    state.currentTerm = term
  }
}

export default mutations
