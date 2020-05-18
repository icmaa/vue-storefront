import config from 'config'
import Winston from 'winston'

export default ({ type, message, tag, context }) => {
  const apiKey = process.env.DD_API_KEY || config.icmaa_monitoring.datadog.apiKey
  const httpTransportOptions = {
    host: 'http-intake.logs.datadoghq.com',
    path: `/v1/input/${apiKey}?ddsource=nodejs&service=vue-storefront`,
    ssl: true
  }

  Winston.createLogger({
    level: type,
    exitOnError: false,
    format: Winston.format.json(),
    transports: [
      new Winston.transports.Http(httpTransportOptions)
    ]
  })

  return { message, tag, context, noDefaultOutput: true }
}
