import config from 'config'
import tracer from 'dd-trace'

if (config.icmaa_monitoring.datadog.enabled === true) {
  tracer.init({
    service: 'vue-storefront',
    env: config.icmaa.mandant + '-' + config.icmaa.environment,
    clientToken: process.env.DD_API_KEY || config.icmaa_monitoring.datadog.apiKey,
    analytics: true,
    logInjection: true
  })
}

export default tracer
