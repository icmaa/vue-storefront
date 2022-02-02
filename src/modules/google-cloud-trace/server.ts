import { serverHooks } from '@vue-storefront/core/server/hooks'

serverHooks.afterProcessStarted(config => {
  if (config?.trace?.enabled === true) {
    let trace = require('@google-cloud/trace-agent') // eslint-disable-line
    trace.start(config.get('trace.config'))
  }
})
