import { ActionTree } from 'vuex'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import RootState from '@vue-storefront/core/types/RootState'
import UserState from '../types/UserState'
import { UserProfile } from '@vue-storefront/core/modules/user/types/UserProfile'
import { UserService } from '@vue-storefront/core/data-resolver'
import { UserService as IcmaaUserService } from '../data-resolver/UserService'
import * as types from './mutation-types'
import * as userTypes from '@vue-storefront/core/modules/user/store/mutation-types'
import { SearchQuery } from 'storefront-query-builder'
import { userHooksExecutors } from '@vue-storefront/core/modules/user/hooks'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import asyncForEach from 'icmaa-config/helpers/asyncForEach'

import getApiEndpointUrl from '@vue-storefront/core/helpers/getApiEndpointUrl'
import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import { notifications } from 'icmaa-cart/helpers'

import config, { entities } from 'config'
import fetch from 'isomorphic-fetch'
import isEmpty from 'lodash-es/isEmpty'
import fetchErrorHandler from 'icmaa-config/helpers/fetchResponseHandler'

const actions: ActionTree<UserState, RootState> = {
  async startSessionWithToken ({ commit, dispatch }, { token }) {
    if (isServer) {
      return
    }

    await dispatch('cart/clear', { sync: false }, { root: true })
    await dispatch('clearCurrentUser')

    commit(userTypes.USER_START_SESSION)

    if (token) {
      commit(userTypes.USER_TOKEN_CHANGED, { newToken: token })
      await dispatch('sessionAfterAuthorized', {})
    } else {
      EventBus.$emit('session-after-nonauthorized')
    }

    EventBus.$emit('session-after-started')
  },
  /**
   * Copy of original – changes:
   * * Write updated user-token to store after profile is refreshed to extend JWT lifetime on each pull.
   * * Logout if 500er response is returned from '/me' request.
   *
   * @param any param0
   * @param any param1
   */
  async refreshUserProfile ({ commit, dispatch }, { resolvedFromCache }) {
    const resp = await UserService.getProfile(true)

    if (resp.resultCode === 200) {
      commit(userTypes.USER_INFO_LOADED, resp.result) // this also stores the current user to localForage
      await dispatch('setUserGroup', resp.result)

      if (resp.result.token) {
        Logger.log('User token was updated.', 'user', resp.result.token)()
        commit(userTypes.USER_TOKEN_CHANGED, { newToken: resp.result.token })
      }

      if (!resolvedFromCache) {
        EventBus.$emit('user-after-loggedin', resp.result)
        await dispatch('cart/authorize', {}, { root: true })
        return resp
      }
    } else {
      if (!notifications.isKnownError(resp.result)) {
        Logger.error('Error while refreshing user:', 'user', resp.result)()
      }

      await dispatch('logout', { silent: true })
    }
  },
  /**
   * Copy of original – changes:
   * * The original method now uses the `queue` (instead `execute`) to update the profile.
   *   This leads to the problem that we can't trigger the user interaction as we want using a promise chain.
   *   I rebuild the `UserService.updateProfile` method using `execute` to make it work again.
   */
  async update ({ dispatch }, profile: UserProfile): Promise<Task> {
    return TaskQueue.execute({
      url: processLocalizedURLAddress(getApiEndpointUrl(config.users, 'me_endpoint')),
      payload: {
        method: 'POST',
        body: JSON.stringify(profile)
      }
    }).then(resp => {
      if (resp.resultCode === 200) {
        dispatch('user/setCurrentUser', resp.result, { root: true })
      } else {
        Logger.error('Error while updating user:', 'user', resp)()
        throw new Error('Error while saving customer data')
      }
      return resp
    })
  },
  async changePassword ({ dispatch, getters }, passwordData): Promise<Task> {
    return UserService.changePassword(passwordData)
      .then(async resp => {
        if (resp.code === 200) {
          await dispatch('login', {
            username: getters.getUserEmail,
            password: passwordData.newPassword
          })
        }
        return resp
      })
  },
  async refreshOrdersHistory ({ commit, dispatch }, { resolvedFromCache, pageSize = 20, currentPage = 1 }) {
    const resp = await UserService.getOrdersHistory(pageSize, currentPage)

    if (resp.code === 200) {
      /** Load orders products to order state item and localstorage */
      await asyncForEach(resp.result.items, async (order, index) => {
        resp.result.items[index] = await dispatch('loadOrderProducts', { order, history: resp.result.items })
      })

      commit(userTypes.USER_ORDERS_HISTORY_LOADED, resp.result) // this also stores the current user to localForage
      EventBus.$emit('user-after-loaded-orders', resp.result)
    }

    if (!resolvedFromCache) {
      Promise.resolve(resp.code === 200 ? resp : null)
    }

    return resp
  },
  async loadLastOrderToHistory ({ commit, dispatch }, { token }) {
    const resp = await IcmaaUserService.getLastOrder(token)

    if (resp.code === 200) {
      const order = await dispatch('loadOrderProducts', { order: resp.result, history: [ resp.result ] })

      commit(userTypes.USER_ORDERS_HISTORY_LOADED, { items: [ order ] })
      EventBus.$emit('user-after-loaded-orders', resp.result)
    }

    return resp
  },
  async loadLastOrderFromCache ({ dispatch }) {
    let resolvedFromCache = false
    const ordersHistory = await dispatch('loadOrdersFromCache')
    if (ordersHistory) {
      Logger.log('Current user order history served from cache', 'user')()
      resolvedFromCache = true
    }

    if (!resolvedFromCache) {
      Promise.resolve(null)
    }
  },
  async loadOrderProducts ({ dispatch }, { order, history }) {
    const index = history.findIndex(o => o.id === order.id)
    if (history[index] && history[index].products) {
      return history[index]
    }

    let query = new SearchQuery()
    query.applyFilter({ key: 'id', value: { 'eq': order.items.map(oi => oi.product_id) } })

    let { includeFields, excludeFields } = entities.productList
    excludeFields = excludeFields.filter(f => f !== 'configurable_options')
    includeFields.push('configurable_options.*')

    return dispatch('product/findProducts', { query, includeFields, excludeFields }, { root: true })
      .then(products => {
        history[index].products = products.items
        return history[index]
      })
  },
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
  },
  async facebookLogin ({ commit, dispatch }, params: { accessToken: string, version: string}) {
    const { endpoint } = config.icmaa_facebook
    const { accessToken, version } = params
    const apiUrl = processLocalizedURLAddress(endpoint + '/login')
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({ 'access_token': accessToken, version }),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      mode: 'cors' as RequestMode
    }

    const resp = await fetch(apiUrl, fetchOptions)
      .then(fetchErrorHandler)
      .then(r => r.json())
      .catch(e => { throw new Error(e.response.result) })

    userHooksExecutors.afterUserAuthorize(resp)

    if (resp.code === 200) {
      try {
        await dispatch('resetUserInvalidateLock', {}, { root: true })
        commit(userTypes.USER_TOKEN_CHANGED, { newToken: resp.result }) // TODO: handle the "Refresh-token" header
        await dispatch('sessionAfterAuthorized', { refresh: true, useCache: false })
      } catch (err) {
        await dispatch('clearCurrentUser')
        throw new Error(err)
      }
    }
  }
}

export default actions
