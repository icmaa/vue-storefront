import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import ProductAlert, { ProductAlertState } from '../types/ProductAlertState'

const getters: GetterTree<ProductAlert, RootState> = {
  getStockItems: (state): string[] => state.stock,
  hasSubscribedToStockItem: (state) => (productId): boolean => state.stock.includes(productId),
  getChildProductIdByCurrentProductOption: (state, getters, RootState, rootGetters) =>
    (option: { type: string, id: string }): string|boolean => {
      const confChildren = rootGetters['product/getCurrentProduct'].configurable_children
      const childProduct = confChildren.find(c => c[option.type] === option.id)
      if (childProduct) {
        return childProduct.id
      }
      return false
    },
  isOptionSubscribedToStock: (state, getters) => (option): boolean => {
    const product = getters.getChildProductIdByCurrentProductOption(option)
    if (!product) {
      return false
    }

    return getters.hasSubscribedToStockItem(product)
  },
  getProducts: (state): ProductAlertState[] => state.product
}

export default getters
