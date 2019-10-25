import { GetterTree } from 'vuex'
import SearchAliasState, { SearchAliasStateItem } from '../../types/SearchAliasState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<SearchAliasState, RootState> = {
  getAll: (state): Record<string, any> => state.items,
  getMap: (state): Record<string, any> => {
    let object = {}
    state.items.forEach((v, k) => { object[k] = v })
    return object
  }
}

export default getters
