import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState';
import CategoryState, { CategoryStateListItem, CategoryStateCategory } from '../types/CategoryState'
import * as types from './mutation-types'
import { fetchCategoryById, fetchChildCategories } from '../helpers'

import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<CategoryState, RootState> = {
  async list (context, { parentId, crawlDepth = 1 }): Promise<any> {
    if (!context.state.lists.find((item) => item.parent.id === parentId)) {
      let parent = await fetchCategoryById({ parentId })
        .then(resp => {
          return resp.items[0]
        })
        .catch(error => {
          Logger.error('Can\'t find category: ' + parentId, 'icmaaCategoryList', error)()
          return false
        })

      if (!parent) {
        return
      }

      let list = await fetchChildCategories({ parentId, level: (parent.level + crawlDepth) })
        .then(resp => resp)
        .catch(error => {
          Logger.error('Error while fetching children of category: ' + parentId, 'icmaaCategoryList', error)()
        })

      context.commit(
        types.ICMAA_CATEGORY_LIST_ADD_CATEGORY_LIST,
        { parent, list }
      )

      return { parent, list }
    }
  }
}

export default actions
