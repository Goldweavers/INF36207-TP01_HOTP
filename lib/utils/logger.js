const { createLogger, transports, format } = require('winston')

const config = require('../config')

const logFormat = format.combine(
  format.label({ label: config.APP.NAME }),
  format.timestamp({ format: config.LOGGER.FORMAT }),
  format.printf(
    ({ level, message, label, timestamp }) =>
      `${timestamp} [${label}] ${level}: ${message}`,
  ),
)

module.exports = createLogger({
  level: config.LOGGER.LEVEL,
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
  ],
})
