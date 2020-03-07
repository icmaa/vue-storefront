import config from 'config'

import Vue from 'vue'
import VueCookies from 'vue-cookies'

import { once } from '@vue-storefront/core/helpers'
import { coreHooks } from '@vue-storefront/core/hooks'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'

import { beforeEachGuard } from './router/beforeEach'
import moduleRoutes from './routes'

export const KEY = 'external-checkout'

export const IcmaaExternalCheckoutModule: StorefrontModule = function ({ router }) {
  if (!isServer) {
    once('__VUE_EXTEND_COOKIES__', () => {
      Vue.use(VueCookies)
    })

    coreHooks.afterAppInit(async () => {
      Logger.error('All keys: ', 'icmaa-external-checkout', Vue.$cookies.keys())()
    })
  }

  router.beforeEach(beforeEachGuard)
  setupMultistoreRoutes(config, router, moduleRoutes, 10)
}
