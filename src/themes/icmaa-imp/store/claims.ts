import Vue from 'vue'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import UniversalStorage from '@vue-storefront/core/lib/store/storage'
import { Logger } from '@vue-storefront/core/lib/logger'

export const claimCollection = (localized = false): UniversalStorage => {
  const claimStorageKey = localized ? 'claims' : 'uniClaims'
  if (!StorageManager.exists(claimStorageKey)) {
    StorageManager.init(claimStorageKey, localized)
  }
  return StorageManager.get(claimStorageKey)
}

export const claimsStore = {
  namespaced: true,
  state: {
    items: {}
  },
  mutations: {
    updateClaim (state, { name, value }) {
      Object.assign(state.items, { [name]: value })
    },
    removeClaim (state, { name }) {
      delete state.items[name]
      Vue.set(state, 'items', state.items)
    }
  },
  actions: {
    set ({ commit }, { claimCode, value, description, localized }) {
      claimCollection(localized).setItem(claimCode, {
        code: claimCode,
        created_at: new Date(),
        value,
        description
      }).then(() => {
        commit('updateClaim', { name: claimCode, value })
      }).catch((reason) => {
        Logger.error(reason)
      })
    },
    unset ({ commit }, { claimCode, localized }) {
      claimCollection(localized).removeItem(claimCode)
        .then(() => {
          commit('removeClaim', { name: claimCode })
        })
        .catch((reason) => {
          Logger.error(reason)
        })
    },
    check ({ getters, commit }, { claimCode, localized }) {
      if (getters.getClaim(claimCode) !== undefined) {
        return getters.getClaim(claimCode)
      }

      return claimCollection(localized).getItem(claimCode)
        .then(claim => {
          commit('updateClaim', { name: claimCode, value: claim })
          return claim
        })
        .catch((reason) => {
          Logger.error(reason)
        })
    }
  },
  getters: {
    getClaim: state => claimCode => {
      if (state.items.hasOwnProperty(claimCode)) {
        return state.items[claimCode]
      }

      return undefined
    }
  }
}
