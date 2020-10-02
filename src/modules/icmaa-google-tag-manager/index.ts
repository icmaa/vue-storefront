import Vue from 'vue'
import VueGtm from 'vue-gtm'

import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { coreHooks } from '@vue-storefront/core/hooks'

import { icmaaGoogleTagManagerModule } from './store'
import { IcmaaGoogleTagManagerExecutors } from './hooks'
import { isEnabled, isAccepted } from './helpers'
import { afterRegistration } from './hooks/afterRegistration'

import { isServer } from '@vue-storefront/core/helpers'

export const disallowList = [ 'product', 'category', 'search' ]

export const IcmaaGoogleTagManagerModule: StorefrontModule = function ({ store, router, appConfig }) {
  store.registerModule('icmaaGoogleTagManager', icmaaGoogleTagManagerModule)
  router.afterEach((to, from) => {
    IcmaaGoogleTagManagerExecutors.afterEach({ to, from })
  })

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

    if (forceCookieAccept) {
      isAccepted(forceCookieAccept).then(accepted => {
        if (accepted) {
          initGTM()
        } else {
          EventBus.$on('cookiesAccepted', async (enabled: boolean) => {
            if (enabled) {
              initGTM()
            }
          })
        }
      })
    } else {
      initGTM()
    }
  })
}
