import Vue from 'vue'
import VueGtm from 'vue-gtm'

import rootStore from '@vue-storefront/core/store'
import { once } from '@vue-storefront/core/helpers'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { Logger } from '@vue-storefront/core/lib/logger'

import { icmaaGoogleTagManagerModule } from './store'
import { isEnabled } from './helpers'
import { IcmaaGoogleTagManagerExecutors } from './hooks'
import { afterRegistration } from './hooks/afterRegistration'

const initGTM = ({ appConfig }) => {
  const enabled = isEnabled(appConfig.googleTagManager)
  if (enabled) {
    once('__VUE_EXTEND_GTM__', () => {
      const { id, debug } = appConfig.googleTagManager
      Vue.use(VueGtm, { enabled, id, debug })

      rootStore.dispatch('icmaaGoogleTagManager/enable')
      afterRegistration()
      rootStore.dispatch('icmaaGoogleTagManager/init')
    })
  } else {
    Logger.log('Google Tag Manager extensions is not enabled', 'icmaa-gtm')()
  }
}

export const IcmaaGoogleTagManagerModule: StorefrontModule = async ({ store, router, appConfig }) => {
  store.registerModule('icmaaGoogleTagManager', icmaaGoogleTagManagerModule)
  router.afterEach((to, from) => IcmaaGoogleTagManagerExecutors.afterEach({ to, from }))
  initGTM({ appConfig })
}
