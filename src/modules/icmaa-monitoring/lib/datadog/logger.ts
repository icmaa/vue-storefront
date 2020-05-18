import winston from 'winston'

const httpTransportOptions = {
  host: 'http-intake.logs.datadoghq.com',
  path: '/v1/input/cb2d5379b72c927f746c87964f3d31f5?ddsource=nodejs&service=vue-storefront',
  ssl: true
}

export default ({ type, message, tag, context }) => {
  winston.createLogger({
    level: type,
    exitOnError: false,
    format: winston.format.json(),
    transports: [
      new winston.transports.Http(httpTransportOptions)
    ]
  })

  return { message, tag, context, noDefaultOutput: true }
}
