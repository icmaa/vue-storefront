import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import UserState from '../types/UserState'
import { UserService } from '@vue-storefront/core/data-resolver'
import { UserService as IcmaaUserService } from '../data-resolver/UserService'
import * as userTypes from '@vue-storefront/core/modules/user/store/mutation-types'
import { SearchQuery } from 'storefront-query-builder'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import asyncForEach from 'icmaa-config/helpers/asyncForEach'
import { entities } from 'config'

import { notifications } from 'icmaa-cart/helpers'

import facebookLoginActions from './actions/facebook-login'
import userSessionActions from './actions/user-session'

const actions: ActionTree<UserState, RootState> = {
  ...facebookLoginActions,
  ...userSessionActions,
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
  }
}

export default actions
