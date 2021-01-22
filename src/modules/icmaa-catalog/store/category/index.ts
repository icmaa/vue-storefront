import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'

export const IcmaaExtendedCategoryStore: Module<CategoryState, any> = {
  actions,
  mutations,
  getters
}
