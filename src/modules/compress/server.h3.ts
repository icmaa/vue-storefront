import { serverHooks } from '@vue-storefront/core/server/hooks'
import config from 'config'

if (config.server.compression) {
  console.log('Output compression is enabled')

  const compression = require('compression') // eslint-disable-line @typescript-eslint/no-var-requires
  serverHooks.beforeHttpServerStarted(({ app, isProd }) => {
    if (!isProd) return
    app.use(compression())
  })
}
