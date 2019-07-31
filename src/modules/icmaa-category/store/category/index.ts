import { Module } from 'vuex'
import getters from './getters'
import CategoryState from '@vue-storefront/core/modules/catalog-next/store/category/CategoryState'

export const ExtendedCategoryStore: Module<CategoryState, any> = {
  getters
}
