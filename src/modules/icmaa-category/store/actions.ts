import { ActionTree } from 'vuex';
import RootState from '@vue-storefront/core/types/RootState';
import CategoryState, { CategoryStateListItem, CategoryStateCategory, ProductListingWidgetState } from '../types/CategoryState';
import * as types from './mutation-types';
import { fetchCategoryById, fetchChildCategories } from '../helpers';
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery';

import { Logger } from '@vue-storefront/core/lib/logger';

const actions: ActionTree<CategoryState, RootState> = {
  async list (context, { parentId, crawlDepth = 1 }): Promise<CategoryStateListItem> {
    if (!context.state.lists.find(item => item.parent.id === parentId)) {
      let parent = await fetchCategoryById({ parentId })
        .then(resp => {
          return resp.items[0];
        })
        .catch(error => {
          Logger.error("Can't find category: " + parentId, 'icmaaCategoryList', error)();
          return false;
        });

      if (!parent) {
        return;
      }

      let list: CategoryStateCategory[] | void = await fetchChildCategories({ parentId, level: parent.level + crawlDepth })
        .then(resp => resp)
        .catch(error => {
          Logger.error('Error while fetching children of category: ' + parentId, 'icmaaCategoryList', error)();
        });

      context.commit(types.ICMAA_CATEGORY_LIST_ADD_CATEGORY_LIST, { parent, list });

      return { parent, list: list as CategoryStateCategory[] };
    }
  },
  async loadProductListingWidgetProducts ({ state, commit, dispatch }, params: { categoryId: number, size: number, sort: string }): Promise<ProductListingWidgetState> {
    const { categoryId, size, sort } = params;

    if (state.productListingWidget.find(i => i.parent === categoryId)) {
      return;
    }

    let query = new SearchQuery();
    query = query
      .applyFilter({ key: 'visibility', value: { in: [2, 3, 4] } })
      .applyFilter({ key: 'status', value: { in: [0, 1] } })
      .applyFilter({ key: 'category_ids', value: { in: [categoryId] } });

    return dispatch('product/findProducts', { query, size, sort }, { root: true }).then(products => {
      const payload = { parent: categoryId, list: products.items };
      commit(types.ICMAA_CATEGORY_LIST_ADD_PRODUCT, payload);
      return payload;
    });
  }
};

export default actions;
