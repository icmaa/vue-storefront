import { GetterTree } from 'vuex'
import CategoryState, { CategoryStateListItem, ProductListingWidgetState } from '../types/CategoryState'
import RootState from '@vue-storefront/core/types/RootState'
import { sortByLetter } from '../helpers'

const getters: GetterTree<CategoryState, RootState> = {
  lists: state => state.lists,
  listByParentId: state => (id: number): CategoryStateListItem => {
    return state.lists.find(list => list.parent.id === id)
  },
  sortedListByParentId: (state, getters) => (
    id: number
  ): CategoryStateListItem | boolean => {
    let list = getters.listByParentId(id)
    if (list) {
      list.list.sort(sortByLetter)
      return list
    }

    return false
  },
  getProductListingWidget: (state): ProductListingWidgetState[] => state.productListingWidget,
  getProductListingWidgetByCategoryId: state => (parent: number): ProductListingWidgetState => {
    return state.productListingWidget.find(i => i.parent === parent)
  }
}

export default getters
