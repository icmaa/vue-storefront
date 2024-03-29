import { Module } from 'vuex'
import { isServer } from '@vue-storefront/core/helpers'
import store from '@vue-storefront/core/store'
import RootState from '@vue-storefront/core/types/RootState'
import kebabCase from 'lodash-es/kebabCase'

export interface UserCentricsState {
  isInit: boolean,
  services: Record<string, boolean>
}

export const userCentricsStore: Module<UserCentricsState, RootState> = {
  namespaced: true,
  state: {
    isInit: false,
    services: {}
  },
  actions: {
    init ({ commit }) {
      window.addEventListener('UC_UI_INITIALIZED', (e) => {
        commit('init')

        const UC = (window as any).UC_UI
        commit('setServices', UC.getServicesBaseInfo())
      })

      window.addEventListener('UC_UI_CMP_EVENT', (e) => {
        const UC = (window as any)?.UC_UI
        if (!UC?.isInitialized()) {
          commit('init', false)
          commit('setServices', [])
          return
        }

        commit('setServices', UC.getServicesBaseInfo())
      })
    },
    showMarketingLayer ({ getters }) {
      if (getters.isInitialized) {
        const UC = (window as any)?.UC_UI
        UC.showSecondLayer()
      }
    }
  },
  mutations: {
    init (state, status = true) {
      state.isInit = status
    },
    setServices (state, services) {
      state.services = Object.fromEntries(services.map(s => ([ kebabCase(s.name), s.consent.status ])))
    }
  },
  getters: {
    isInitialized: state => state.isInit,
    isServiceAllowed: (state, getters) => (service: string) => getters.isInitialized && (state.services[service] || false),
    getServices: state => state.services
  }
}

export function registerUserCentricsStore () {
  store.registerModule('userCentrics', userCentricsStore)
  if (!isServer) {
    store.dispatch('userCentrics/init', null, { root: true })
  }
}
