import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category'
import CategoryState, { ProductListingWidgetState } from '../types/CategoryState'
import * as types from './mutation-types'
import * as catTypes from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'
import addDefaultProductFilter from 'icmaa-catalog/helpers/defaultProductFilter'
import { fetchChildCategories, sortByLetter } from '../helpers'
import { SearchQuery } from 'storefront-query-builder'

import { getObjectHash } from 'icmaa-config/helpers/hash'

import forEach from 'lodash-es/forEach'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<CategoryState, RootState> = {
  async list ({ state, commit, dispatch, rootGetters }, { id, depth = 1 }): Promise<void> {
    if (!state.lists.find(item => item.category === id)) {
      let category = rootGetters['category-next/getCategoryById'](id)
      if (!category) {
        category = await dispatch('category-next/loadCategory', { filters: { id } }, { root: true })
        if (!category) return
      }

      let level: number[] = []
      if (typeof depth === 'string' && depth.split(',').length > 1) {
        level = depth.split(',').map(i => parseInt(category.level) + parseInt(i))
      } else {
        level.push(parseInt(category.level) + parseInt(depth))
      }

      const includeFields = [ 'name', 'url_path', 'ceCluster' ]
      let items: Category[] | void = await fetchChildCategories({ parentId: id, level, onlyActive: true, includeFields })
        .then(resp => resp.sort(sortByLetter))
        .catch(error => {
          Logger.error('Error while fetching children of category: ' + id, 'icmaaCategoryList', error)()
        })

      commit(`category-next/${catTypes.CATEGORY_ADD_CATEGORIES}`, [ category ], { root: true })
      commit(types.ICMAA_CATEGORY_LIST_ADD_CATEGORY_LIST, { category: category.id, items })
    }
  },
  async loadProductListingWidgetProducts ({ state, commit, dispatch, rootGetters }, params: { categoryId: number, filter: any, size: number, sort: string|string[], reload?: boolean }): Promise<ProductListingWidgetState> {
    let { categoryId, filter, size, sort, reload } = params
    let optionsHash = getObjectHash({ categoryId, filter, sort, size })

    if (!reload && state.productListingWidget.find(i => i.optionsHash === optionsHash)) {
      return
    }

    let query = addDefaultProductFilter(new SearchQuery(), true)
    query.applyFilter({ key: 'category_ids', value: { in: [categoryId] } })

    if (filter !== false) {
      forEach(filter, (value, key) => {
        value = { in: [value] }
        query.applyFilter({ key, value })
      })
    }

    let sortArray: string[] = typeof sort === 'string' ? [sort] : sort

    let cluster = rootGetters['user/getCluster']
    if (cluster) {
      cluster = parseInt(cluster)
      query.applyFilter({ key: 'customercluster', value: { or: [cluster] } })
      query.applyFilter({ key: 'customercluster', value: { or: null } })
      sortArray.push('customercluster:desc')
    }

    dispatch(
      'user/applySessionFilterToSearchQuery',
      { query },
      { root: true }
    )

    sortArray.forEach(sort => {
      const [ field, options ] = sort.split(':')
      query.applySort({ field, options })
    })

    const options = { separateSelectedVariant: rootGetters['category-next/separateSelectedVariantInProductList'] }

    return dispatch('product/findProducts', { query, size, options }, { root: true }).then(products => {
      const payload = { parent: categoryId, list: products.items, optionsHash }
      commit(types.ICMAA_CATEGORY_LIST_ADD_PRODUCT_LIST_WIDGET, payload)
      return payload
    })
  }
}

export default actions
