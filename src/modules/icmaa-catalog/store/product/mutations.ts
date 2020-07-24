import { MutationTree } from 'vuex'
import * as types from '@vue-storefront/core/modules/catalog/store/product/mutation-types'
import ProductState from '@vue-storefront/core/modules/catalog/types/ProductState'

const mutations: MutationTree<ProductState> = {
  /**
   * Add some basic product placeholders to prevent `of undefined` errors
   */
  [types.PRODUCT_RESET_CURRENT] (state, originalProduct) {
    const productDefaults = {
      name: '',
      description: '',
      stock: {
        is_in_stock: false,
        qty: false
      }
    }

    state.current = Object.assign(productDefaults, originalProduct)
    state.current_configuration = {}
    state.offlineImage = null
    state.parent = null
    state.current_options = { color: [], size: [] }
    state.current_bundle_options = {}
    state.current_custom_options = {}
  }
}

export default mutations
