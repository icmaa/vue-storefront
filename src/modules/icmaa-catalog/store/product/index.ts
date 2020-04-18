import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import ProductState from '@vue-storefront/core/modules/catalog/types/ProductState'

export const IcmaaExtendedProductStore: Module<ProductState, any> = {
  actions,
  mutations
}
