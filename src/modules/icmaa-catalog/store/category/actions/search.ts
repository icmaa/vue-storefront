import { ActionTree } from 'vuex'
import * as types from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'
import i18n from '@vue-storefront/i18n'
import addDefaultProductFilter from 'icmaa-catalog/helpers/defaultProductFilter'
import { products } from 'config'
import { buildFilterProductsQuery } from '@vue-storefront/core/helpers'
import { _prepareCategoryPathIds } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers'

const actions: ActionTree<CategoryState, RootState> = {
  async loadSearchProducts ({ commit, getters, dispatch, rootState }, { category, pageSize = 50 } = {}) {
    const route = rootState.route
    const categoryMappedFilters = getters.getFiltersMap[category.url_key]

    const searchQuery = getters.getCurrentFiltersFrom(route[products.routerFiltersSource], categoryMappedFilters)
    let filterQr = buildFilterProductsQuery({}, searchQuery.filters)

    filterQr.applyFilter({ key: 'search-text', value: category.term })
    addDefaultProductFilter(filterQr, 'search')

    const { includeFields, excludeFields } = getters.getIncludeExcludeFields(category)
    const sort = searchQuery.sort
    const separateSelectedVariant = getters.separateSelectedVariantInProductList

    const page = route?.query?.p || 1
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
      category,
      filters: searchQuery.filters
    })

    commit(types.CATEGORY_SET_SEARCH_PRODUCTS_STATS, { page, perPage, start, total })
    commit(types.CATEGORY_SET_PRODUCTS, items)

    return items
  },
  async loadMoreSearchProducts ({ commit, getters, dispatch, rootGetters, rootState }, { router, prev }) {
    const category = {
      url_key: rootGetters['icmaaSearch/getCurrentResultsPageTermHash'],
      term: rootGetters['icmaaSearch/getCurrentResultsPageTerm']
    }

    const { perPage, start, total, page: currPage } = getters.getCategorySearchProductsStats
    const totalValue = typeof total === 'object' ? total.value : total
    if (start >= totalValue || totalValue < perPage) return

    const searchQuery = getters.getCurrentSearchQuery
    let filterQr = buildFilterProductsQuery({}, searchQuery.filters)

    filterQr.applyFilter({ key: 'search-text-plain', value: category.term })
    addDefaultProductFilter(filterQr, 'search')

    const { includeFields, excludeFields } = getters.getIncludeExcludeFields(category)
    const sort = searchQuery.sort
    const separateSelectedVariant = getters.separateSelectedVariantInProductList

    const searchResult = await dispatch('product/findProducts', {
      query: filterQr,
      sort,
      start: !prev ? start + perPage : start - perPage,
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

    const page = prev ? currPage : searchResult.start / searchResult.perPage + 1
    commit(types.CATEGORY_SET_SEARCH_PRODUCTS_STATS, {
      page,
      perPage: searchResult.perPage,
      start: searchResult.start,
      total: searchResult.total
    })
    commit(!prev ? types.CATEGORY_ADD_PRODUCTS : types.CATEGORY_ADD_PRODUCTS_IN_FRONT, searchResult.items)

    if (!prev && page > 1) {
      router.push({ query: { ...rootState.route.query, p: page } })
    }

    return searchResult.items
  },
  async loadSearchBreadcrumbs ({ dispatch, rootGetters }) {
    const routes = [ { name: i18n.t('Search') } ]
    const current = rootGetters['icmaaSearch/getCurrentResultsPageTerm']

    await dispatch('breadcrumbs/set', { current, routes }, { root: true })
  }
}

export default actions
