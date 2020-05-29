import config from 'config'
import createLogger from 'icmaa-monitoring/lib/winston/logger'
import { isServer } from '@vue-storefront/core/helpers'
import { datadogLogs } from '@datadog/browser-logs'

if (!isServer) {
  const clientToken = process.env.DD_CLIENT_TOKEN || config.icmaa_monitoring.datadog.clientToken
  const datacenter = config.icmaa_monitoring.datadog.dataCenter || 'eu'
  datadogLogs.init({ clientToken, datacenter })
}

/**
 * Convert message to string - as it may be object, array either primitive
 * @param payload
 */
function convertToString (payload: any) {
  if (typeof payload === 'string' || typeof payload === 'boolean' || typeof payload === 'number') return payload
  if (payload && payload.message) return payload.message
  return JSON.stringify(payload)
}

/**
 * Convert context to object
 * @param payload
 */
function convertToObject (payload: any) {
  if (typeof payload === 'string' || typeof payload === 'boolean' || typeof payload === 'number') {
    return { payload }
  }
  return { payload }
}

export default ({ type, message, tag, context }) => {
  const { environment, mandant } = config.icmaa

  if (isServer) {
    const logger = createLogger()
    logger.log(
      type,
      tag ? `[${tag}] ${convertToString(message)}` : convertToString(message),
      Object.assign({ environment, mandant, vsf: true }, convertToObject(context))
    )
  } else {
    datadogLogs.logger.log(
      convertToString(message),
      Object.assign({ environment, mandant, vsf: true }, convertToObject(context)),
      type || 'info'
    )
  }

  return { message, tag, context }
}
