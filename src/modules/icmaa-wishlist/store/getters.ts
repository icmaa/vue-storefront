import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import WishlistState from '../types/WishlistState'

const getters: GetterTree<WishlistState, RootState> = {
  getWishlistItems: state => state.items,
  getWishlistItemsWithProduct: state => {
    return state.items
      .map(i => {
        i.product = state.products.find(p => p.sku === i.sku)
        return i
      })
      .filter(i => !!i.product)
  }
}

export default getters
