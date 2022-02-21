import { serverHooks } from '@vue-storefront/core/server/hooks'
import config from 'config'
import { App } from 'h3'

if (config.server.compression) {
  const compression = require('compression') // eslint-disable-line @typescript-eslint/no-var-requires
  serverHooks.afterApplicationInitialized(({ app, isProd }) => {
    if (isProd) {
      console.log('Output Compression is enabled')

      app = (app as App)
      app.use(compression({ enabled: isProd }))
    }
  })
}
