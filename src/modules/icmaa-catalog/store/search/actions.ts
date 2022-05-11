import { ActionTree } from 'vuex'

import * as types from './mutation-types'
import SearchState from '../../types/SearchState'
import RootState from '@vue-storefront/core/types/RootState'

const actions: ActionTree<SearchState, RootState> = {
  getAliasesBySearchString: async ({ dispatch, getters }, { searchString }): Promise<string> => {
    return searchString.toLowerCase()
  },
  setCurrentTerm: ({ commit }, term: string) => {
    commit(types.ICMAA_SEARCH_SET_CURRENT_TERM, term)
  }
}

export default actions
