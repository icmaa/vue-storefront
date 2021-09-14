import Vue from 'vue'
import VueCookies from 'vue-cookies'

import config, { externalCheckout as checkoutConfig } from 'config'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { once } from '@vue-storefront/core/helpers'
import { userHooks } from '@vue-storefront/core/modules/user/hooks'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'

import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore'

import { getCookieHostname } from './helper'
import { beforeEachGuard } from './router/beforeEach'
import fetchErrorHandler from 'icmaa-config/helpers/fetchResponseHandler'
import moduleRoutes from './routes'

export const KEY = 'external-checkout'

export const IcmaaExternalCheckoutModule: StorefrontModule = function ({ router, store }) {
  if (!isServer && checkoutConfig.enableCookieSessionTransfer) {
    once('__VUE_EXTEND_COOKIES__', () => {
      Vue.use(VueCookies)
    })

    const getCookies = (): { customerToken: string, lastOrderToken: string } => {
      return {
        customerToken: Vue.$cookies.get('vsf_token_customer'),
        lastOrderToken: Vue.$cookies.get('vsf_token_lastorder')
      }
    }

    EventBus.$on('session-after-started', async () => {
      const { customerToken, lastOrderToken } = getCookies()

      if (store.getters['user/isLoggedIn'] && (customerToken || lastOrderToken)) {
        Vue.$cookies.remove('vsf_token_customer', undefined, getCookieHostname())
        Vue.$cookies.remove('vsf_token_lastorder', undefined, getCookieHostname())
      }
    })

    EventBus.$on('session-after-authorized', async () => {
      /**
       * @todo Don't load all orders and its products here – maybe just last N
       */
      await store.dispatch('user/refreshOrdersHistory', { resolvedFromCache: false })
      EventBus.$emit('icmaa-external-checkout-user-data-complete')
    })

    EventBus.$on('session-after-nonauthorized', async () => {
      const { customerToken, lastOrderToken } = getCookies()

      if (!store.getters['user/isLoggedIn'] && (customerToken || lastOrderToken)) {
        if (customerToken) {
          Logger.info('Customer token found in cookie – try to login:', 'external-checkout', customerToken)()
          store.dispatch('user/startSessionWithToken', { token: customerToken }).then(() => {
            Vue.$cookies.remove('vsf_token_customer', undefined, getCookieHostname())
            Vue.$cookies.remove('vsf_token_lastorder', undefined, getCookieHostname())
          })
        } else {
          if (lastOrderToken) {
            Logger.info('Last-order token found in cookie – try to load last order:', 'external-checkout', lastOrderToken)()
            store.dispatch('user/loadOrderByToken', { token: lastOrderToken }).then(() => {
              Vue.$cookies.remove('vsf_token_lastorder', undefined, getCookieHostname())
              EventBus.$emit('icmaa-external-checkout-user-data-complete')
            })
          }
        }
      } else if (!store.getters['user/isLoggedIn']) {
        await store.dispatch('user/loadOrdersFromCache')
        EventBus.$emit('icmaa-external-checkout-user-data-complete')
      }
    })

    userHooks.afterUserUnauthorize(async () => {
      if (checkoutConfig.httpOnlySupport) {
        /**
         * As Magento sets HTTP-Only cookies to prevent XSS attacks,
         * it is only possible to delete the session cookie using a non-client-/SSR-request.
         * So there is a special route for it to call using a server-side request.
         * The `{ credentials: 'include' }` is an important part to transfer cookies to SSR.
         *
         * It's also important to use an url without trailing slash in production to prevent
         * an exception like: `TypeError: Failed to fetch`. This sure also could be configured server-side.
         */
        await fetch('/vsf/external-checkout-cookie-logout', { credentials: 'include' })
          .then(fetchErrorHandler)
          .then(r => r.json())
          .catch(e => {
            Logger.error('Error while trying to delete Magento session-cookie:', 'external-checkout', e)()
          })
          .then(json => {
            Logger.info('Remove Magento session-cookie', 'external-checkout', json)()
          })
      } else {
        // If Magento isn't using HTTP-Only cookies, just use `vue-cookies` to remove the session cookies.
        Logger.info('Remove Magento session-cookie', 'external-checkout', Vue.$cookies.get('frontend'))()
        Vue.$cookies.remove('frontend')
      }

      Vue.$cookies.remove('vsf_token_customer', undefined, getCookieHostname())
      Vue.$cookies.remove('vsf_token_lastorder', undefined, getCookieHostname())
      Vue.$cookies.remove('vsf_token_recentorder', undefined, getCookieHostname())
    })
  }

  router.beforeEach(beforeEachGuard)
  setupMultistoreRoutes(config, router, moduleRoutes, 10)
}
