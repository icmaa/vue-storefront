import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { extendStore, isServer } from '@vue-storefront/core/helpers'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

import { localizedRoute } from '@vue-storefront/core/lib/multistore'
import { Logger } from '@vue-storefront/core/lib/logger'

import { ExtendedUserStore } from './store'
import * as types from './store/mutation-types'

export const IcmaaExtendedUserModule: StorefrontModule = async function ({ store, router }) {
  extendStore('user', ExtendedUserStore)

  if (!isServer) {
    /**
     * Call this action here to be able to overwrite the original action.
     * The original one inside the user module is uncommented.
     */
    store.dispatch('user/startSession')

    /**
     * This is our router-guard to be able to protect router by login.
     */
    router.beforeEach(async (to, from, next) => {
      if (to.meta.isSecure === true && !store.getters['user/isLoggedIn']) {
        const unwatch = store.watch(
          () => store.state.user.session_started,
          value => {
            const unauthorizedRedirect = localizedRoute({ name: 'home', query: { fwd: 'login', redirect: to.path } })
            const timeout = setTimeout(() => {
              Logger.log('User is not authorized in time, redirect to login.', 'user')()
              next(unauthorizedRedirect)
            }, 2000)

            if (value !== null) {
              unwatch()
              clearTimeout(timeout)

              if (store.getters['user/isLoggedIn'] === true) {
                next()
              } else {
                Logger.log('User is not authorized, redirect to login.', 'user')()
                next(unauthorizedRedirect)
              }
            }
          }
        )
        return
      }

      next()
    })
  }

  store.subscribe((mutation, state) => {
    const type = mutation.type
    if (type.endsWith(types.USER_ADD_SESSION_DATA) || type.endsWith(types.USER_RMV_SESSION_DATA)) {
      StorageManager.get('user')
        .setItem('session-data', state.user.sessionData)
        .catch((reason) => {
          Logger.error('Can\'t save customer to local-storage:', 'user', reason)()
        })
    } else if (type.endsWith(types.USER_ORDERS_HISTORY_UPD)) {
      StorageManager.get('user')
        .setItem('orders-history', state.user.orders_history)
        .catch((reason) => {
          Logger.error('Can\'t fetch customer from local-storage:', 'user', reason)()
        })
    }
  })

  EventBus.$on('session-after-started', async () => {
    if (!store.getters['user/isLoggedIn'] && store.getters['user/getCustomer']) {
      return store.dispatch('user/logout', { silent: true })
    }
  })

  if (!isServer) {
    await store.dispatch('user/loadSessionData')
  }

  EventBus.$on('user-after-loggedin', () => {
    store.dispatch('user/setSessionGenderByCustomerData')
  })
}
