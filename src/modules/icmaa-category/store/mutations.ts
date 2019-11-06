import { MutationTree } from 'vuex';
import * as types from './mutation-types';
import CategoryListState, { ProductListingWidgetState } from '../types/CategoryState';

const mutations: MutationTree<CategoryListState> = {
  [types.ICMAA_CATEGORY_LIST_ADD_CATEGORY_LIST] (state, payload) {
    const item = state.lists.find(item => item.parent.id === payload.parent.id);
    if (!item) {
      state.lists.push(payload);
    }
  },
  [types.ICMAA_CATEGORY_LIST_ADD_PRODUCT] (state, payload: ProductListingWidgetState) {
    if (state.productListingWidget.find(i => i.parent === payload.parent)) {
      return;
    }
    state.productListingWidget.push(payload);
  }
};

export default mutations;
