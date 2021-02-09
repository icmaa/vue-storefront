import { ActionTree } from 'vuex'
import * as types from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'
import addDefaultProductFilter from 'icmaa-catalog/helpers/defaultProductFilter'
import { products, entities } from 'config'
import { buildFilterProductsQuery } from '@vue-storefront/core/helpers'
import { _prepareCategoryPathIds } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers'
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'

import omit from 'lodash-es/omit'
import cloneDeep from 'lodash-es/cloneDeep'

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
   * * Filter for custom attribute-filters in session (e.g. gender) if they are set
   */
  async loadCategoryProducts ({ commit, getters, rootGetters, dispatch }, { route, category, pageSize = 50 } = {}) {
    const searchCategory = category || getters.getCategoryFrom(route.path) || {}
    const categoryMappedFilters = getters.getFiltersMap[searchCategory.id]
    const areFiltersInQuery = !!Object.keys(route[products.routerFiltersSource]).length
    const hasSessionFilters = !!rootGetters['user/hasSessionFilters']
    if (!categoryMappedFilters && (areFiltersInQuery || hasSessionFilters)) { // loading all filters only when some filters are currently chosen and category has no available filters yet
      await dispatch('loadCategoryFilters', searchCategory)
    }
    const searchQuery = getters.getCurrentFiltersFrom(route[products.routerFiltersSource], categoryMappedFilters)
    let filterQr = buildFilterProductsQuery(searchCategory, searchQuery.filters)

    addDefaultProductFilter(filterQr)
    if (!searchQuery.sort) {
      filterQr.applySort({ field: 'is_in_sale', options: { 'missing': '_first' } })
    }

    dispatch(
      'user/applySessionFilterToSearchQuery',
      { query: filterQr, filters: searchQuery.filters },
      { root: true }
    )

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
      filters: searchQuery.filters,
      userSessionFilterKeys: rootGetters['user/getSessionFilterKeys']
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
   * * Filter for custom attribute-filters in session (e.g. gender) if they are set
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

    dispatch(
      'user/applySessionFilterToSearchQuery',
      { query: filterQr, filters: searchQuery.filters },
      { root: true }
    )

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
  /**
   * Changes:
   * * Add `userSessionFilterKeys` parameter to be able to show filter in sidebar that are otherwise
   *   would be excluded by the results of the current session filter.
   */
  async loadAvailableFiltersFrom ({ commit, getters, dispatch }, { aggregations, attributeMetadata, category, filters = {}, userSessionFilterKeys = [] }) {
    if (entities.attribute.loadByAttributeMetadata) {
      await dispatch('attribute/loadCategoryAttributes', { attributeMetadata }, { root: true })
    }
    const aggregationFilters = getters.getAvailableFiltersFrom(aggregations)
    const currentCategory = category || getters.getCurrentCategory
    const categoryMappedFilters = getters.getFiltersMap[currentCategory.id]
    let resultFilters = aggregationFilters
    const filtersKeys = Object.keys(filters)
    if (categoryMappedFilters && (filtersKeys.length || userSessionFilterKeys.length)) {
      resultFilters = Object.assign(
        cloneDeep(categoryMappedFilters),
        cloneDeep(omit(aggregationFilters, [...filtersKeys, ...userSessionFilterKeys])))
    }
    commit(types.CATEGORY_SET_CATEGORY_FILTERS, { category, filters: resultFilters })
  },
  /**
   * Changes:
   * * Don't load it using `loadCategories` because the result might overwrite the current category in state
   * * Don't load root-category
   */
  async loadCategoryBreadcrumbs ({ dispatch }, { category, currentRouteName }) {
    if (!category) {
      return dispatch('breadcrumbs/set', { current: currentRouteName, routes: [] }, { root: true })
    }

    let categoryPathIds = _prepareCategoryPathIds(category).map(id => Number(id))

    const filters = { id: categoryPathIds, level: { gt: 1 } }
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
