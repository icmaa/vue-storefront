import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import CategoryState from 'icmaa-catalog/types/CategoryState'
import { categoryModule as CategoryStore } from '@vue-storefront/core/modules/catalog-next/store/category'
import merge from 'lodash-es/merge'

export const IcmaaExtendedCategoryStore: Module<CategoryState, any> = {
  state: merge(CategoryStore.state, {
    isGenericSubcategory: false
  }),
  actions,
  mutations,
  getters
}
