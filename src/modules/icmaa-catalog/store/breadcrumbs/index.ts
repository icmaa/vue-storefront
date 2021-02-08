import { Module } from 'vuex'

export const IcmaaBreadcrumbsStore: Module<any, any> = {
  state: {
    preserve: false
  },
  mutations: {
    set (state, { routes, current, preserve = true }) {
      state.routes = routes
      state.current = current
      state.preserve = preserve
    }
  },
  getters: {
    isPreserved: (state) => !!state.preserve
  }
}
