import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CompetitionsState, { Competition } from '../types/CompetitionsState'

const getters: GetterTree<CompetitionsState, RootState> = {
  getItems: (state): Competition[] => state.items,
  getByIdentifier: (state, getters) =>
    (identifier: string): Competition|boolean => getters.getItems.find(c => c.identifier === identifier),
  getRouteByIdentifier: (state, getter) => (identifier: string): Record<string, any> => {
    const competition = getter.getByIdentifier(identifier)
    if (competition !== null && competition.enabled === true) {
      return {
        name: 'icmaa-competition',
        params: { identifier }
      }
    }
  }
}

export default getters
