import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import LooksState, { Look } from '../types/LooksState'

const getters: GetterTree<LooksState, RootState> = {
  getLooks: (state): Look[] => state.items,
  getByIdentifier: (state, getters) =>
    (identifier: string): Look|boolean => getters.getLooks.find(c => c.identifier === identifier)
}

export default getters
