import * as winston from 'winston'

const logPath = `${process.cwd()}/dist/log/`

const createLogger = () => winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: `${logPath}/winston.error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${logPath}/winston.combined.log` })
  ],
  exitOnError: false
})

export const createExceptionLogger = () => {
  winston.createLogger({
    format: winston.format.json(),
    exitOnError: false,
    exceptionHandlers: [
      new winston.transports.File({ filename: `${logPath}/winston.error.log` })
    ]
  })
}

export default createLogger
