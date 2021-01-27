import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import CategoryState, { CategoryStateListItem, ProductListingWidgetState } from '../types/CategoryState'
import * as types from './mutation-types'
import * as catTypes from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'
import addDefaultProductFilter from 'icmaa-catalog/helpers/defaultProductFilter'
import { fetchCategoryById, fetchChildCategories } from '../helpers'
import { SearchQuery } from 'storefront-query-builder'
import { getFilterHash } from '../helpers'

import forEach from 'lodash-es/forEach'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<CategoryState, RootState> = {
  async loadParentCategory ({ commit }, { id }): Promise<void|boolean> {
    return fetchCategoryById({ id })
      .then((resp): Category => resp.items[0])
      .then(cat => {
        commit(`category-next/${catTypes.CATEGORY_ADD_CATEGORIES}`, [ cat ], { root: true })
        commit(types.ICMAA_CATEGORY_LIST_ADD_CATEGORY_LIST, { payload: { parent: cat.id, list: [] } })
      })
      .catch(error => {
        Logger.error('Can\'t find category: ' + id, 'icmaaCategoryList', error)()
        return false
      })
  },
  async loadListCategories ({ state, commit, rootGetters }, { parentId, depth = 1, letters }): Promise<void> {
    const letter = letters[0]
    if (!state.lists.find(item => item.parent === parentId && item.list[letter])) {
      const categories: Category[] = rootGetters['category-next/getCategories']
      const parent: Category = categories.find(c => c.id === parentId)

      if (!parent) {
        return
      }

      let level: number[] = []
      if (typeof depth === 'string' && depth.split(',').length > 1) {
        level = depth.split(',').map(i => parseInt(parent.level as any) + parseInt(i))
      } else {
        level.push(parseInt(parent.level as any) + parseInt(depth))
      }

      const includeFields = [ 'name', 'url_path', 'ceCluster' ]
      let list: Category[] | void = await fetchChildCategories({ parentId, level, onlyActive: true, letters, includeFields })
        .then(resp => resp)
        .catch(error => {
          Logger.error('Error while fetching children of category: ' + parentId, 'icmaaCategoryList', error)()
        })

      commit(types.ICMAA_CATEGORY_LIST_ADD_CATEGORY_LIST, { payload: { parent: parent.id, list }, letter })
    }
  },
  async loadProductListingWidgetProducts ({ state, commit, dispatch, rootGetters }, params: { categoryId: number, filter: any, cluster: any, size: number, sort: string|string[] }): Promise<ProductListingWidgetState> {
    let { categoryId, filter, cluster, size, sort } = params

    if (state.productListingWidget.find(i => i.parent === categoryId && i.cluster === cluster && i.list.length >= size)) {
      return
    }

    let query = addDefaultProductFilter(new SearchQuery(), true)
    query.applyFilter({ key: 'category_ids', value: { in: [categoryId] } })

    let filterHash = getFilterHash(filter)
    if (filter !== false) {
      forEach(filter, (value, key) => {
        value = { in: [value] }
        query.applyFilter({ key, value })
      })
    }

    let sortArray: string[] = typeof sort === 'string' ? [sort] : sort

    if (cluster) {
      cluster = parseInt(cluster)
      query.applyFilter({ key: 'customercluster', value: { or: [cluster] } })
      query.applyFilter({ key: 'customercluster', value: { or: null } })
      sortArray.push('customercluster:desc')
    }

    sortArray.forEach(sort => {
      const [ field, options ] = sort.split(':')
      query.applySort({ field, options })
    })

    const options = { separateSelectedVariant: rootGetters['category-next/separateSelectedVariantInProductList'] }

    return dispatch('product/findProducts', { query, size, options }, { root: true }).then(products => {
      const payload = { parent: categoryId, list: products.items, cluster, filterHash }
      commit(types.ICMAA_CATEGORY_LIST_ADD_PRODUCT, payload)
      return payload
    })
  }
}

export default actions
