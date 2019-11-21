import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import ProductAlertState from '../types/ProductAlertState'

const getters: GetterTree<ProductAlertState, RootState> = {
  getStockItems: (state): string[] => state.stock,
  getChildProductIdByCurrentProductOption: (state, getters, RootState, rootGetters) =>
    (option: { type: string, id: string }): string|boolean => {
      const confChildren = rootGetters['product/getCurrentProduct'].configurable_children
      const childProduct = confChildren.find(c => c[option.type] === option.id)
      if (childProduct) {
        return childProduct.id
      }
      return false
    }
}

export default getters
