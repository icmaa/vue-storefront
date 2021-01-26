import Vue from 'vue'
import { MutationTree } from 'vuex'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'
import * as types from './mutation-types'

const mutations: MutationTree<CategoryState> = {
  /**
   * Update existing category filter
   * @param {} state
   * @param {Array} attributes
   */
  [types.CATEGORY_UPD_CATEGORY_FILTERS] (state, { categoryId, filters }) {
    filters = Object.assign({}, state.filtersMap[categoryId], filters)
    Vue.set(state.filtersMap, categoryId, filters)
  }
}

export default mutations
