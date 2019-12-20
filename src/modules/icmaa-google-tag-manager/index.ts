import Vue from 'vue'
import VueGtm from 'vue-gtm'

import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { once } from '@vue-storefront/core/helpers'
import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { Logger } from '@vue-storefront/core/lib/logger'

import { icmaaGoogleTagManagerModule } from './store'
import { afterRegistration, isEnabled } from './hooks/afterRegistration'
export const KEY = 'icmaa-google-tag-manager'

const initGTM = async ({ appConfig, router }) => {
  const { id, debug } = appConfig.googleTagManager
  const enabled = await isEnabled(id)
  if (enabled) {
    once('__VUE_EXTEND_GTM__', () => {
      Vue.use(VueGtm, { enabled, id, debug, vueRouter: router })
    })

    router.afterEach((to, from) => {
      const name = to.meta.gtm || to.name
      let dataLayer = (window['dataLayer'] = window['dataLayer'] || [])
      dataLayer.push({
        event: 'icmaa-content-view',
        'content-name': to.fullPath,
        'content-view-name': name
      })
    })
  } else {
    Logger.log('Google Tag Manager extensions is not enabled', 'icmaa-gtm')()
  }
}

export const IcmaaGoogleTagManagerModule: StorefrontModule = async ({store, router, appConfig}) => {
  initGTM({ appConfig, router })
  EventBus.$on('cookiesAccepted', () => {
    initGTM({ appConfig, router })
  })

  store.registerModule(KEY, icmaaGoogleTagManagerModule)
  afterRegistration(appConfig, store)
}
