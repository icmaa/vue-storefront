import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import BlockState from '../types/CategoryState'

const mutations: MutationTree<BlockState> = {
  [types.ICMAA_CATEGORY_LIST_ADD_CATEGORY_LIST] (state, payload) {
    const item = state.lists.find(item => item.parent.id === payload.parent.id)
    if (!item) {
      state.lists.push(payload)
    }
  },
  [types.ICMAA_CATEGORY_LIST_ADD_PRODUCT] (state, productList) {
    state.productListingWidget.push(productList)
  }
};

export default mutations
