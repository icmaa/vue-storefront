import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import BlockState from '../../types/BlockState'

const mutations: MutationTree<BlockState> = {
  [types.ICMAA_CMS_BLOCK_ADD_CMS_BLOCK] (state, block) {
    const item = state.items.find(item => item.identifier === block.id)
    if (!item) {
      state.items.push(block)
    }
  }
}

export default mutations
