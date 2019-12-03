import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState';
import ProductAlertState from '../types/ProductAlertState'
import ProductAlertService from '../data-resolver/ProductAlertService'
import * as types from './mutation-types'
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'

const actions: ActionTree<ProductAlertState, RootState> = {
  async addProductStockAlert ({ commit, rootGetters }, productId): Promise<boolean> {
    const addProduct = await ProductAlertService.addProductStockAlert(productId)
    if (addProduct) {
      commit(types.ICMAA_PRODUCT_ALERT_ADD_PRODUCT, productId)
    }

    return addProduct
  },
  async fetchProductStockAlerts ({ commit, rootGetters }): Promise<string[]> {
    const productIds = await ProductAlertService.listProductStockAlerts()
    if (productIds) {
      commit(types.ICMAA_PRODUCT_ALERT_SET_PRODUCTS, productIds)
    }

    return productIds as string[] || []
  },
  async removeProductStockAlert ({ commit, rootGetters }, productId): Promise<boolean> {
    const product = await ProductAlertService.removeProductStockAlert(productId)
    if (product) {
      commit(types.ICMAA_PRODUCT_ALERT_RMV_PRODUCT, productId)
    }

    return product
  },
  clearProductStockAlerts ({ commit }): void {
    commit(types.ICMAA_PRODUCT_ALERT_CLR_PRODUCT)
  },
  async fetchProductsByProductId ({ state, commit, dispatch }, params: { productId: number[] }): Promise<ProductAlertState> {
    let { productId } = params

    let query = new SearchQuery()
    query.applyFilter({key: 'configurable_children.id', value: { in: productId }})

    return dispatch('product/findProducts', { query }, { root: true }).then(products => {
      const payload = { childId: productId, product: products.items }
      commit(types.ICMAA_PRODUCT_ALERT_SET_PRODUCTS_DATA, payload)
      return products
    })
  },
  async removeProductByProductId ({ commit, rootGetters }, productId): Promise<number> {
    commit(types.ICMAA_PRODUCT_ALERT_RMV_PRODUCTS_DATA, productId)
    return productId
  }
}

export default actions
