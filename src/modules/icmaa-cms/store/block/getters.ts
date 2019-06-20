import { GetterTree } from 'vuex'
import BlockState from '../../types/BlockState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<BlockState, RootState> = {
  blocks: (state) => state.items,
  blockByIdentifier: (state) => (identifier) => {
    return state.items.find(item => item.identifier === identifier)
  }
}

export default getters
