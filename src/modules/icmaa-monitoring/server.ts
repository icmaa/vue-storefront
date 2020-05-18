import { serverHooks } from '@vue-storefront/core/server/hooks'

// Enable tracing by datadog
import './lib/datadog/dd-trace'

serverHooks.afterApplicationInitialized(({ app }) => {
  app.get('/health', async (req, res) => {
    // @todo: Add check for different services and counted exceptions
    // * Save SSR exceptions into Redis and check them here
    res.status(200)
      .send('success')
  })
})
