import Vue from 'vue'
import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'
import FilterVariant from '@vue-storefront/core/modules/catalog-next/types/FilterVariant'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import { DataResolver } from '@vue-storefront/core/data-resolver/types/DataResolver'
import { router } from '@vue-storefront/core/app'
import { products } from 'config'
import { changeFilterQuery } from '@vue-storefront/core/modules/catalog-next/helpers/filterHelpers'
import * as types from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'

import extendedCoreActions from './actions/index'
import searchActions from './actions/search'

const actions: ActionTree<CategoryState, RootState> = {
  ...extendedCoreActions,
  ...searchActions,
  async loadCategoryWithExtras ({ dispatch }, categorySearchOptions: DataResolver.CategorySearchOptions): Promise<Category> {
    return dispatch('icmaaCategoryExtras/loadCategoryWithExtras', categorySearchOptions, { root: true })
  },
  async setSearchFilters ({ dispatch }, filterVariants: FilterVariant[] = []) {
    let currentQuery = {}
    filterVariants.forEach(filterVariant => {
      currentQuery = changeFilterQuery({ currentQuery, filterVariant })
    })
    await dispatch('changeRouterFilterParameters', currentQuery)
  },
  async unsetSearchFilterForAttribute ({ dispatch, getters }, attributeKey: string) {
    let currentQuery = router.currentRoute[products.routerFiltersSource]
    let currentFilters = getters.getCurrentFilters[attributeKey] || []
    if (!Array.isArray(currentFilters)) {
      currentFilters = [ currentFilters ]
    }

    if (currentQuery[attributeKey] && currentFilters.length > 0) {
      currentFilters.forEach(filter => {
        currentQuery = changeFilterQuery({ currentQuery, filterVariant: filter })
      })
      await dispatch('changeRouterFilterParameters', currentQuery)
    }
  },
  async findCategoriesWithoutBlacklisting ({ dispatch, commit }, categorySearchOptions: DataResolver.CategorySearchOptions): Promise<Category[]> {
    const categories = await dispatch('findCategories', categorySearchOptions)
    if (Vue.prototype.$cacheTags) {
      categories.forEach(category => {
        Vue.prototype.$cacheTags.add(`C${category.id}`)
      })
    }

    commit(types.CATEGORY_ADD_CATEGORIES, categories)

    return categories
  },
  async loadChildCategoryFilter ({ dispatch, getters, commit }) {
    let currentCategory: Category = getters.getCurrentCategory
    if (currentCategory) {
      const { children_count, children_data: children } = currentCategory
      if (Number(children_count) === 0 || !children || children.length === 0) {
        return
      }

      const childrenIds: number[] = children.map(c => parseInt(c.id as string))
      await dispatch('loadCategories', { filters: { id: childrenIds } })

      const filters = { category: [] }
      getters.getCategories
        .filter(c => childrenIds.includes(c.id))
        .forEach(c => {
          const { id, name: label, position, url_path, slug } = c
          const filter = { id, label, position, url_path, slug }
          filters.category.push(filter)
        })

      filters.category.sort((a, b) => a.position - b.position)

      commit(types.CATEGORY_SET_CATEGORY_FILTERS, { category: currentCategory, filters })
    }
  }
}

export default actions
