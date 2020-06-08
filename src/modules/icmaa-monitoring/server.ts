import { serverHooks } from '@vue-storefront/core/server/hooks'
import { icmaa_monitoring } from 'config'
import createLogger, { createExceptionLogger } from './lib/winston/logger'

// Enable tracing by datadog
import './lib/datadog/dd-trace'

if (icmaa_monitoring.datadog.enabled === true) {
  // Enable exception-logging for unhandled ssr exceptions
  serverHooks.afterProcessStarted(() => {
    createExceptionLogger()
  })

  // Log handled ssr exeptions using winston
  serverHooks.ssrException(({ err }) => {
    const logger = createLogger()
    logger.log('error', 'SSR Exception', err)
  })
}
