import Vue from 'vue'
import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import CategoryListState, { ProductListingWidgetState } from '../types/CategoryState'
import { sortByLetter } from '../helpers'

const mutations: MutationTree<CategoryListState> = {
  [types.ICMAA_CATEGORY_LIST_ADD_CATEGORY_LIST] (state, { payload, letter }) {
    const itemIndex = state.lists.findIndex(item => item.parent === payload.parent)
    if (itemIndex === -1) {
      if (letter) {
        payload.list[letter] = payload.list.sort(sortByLetter)
      }
      state.lists.push(payload)
    } else {
      Vue.set(state.lists[itemIndex]['list'], letter, payload.list.sort(sortByLetter))
    }
  },
  [types.ICMAA_CATEGORY_LIST_ADD_PRODUCT] (state, payload: ProductListingWidgetState) {
    let list = state.productListingWidget.find(i => i.parent === payload.parent && i.cluster === payload.cluster && i.filterHash === payload.filterHash)
    if (list) {
      const newProductids = payload.list.map(p => p.id).filter(id => !list.list.map(p => p.id).includes(id))
      list.list.push(...payload.list.filter(p => newProductids.includes(p.id)))
      return
    }
    state.productListingWidget.push(payload)
  }
}

export default mutations
