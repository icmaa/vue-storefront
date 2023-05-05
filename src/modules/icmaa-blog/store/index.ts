import { Module } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import BlogState from '../types/BlogState'
import RootState from '@vue-storefront/core/types/RootState'

export const stateKey = 'icmaaBlog'
export const storageKey = 'blog'

export const BlogStore: Module<BlogState, RootState> = {
  namespaced: true,
  state: {
    items: []
  },
  getters,
  actions,
  mutations
}
