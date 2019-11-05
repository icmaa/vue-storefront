import { ActionTree } from 'vuex';
import RootState from '@vue-storefront/core/types/RootState';
import CategoryState, { CategoryStateListItem, CategoryStateCategory } from '../types/CategoryState';
import * as types from './mutation-types';
import { fetchCategoryById, fetchChildCategories } from '../helpers';
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery';

import { Logger } from '@vue-storefront/core/lib/logger';

const actions: ActionTree<CategoryState, RootState> = {
  async list (context, { parentId, crawlDepth = 1 }): Promise<any> {
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

      let list = await fetchChildCategories({ parentId, level: parent.level + crawlDepth })
        .then(resp => resp)
        .catch(error => {
          Logger.error('Error while fetching children of category: ' + parentId, 'icmaaCategoryList', error)();
        });

      context.commit(types.ICMAA_CATEGORY_LIST_ADD_CATEGORY_LIST, { parent, list });

      return { parent, list };
    }
  },
  async loadProductListingWidgetProducts ({ commit, dispatch }, params: { categoryId: number, size: number, sort: string }) {
    const { categoryId, size, sort } = params;

    let query = new SearchQuery();
    query = query.applyFilter({ key: 'visibility', value: { in: [2, 3, 4] } }).applyFilter({ key: 'status', value: { in: [0, 1] } });

    const products = await dispatch(
      'product/findProducts',
      {
        query,
        size
      },
      { root: true }
    );

    return products;

    // commit(types.ICMAA_CATEGORY_LIST_ADD_CATEGORY_LIST, {});
  }

  /**
   * Search ElasticSearch catalog of products using simple text query
   * Use bodybuilder to build the query, aggregations etc: http://bodybuilder.js.org/
   * @param {Object} query is the object of searchQuery class
   * @param {Int} start start index
   * @param {Int} size page size
   * @return {Promise}
   */
  /* async list ({ dispatch, commit }, { query, start = 0, size = 50, entityType = 'product', sort = '', cacheByKey = 'sku', prefetchGroupProducts = !isServer, updateState = false, meta = {}, excludeFields = null, includeFields = null, configuration = null, append = false, populateRequestCacheTags = true }) {
    const searchResult = await dispatch('findProducts', { query, start, size, entityType, sort, cacheByKey, excludeFields, includeFields, configuration, populateRequestCacheTags })
    await dispatch('preConfigureAssociated', { searchResult, prefetchGroupProducts })

    if (updateState) {
      if (append) commit(types.PRODUCT_ADD_PAGED_PRODUCTS, searchResult)
      else commit(types.PRODUCT_SET_PAGED_PRODUCTS, searchResult)
    }

    EventBus.$emit('product-after-list', { query, start, size, sort, entityType, meta, result: searchResult })

    return searchResult
  },
  preConfigureAssociated (context, { searchResult, prefetchGroupProducts }) {
    const { storeCode, appendStoreCode } = currentStoreView()
    for (let product of searchResult.items) {
      if (product.url_path) {
        const { parentSku, slug } = product

        context.dispatch('url/registerMapping', {
          url: localizedDispatcherRoute(product.url_path, storeCode),
          routeData: {
            params: { parentSku, slug },
            'name': localizedDispatcherRouteName(product.type_id + '-product', storeCode, appendStoreCode)
          }
        }, { root: true })
      }

      if (isGroupedOrBundle(product) && prefetchGroupProducts && !isServer) {
        context.dispatch('setupAssociated', { product })
      }
    }
  },
  async findProducts (context, { query, start = 0, size = 50, entityType = 'product', sort = '', cacheByKey = 'sku', excludeFields = null, includeFields = null, configuration = null, populateRequestCacheTags = true }) {
    const isCacheable = canCache({ includeFields, excludeFields })
    const { excluded, included } = getOptimizedFields({ excludeFields, includeFields })
    const resp = await quickSearchByQuery({ query, start, size, entityType, sort, excludeFields: excluded, includeFields: included })
    const products = await context.dispatch('configureLoadedProducts', { products: resp, isCacheable, cacheByKey, populateRequestCacheTags, configuration })

    return products
  } */
};

export default actions;
