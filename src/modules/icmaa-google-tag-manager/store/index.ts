import { Module } from 'vuex'
import GoogleTagManagerState from '../types/GoogleTagManagerState'

export const icmaaGoogleTagManagerModule: Module<GoogleTagManagerState, any> = {
  namespaced: true,
  state: {
    key: null,
    enabled: false
  },
  mutations: {
    enable (state, payload: boolean) {
      state.enabled = payload
    }
  },
  actions: {
    enable ({ commit }, payload: boolean = true) {
      commit('enable', payload)
    }
  },
  getters: {
    enabled: (state): boolean => state.enabled
  }
}
