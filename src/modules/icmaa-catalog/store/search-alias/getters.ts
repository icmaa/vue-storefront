import { GetterTree } from 'vuex'
import SearchAliasState, { SearchAliasStateItem } from '../../types/SearchAliasState'
import RootState from '@vue-storefront/core/types/RootState'
import { getHash } from 'icmaa-config/helpers/hash'

const getters: GetterTree<SearchAliasState, RootState> = {
  getAll: (state): SearchAliasStateItem[] => state.items,
  getMap: (state): Record<string, string> => {
    let object = {}
    state.items.forEach((v) => { object[v.identifier] = v.search })
    return object
  },
  getCurrentTerm: (state): string => state.currentTerm,
  isSearchResultPage: (state, getters, rootState): boolean => rootState.route.name.endsWith('search'),
  getCurrentResultsPageTerm: (state, getters, rootState): string => rootState.route.params.term || '',
  getCurrentResultsPageTermHash: (state, getters): string => 'search-' + getHash(getters.getCurrentResultsPageTerm),
  getCurrentResultsPageAlias: (state): string => state.currentResultAlias
}

export default getters
