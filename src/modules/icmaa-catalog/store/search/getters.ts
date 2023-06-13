import { GetterTree } from 'vuex'
import SearchState from '../../types/SearchState'
import RootState from '@vue-storefront/core/types/RootState'
import { getHash } from 'icmaa-config/helpers/hash'

const getters: GetterTree<SearchState, RootState> = {
  getCurrentTerm: (state): string => state.currentTerm,
  isSearchResultPage: (state, getters, rootState): boolean => rootState.route.name.endsWith('search'),
  getCurrentResultsPageTerm: (state, getters, rootState): string => rootState.route.params.term || '',
  getSettings: (state, getters, rootState, rootGetters): Record<string, any> => {
    return rootGetters['icmaaCmsBlock/getJsonBlockByIdentifier']('search-settings') || { stopWords: [] }
  },
  cleanTerm: (state, getters) => (term: string): string => {
    const { stopWords } = getters.getSettings
    return term
      .replace(/[&/\\#,+()[\]~%.'":*?<>{}]/g, '')
      .replace(/\s{1,}/gm, ' ')
      .split(' ')
      .filter(w => !stopWords.includes(w.toLowerCase()))
      .join(' ')
      .trim()
  }
}

export default getters
