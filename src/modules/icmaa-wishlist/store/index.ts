import { Module } from 'vuex'
import WishlistState from '@vue-storefront/core/modules/wishlist/types/WishlistState'
import actions from './actions'
import getters from './getters'

export const ExtendedWishlistStore: Module<WishlistState, any> = {
  actions,
  getters
}
