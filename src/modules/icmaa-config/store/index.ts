import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import ConfigState from '../types/ConfigState'
import getters from './getters'

export const ExtendedConfigStore: Module<ConfigState, RootState> = {
  namespaced: true,
  getters
}
