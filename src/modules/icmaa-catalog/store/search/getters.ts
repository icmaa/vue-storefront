import { GetterTree } from 'vuex'
import SearchState from '../../types/SearchState'
import RootState from '@vue-storefront/core/types/RootState'
import { getHash } from 'icmaa-config/helpers/hash'

const getters: GetterTree<SearchState, RootState> = {
  getClient: (state) => state.client,
  getCollection: (state) => (key: string) => state.collections[key],
  getCurrentTerm: (state): string => state.currentTerm,
  isSearchResultPage: (state, getters, rootState): boolean => rootState.route.name.endsWith('search'),
  getCurrentResultsPageTerm: (state, getters, rootState): string => rootState.route.params.term || '',
  getCurrentResultsPageTermHash: (state, getters): string => 'search-' + getHash(getters.getCurrentResultsPageTerm)
}

export default getters
