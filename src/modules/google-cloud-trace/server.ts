import { serverHooks } from '@vue-storefront/core/server/hooks'

serverHooks.afterProcessStarted((config) => {
  let trace = require('@google-cloud/trace-agent')
  if (config.trace && config.trace.enabled) {
    trace.start(config.get('trace.config'))
  }
})
