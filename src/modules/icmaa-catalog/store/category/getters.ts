import config, { entities, icmaa_catalog } from 'config'
import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import intersection from 'lodash-es/intersection'
import union from 'lodash-es/union'
import get from 'lodash-es/get'

const getters: GetterTree<CategoryState, RootState> = {
  /**
   * Overwrite parent to be able to search for search-filters of search-result page.
   */
  getAvailableFilters: (state, getters, rootState, rootGetters) => {
    if (rootGetters['icmaaSearchAlias/isSearchResultPage']) {
      return state.filtersMap[rootGetters['icmaaSearchAlias/getCurrentResultsPageTermHash']] || {}
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

    return intersection(parents, currentFilterKeys).length > 0
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
  separateSelectedVariantInProductList: () => !icmaa_catalog.entities.category.configureChildProductsInCategoryList || false
}

export default getters
