import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import CategoryListState, { ProductListingWidgetState } from '../types/CategoryState'

const mutations: MutationTree<CategoryListState> = {
  [types.ICMAA_CATEGORY_LIST_ADD_CATEGORY_LIST] (state, payload) {
    const item = state.lists.find(item => item.category === payload.category)
    if (!item) {
      state.lists.push(payload)
    }
  },
  [types.ICMAA_CATEGORY_LIST_ADD_PRODUCT_LIST_WIDGET] (state, payload: ProductListingWidgetState) {
    let index = state.productListingWidget.findIndex(i => i.optionsHash === payload.optionsHash)
    if (index !== -1) {
      state.productListingWidget.splice(index, 1, payload)
    } else {
      state.productListingWidget.push(payload)
    }
  }
}

export default mutations
