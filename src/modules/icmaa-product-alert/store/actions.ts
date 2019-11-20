import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState';
import ProductAlertState from '../types/ProductAlertState'
import ProductAlertService from '../data-resolver/ProductAlertService'
import * as types from './mutation-types'

const actions: ActionTree<ProductAlertState, RootState> = {
  async addProductStockAlert ({ commit, rootGetters }, productId): Promise<boolean> {
    const addProduct = await ProductAlertService.addProductStockAlert(productId)
    return addProduct
  }
}

export default actions
