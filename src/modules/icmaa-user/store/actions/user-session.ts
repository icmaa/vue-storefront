import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import UserState from '../../types/UserState'

import * as types from '../mutation-types'
import { SearchQuery } from 'storefront-query-builder'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

import isEmpty from 'lodash-es/isEmpty'

const actions: ActionTree<UserState, RootState> = {
  setCluster ({ commit }, value) {
    // Don't set cluster for `always visible`/`0` as `customercluster` value
    if ((!isEmpty(value) || value === false) && value !== '0' && value !== 0) {
      commit(types.USER_ADD_SESSION_DATA, { key: 'cluster', value })
    }
  },
  setGender ({ commit }, value) {
    commit(types.USER_ADD_SESSION_DATA, { key: 'gender', value: value })
  },
  unsetGender ({ commit }) {
    commit(types.USER_RMV_SESSION_DATA, 'gender')
  },
  async loadSessionData ({ commit }) {
    const usersCollection = StorageManager.get('user')
    const userData = await usersCollection.getItem('session-data')
    if (userData) {
      commit(types.USER_SET_SESSION_DATA, userData)
    }
  },
  applySessionFilterToSearchQuery ({ getters }, { query, filters = {} }: { query: SearchQuery, filters: any }) {
    getters.getSessionFilters.forEach(({ attributeCode, value }) => {
      if (!filters[attributeCode]) {
        query
          .applyFilter({ key: attributeCode, value: { or: value } })
          .applyFilter({ key: attributeCode, value: { or: null } })
      }
    })
  }
}

export default actions
