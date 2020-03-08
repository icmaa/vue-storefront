import Vue from 'vue'

import config, { externalCheckout as checkoutConfig } from 'config'
import { once } from '@vue-storefront/core/helpers'
import { userHooks } from '@vue-storefront/core/modules/user/hooks'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'

import { beforeEachGuard } from './router/beforeEach'
import moduleRoutes from './routes'

export const KEY = 'external-checkout'

export const IcmaaExternalCheckoutModule: StorefrontModule = function ({ router }) {
  if (!isServer && checkoutConfig.clearCookieOnLogout) {
    userHooks.afterUserUnauthorize(async () => {
      if (checkoutConfig.httpOnlySupport) {
        // As Magento sets HTTP-Only cookies to prevent XSS attacks,
        // it is only possible to delete the session cookie using a non-client-/SSR-request.
        // So there is a special route for it to call using a server-side request.
        // The `{ credentials: 'include' }` is an important part to transfer cookies to SSR.
        await fetch('/vsf/external-checkout-cookie-logout/', { credentials: 'include' })
          .then(r => r.json())
          .then(json => {
            Logger.info('Remove Magento session-cookie', 'external-checkout', json)()
          })
      } else {
        // If Magento isn't using HTTP-Only cookies, just use `vue-cookies` to remove the session cookies.
        const VueCookies = await import('vue-cookies')
        once('__VUE_EXTEND_COOKIES__', () => {
          Vue.use(VueCookies)
        })

        Logger.info('Remove Magento session-cookie', 'external-checkout', Vue.$cookies.get('frontend'))()
        Vue.$cookies.remove('frontend')
      }
    })
  }

  router.beforeEach(beforeEachGuard)
  setupMultistoreRoutes(config, router, moduleRoutes, 10)
}
