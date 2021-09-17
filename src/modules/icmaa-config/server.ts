import { serverHooks } from '@vue-storefront/core/server/hooks'

serverHooks.afterApplicationInitialized(({ app }) => {
  app.get('/_ah/warmup', (req, res) => res.send('Warmup request for vue-storefront was successful'))
  app.get('/_ah/keep-alive', (req, res) => res.send('Keep alive for vue-storefront was successful'))
  app.get('/_ah/liveness_check', (req, res) => res.send('Liveness check for vue-storefront was successful'))
  app.get('/_ah/readiness_check', (req, res) => res.send('Readiness check for vue-storefront was successful'))
})
