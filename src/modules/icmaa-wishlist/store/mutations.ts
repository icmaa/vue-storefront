import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import WishlistState from '../types/WishlistState'
import Product from 'core/modules/catalog/types/Product'

const mutations: MutationTree<WishlistState> = {
  [types.WISHLIST_ADD_PRODUCTS] (state, products: Product[]) {
    const newProducts = products.filter(p => !state.products.map(p => p.sku).includes(p.sku))
    if (newProducts.length > 0) {
      state.products.push(...newProducts)
    }
  },
  [types.WISHLIST_RMV_PRODUCTS] (state, products: Product[]) {
    const rmvProducts = products.map(p => p.sku)
    state.products = state.products.filter(p => !rmvProducts.includes(p.sku))
  },
  [types.WISHLIST_CLR_PRODUCTS] (state, products: Product[]) {
    state.products = []
  }
}

export default mutations
