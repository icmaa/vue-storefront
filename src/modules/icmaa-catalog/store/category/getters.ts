import config, { entities, icmaa_catalog } from 'config'
import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import getDefaultCategorySort from 'icmaa-catalog/helpers/defaultCategorySort'
import queryString from 'query-string'
import intersection from 'lodash-es/intersection'
import union from 'lodash-es/union'
import get from 'lodash-es/get'

const getters: GetterTree<CategoryState, RootState> = {
  getCategoryById: (state, getters) => (id): Category|boolean => {
    return Object.values(getters.getCategoriesMap as Category[]).find(c => c.id === id) || false
  },
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

    const categoryUrlKey = get(getters.getCurrentCategory, 'url_key', null)
    return state.filtersMap[categoryUrlKey] || {}
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
  getFilterCategories: (state, getters) => {
    const filterCategories = getters.getAvailableFilters.category || []

    const genericSubcategories = getters.getCurrentCategory?.genericSubcategories
    if (genericSubcategories) {
      filterCategories.push(
        ...genericSubcategories.map(c => ({
          slug: c.urlKey,
          url_path: c.urlPath,
          label: c.title
        }))
      )
    }

    return filterCategories
  },
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
  isGenericSubcategory: (state, getters) => getters.getCurrentCategory?.isGenericSubcategory === true,
  getGenericSubcategory: (state, getters, rootState): boolean | any => {
    return getters.getGenericSubcategoryByCategory(getters.getCurrentCategory)
  },
  getGenericSubcategoryByCategory: (state, getters, rootState) => (category: any): boolean | any => {
    if (!category.isGenericSubcategory) return false
    const subcategory = category.subcategory
    subcategory.query = queryString.parse('?' + subcategory.queryPath)
    return subcategory
  }
}

export default getters
