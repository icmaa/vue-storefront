import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import WishlistState from '@vue-storefront/core/modules/wishlist/types/WishlistState'

const getters: GetterTree<WishlistState, RootState> = {
  getWishlistItems: state => state.items
}

export default getters
