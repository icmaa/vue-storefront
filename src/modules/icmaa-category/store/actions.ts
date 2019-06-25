import { ActionTree } from 'vuex'
import * as types from './mutation-types'
import RootState from '@vue-storefront/core/types/RootState';
import CategoryState, { CategoryStateListItem, CategoryStateCategory } from '../types/CategoryState'

import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<CategoryState, RootState> = {
  list (context, { String: parentId }): Promise<any> {
    if (!context.state.lists.find((item) => item.parent.id === parentId)) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
}

export default actions
