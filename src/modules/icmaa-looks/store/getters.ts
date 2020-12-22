import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import LooksState, { Look } from '../types/LooksState'
import Product from 'core/modules/catalog/types/Product'

const getters: GetterTree<LooksState, RootState> = {
  getLooks: (state): Look[] => state.items,
  getByIdentifier: (state, getters) =>
    (identifier: string): Look|boolean => getters.getLooks.find(c => c.identifier === identifier),
  getExistingProducts: (state) => Object.keys(state.products),
  getProducts: (state) => (skus: string[]): Product[] => {
    return skus
      .map(sku => state.products[sku] || false)
      .filter(p => p !== false) as Product[]
  }
}

export default getters
