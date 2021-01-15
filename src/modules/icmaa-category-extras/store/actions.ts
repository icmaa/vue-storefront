import config from 'config'
import { ActionTree } from 'vuex'

import RootState from '@vue-storefront/core/types/RootState'
import CategoryExtrasState, { CategoryExtrasContentHeader } from '../types/CategoryExtrasState'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import * as types from './mutation-types'
import { categoryExtrasStateKey } from './'

import { DataResolver } from '@vue-storefront/core/data-resolver/types/DataResolver'
import CmsService from 'icmaa-cms/data-resolver/CmsService'

const actions: ActionTree<CategoryExtrasState, RootState> = {
  async loadCategoryWithExtras ({ dispatch }, categorySearchOptions: DataResolver.CategorySearchOptions): Promise<Category> {
    categorySearchOptions.includeFields = config.entities.category.includeFields.concat(config.icmaa_categoryextras.categoryAttributes)
    return dispatch('category-next/loadCategory', categorySearchOptions, { root: true })
  },
  loadContentHeader: async ({ getters }, identifier: string): Promise<CategoryExtrasContentHeader|any[]> => {
    if (!identifier) {
      return
    }

    const existingContentHeader = getters.getContentHeaderByUrlKey(identifier)
    if (existingContentHeader) {
      return existingContentHeader
    }

    const documentType = 'category-extras'
    const actionName = `store:${categoryExtrasStateKey}/loadContentHeaderSync`
    return CmsService.singleQueue({ documentType, uid: identifier, actionName })
  },
  loadContentHeaderSync: ({ commit }, task: any) => {
    const { result } = task
    const payload: CategoryExtrasContentHeader = result.contentHeader
    const identifier: string = result.identifier
    commit(types.ICMAA_CATEGORY_EXTRAS_CONTENT_HEADER_ADD, { identifier, payload })
  }
}

export default actions
