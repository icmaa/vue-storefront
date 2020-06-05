import { Module } from 'vuex'
import actions from './actions'
import getters from './getters'
import ProductState from '@vue-storefront/core/modules/catalog/types/ProductState'

export const IcmaaExtendedProductStore: Module<ProductState, any> = {
  actions,
  getters
}
