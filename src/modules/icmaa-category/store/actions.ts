import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState';
import CategoryState, { CategoryStateListItem, CategoryStateCategory } from '../types/CategoryState'
import * as types from './mutation-types'
import rootStore from '@vue-storefront/core/store'
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'
import { quickSearchByQuery } from '@vue-storefront/core/lib/search'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<CategoryState, RootState> = {
  async list (context, { parentId }): Promise<any> {
    if (!context.state.lists.find((item) => item.parent.id === parentId)) {
      let parentSearchQuery = new SearchQuery()
      parentSearchQuery.applyFilter({ key: 'id', value: { 'eq': parentId } })

      let parentCategory = await quickSearchByQuery({ entityType: 'category', query: parentSearchQuery, size: 1 })
        .then(resp => {
          for (let category of resp.items) {
            if (category.url_path) {
              rootStore.dispatch('url/registerMapping', {
                url: category.url_path,
                routeData: {
                  params: {
                    'slug': category.slug
                  },
                  'name': 'category'
                }
              }, { root: true })
            }
          }

          return resp
        })

      let childrenSearchQuery = new SearchQuery()
      childrenSearchQuery.applyFilter({ key: 'path', value: { 'regexp': '$' + parentCategory.items[0].path + '.*' } })

      let childeCategories = await quickSearchByQuery({ entityType: 'category', query: childrenSearchQuery })
        .then(resp => {
          Logger.error('CATCOUNT', 'DEBUG', resp.total)()
          for (let category of resp.items) {
            Logger.error('CAT-PATH', 'DEBUG', category.path)()
          }

          return resp
        })
    }
  }
}

export default actions
