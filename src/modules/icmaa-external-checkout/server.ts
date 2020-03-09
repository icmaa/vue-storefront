import { externalCheckout as config } from 'config'
import { serverHooks } from '@vue-storefront/core/server/hooks'

if (config.enableCookieSessionTransfer && config.httpOnlySupport) {
  serverHooks.afterApplicationInitialized(({ app }) => {
    app.get('/vsf/external-checkout-cookie-logout', (req, res) => {
      res.clearCookie('frontend')
      res.json({ status: 200, message: 'Cookies deleted' })
    })

    app.get('/vsf/external-checkout-cookie-test', (req, res) => {
      res.cookie('frontend', Date.now(), { httpOnly: true })
      res.json({ status: 200, message: 'Set cookie' })
    })
  })
}
