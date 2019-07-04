import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import CategoryExtrasState from '../../types/CategoryExtrasState'

const mutations: MutationTree<CategoryExtrasState> = {
  [types.ICMAA_CMS_CATEGORY_EXRTAS_ADD] (state, payload) {
    const item = state.items.find(item => item.identifier === payload.identifier)
    if (!item) {
      state.items.push(payload)
    }
  },
  [types.ICMAA_CMS_CATEGORY_EXRTAS_UPD] (state, payload) {
    const index = state.items.findIndex(item => item.identifier === payload.identifier)
    if (index !== -1) {
      // Need to use slice because otherwise its not reactive
      // @see https://vuejs.org/v2/guide/list.html#Caveats
      state.items.splice(index, 1, payload)
    } else {
      state.items.push(payload)
    }
  },
  [types.ICMAA_CMS_CATEGORY_EXRTAS_RMV] (state, payload) {
    const index = state.items.findIndex(item => item.identifier === payload.identifier)
    if (index !== -1) {
      state.items.splice(index, 1)
    }
  }
}

export default mutations
