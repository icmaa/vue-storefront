import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import WishlistState from '@vue-storefront/core/modules/wishlist/types/WishlistState'
import * as types from '@vue-storefront/core/modules/wishlist/store/mutation-types'
import { WishlistService } from 'icmaa-wishlist/data-resolver/WishlistService'

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

    commit(
      types.WISH_ADD_ITEM,
      { product: pick(product, ['sku', 'id']) }
    )
  },
  async removeItem ({ commit, rootGetters }, product) {
    if (rootGetters['user/isLoggedIn']) {
      await WishlistService.removeWishlistItems([ product.id ])
    }

    commit(types.WISH_DEL_ITEM, { product })
  },
  async clear ({ state, commit, rootGetters }) {
    if (rootGetters['user/isLoggedIn']) {
      const productIds = state.items.map(i => i.id)
      await WishlistService.removeWishlistItems(productIds)
    }

    commit(types.WISH_DEL_ALL_ITEMS, [])
  }
}

export default actions
