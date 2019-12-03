import { MutationTree } from 'vuex'
import ProductAlert, { ProductAlertState } from '../types/ProductAlertState'
import * as types from './mutation-types'
import remove from 'lodash-es/remove'

const mutations: MutationTree<ProductAlert> = {
  [types.ICMAA_PRODUCT_ALERT_SET_PRODUCTS] (state, productIds: string[]) {
    state.stock = productIds || []
  },
  [types.ICMAA_PRODUCT_ALERT_ADD_PRODUCT] (state, productId) {
    state.stock.push(productId)
  },
  [types.ICMAA_PRODUCT_ALERT_RMV_PRODUCT] (state, productId) {
    state.stock = remove(state.stock, id => productId === id)
  },
  [types.ICMAA_PRODUCT_ALERT_CLR_PRODUCT] (state) {
    state.stock = []
  },
  [types.ICMAA_PRODUCT_ALERT_SET_PRODUCTS_DATA] (state, payload: ProductAlertState) {
    if (!state.product.find(el => el.childId === payload.childId)) {
      state.product.push(payload)
    }
  },
  [types.ICMAA_PRODUCT_ALERT_RMV_PRODUCTS_DATA] (state, productId: number) {
    state.product = state.product.filter(el => el.childId !== productId)
  }
}

export default mutations
