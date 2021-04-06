import { Module } from 'vuex'
import { wishlistStore } from '@vue-storefront/core/modules/wishlist/store/index'
import WishlistState from '../types/WishlistState'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

import merge from 'lodash-es/merge'

export const ExtendedWishlistStore: Module<WishlistState, any> = {
  actions,
  mutations,
  getters,
  state: merge(wishlistStore.state, {
    products: []
  })
}
