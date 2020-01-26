const { createLogger, transports, format } = require('winston')

const logFormat = format.combine(
  format.label({ label: 'token-server' }),
  format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  format.printf(
    ({ level, message, label, timestamp }) =>
      `${timestamp} [${label}] ${level}: ${message}`,
  ),
)

module.exports = createLogger({
  level: 'info',
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
  ],
})
