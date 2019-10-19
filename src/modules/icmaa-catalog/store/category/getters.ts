import config from 'config'
import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'

const getters: GetterTree<CategoryState, RootState> = {
  isCurrentFilterAttribute: (state, getters) => (attributeKey) => {
    return (getters.getCurrentFilters[attributeKey])
  },
  getNestedSubmenuFilterKeys: () => {
    let { filterTree } = config.products
    return [].concat(...Object.keys(filterTree).map(k => filterTree[k]))
  },
  getAllSubmenuFilterKeys: () => {
    let { submenuFilters, filterTree } = config.products
    return submenuFilters.concat(...Object.keys(filterTree).map(k => filterTree[k]))
  }
}

export default getters
