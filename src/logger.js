import { createLogger, format, transports } from 'winston'

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'info',
  format: format.combine(format.splat(), format.simple()),
  transports: [new transports.Console()]
})

export const logErrorHook = async (context, next) => {
  try {
    await next()
  } catch (error) {
    logger.error(error.stack)
    // Log validation errors
    if (error.data) {
      logger.error(error.data)
    }

    throw error
  }
}
