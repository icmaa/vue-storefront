import { Module } from 'vuex'
import WishlistState from '@vue-storefront/core/modules/wishlist/types/WishlistState'
import actions from './actions'

export const ExtendedWishlistStore: Module<WishlistState, any> = {
  actions
}
