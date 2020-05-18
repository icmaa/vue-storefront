import { createLogger, format, transports } from 'winston'

const httpTransportOptions = {
  host: 'http-intake.logs.datadoghq.com',
  path: '/v1/input/cb2d5379b72c927f746c87964f3d31f5?ddsource=nodejs&service=<APPLICATION_NAME>',
  ssl: true
}

export default ({ type, message, tag, context }) => {
  const logger = createLogger({
    level: type,
    exitOnError: false,
    format: format.json(),
    transports: [
      new transports.Http(httpTransportOptions)
    ]
  })

  return { message, tag, context, noDefaultOutput: true }
}
