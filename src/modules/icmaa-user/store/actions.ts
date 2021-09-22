import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import UserState from '../types/UserState'
import { UserService } from '@vue-storefront/core/data-resolver'
import { UserService as IcmaaUserService } from '../data-resolver/UserService'
import * as userTypes from '@vue-storefront/core/modules/user/store/mutation-types'
import * as types from './mutation-types'
import { UserProfile } from '@vue-storefront/core/modules/user/types/UserProfile'
import { userHooksExecutors } from '@vue-storefront/core/modules/user/hooks'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { SearchQuery } from 'storefront-query-builder'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { entities } from 'config'

import { notifications } from 'icmaa-cart/helpers'

import facebookLoginActions from './actions/facebook-login'
import userSessionActions from './actions/user-session'

const actions: ActionTree<UserState, RootState> = {
  ...facebookLoginActions,
  ...userSessionActions,
  /**
   * Copy of original – changes:
   * * Set `session_started` default to `null` and set it after the authorization is checked.
   *   This way we can use a watcher to check if the session is already authorized and don't need
   *   to relay on the "session-after-started" event and preserve the write-in-one-direction approach of Vuex.
   * * We must uncomment the original dispatch of `startSession` in  `UserModule` to be able to overwrite this action.
   * * Add `session-after-authorized` event to have unique event for each state
   */
  async startSession ({ commit, dispatch, getters }) {
    const usersCollection = StorageManager.get('user')
    const userData = await usersCollection.getItem('current-user')

    if (isServer || getters.isLocalDataLoaded) return
    commit(userTypes.USER_LOCAL_DATA_LOADED, true)

    if (userData) {
      commit(userTypes.USER_INFO_LOADED, userData)
    }

    const lastUserToken = await usersCollection.getItem('current-token')

    if (lastUserToken) {
      commit(userTypes.USER_TOKEN_CHANGED, { newToken: lastUserToken })
      await dispatch('sessionAfterAuthorized', {})

      if (userData) {
        dispatch('setUserGroup', userData)
      }

      EventBus.$emit('session-after-authorized')
    } else {
      EventBus.$emit('session-after-nonauthorized')
    }

    commit(userTypes.USER_START_SESSION)
    EventBus.$emit('session-after-started')
  },
  async startSessionWithToken ({ commit, dispatch }, { token }) {
    if (isServer) {
      return
    }

    await dispatch('cart/clear', { sync: false }, { root: true })
    await dispatch('clearCurrentUser')

    if (token) {
      commit(userTypes.USER_TOKEN_CHANGED, { newToken: token })
      await dispatch('sessionAfterAuthorized', {})
      EventBus.$emit('session-after-authorized')
    } else {
      EventBus.$emit('session-after-nonauthorized')
    }

    commit(userTypes.USER_START_SESSION)
    EventBus.$emit('session-after-started')
  },
  /**
   * Copy of original – changes:
   * * Write updated user-token to store after profile is refreshed to extend JWT lifetime on each pull.
   * * Logout if 500er response is returned from '/me' request.
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
   * * Return response of service request
   */
  async update (_, profile: UserProfile) {
    profile = userHooksExecutors.beforeUserProfileUpdate(profile)
    return UserService.updateProfile(profile, 'user/handleUpdateProfile')
  },
  /**
   * Copy of original – changes:
   * * Add this feature, it's just a place holder in orginal action.
   */
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
  /**
   * Copy of original – changes:
   * * Add `loadProducts` parameter to fetch products off all fetched orders
   * * If after page 1 update existing orders instead of replacing them.
   */
  async refreshOrdersHistory ({ commit, dispatch }, { resolvedFromCache, loadProducts = false, pageSize = 5, currentPage = 1 }) {
    const resp = await UserService.getOrdersHistory(pageSize, currentPage)

    if (resp.code === 200) {
      let orders = resp.result.items

      /** Load orders products to order state item and localstorage */
      if (loadProducts) {
        orders = await dispatch('loadOrderHistoryProducts', { history: orders })
      }

      // this also stores the current user to localForage
      if (currentPage > 1) {
        commit(types.USER_ORDERS_HISTORY_UPD, orders)
      } else {
        commit(userTypes.USER_ORDERS_HISTORY_LOADED, orders)
      }

      EventBus.$emit('user-after-loaded-orders', orders)
    }

    if (!resolvedFromCache) {
      Promise.resolve(resp.code === 200 ? resp : null)
    }

    return resp
  },
  async loadOrderByToken ({ commit, dispatch }, { token }) {
    const resp = await IcmaaUserService.getLastOrder(token)

    if (resp.code === 200) {
      const orders = await dispatch('loadOrderHistoryProducts', { history: [ resp.result ] })

      commit(types.USER_ORDERS_HISTORY_UPD, orders)
      EventBus.$emit('user-after-loaded-orders', orders)
    }

    return resp
  },
  async loadOrderHistoryProducts ({ dispatch }, { history }) {
    const missingOrders = history.filter(order => !order.products || order.products.length === 0)
    const productIds = missingOrders
      .map(o => o.items.map(oi => oi.product_id))
      .reduce((a, b) => a.concat(b), [])

    let query = new SearchQuery()
    query.applyFilter({ key: 'id', value: { 'eq': productIds } })

    const { includeFields, excludeFields } = entities.productList
    const options = {
      separateSelectedVariant: true,
      fallbackToDefaultWhenNoAvailable: false,
      setConfigurableProductOptions: false
    }

    return dispatch('product/findProducts', { query, options, includeFields, excludeFields }, { root: true })
      .then(result => {
        if (!result.items || result.items.length === 0) return history

        const products = result.items
        history.map(order => {
          order.products = products.filter(p => order.items.map(i => i.product_id).includes(p.id))
          return order
        })

        return history
      })
  },
  async loadProductsForOrders ({ dispatch, commit }, history) {
    history = history.filter(o => !o.products)
    const updatedHistory = await dispatch('loadOrderHistoryProducts', { history })
    commit(types.USER_ORDERS_HISTORY_UPD, updatedHistory)
  }
}

export default actions
