import Vue from 'vue'
import VueGtm from 'vue-gtm'

import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { coreHooks } from '@vue-storefront/core/hooks'

import { icmaaGoogleTagManagerModule } from './store'
import { IcmaaGoogleTagManagerExecutors } from './hooks'
import { isEnabled } from './helpers'
import { afterRegistration } from './hooks/afterRegistration'

import { isServer } from '@vue-storefront/core/helpers'

export const disallowList = [ 'product', 'category', 'search', 'checkout', 'page-not-found' ]

export const IcmaaGoogleTagManagerModule: StorefrontModule = function ({ store, router, appConfig }) {
  store.registerModule('icmaaGoogleTagManager', icmaaGoogleTagManagerModule)
  router.afterEach((to, from) => {
    IcmaaGoogleTagManagerExecutors.afterEach({ to, from })
  })

  StorageManager.init('icmaa-gtm')

  coreHooks.afterAppInit(() => {
    const config = appConfig.googleTagManager
    const { id, debug, forceCookieAccept } = config
    const enabled = isEnabled(id)

    if (!enabled) {
      return
    }

    const initGTM = () => {
      store.dispatch('icmaaGoogleTagManager/enable')
      if (!isServer) {
        Vue.use(VueGtm, { enabled, id, debug })
        afterRegistration()
      }
    }

    initGTM()
  })
}
