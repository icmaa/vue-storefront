import { serverHooks } from '@vue-storefront/core/server/hooks'
import config, { icmaa_monitoring } from 'config'
import createLogger, { createExceptionLogger } from './lib/winston/logger'

if (icmaa_monitoring.datadog.enabled === true) {
  // Enable datadog tracer
  const tracer = require('dd-trace')
  tracer.init({
    service: 'vue-storefront',
    env: config.icmaa.mandant + '-' + config.icmaa.environment,
    clientToken: process.env.DD_CLIENT_TOKEN || config.icmaa_monitoring.datadog.clientToken,
    analytics: true,
    logInjection: true,
    runtimeMetrics: true,
    reportHostname: true,
    tags: {
      env: config.icmaa.environment,
      mandant: config.icmaa.mandant,
      application_name: 'vue-storefront',
      vsf: true
    }
  })

  // Include this after feedback of DD support
  tracer.use('express', {
    analytics: true,
    enabled: true
  })

  // Enable exception-logging for unhandled ssr exceptions
  serverHooks.afterProcessStarted(() => {
    createExceptionLogger()
  })

  // Log handled ssr exeptions using winston
  serverHooks.ssrException(({ err, req }) => {
    let payload = {
      path: req.url,
      payload: err.message + '\n' + err.stack
    }

    const logger = createLogger()
    logger.log('error', 'SSR Exception: ' + err.message, payload)
  })
}
