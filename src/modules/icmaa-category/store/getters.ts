import { GetterTree } from 'vuex'
import CategoryState, { CategoryStateListItem, ProductListingWidgetState } from '../types/CategoryState'
import RootState from '@vue-storefront/core/types/RootState'
import { getFilterHash } from '../helpers'

const getters: GetterTree<CategoryState, RootState> = {
  lists: state => state.lists,
  listByParentId: (state, getters, RootState, rootGetters) => (id: number): CategoryStateListItem | boolean => {
    let categoryList = getters.lists.find(l => l.category === id)
    if (categoryList) {
      const { items, category } = categoryList
      const categories = rootGetters['category-next/getCategories']
      return { category: categories.find(c => c.id === category), items }
    }

    return false
  },
  getProductListingWidget: (state, getters, RootState, rootGetters) => (parent: number, filter: Record<string, any>|boolean = false): ProductListingWidgetState => {
    let cluster = rootGetters['user/getCluster']
    if (cluster !== false) {
      cluster = parseInt(rootGetters['user/getCluster'])
    }

    return state.productListingWidget.find(i => i.parent === parent && i.cluster === cluster && i.filterHash === getFilterHash(filter))
  }
}

export default getters
