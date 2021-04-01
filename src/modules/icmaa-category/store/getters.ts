import { GetterTree } from 'vuex'
import CategoryState, { CategoryStateListItem, ProductListingWidgetState } from '../types/CategoryState'
import RootState from '@vue-storefront/core/types/RootState'
import { getObjectHash } from 'icmaa-config/helpers/hash'

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
  getProductListingWidget: (state) => (options: Record<string, any>): ProductListingWidgetState => {
    return state.productListingWidget.find(i => i.optionsHash === getObjectHash(options))
  }
}

export default getters
