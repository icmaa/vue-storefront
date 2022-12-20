import config, { entities, icmaa_catalog } from 'config'
import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState from 'icmaa-catalog/types/CategoryState'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import getDefaultCategorySort from 'icmaa-catalog/helpers/defaultCategorySort'
import stripUrlPath from 'icmaa-catalog/helpers/stripUrlPath'
import queryString from 'query-string'
import intersection from 'lodash-es/intersection'
import union from 'lodash-es/union'
import get from 'lodash-es/get'

const getters: GetterTree<CategoryState, RootState> = {
  getCategoryById: (state, getters) => (id): Category|boolean => getters.getCategoriesMap[id] || false,
  getDefaultCategorySort: (state, getters, rootState, rootGetters) => {
    return getDefaultCategorySort(getters.getCurrentCategory as Category)
  },
  /**
   * Overwrite parent to be able to search for search-filters of search-result page.
   */
  getAvailableFilters: (state, getters, rootState, rootGetters) => {
    if (rootGetters['icmaaSearch/isSearchResultPage']) {
      return state.filtersMap[rootGetters['icmaaSearch/getCurrentResultsPageTermHash']] || {}
    }

    const categoryId = get(getters.getCurrentCategory, 'id', null)
    return state.filtersMap[categoryId] || {}
  },
  isActiveFilterAttribute: (state, getters) => (attributeKey: string) => {
    return (getters.getCurrentFilters[attributeKey])
  },
  getNestedSubmenuFilterKeys: () => {
    let { filterTree } = config.products
    return [].concat(...Object.keys(filterTree).map(k => filterTree[k]))
  },
  isVisibleFilter: (state, getters) => (attributeKey: string): boolean => {
    if (!getters.getNestedSubmenuFilterKeys.includes(attributeKey)) {
      return true
    }

    let parents = []
    const currentFilterKeys = Object.keys(getters.getCurrentFilters)
    let { filterTree } = config.products
    for (let key in filterTree) {
      if (filterTree[key].includes(attributeKey)) {
        parents.push(key)
      }
    }

    const category = getters.getCurrentCategory
    const showFilterInCategoryFor = category?.ceShowFiltersFor || []

    return intersection(parents, [...currentFilterKeys, ...showFilterInCategoryFor]).length > 0
  },
  getFilterCategories: (state, getters) => getters.getAvailableFilters.category || [],
  isCategoryInTicketWhitelist: () => (category: Category): boolean => {
    if (!category || !category.path) {
      return false
    }
    let whitelist = icmaa_catalog.entities.productListTicket.parentCategoryWhitelist || []
    const pathIds = category.path.split('/').map(id => Number(id))
    return intersection(pathIds, whitelist).length > 0
  },
  isCurrentCategoryInTicketWhitelist: (state, getters): boolean => {
    return getters.isCategoryInTicketWhitelist(getters.getCurrentCategory)
  },
  getIncludeExcludeFields: (state, getters) => (category: Category): { includeFields, excludeFields } => {
    let { includeFields, excludeFields } = entities.productList
    if (getters.isCategoryInTicketWhitelist(category)) {
      includeFields = union(includeFields, icmaa_catalog.entities.productListTicket.includeFields)
    }

    return { includeFields, excludeFields }
  },
  /**
   * Enable child configuration using `separateSelectedVariant` by config – if `configureChildProductsInCategoryList` is false
   * product will still be configured but won't overwrite original options like the product image in unisex products.
   * @return boolean
   */
  separateSelectedVariantInProductList: () => !icmaa_catalog.entities.category.configureChildProductsInCategoryList || false,
  isGenericSubcategory: state => state.isGenericSubcategory,
  getGenericSubcategoryByUrlPath: (state, getters, rootState) => (urlPath?: string) => {
    urlPath = stripUrlPath(urlPath)
    const subcategory = getters.getCurrentCategory.genericSubcategories?.find(c => c.urlPath === urlPath) || false
    if (subcategory) {
      subcategory.filtersQuery = queryString.parse('?' + subcategory.queryPath)
    }
    return subcategory
  },
  getGenericSubcategory: (state, getters, rootState) => {
    return getters.getGenericSubcategoryByUrlPath(rootState.route?.path || '')
  }
}

export default getters
