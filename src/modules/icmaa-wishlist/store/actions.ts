import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import WishlistState from '@vue-storefront/core/modules/wishlist/types/WishlistState'
import * as types from '@vue-storefront/core/modules/wishlist/store/mutation-types'
import { WishlistService } from 'icmaa-wishlist/data-resolver/WishlistService'

const actions: ActionTree<WishlistState, RootState> = {
  async addItem ({ commit, rootGetters }, product) {
    if (rootGetters['user/isLoggedIn']) {
      const wishlist = await WishlistService.getWishlist()
      console.error(wishlist)
    }

    commit(types.WISH_ADD_ITEM, { product })
  }
}

export default actions
