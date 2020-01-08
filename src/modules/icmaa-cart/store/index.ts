import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import CartState from '@vue-storefront/core/modules/cart/types/CartState'

export const IcmaaExtendedCartStore: Module<CartState, any> = {
  actions,
  getters
}
