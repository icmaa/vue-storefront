import config from 'config'

import Vue from 'vue'
import VueCookies from 'vue-cookies'

import { once } from '@vue-storefront/core/helpers'
import { coreHooks } from '@vue-storefront/core/hooks'
import { userHooks } from '@vue-storefront/core/modules/user/hooks'
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

    coreHooks.afterAppInit(() => {
      Logger.error('All keys: ', 'icmaa-external-checkout', Vue.$cookies.keys())()
      Logger.error('Magento-Session-ID: ', 'icmaa-external-checkout', Vue.$cookies.get('frontend'))()
    })

    userHooks.afterUserUnauthorize(() => {
      Logger.error('Remove Magento session-cookie', 'DEBUG', Vue.$cookies.get('frontend'))()
      Vue.$cookies.remove('frontend')
    })
  }

  router.beforeEach(beforeEachGuard)
  setupMultistoreRoutes(config, router, moduleRoutes, 10)
}
