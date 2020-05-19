import config from 'config'
import { isServer } from '@vue-storefront/core/helpers'
import { datadogLogs } from '@datadog/browser-logs'

if (!isServer) {
  const apiKey = process.env.DD_API_KEY || config.icmaa_monitoring.datadog.apiKey
  datadogLogs.init({
    clientToken: apiKey,
    datacenter: 'eu',
    forwardErrorsToLogs: true,
    sampleRate: 100
  })
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
  return payload
}

export default ({ type, message, tag, context }) => {
  if (!isServer) {
    datadogLogs.logger.log(convertToString(message), convertToObject(context) || {}, type || 'info')
    return { message, tag, context, type }
  }

  return { message, tag, context }
}
