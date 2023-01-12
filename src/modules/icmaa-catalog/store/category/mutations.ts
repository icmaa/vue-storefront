import Vue from 'vue'
import { MutationTree } from 'vuex'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'
import * as originalTypes from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'

const mutations: MutationTree<CategoryState> = {
  /**
   * Update existing category filter instead of just overwrite them.
   * This way can asynchronously mutate the filters.
   * @param {} state
   * @param {Array} attributes
   */
  [originalTypes.CATEGORY_SET_CATEGORY_FILTERS] (state, { category, filters }) {
    const orgFilters = state.filtersMap[category.url_key] || {}
    filters = Object.assign({}, orgFilters, filters)
    Vue.set(state.filtersMap, category.url_key, filters)
  }
}

export default mutations
