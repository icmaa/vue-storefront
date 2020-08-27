import Vue from 'vue'
import VueGtm from 'vue-gtm'

import { StorefrontModule } from '@vue-storefront/core/lib/modules'

import { icmaaGoogleTagManagerModule } from './store'
import { isEnabled } from './helpers'
import { IcmaaGoogleTagManagerExecutors } from './hooks'
import { afterRegistration } from './hooks/afterRegistration'

export const disallowList = [ 'product', 'category' ]

export const IcmaaGoogleTagManagerModule: StorefrontModule = async ({ store, router, appConfig }) => {
  store.registerModule('icmaaGoogleTagManager', icmaaGoogleTagManagerModule)
  router.afterEach((to, from) => {
    IcmaaGoogleTagManagerExecutors.afterEach({ to, from })
  })

  const config = appConfig.googleTagManager
  const enabled = isEnabled(config)
  if (!enabled) {
    return
  }

  const { id, debug } = config
  Vue.use(VueGtm, { enabled, id, debug })

  store.dispatch('icmaaGoogleTagManager/enable')
  afterRegistration()
}
