import Vue from 'vue'
import { MutationTree } from 'vuex'
import CategoryState from 'icmaa-catalog/types/CategoryState'
import * as types from './mutation-types'
import * as originalTypes from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'

const mutations: MutationTree<CategoryState> = {
  /**
   * Update existing category filter instead of just overwrite them.
   * This way can asynchronously mutate the filters.
   * @param {} state
   * @param {Array} attributes
   */
  [originalTypes.CATEGORY_SET_CATEGORY_FILTERS] (state, { category, filters }) {
    const orgFilters = state.filtersMap[category.id] || {}
    filters = Object.assign({}, orgFilters, filters)
    Vue.set(state.filtersMap, category.id, filters)
  },
  [types.CATEGORY_SET_GENERIC_SUBCATEGORY] (state, isGenericSubcategory: boolean) {
    state.isGenericSubcategory = isGenericSubcategory
  }
}

export default mutations
