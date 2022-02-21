import { serverHooks } from '@vue-storefront/core/server/hooks'
import { assertMethod } from 'h3'

serverHooks.afterApplicationInitialized(({ app }) => {
  const getMiddleware = (text: string) => (req, res) => {
    assertMethod(req, 'GET')
    return text
  }

  app.use('/_ah/warmup', getMiddleware('Warmup request for vue-storefront was successful'))
  app.use('/_ah/keep-alive', getMiddleware('Keep alive for vue-storefront was successful'))
  app.use('/_ah/liveness_check', getMiddleware('Liveness check for vue-storefront was successful'))
  app.use('/_ah/readiness_check', getMiddleware('Readiness check for vue-storefront was successful'))
})
