import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import ProductState from '@vue-storefront/core/modules/catalog/types/ProductState'

const getters: GetterTree<ProductState, RootState> = {
  getCurrentBundleOptions: state => state.current_bundle_options,
  isCurrentBundleOptionsSelection: (state, getters) => {
    const product = getters.getCurrentProduct
    const currentBundleOptions = Object.values(getters.getCurrentBundleOptions)
    return product.bundle_options && currentBundleOptions.length === product.bundle_options.length
  }
}

export default getters
