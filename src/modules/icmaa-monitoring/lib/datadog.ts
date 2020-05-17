import config from 'config'
import tracer from 'dd-trace'

if (config.icmaa_monitoring.datadog.enabled === true) {
  tracer.init()
}

export default tracer
