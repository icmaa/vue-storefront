import { ActionTree } from 'vuex'
import * as types from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'
import addDefaultProductFilter from 'icmaa-catalog/helpers/defaultProductFilter'
import { products, entities } from 'config'
import { buildFilterProductsQuery } from '@vue-storefront/core/helpers'
import { _prepareCategoryPathIds } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers'
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'
import getDefaultCategorySort from 'icmaa-catalog/helpers/defaultCategorySort'

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
  async loadCategoryProducts ({ commit, getters, rootGetters, dispatch, rootState }, { category, pageSize = 50 } = {}) {
    const route = rootState.route
    const searchCategory = category || getters.getCategoryFrom(route.path) || {}
    let categoryMappedFilters = getters.getFiltersMap[searchCategory.url_key]
    const areFiltersInQuery = !!Object.keys(route[products.routerFiltersSource]).length
    const hasSessionFilters = !!rootGetters['user/hasSessionFilters']
    if (!categoryMappedFilters && (areFiltersInQuery || hasSessionFilters)) { // loading all filters only when some filters are currently chosen and category has no available filters yet
      await dispatch('loadCategoryFilters', searchCategory)
      categoryMappedFilters = getters.getFiltersMap[searchCategory.url_key]
    }
    const searchQuery = getters.getCurrentFiltersFrom(route[products.routerFiltersSource], categoryMappedFilters)
    let filterQr = buildFilterProductsQuery(searchCategory, searchQuery.filters)

    addDefaultProductFilter(filterQr)
    if (!searchQuery.sort) {
      filterQr.applySort({ field: 'is_in_sale', options: { 'missing': '_first' } })
    }

    if (category.isGenericSubcategory === true) {
      const subcategory = getters.getGenericSubcategoryByCategory(category)
      for (const key in subcategory.query) {
        const value = subcategory.query[key] === 'notNull'
          ? { [subcategory.query[key]]: true }
          : subcategory.query[key].split(',')
        filterQr.applyFilter({ key, value, scope: 'default' })
      }
    }

    dispatch(
      'user/applySessionFilterToSearchQuery',
      { query: filterQr, filters: searchQuery.filters },
      { root: true }
    )

    const { includeFields, excludeFields } = getters.getIncludeExcludeFields(category)
    const sort = searchQuery.sort || getDefaultCategorySort(searchCategory)
    const separateSelectedVariant = getters.separateSelectedVariantInProductList

    const page = parseInt(route?.query?.p) || 1
    const startFrom = pageSize * (page - 1)
    const { items, perPage, start, total, aggregations, attributeMetadata } = await dispatch('product/findProducts', {
      query: filterQr,
      sort,
      includeFields,
      excludeFields,
      start: startFrom,
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

    commit(types.CATEGORY_SET_SEARCH_PRODUCTS_STATS, { page, perPage, start, visible: perPage, total })
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
  async loadMoreCategoryProducts ({ commit, getters, dispatch, rootState }, { router, prev = false }) {
    const category = getters.getCurrentCategory
    const { perPage, start, visible, total, page: currPage } = getters.getCategorySearchProductsStats
    const totalValue = typeof total === 'object' ? total.value : total
    if (start >= totalValue || totalValue < perPage) return

    const searchQuery = getters.getCurrentSearchQuery
    let filterQr = buildFilterProductsQuery(category, searchQuery.filters)

    addDefaultProductFilter(filterQr)
    if (!searchQuery.sort) {
      filterQr.applySort({ field: 'is_in_sale', options: { 'missing': '_first' } })
    }

    if (getters.isGenericSubcategory) {
      const subcategory = getters.getGenericSubcategory
      for (const key in subcategory.query) {
        const value = subcategory.query[key] === 'notNull'
          ? { [subcategory.query[key]]: true }
          : subcategory.query[key].split(',')
        filterQr.applyFilter({ key, value, scope: 'default' })
      }
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
      start: prev ? start - perPage : start + visible,
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

    const page = parseInt(prev ? currPage : currPage + 1)
    commit(types.CATEGORY_SET_SEARCH_PRODUCTS_STATS, {
      page,
      perPage: searchResult.perPage,
      start: prev ? searchResult.start : start,
      visible: visible + perPage,
      total: searchResult.total
    })
    commit(!prev ? types.CATEGORY_ADD_PRODUCTS : types.CATEGORY_ADD_PRODUCTS_TO_START, searchResult.items)

    if (!prev && page > 1) {
      router.push({ query: { ...rootState.route.query, p: page } })
    }

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
    const categoryMappedFilters = getters.getFiltersMap[currentCategory.url_key]
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
  async loadCategoryBreadcrumbs ({ dispatch }, { category, currentRouteName, preserve }) {
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

    await dispatch('breadcrumbs/set', { current: currentRouteName, routes, preserve }, { root: true })
    return categories
  }
}

export default actions
