import { GetterTree } from 'vuex'
import BlockState, { BlockStateItem } from '../../types/BlockState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<BlockState, RootState> = {
  blocks: (state) => state.items,
  blockByIdentifier: (state) => (identifier): BlockStateItem => {
    return state.items.find(item => item.identifier === identifier)
  }
}

export default getters
