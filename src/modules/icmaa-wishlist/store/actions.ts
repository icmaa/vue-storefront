import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import * as types from '@vue-storefront/core/modules/wishlist/store/mutation-types'
import * as customTypes from './mutation-types'
import WishlistState from '../types/WishlistState'
import { WishlistService } from '../data-resolver/WishlistService'
import { SearchQuery } from 'storefront-query-builder'

import pick from 'lodash-es/pick'

const actions: ActionTree<WishlistState, RootState> = {
  async sync ({ state, commit, rootGetters }) {
    if (!rootGetters['user/isLoggedIn']) return

    let wishlist
    if (state.items.length > 0) {
      wishlist = await WishlistService.addWishlistItems(state.items.map(i => i.id))
    } else {
      wishlist = await WishlistService.getWishlist()
    }

    if (wishlist.resultCode !== 200) return

    wishlist.result
      .forEach(product => {
        const { sku, product_id: id } = product
        commit(
          types.WISH_ADD_ITEM,
          { product: { sku, id } }
        )
      })
  },
  async addItem ({ commit, rootGetters }, product) {
    if (rootGetters['user/isLoggedIn']) {
      await WishlistService.addWishlistItems([ product.id ])
    }

    commit(types.WISH_ADD_ITEM, { product: pick(product, ['sku', 'id']) })
    commit(customTypes.WISHLIST_ADD_PRODUCTS, [ product ])
  },
  async removeItem ({ commit, rootGetters }, product) {
    if (rootGetters['user/isLoggedIn']) {
      await WishlistService.removeWishlistItems([ product.id ])
    }

    commit(types.WISH_DEL_ITEM, { product })
    commit(customTypes.WISHLIST_RMV_PRODUCTS, [ product ])
  },
  async clear ({ state, commit, rootGetters }) {
    if (rootGetters['user/isLoggedIn']) {
      const productIds = state.items.map(i => i.id)
      await WishlistService.removeWishlistItems(productIds)
    }

    commit(types.WISH_DEL_ALL_ITEMS, [])
    commit(customTypes.WISHLIST_CLR_PRODUCTS)
  },
  async getProducts ({ state, dispatch, commit }): Promise<void> {
    const availProducts = state.products.map(p => p.sku)
    const productIds = state.items.filter(i => !availProducts.includes(i.sku)).map(i => i.id)

    if (productIds.length === 0) return

    let query = new SearchQuery()
    query.applyFilter({ key: 'id', value: { 'eq': productIds } })

    return dispatch(
      'product/findProducts',
      { query },
      { root: true }
    ).then(result => {
      commit(customTypes.WISHLIST_ADD_PRODUCTS, result.items)
    })
  }
}

export default actions
