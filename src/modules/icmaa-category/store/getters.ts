import { GetterTree } from 'vuex'
import CategoryState, { CategoryStateListItem } from '../types/CategoryState'
import RootState from '@vue-storefront/core/types/RootState'

const getters: GetterTree<CategoryState, RootState> = {
  lists: (state) => state.lists,
  listByParentId: (state) => (id): CategoryStateListItem => {
    return state.lists.find(item => item.parent.id === id)
  }
}

export default getters
