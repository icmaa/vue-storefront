import config from 'config'
import * as winston from 'winston'
import { isServer } from '@vue-storefront/core/helpers'
import { datadogLogs } from '@datadog/browser-logs'

if (!isServer) {
  const clientToken = process.env.DD_CLIENT_TOKEN || config.icmaa_monitoring.datadog.clientToken
  datadogLogs.init({
    clientToken,
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
  return { payload }
}

export default ({ type, message, tag, context }) => {
  if (!isServer) {
    datadogLogs.logger.log(convertToString(message), convertToObject(context) || {}, type || 'info')
  } else {
    const logger = winston.createLogger({
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ filename: `${process.cwd()}/winston.error.log`, level: 'error' }),
        new winston.transports.File({ filename: `${process.cwd()}/winston.combined.log` })
      ],
      exitOnError: false
    })

    logger.log(type, tag ? `[${tag}] ${convertToString(message)}` : convertToString(message), convertToObject(context))
  }

  return { message, tag, context }
}
