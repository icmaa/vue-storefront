import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import CategoryState, { CategoryStateListItem, CategoryStateCategory } from '../types/CategoryState'
import * as types from './mutation-types'
import { fetchCategoryById, fetchChildCategories } from '../helpers'
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'

import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<CategoryState, RootState> = {
  async list (context, { parentId, crawlDepth = 1 }): Promise<any> {
    if (!context.state.lists.find(item => item.parent.id === parentId)) {
      let parent = await fetchCategoryById({ parentId })
        .then(resp => {
          return resp.items[0]
        })
        .catch(error => {
          Logger.error("Can't find category: " + parentId, 'icmaaCategoryList', error)()
          return false;
        });

      if (!parent) {
        return
      }

      let list = await fetchChildCategories({ parentId, level: parent.level + crawlDepth })
        .then(resp => resp)
        .catch(error => {
          Logger.error('Error while fetching children of category: ' + parentId, 'icmaaCategoryList', error)()
        });

      context.commit(types.ICMAA_CATEGORY_LIST_ADD_CATEGORY_LIST, { parent, list })

      return { parent, list }
    }
  },
  async loadProductListingWidgetProducts ({ commit, dispatch }, params: { categoryId: number, size: number, sort: string }) {
    const { categoryId, size, sort } = params

    let query = new SearchQuery();
    query = query.applyFilter({ key: 'visibility', value: { in: [2, 3, 4] } }).applyFilter({ key: 'status', value: { in: [0, 1] } }).applyFilter({ key: 'category_ids', value: { in: [categoryId] } })

    const products = await dispatch(
      'product/findProducts',
      {
        query,
        size,
        sort
      },
      { root: true }
    );

    commit(types.ICMAA_CATEGORY_LIST_ADD_PRODUCT, products.items);

    return products.items;
  }
};

export default actions;
