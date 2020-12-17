import { ActionTree } from 'vuex'
import * as types from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'
import FilterVariant from '@vue-storefront/core/modules/catalog-next/types/FilterVariant'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'
import addDefaultProductFilter from 'icmaa-catalog/helpers/defaultProductFilter'
import { products } from 'config'
import { buildFilterProductsQuery } from '@vue-storefront/core/helpers'
import { _prepareCategoryPathIds } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers'
import { changeFilterQuery } from '@vue-storefront/core/modules/catalog-next/helpers/filterHelpers'
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'

import { icmaa } from 'config'
import intersection from 'lodash-es/intersection'
import union from 'lodash-es/union'

/**
 * These methods are overwrites of the original ones to extend them for our needs
 */
const actions: ActionTree<CategoryState, RootState> = {
  /**
   * Changes:
   * * Add custom default sort and filter
   * * Add custom `includeFields`/`excludeFields` loaded via getter
   * * Enable child configuration using `separateSelectedVariant` – product will still be configured
   *   but won't overwrite original options like the product image in unisex products
   */
  async loadCategoryProducts ({ commit, getters, dispatch }, { route, category, pageSize = 50 } = {}) {
    const searchCategory = category || getters.getCategoryFrom(route.path) || {}
    const categoryMappedFilters = getters.getFiltersMap[searchCategory.id]
    const areFiltersInQuery = !!Object.keys(route[products.routerFiltersSource]).length
    if (!categoryMappedFilters && areFiltersInQuery) { // loading all filters only when some filters are currently chosen and category has no available filters yet
      await dispatch('loadCategoryFilters', searchCategory)
    }
    const searchQuery = getters.getCurrentFiltersFrom(route[products.routerFiltersSource], categoryMappedFilters)
    let filterQr = buildFilterProductsQuery(searchCategory, searchQuery.filters)

    addDefaultProductFilter(filterQr)
    if (!searchQuery.sort) {
      filterQr.applySort({ field: 'is_in_sale', options: { 'missing': '_first' } })
    }

    const { includeFields, excludeFields } = getters.getIncludeExcludeFields(category)
    const sort = searchQuery.sort || getters.getDefaultCategorySort
    const separateSelectedVariant = getters.separateSelectedVariantInProductList

    const { items, perPage, start, total, aggregations, attributeMetadata } = await dispatch('product/findProducts', {
      query: filterQr,
      sort,
      includeFields,
      excludeFields,
      size: pageSize,
      configuration: searchQuery.filters,
      options: {
        populateRequestCacheTags: true,
        prefetchGroupProducts: false,
        setProductErrors: false,
        fallbackToDefaultWhenNoAvailable: true,
        assignProductConfiguration: false,
        separateSelectedVariant
      }
    }, { root: true })

    await dispatch('loadAvailableFiltersFrom', {
      aggregations,
      attributeMetadata,
      category: searchCategory,
      filters: searchQuery.filters
    })

    commit(types.CATEGORY_SET_SEARCH_PRODUCTS_STATS, { perPage, start, total })
    commit(types.CATEGORY_SET_PRODUCTS, items)

    return items
  },
  /**
   * Changes:
   * * Add custom default sort and filter
   * * Add custom `includeFields`/`excludeFields` loaded via getter
   * * Enable child configuration using `separateSelectedVariant` – product will still be configured
   *   but won't overwrite original options like the product image in unisex products
   */
  async loadMoreCategoryProducts ({ commit, getters, dispatch }) {
    const category = getters.getCurrentCategory
    const { perPage, start, total } = getters.getCategorySearchProductsStats
    const totalValue = typeof total === 'object' ? total.value : total
    if (start >= totalValue || totalValue < perPage) return

    const searchQuery = getters.getCurrentSearchQuery
    let filterQr = buildFilterProductsQuery(category, searchQuery.filters)

    addDefaultProductFilter(filterQr)
    if (!searchQuery.sort) {
      filterQr.applySort({ field: 'is_in_sale', options: { 'missing': '_first' } })
    }

    const { includeFields, excludeFields } = getters.getIncludeExcludeFields(category)
    const sort = searchQuery.sort || getters.getDefaultCategorySort
    const separateSelectedVariant = getters.separateSelectedVariantInProductList

    const searchResult = await dispatch('product/findProducts', {
      query: filterQr,
      sort,
      start: start + perPage,
      size: perPage,
      includeFields,
      excludeFields,
      configuration: searchQuery.filters,
      options: {
        populateRequestCacheTags: true,
        prefetchGroupProducts: false,
        setProductErrors: false,
        fallbackToDefaultWhenNoAvailable: true,
        assignProductConfiguration: false,
        separateSelectedVariant
      }
    }, { root: true })

    commit(types.CATEGORY_SET_SEARCH_PRODUCTS_STATS, {
      perPage: searchResult.perPage,
      start: searchResult.start,
      total: searchResult.total
    })
    commit(types.CATEGORY_ADD_PRODUCTS, searchResult.items)

    return searchResult.items
  },
  async setSearchFilters ({ dispatch }, filterVariants: FilterVariant[] = []) {
    let currentQuery = {}
    filterVariants.forEach(filterVariant => {
      currentQuery = changeFilterQuery({ currentQuery, filterVariant })
    })
    await dispatch('changeRouterFilterParameters', currentQuery)
  },
  /**
   * Changes:
   * * Add category allowlist support to hide unimportant categories
   * * Don't load it using `loadCategories` because the result might overwrite the current category in state
   */
  async loadCategoryBreadcrumbs ({ dispatch }, { category, currentRouteName }) {
    if (!category) {
      return dispatch('breadcrumbs/set', { current: currentRouteName, routes: [] }, { root: true })
    }

    let categoryHierarchyIds = _prepareCategoryPathIds(category).map(id => Number(id))
    let allowlistCategoryHierarchyIds = intersection(categoryHierarchyIds, icmaa.breadcrumbs.allowlist)
    if (allowlistCategoryHierarchyIds.length > 0) {
      categoryHierarchyIds = union(allowlistCategoryHierarchyIds, categoryHierarchyIds.slice(-1))
    } else {
      categoryHierarchyIds = allowlistCategoryHierarchyIds
    }

    const filters = { 'id': categoryHierarchyIds }
    const categories = await dispatch('findCategories', { filters })

    categories.sort((a, b) => a.level - b.level)
    const routes = categories.map(c => {
      return { name: c.name, route_link: formatCategoryLink(c) }
    })

    await dispatch('breadcrumbs/set', { current: currentRouteName, routes }, { root: true })
    return categories
  }
}

export default actions
