import { Module } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import RootState from '@vue-storefront/core/types/RootState'
import SearchState from '../../types/SearchState'

export const stateKey = 'icmaaSearch'
export const storageKey = 'search'

export const SearchStore: Module<SearchState, RootState> = {
  namespaced: true,
  state: {
    currentTerm: ''
  },
  getters,
  actions,
  mutations
}
