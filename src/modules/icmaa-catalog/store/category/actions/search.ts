import { ActionTree } from 'vuex'
import * as types from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'
import i18n from '@vue-storefront/i18n'
import addDefaultProductFilter from 'icmaa-catalog/helpers/defaultProductFilter'
import { products } from 'config'
import { buildFilterProductsQuery } from '@vue-storefront/core/helpers'
import { _prepareCategoryPathIds } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers'

import { icmaa_catalog } from 'config'

const actions: ActionTree<CategoryState, RootState> = {
  async loadSearchProducts ({ commit, getters, dispatch }, { route, category, pageSize = 50 } = {}) {
    const categoryMappedFilters = getters.getFiltersMap[category.id]

    const searchQuery = getters.getCurrentFiltersFrom(route[products.routerFiltersSource], categoryMappedFilters)
    let filterQr = buildFilterProductsQuery({}, searchQuery.filters)

    filterQr.applyFilter({ key: 'search-text', value: category.term })
    addDefaultProductFilter(filterQr)

    const { includeFields, excludeFields } = getters.getIncludeExcludeFields(category)
    const sort = searchQuery.sort
    const separateSelectedVariant = !icmaa_catalog.entities.category.configureChildProductsInCategoryList || false

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
      category,
      filters: searchQuery.filters
    })

    commit(types.CATEGORY_SET_SEARCH_PRODUCTS_STATS, { perPage, start, total })
    commit(types.CATEGORY_SET_PRODUCTS, items)

    return items
  },
  async loadMoreSearchProducts ({ commit, getters, dispatch, rootGetters }) {
    const category = {
      id: rootGetters['icmaaSearchAlias/getCurrentResultsPageTermHash'],
      term: rootGetters['icmaaSearchAlias/getCurrentResultsPageAlias']
    }

    const { perPage, start, total } = getters.getCategorySearchProductsStats
    const totalValue = typeof total === 'object' ? total.value : total
    if (start >= totalValue || totalValue < perPage) return

    const searchQuery = getters.getCurrentSearchQuery
    let filterQr = buildFilterProductsQuery({}, searchQuery.filters)

    filterQr.applyFilter({ key: 'search-text-plain', value: category.term })
    addDefaultProductFilter(filterQr)

    const { includeFields, excludeFields } = getters.getIncludeExcludeFields(category)
    const sort = searchQuery.sort
    const separateSelectedVariant = !icmaa_catalog.entities.category.configureChildProductsInCategoryList || false

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
  async loadSearchBreadcrumbs ({ dispatch, rootGetters }) {
    const routes = [ { name: i18n.t('Search') } ]
    const current = rootGetters['icmaaSearchAlias/getCurrentResultsPageTerm']

    await dispatch('breadcrumbs/set', { current, routes }, { root: true })
  }
}

export default actions
