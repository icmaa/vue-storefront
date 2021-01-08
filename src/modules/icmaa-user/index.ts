import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { extendStore } from '@vue-storefront/core/helpers'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { isServer } from '@vue-storefront/core/helpers'

import { ExtendedUserStore } from './store'
import * as types from './store/mutation-types'

export const IcmaaExtendedUserModule: StorefrontModule = async function ({ store }) {
  extendStore('user', ExtendedUserStore)

  store.subscribe((mutation, state) => {
    if (mutation.type.endsWith(types.USER_ADD_SESSION_DATA) || mutation.type.endsWith(types.USER_RMV_SESSION_DATA)) {
      StorageManager.get('user').setItem('session-data', state.user.sessionData)
        .catch((reason) => { console.error(reason) })
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
}
