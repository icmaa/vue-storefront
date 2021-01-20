import config from 'config'
import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import UserState from '../../types/UserState'

import * as types from '../mutation-types'
import { SearchQuery } from 'storefront-query-builder'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

import { changeFilterQuery } from '@vue-storefront/core/modules/catalog-next/helpers/filterHelpers'
import { router } from '@vue-storefront/core/app'
import { products } from 'config'

import isEmpty from 'lodash-es/isEmpty'
import invert from 'lodash-es/invert'

const actions: ActionTree<UserState, RootState> = {
  setCluster ({ dispatch }, value) {
    // Don't set cluster for `always visible`/`0` as `customercluster` value
    if ((!isEmpty(value) || value === false) && value !== '0' && value !== 0) {
      dispatch('addSessionData', { key: 'cluster', value })
    }
  },
  async loadSessionData ({ commit }) {
    const usersCollection = StorageManager.get('user')
    const userData = await usersCollection.getItem('session-data')
    if (userData) {
      commit(types.USER_SET_SESSION_DATA, userData)
    }
  },
  addSessionData ({ commit }, { key, value }: { key: string, value: any }) {
    commit(types.USER_ADD_SESSION_DATA, { key, value })
  },
  removeSessionData ({ commit }, key: string) {
    commit(types.USER_RMV_SESSION_DATA, key)
  },
  addSessionDataByCategoryFilter ({ dispatch, getters, rootGetters }, filter: { id: any, type: string, label: string }) {
    const { type: key, id: value } = filter
    if (!getters.isSessionFilterAttribute(key)) {
      return
    }

    const currentQuery = router.currentRoute[products.routerFiltersSource]
    const query = changeFilterQuery({ currentQuery, filterVariant: filter })

    if (getters.getSessionData(key) === value &&
      (!query[key] || !query[key].includes(value))
    ) {
      dispatch('removeSessionData', key)
    } else if (query[key] && query[key].includes(value)) {
      dispatch('addSessionData', { key, value })
    }
  },
  removeSessionDataByCategoryFilter ({ dispatch, getters }, key: string) {
    if (getters.isSessionFilterAttribute(key)) {
      dispatch('removeSessionData', key)
    }
  },
  resetSessionDataByCategoryFilter ({ dispatch, getters }) {
    getters.getSessionFilterKeys.forEach(key => dispatch('removeSessionData', key))
  },
  applySessionFilterToSearchQuery ({ getters }, { query, filters = {} }: { query: SearchQuery, filters: any }) {
    getters.getSessionFilters.forEach(({ attributeCode, value }) => {
      if (!filters[attributeCode]) {
        query.applyFilter({ key: attributeCode, value: { orNull: [ value ] } })
      }
    })
  },
  setSessionGenderByCustomerData ({ dispatch, getters }) {
    const customer = getters.getCustomer
    if (customer.gender) {
      const { genderMap, genderProductMap } = config.icmaa.user
      const customerGenderString = invert(genderMap)[customer.gender.toString()]
      const productGenderString = genderProductMap[customerGenderString]
      if (customerGenderString && productGenderString) {
        dispatch('addSessionData', { key: 'gender', value: productGenderString })
      }
    }
  }
}

export default actions
