import { GetterTree } from 'vuex'
import CategoryState, { CategoryStateListItem } from '../types/CategoryState'
import RootState from '@vue-storefront/core/types/RootState'
import { sortByLetter } from '../helpers/fetchCategories'

const getters: GetterTree<CategoryState, RootState> = {
  lists: (state) => state.lists,
  listByParentId: (state) => (id: number): CategoryStateListItem => {
    return state.lists.find(list => list.parent.id === id)
  },
  sortedListByParentId: (state, getters) => (id: number): CategoryStateListItem => {
    let list = getters.listByParentId(id)
    list.list.sort(sortByLetter)

    return list
  }
}

export default getters
