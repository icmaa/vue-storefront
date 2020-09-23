import { Module } from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import CartState from '../types/CartState'

let extendState = { freeCartItems: [] }

export const IcmaaExtendedCartStore: Module<CartState, any> = {
  state: extendState as CartState,
  actions,
  getters,
  mutations
}
