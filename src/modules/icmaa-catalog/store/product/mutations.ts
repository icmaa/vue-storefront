import { MutationTree } from 'vuex'
import * as types from '@vue-storefront/core/modules/catalog/store/product/mutation-types'
import ProductState from '@vue-storefront/core/modules/catalog/types/ProductState'

const mutations: MutationTree<ProductState> = {
  [types.PRODUCT_SET_CURRENT_OPTIONS] (state, configuration = {}) {
    state.current_options = Object.assign({}, configuration)
  },
  [types.PRODUCT_SET_CURRENT_CONFIGURATION] (state, configuration = {}) {
    state.current_configuration = Object.assign({}, configuration)
  }
}

export default mutations
